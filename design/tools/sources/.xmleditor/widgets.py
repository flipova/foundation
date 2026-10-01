"""Tk widgets for the visual XML editor.

All widgets are driven by ``BlockSpec``/``ParticleSpec`` objects: the palette
lists what the schema allows, the tree renders the document as nested blocks,
the inspector renders typed editors per attribute and the diagram draws the
same blocks as a foldable, colour-coded graph. Nothing here hardcodes an
element or attribute name.
"""

from __future__ import annotations

import re
import sys
import tkinter as tk
import tkinter.font as tkfont
from collections import OrderedDict
from dataclasses import dataclass, field
from pathlib import Path
from tkinter import ttk
from typing import Callable

from .blocks import PaletteEntry, describe
from .model import DocumentModel, Issue
from .xsdmodel import BlockSpec, localname

# ---------------------------------------------------------------------------
# Shared look & feel
# ---------------------------------------------------------------------------

# kind -> (accent colour, tint colour, human label) — Apple-flavoured palette
KIND_STYLES = {
    "root": ("#5e5ce6", "#eeedff", "Root"),
    "container": ("#0071e3", "#eaf3ff", "Container"),
    "value": ("#248a3d", "#e9f8ee", "Value"),
    "text": ("#b25e00", "#fff4e5", "Text"),
    "empty": ("#8e8e93", "#f2f2f7", "Empty"),
    "freeform": ("#d6336c", "#fdeef4", "Free key"),
    "unknown": ("#8e8e93", "#f0f0f4", "Not in schema"),
}
KIND_COLOURS = {kind: style[1] for kind, style in KIND_STYLES.items()}
KIND_GLYPHS = {
    "root": "◆", "container": "▣", "value": "●", "text": "¶",
    "empty": "○", "freeform": "✎", "unknown": "?",
}
ISSUE_MARKS = {"error": "✖", "warning": "⚠"}
ISSUE_COLOURS = {"error": "#ff3b30", "warning": "#ff9500"}   # graphics
ISSUE_TEXT = {"error": "#d70015", "warning": "#b25e00"}      # text

BG = "#f5f5f7"


def kind_of(block: BlockSpec | None) -> str:
    """Visual category of a block (drives colours and glyphs everywhere)."""
    if block is None:
        return "unknown"
    if block.is_root:
        return "root"
    if block.type_name == "xs:any":
        return "freeform"
    return block.kind if block.kind in KIND_STYLES else "container"


def apply_theme(root: tk.Misc) -> None:
    """One consistent, calm ttk theme for the whole editor."""
    style = ttk.Style(root)
    if "clam" in style.theme_names():
        style.theme_use("clam")
    preferred = {"win32": "Segoe UI", "darwin": "SF Pro Text"}.get(sys.platform)
    for name in ("TkDefaultFont", "TkTextFont", "TkMenuFont"):
        try:
            tkfont.nametofont(name).configure(
                **({"family": preferred} if preferred else {}), size=10)
        except tk.TclError:
            pass
    family = preferred or tkfont.nametofont("TkDefaultFont").actual("family")
    try:
        root.configure(background=BG)
    except tk.TclError:
        pass

    # -- surfaces --------------------------------------------------------
    style.configure("TFrame", background=BG)
    style.configure("TLabel", background=BG)
    style.configure("TCheckbutton", background=BG)
    style.configure("TLabelframe", background=BG, bordercolor="#e5e5ea")
    style.configure("TLabelframe.Label", background=BG, foreground="#1d1d1f",
                    font=(family, 10, "bold"))
    style.configure("TPanedwindow", background=BG)
    style.configure("TSeparator", background="#e5e5ea")

    # -- notebook: flat, VSCode-like tabs ---------------------------------
    style.configure("TNotebook", background=BG, borderwidth=0, tabmargins=(0, 6, 0, 0))
    style.configure("TNotebook.Tab", padding=(16, 7), background=BG,
                    foreground="#6e6e73")
    style.map("TNotebook.Tab",
              background=[("selected", "#ffffff"), ("active", "#ececf0")],
              foreground=[("selected", "#0071e3"), ("active", "#1d1d1f")])

    # -- lists ------------------------------------------------------------
    style.configure("Treeview", rowheight=26, background="#ffffff",
                    fieldbackground="#ffffff", borderwidth=0)
    style.map("Treeview",
              background=[("selected", "#0071e3")],
              foreground=[("selected", "#ffffff")])
    style.configure("Treeview.Heading", padding=(8, 6), background="#f0f0f4",
                    foreground="#1d1d1f", font=(family, 10, "bold"),
                    relief="flat")
    style.map("Treeview.Heading", background=[("active", "#e9e9ee")])

    # -- controls: flat white buttons, accent primary, focus ring ---------
    try:
        style.configure("TButton", padding=(12, 6), background="#ffffff",
                        foreground="#1d1d1f", bordercolor="#d2d2d7",
                        relief="flat", focusthickness=1, focuscolor="#0071e3")
        style.map("TButton",
                  background=[("active", "#f0f0f5"), ("pressed", "#e5e5ea"),
                              ("disabled", "#f5f5f7")],
                  foreground=[("disabled", "#aeaeb2")])
        style.configure("Toolbar.TButton", padding=(12, 6), background="#ffffff",
                        foreground="#1d1d1f", bordercolor="#d2d2d7",
                        relief="flat", focusthickness=1, focuscolor="#0071e3")
        style.map("Toolbar.TButton",
                  background=[("active", "#f0f0f5"), ("pressed", "#e5e5ea"),
                              ("disabled", "#f5f5f7")],
                  foreground=[("disabled", "#aeaeb2")])
        style.configure("Accent.TButton", padding=(14, 6), background="#0071e3",
                        foreground="#ffffff", bordercolor="#0071e3",
                        relief="flat", focusthickness=1, focuscolor="#0068d0")
        style.map("Accent.TButton",
                  background=[("active", "#0077ed"), ("pressed", "#0068d0"),
                              ("disabled", "#a6c8f0")],
                  foreground=[("disabled", "#ffffff")])
        style.configure("TEntry", fieldbackground="#ffffff",
                        bordercolor="#d2d2d7", lightcolor="#0071e3", padding=6,
                        relief="flat", focusthickness=1, focuscolor="#0071e3")
        style.configure("TCombobox", fieldbackground="#ffffff",
                        bordercolor="#d2d2d7", lightcolor="#0071e3", padding=5,
                        arrowsize=11, relief="flat", focusthickness=1,
                        focuscolor="#0071e3")
        style.map("TCombobox",
                  fieldbackground=[("readonly", "#ffffff")],
                  foreground=[("readonly", "#1d1d1f")])
    except tk.TclError:
        # toolkits lacking these clam options keep the simpler flat look
        style.configure("TButton", padding=(12, 6), background="#ffffff",
                        foreground="#1d1d1f")
        style.map("TButton", background=[("active", "#f0f0f5"),
                                         ("disabled", "#f5f5f7")])
        style.configure("Accent.TButton", padding=(14, 6), background="#0071e3",
                        foreground="#ffffff")
        style.map("Accent.TButton", background=[("active", "#0077ed"),
                                                ("disabled", "#a6c8f0")])

    # -- calm scrollbars: slim, arrowless, macOS-like segmented thumb -----
    try:
        style.layout("Vertical.TScrollbar", [
            ("Scrollbar.trough",
             {"children": [("Scrollbar.thumb",
                            {"expand": True, "unit": 1, "sticky": "ns"})],
              "sticky": "ns"})])
        style.layout("Horizontal.TScrollbar", [
            ("Scrollbar.trough",
             {"children": [("Scrollbar.thumb",
                            {"expand": True, "unit": 1, "sticky": "ew"})],
              "sticky": "ew"})])
        for scrollbar in ("Vertical.TScrollbar", "Horizontal.TScrollbar"):
            style.configure(scrollbar, background="#c7c7cc",
                            troughcolor="#f5f5f7", bordercolor="#f5f5f7",
                            arrowcolor=BG, width=11, borderwidth=0)
            style.map(scrollbar, background=[("active", "#a1a1a6"),
                                             ("pressed", "#8e8e93")])
    except tk.TclError:
        pass

    # -- hairline sashes (no grips) ---------------------------------------
    try:
        style.configure("Sash", background="#e5e5ea", gripcount=0,
                        sashthickness=5, borderwidth=0, relief="flat")
    except tk.TclError:
        pass

    # -- text styles -------------------------------------------------------
    style.configure("Section.TLabel", font=(family, 11, "bold"),
                    foreground="#1d1d1f")
    style.configure("Hint.TLabel", foreground="#86868b", font=(family, 9))
    style.configure("Title.TLabel", font=(family, 17, "bold"),
                    foreground="#1d1d1f")
    style.configure("Crumb.TLabel", foreground="#0071e3")
    style.configure("CrumbLast.TLabel", foreground="#1d1d1f",
                    font=(family, 10, "bold"))


def context_sequences(widget: tk.Misc) -> tuple[str, ...]:
    """Right-click sequences for the running windowing system."""
    if widget.tk.call("tk", "windowingsystem") == "aqua":
        return ("<Button-2>", "<Control-Button-1>")
    return ("<Button-3>",)


def bind_mousewheel(panel: tk.Misc, canvas: tk.Canvas) -> None:
    """Scroll *canvas* with the wheel while the pointer is anywhere over *panel*."""

    def wheel(event) -> None:
        delta = event.delta if event.delta else (120 if event.num == 4 else -120)
        canvas.yview_scroll(-1 if delta > 0 else 1, "units")

    def enter(_event) -> None:
        canvas.bind_all("<MouseWheel>", wheel)
        canvas.bind_all("<Button-4>", wheel)
        canvas.bind_all("<Button-5>", wheel)

    def leave(_event) -> None:
        under = canvas.winfo_containing(*canvas.winfo_pointerxy())
        if under is not None and str(under).startswith(str(panel)):
            return
        canvas.unbind_all("<MouseWheel>")
        canvas.unbind_all("<Button-4>")
        canvas.unbind_all("<Button-5>")

    panel.bind("<Enter>", enter, add="+")
    panel.bind("<Leave>", leave, add="+")


class Tip:
    """Tiny tooltip: attach to a widget, or drive it by hand with ``arm``."""

    def __init__(self, widget: tk.Misc, text: str = "", delay: int = 450) -> None:
        self.widget = widget
        self.text = text
        self.delay = delay
        self._job = None
        self._win: tk.Toplevel | None = None
        if text:
            widget.bind("<Enter>", lambda _e: self.arm(self.text), add="+")
            widget.bind("<Leave>", self.hide, add="+")
            widget.bind("<ButtonPress>", self.hide, add="+")

    def arm(self, text: str) -> None:
        self.hide()
        self.text = text
        if text:
            self._job = self.widget.after(self.delay, self._show)

    def _show(self) -> None:
        self._job = None
        x = self.widget.winfo_pointerx() + 14
        y = self.widget.winfo_pointery() + 18
        win = tk.Toplevel(self.widget)
        win.wm_overrideredirect(True)
        win.wm_geometry(f"+{x}+{y}")
        tk.Label(win, text=self.text, justify="left", background="#1d1d1f",
                 foreground="#ffffff", padx=9, pady=6, wraplength=380).pack()
        self._win = win

    def hide(self, _event=None) -> None:
        if self._job is not None:
            try:
                self.widget.after_cancel(self._job)
            except tk.TclError:
                pass
            self._job = None
        if self._win is not None:
            try:
                self._win.destroy()
            except tk.TclError:
                pass
            self._win = None


# ---------------------------------------------------------------------------
# File explorer
# ---------------------------------------------------------------------------

class FileExplorer(ttk.Frame):
    """Tree of the XML files under a root folder (``design/`` by default).

    Directories that hold an XML file somewhere below are expandable (top
    level starts open), files open on double-click/Enter, and the document
    currently loaded in the editor is highlighted in accent blue.
    """

    def __init__(self, master: tk.Misc, root: Path,
                 on_open: Callable[[Path], None]) -> None:
        super().__init__(master)
        self.root_dir = Path(root)
        self.on_open = on_open
        self._files: dict[str, Path] = {}
        self._dirs: dict[str, Path] = {}
        self._current: Path | None = None
        family = tkfont.nametofont("TkDefaultFont").actual("family")

        head = ttk.Frame(self)
        head.pack(fill="x", padx=6, pady=(6, 2))
        ttk.Label(head, text="Files", style="Section.TLabel").pack(side="left")
        ttk.Button(head, text="Refresh", style="Toolbar.TButton",
                   command=self.refresh).pack(side="right")

        ttk.Label(self, text="Double-click to open",
                  style="Hint.TLabel").pack(side="bottom", fill="x",
                                            padx=6, pady=(2, 4))
        self.tree = ttk.Treeview(self, show="tree", selectmode="browse")
        scroll = ttk.Scrollbar(self, orient="vertical",
                               command=self.tree.yview)
        self.tree.configure(yscrollcommand=scroll.set)
        self.tree.tag_configure("folder", foreground="#6e6e73")
        self.tree.tag_configure("file", foreground="#1d1d1f")
        self.tree.tag_configure("current", foreground="#0071e3",
                                font=(family, 10, "bold"))
        self.tree.pack(side="left", fill="both", expand=True,
                       padx=(6, 0), pady=(2, 0))
        scroll.pack(side="right", fill="y", pady=(2, 0))

        self.tree.bind("<Double-1>", self._on_double)
        self.tree.bind("<Return>", self._on_double)
        self.refresh()

    # -- building ---------------------------------------------------------

    @staticmethod
    def _has_xml(folder: Path) -> bool:
        """True when *folder* holds an XML file directly or deeper."""
        try:
            for entry in folder.iterdir():
                if entry.is_symlink():
                    continue
                if entry.is_file() and entry.suffix.lower() == ".xml":
                    return True
                if entry.is_dir() and FileExplorer._has_xml(entry):
                    return True
        except OSError:
            return False
        return False

    def refresh(self) -> None:
        """Rebuild from disk, preserving which folders were expanded."""
        open_dirs = {self._dirs[iid] for iid in self._dirs
                     if self.tree.item(iid, "open")}
        self.tree.delete(*self.tree.get_children())
        self._files.clear()
        self._dirs.clear()
        self._add_dir("", self.root_dir, open_dirs)
        if self._current is not None:
            self.mark_current(self._current)

    def _add_dir(self, parent: str, folder: Path, open_dirs: set) -> None:
        try:
            entries = sorted(folder.iterdir(), key=lambda p: p.name.lower())
        except OSError:
            return
        for entry in entries:
            if entry.is_symlink():
                continue
            if entry.is_dir():
                if not self._has_xml(entry):
                    continue
                iid = self.tree.insert(
                    parent, "end", text=entry.name, tags=("folder",),
                    open=(entry in open_dirs or not parent))
                self._dirs[iid] = entry
                self._add_dir(iid, entry, open_dirs)
            elif entry.is_file() and entry.suffix.lower() == ".xml":
                iid = self.tree.insert(parent, "end", text=entry.name,
                                       tags=("file",))
                self._files[iid] = entry

    # -- interaction ------------------------------------------------------

    def _on_double(self, _event=None):
        iid = self.tree.focus()
        if not iid:
            return None
        if iid in self._files:
            self.on_open(self._files[iid])
            return "break"
        if iid in self._dirs:
            self.tree.item(iid, open=not self.tree.item(iid, "open"))
            return "break"
        return None

    def mark_current(self, path: Path | None) -> None:
        """Highlight *path* as the open document and reveal it in the tree."""
        self._current = Path(path) if path is not None else None
        target = None
        want = (self._current.resolve() if self._current is not None
                else None)
        for iid, file_path in self._files.items():
            tags = [t for t in self.tree.item(iid, "tags") if t != "current"]
            if want is not None and file_path.resolve() == want:
                tags.append("current")
                target = iid
            self.tree.item(iid, tags=tags)
        if target is None:
            return
        parent = self.tree.parent(target)
        while parent:
            self.tree.item(parent, open=True)
            parent = self.tree.parent(parent)
        self.tree.selection_set(target)
        self.tree.see(target)


def severity_for(issues: list[Issue], element) -> str:
    """Worst severity reported for *element* (identity comparison)."""
    worst = ""
    for issue in issues:
        if issue.element is element:
            if issue.severity == "error":
                return "error"
            worst = "warning"
    return worst


# ---------------------------------------------------------------------------
# Breadcrumb + empty state
# ---------------------------------------------------------------------------

class Breadcrumb(ttk.Frame):
    """Clickable path root › … › selection (always tells you where you are)."""

    def __init__(self, master: tk.Misc, on_pick: Callable[[object], None]) -> None:
        super().__init__(master)
        self.on_pick = on_pick
        self.show([])

    def show(self, elements: list) -> None:
        for child in list(self.winfo_children()):
            child.destroy()
        if not elements:
            ttk.Label(self, text="No selection — click a block to inspect and edit it",
                      style="Hint.TLabel").pack(side="left")
            return
        ttk.Label(self, text="Selection:", style="Hint.TLabel").pack(side="left", padx=(0, 6))
        for index, element in enumerate(elements):
            last = index == len(elements) - 1
            label = ttk.Label(self, text=localname(str(element.tag)),
                              style="CrumbLast.TLabel" if last else "Crumb.TLabel",
                              cursor="" if last else "hand2")
            label.pack(side="left")
            if not last:
                label.bind("<Button-1>", lambda _e, el=element: self.on_pick(el))
                ttk.Label(self, text="  ›  ", style="Hint.TLabel").pack(side="left")


class EmptyState(ttk.Frame):
    """Friendly start screen shown while no document is open."""

    def __init__(self, master: tk.Misc, root_names: list[str],
                 on_new_root: Callable[[str], None], on_open: Callable[[], None]) -> None:
        super().__init__(master)
        inner = ttk.Frame(self)
        inner.place(relx=0.5, rely=0.42, anchor="center")
        ttk.Label(inner, text="No document open", style="Title.TLabel").pack()
        ttk.Label(inner, style="Hint.TLabel", justify="center",
                  text="Start a new document from a root element of the schema,\n"
                       "or open an existing XML file.").pack(pady=(4, 14))
        for name in list(root_names)[:8]:
            ttk.Button(inner, text=f"✚  New <{name}>", style="Toolbar.TButton",
                       command=lambda n=name: on_new_root(n)).pack(fill="x", pady=2)
        ttk.Separator(inner).pack(fill="x", pady=8)
        ttk.Button(inner, text="Open an XML file…", style="Accent.TButton",
                   command=on_open).pack(fill="x")


# ---------------------------------------------------------------------------
# Palette
# ---------------------------------------------------------------------------

class _EntryList(ttk.Frame):
    """A grouped list of palette entries that keeps scroll/fold/selection."""

    def __init__(self, master: tk.Misc, on_pick: Callable, on_activate: Callable) -> None:
        super().__init__(master)
        self.on_pick = on_pick
        self.on_activate = on_activate
        self._entries: dict[str, PaletteEntry] = {}
        self._groups: dict[str, str] = {}
        self._open: dict[str, bool] = {}
        self._sig = None
        self._key: str | None = None
        self._bold = tkfont.nametofont("TkDefaultFont").copy()
        self._bold.configure(weight="bold")

        self.tree = ttk.Treeview(self, columns=("detail",), show="tree",
                                 selectmode="browse", height=5)
        self.tree.column("#0", width=150, stretch=True)
        self.tree.column("detail", width=110, stretch=False)
        self.tree.tag_configure("group", font=self._bold, foreground="#3c4043")
        self.tree.tag_configure("required", foreground="#b3261e")
        self.tree.tag_configure("allowed", foreground="#188038")
        self.tree.tag_configure("root", foreground="#5e35b1")
        self.tree.tag_configure("muted", foreground="#80868b")

        scroll = ttk.Scrollbar(self, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=scroll.set)
        self.tree.pack(side="left", fill="both", expand=True)
        scroll.pack(side="right", fill="y")
        self.tree.bind("<<TreeviewSelect>>", self._on_select)
        self.tree.bind("<Double-1>", self._on_double)
        self.tree.bind("<Return>", self._on_double)

    @staticmethod
    def _key_of(entry: PaletteEntry) -> str:
        return f"{entry.category}/{entry.block.key or entry.block.name}"

    def fill(self, groups: OrderedDict[str, list[PaletteEntry]],
             allowed: frozenset = frozenset(), empty_text: str = "",
             open_default: tuple | None = None) -> None:
        sig = (tuple((cat, tuple((self._key_of(e), e.detail) for e in entries))
                     for cat, entries in groups.items()), allowed)
        if sig == self._sig:
            return
        self._sig = sig
        for cat, iid in self._groups.items():
            if self.tree.exists(iid):
                self._open[cat] = bool(self.tree.item(iid, "open"))
        top = self.tree.yview()[0]
        wanted = self._key
        self.tree.delete(*self.tree.get_children())
        self._entries.clear()
        self._groups.clear()
        if not groups:
            self.tree.insert("", "end", text=empty_text, tags=("muted",))
            return
        counter = 0
        for cat, entries in groups.items():
            default = True if open_default is None else cat in open_default
            gid = self.tree.insert("", "end", text=f"{cat}  ({len(entries)})",
                                   open=self._open.get(cat, default), tags=("group",))
            self._groups[cat] = gid
            for entry in entries:
                counter += 1
                iid = f"p{counter}"
                self._entries[iid] = entry
                tags = []
                is_allowed = entry.block.name in allowed
                if entry.category == "Required":
                    tags.append("required")
                elif entry.block.is_root:
                    tags.append("root")
                elif is_allowed:
                    tags.append("allowed")
                self.tree.insert(gid, "end", iid=iid,
                                 text=("✓ " if is_allowed else "") + entry.label,
                                 values=(entry.detail or entry.block.summary,),
                                 tags=tuple(tags))
                if wanted is not None and wanted == self._key_of(entry):
                    self.tree.selection_set(iid)
        self.tree.yview_moveto(top)

    def selected_entry(self) -> PaletteEntry | None:
        selection = self.tree.selection()
        return self._entries.get(selection[0]) if selection else None

    def clear_selection(self) -> None:
        self._key = None
        if self.tree.selection():
            self.tree.selection_set(())

    def _on_select(self, _event=None) -> None:
        entry = self.selected_entry()
        if entry is None:
            return
        self._key = self._key_of(entry)
        self.on_pick(self, entry)

    def _on_double(self, _event=None) -> None:
        entry = self.selected_entry()
        if entry is not None:
            self.on_activate(entry)


class BlockPalette(ttk.Frame):
    """Schema-driven palette with two *permanently visible* lists.

    Top: the whole schema profile (what can exist at all). It never goes away
    when the selection changes; blocks that can be added to the current
    selection get a green ✓. Bottom: what is allowed right now under the
    selection, missing required blocks first. A search box filters both.
    """

    def __init__(self, master: tk.Misc, on_activate: Callable[[PaletteEntry], None]) -> None:
        super().__init__(master)
        self.on_activate = on_activate
        self._profile: OrderedDict[str, list[PaletteEntry]] = OrderedDict()
        self._context: list[PaletteEntry] = []
        self._context_name = ""
        self._allowed: frozenset = frozenset()
        self._active: PaletteEntry | None = None
        self._query = tk.StringVar()
        self._context_title = tk.StringVar(value="Allowed here")

        ttk.Label(self, text="Blocks", style="Section.TLabel").pack(
            anchor="w", padx=6, pady=(6, 2))
        search = ttk.Frame(self)
        search.pack(fill="x", padx=6)
        self.search_entry = ttk.Entry(search, textvariable=self._query)
        self.search_entry.pack(side="left", fill="x", expand=True)
        Tip(self.search_entry, "Filter blocks by name or documentation (Ctrl+F)")
        ttk.Button(search, text="×", width=3, style="Toolbar.TButton",
                   command=lambda: self._query.set("")).pack(side="left", padx=(2, 0))
        self._query.trace_add("write", lambda *_: self._render())
        self.search_entry.bind("<Escape>", lambda _e: self._query.set(""))

        self.add_button = ttk.Button(self, text="Add to selection", style="Accent.TButton",
                                     state="disabled", command=self._add_active)
        self.add_button.pack(side="bottom", fill="x", padx=6, pady=6)
        self.description = tk.Text(self, height=8, wrap="word", relief="flat", borderwidth=0,
                                   background="#ffffff", foreground="#1d1d1f", padx=8, pady=6)
        self.description.pack(side="bottom", fill="x", padx=6)
        self._set_description("Pick a block to read its schema documentation.\n"
                              "Double-click a block to add it.")

        panes = ttk.PanedWindow(self, orient="vertical")
        panes.pack(fill="both", expand=True, padx=2, pady=4)

        profile_box = ttk.Frame(panes)
        head = ttk.Frame(profile_box)
        head.pack(fill="x", padx=4)
        ttk.Label(head, text="Schema profile", style="Section.TLabel").pack(side="left")
        ttk.Label(head, text="✓ = can be added to the selection",
                  style="Hint.TLabel").pack(side="right")
        self.profile_list = _EntryList(profile_box, self._picked, self._activate)
        self.profile_list.pack(fill="both", expand=True, padx=4, pady=(2, 4))
        panes.add(profile_box, weight=1)

        context_box = ttk.Frame(panes)
        ttk.Label(context_box, textvariable=self._context_title,
                  style="Section.TLabel").pack(anchor="w", padx=4)
        self.context_list = _EntryList(context_box, self._picked, self._activate)
        self.context_list.pack(fill="both", expand=True, padx=4, pady=(2, 4))
        panes.add(context_box, weight=1)

    # -- content ---------------------------------------------------------

    def set_profile(self, categories) -> None:
        """Set the schema profile (category -> blocks). Called once per schema."""
        self._profile = OrderedDict(
            (cat, [PaletteEntry(block=b, category=cat, reason=f"{cat.lower()} block")
                   for b in blocks])
            for cat, blocks in categories.items())
        self._render()

    def set_context(self, parent_name: str, entries: list[PaletteEntry]) -> None:
        """Update the 'allowed here' list; the profile list is left untouched."""
        self._context_name = parent_name
        self._context = list(entries)
        self._allowed = frozenset(e.block.name for e in entries if e.block.name != "*")
        self._render()

    def _render(self) -> None:
        query = self._query.get().strip().lower()

        def keep(entry: PaletteEntry) -> bool:
            return (not query or query in entry.block.name.lower()
                    or query in (entry.block.documentation or "").lower())

        profile: OrderedDict[str, list[PaletteEntry]] = OrderedDict()
        for cat, entries in self._profile.items():
            kept = [e for e in entries if keep(e)]
            if kept:
                profile[cat] = kept
        context: OrderedDict[str, list[PaletteEntry]] = OrderedDict()
        for entry in self._context:
            if keep(entry):
                context.setdefault(entry.category or "Allowed", []).append(entry)

        self.profile_list.fill(profile, allowed=self._allowed, open_default=("Roots",),
                               empty_text="No block matches" if query else "Schema has no blocks")
        self.context_list.fill(context, empty_text="No block matches" if query
                               else "Nothing can be added here")
        self._context_title.set(f"Allowed in <{self._context_name}>"
                                if self._context_name else "Allowed here")

    # -- interaction -----------------------------------------------------

    def focus_search(self) -> None:
        self.search_entry.focus_set()
        self.search_entry.select_range(0, "end")

    def selected_entry(self) -> PaletteEntry | None:
        return self._active

    def _picked(self, source: _EntryList, entry: PaletteEntry) -> None:
        self._active = entry
        other = self.context_list if source is self.profile_list else self.profile_list
        other.clear_selection()
        is_root = entry.category == "Roots"
        self.add_button.configure(
            state="normal",
            text="New document with this root" if is_root else "Add to selection")
        lines = []
        if entry.reason:
            lines.append(entry.reason[:1].upper() + entry.reason[1:])
        if entry.particle is not None:
            lines.append(f"Occurrences allowed: {entry.particle.occurs_label}")
        lines += ["", describe(entry.block)]
        self._set_description("\n".join(lines))

    def _activate(self, entry: PaletteEntry) -> None:
        self.on_activate(entry)

    def _add_active(self) -> None:
        if self._active is not None:
            self.on_activate(self._active)

    def _set_description(self, text: str) -> None:
        self.description.configure(state="normal")
        self.description.delete("1.0", "end")
        self.description.insert("1.0", text)
        self.description.configure(state="disabled")


# ---------------------------------------------------------------------------
# Document tree
# ---------------------------------------------------------------------------

class DocumentTree(ttk.Frame):
    """The document rendered as nested schema blocks (the "blocks" view)."""

    def __init__(self, master: tk.Misc, on_select: Callable[[object], None],
                 on_context: Callable | None = None) -> None:
        super().__init__(master)
        self.on_select = on_select
        self.on_context = on_context
        self._map: dict[str, object] = {}
        self._paths: dict[str, tuple] = {}
        self._closed: set[tuple] = set()
        self._issues: list[Issue] = []
        self._severity: dict[int, str] = {}

        bar = ttk.Frame(self)
        bar.grid(row=0, column=0, columnspan=2, sticky="ew", padx=4, pady=4)
        for text, command, tip in (
                ("Expand all", self.expand_all, "Unfold every block"),
                ("Collapse all", self.collapse_all, "Fold everything below the root")):
            button = ttk.Button(bar, text=text, command=command, style="Toolbar.TButton")
            button.pack(side="left", padx=(0, 4))
            Tip(button, tip)
        ttk.Label(bar, text="Right-click a block for actions", style="Hint.TLabel").pack(
            side="right")

        self.tree = ttk.Treeview(self, columns=("attrs", "occurs"), show="tree headings")
        self.tree.heading("#0", text="Document blocks")
        self.tree.heading("attrs", text="Attributes / value")
        self.tree.heading("occurs", text="Occurs")
        self.tree.column("#0", width=300, stretch=True)
        self.tree.column("attrs", width=260, stretch=False)
        self.tree.column("occurs", width=70, stretch=False, anchor="center")

        scroll_y = ttk.Scrollbar(self, orient="vertical", command=self.tree.yview)
        scroll_x = ttk.Scrollbar(self, orient="horizontal", command=self.tree.xview)
        self.tree.configure(yscrollcommand=scroll_y.set, xscrollcommand=scroll_x.set)
        self.tree.grid(row=1, column=0, sticky="nsew")
        scroll_y.grid(row=1, column=1, sticky="ns")
        scroll_x.grid(row=2, column=0, sticky="ew")
        self.rowconfigure(1, weight=1)
        self.columnconfigure(0, weight=1)

        for kind, colour in KIND_COLOURS.items():
            self.tree.tag_configure(kind, background=colour)
        self.tree.tag_configure("error", foreground=ISSUE_TEXT["error"])
        self.tree.tag_configure("warning", foreground=ISSUE_TEXT["warning"])

        self.tree.bind("<<TreeviewSelect>>", self._on_select)
        self.tree.bind("<<TreeviewOpen>>", lambda _e: self.after_idle(self._sync_closed))
        self.tree.bind("<<TreeviewClose>>", lambda _e: self.after_idle(self._sync_closed))
        for sequence in context_sequences(self.tree):
            self.tree.bind(sequence, self._on_context)

    # -- rendering -------------------------------------------------------

    def _sync_closed(self) -> None:
        for iid, path in self._paths.items():
            if self.tree.exists(iid) and self.tree.get_children(iid):
                if self.tree.item(iid, "open"):
                    self._closed.discard(path)
                else:
                    self._closed.add(path)

    def refresh(self, doc: DocumentModel | None, issues: list[Issue] | None = None) -> None:
        self._sync_closed()
        # Read the scroll position only when the tab can paint: yview() on a
        # hidden treeview still works, but moving it back afterwards forces an
        # off-screen layout pass for nothing.
        top = self.tree.yview()[0] if self.tree.winfo_viewable() else 0.0
        self._issues = list(issues or [])
        # O(1) id-keyed lookup replaces the O(issues) scan per element below.
        self._severity = {id(issue.element): issue.severity for issue in self._issues
                          if issue.element is not None}
        self.tree.delete(*self.tree.get_children())
        self._map.clear()
        self._paths.clear()
        if doc is None:
            return
        self._add("", doc.root, doc, ())
        if self.tree.winfo_viewable():
            self.tree.yview_moveto(top)

    def _add(self, parent_iid: str, element, doc: DocumentModel, path: tuple) -> None:
        block = doc.block_of(element)
        particle = doc.particle_of(element)
        kind = kind_of(block)
        severity = self.severity_of(element)
        marker = f"  {ISSUE_MARKS[severity]}" if severity in ISSUE_MARKS else ""
        kids = [c for c in element if isinstance(c.tag, str)]
        iid = self.tree.insert(
            parent_iid, "end",
            text=f"{KIND_GLYPHS[kind]}  {localname(str(element.tag))}{marker}",
            values=(self._summary(element, kids),
                    particle.occurs_label if particle is not None else ""),
            open=path not in self._closed,
            tags=(kind,) + ((severity,) if severity in ISSUE_MARKS else ()),
        )
        self._map[iid] = element
        self._paths[iid] = path
        for index, child in enumerate(kids):
            self._add(iid, child, doc, path + (index,))

    @staticmethod
    def _summary(element, kids: list) -> str:
        pairs = []
        for name, value in element.attrib.items():
            if name.startswith("{"):
                continue
            text = (value or "").strip()
            if len(text) > 28:
                text = text[:27] + "…"
            pairs.append(f"{name}={text}" if text else name)
        text = (element.text or "").strip()
        if text and not kids:
            pairs.append("= " + (text if len(text) <= 32 else text[:31] + "…"))
        return "  ".join(pairs)

    def severity_of(self, element) -> str:
        return self._severity.get(id(element), "") if self._severity else ""

    # -- folding ---------------------------------------------------------

    def expand_all(self) -> None:
        self._closed.clear()
        for iid in self._map:
            self.tree.item(iid, open=True)

    def collapse_all(self) -> None:
        for iid, path in self._paths.items():
            if path and self.tree.get_children(iid):
                self.tree.item(iid, open=False)
        self._sync_closed()

    # -- selection -------------------------------------------------------

    def _on_select(self, _event=None) -> None:
        element = self.selected_element()
        if element is not None:
            self.on_select(element)

    def _on_context(self, event) -> None:
        iid = self.tree.identify_row(event.y)
        if not iid or self.on_context is None:
            return
        self.tree.selection_set(iid)
        self.tree.focus(iid)
        self.on_context(self._map[iid], event)

    def selected_element(self):
        selection = self.tree.selection()
        return self._map.get(selection[0]) if selection else None

    def iid_for(self, element) -> str | None:
        for iid, node in self._map.items():
            if node is element:
                return iid
        return None

    def select_element(self, element) -> None:
        iid = self.iid_for(element)
        if iid is None:
            return
        self.tree.see(iid)
        if self.tree.selection() != (iid,):
            self.tree.selection_set(iid)
        self.tree.focus(iid)


# ---------------------------------------------------------------------------
# Inspector
# ---------------------------------------------------------------------------

class ResizableText(tk.Frame):
    """Multiline text field whose height can be adjusted in-place."""

    def __init__(self, master: tk.Misc, height: int = 4) -> None:
        super().__init__(master, background="#ffffff")
        self.text = tk.Text(self, height=height, wrap="word", undo=True,
                            relief="solid", borderwidth=1)
        self.text.grid(row=0, column=0, sticky="nsew")
        self.grip = tk.Canvas(self, width=12, height=12, highlightthickness=0,
                              background="#ffffff", cursor="sb_v_double_arrow")
        self.grip.grid(row=0, column=0, sticky="se")
        self.columnconfigure(0, weight=1)
        self.rowconfigure(0, weight=1)
        self._start_y = 0
        self._start_height = height
        self.grip.bind("<ButtonPress-1>", self._start_resize)
        self.grip.bind("<B1-Motion>", self._resize)

    def insert(self, value: str) -> None:
        self.text.insert("1.0", value)

    def get(self, start: str, end: str) -> str:
        return self.text.get(start, end)

    def bind(self, sequence=None, func=None, add=None):
        return self.text.bind(sequence, func, add)

    def _start_resize(self, event) -> None:
        self._start_y = event.y_root
        self._start_height = int(self.text.cget("height"))

    def _resize(self, event) -> None:
        line_height = max(1, self.text.winfo_fpixels("1i") / 12)
        delta = round((event.y_root - self._start_y) / line_height)
        self.text.configure(height=max(2, min(30, self._start_height + delta)))


class PropertyPanel(ttk.Frame):
    """Typed inspector: schema attributes plus a value editor for the block.

    Every field is generated from ``AttributeSpec``/``LeafSpec``: enumerations
    become read-only combo boxes, ``@fixed`` attributes are locked, booleans
    become true/false selectors, and the XSD documentation of the selected
    block is displayed underneath. Editing a field does *not* rebuild the
    panel, so Tab moves smoothly from one field to the next.
    """

    def __init__(self, master: tk.Misc, on_change: Callable) -> None:
        super().__init__(master)
        self.on_change = on_change  # (element, kind, name, value) -> None
        self._element = None
        self._block: BlockSpec | None = None
        self._attr_labels: dict[str, tuple] = {}
        self._default_fg = ttk.Style(self).lookup("TLabel", "foreground") or "#1d1d1f"
        family = tkfont.nametofont("TkDefaultFont").actual("family")

        self.strip = tk.Frame(self, height=4, background="#e5e5ea")
        self.strip.grid(row=0, column=0, columnspan=2, sticky="ew")
        ttk.Label(self, text="Properties", style="Section.TLabel").grid(
            row=1, column=0, sticky="w", padx=8, pady=(6, 0))
        self.heading = ttk.Label(self, text="Nothing selected", font=(family, 13, "bold"))
        self.heading.grid(row=2, column=0, columnspan=2, sticky="w", padx=8)
        self.subheading = ttk.Label(self, text="", style="Hint.TLabel",
                                    wraplength=300, justify="left")
        self.subheading.grid(row=3, column=0, columnspan=2, sticky="w", padx=8)
        self.issue_box = ttk.Frame(self)
        self.issue_box.grid(row=4, column=0, columnspan=2, sticky="ew", padx=8)

        self.canvas = tk.Canvas(self, highlightthickness=0, background=BG)
        self.body = ttk.Frame(self.canvas)
        self.canvas.create_window((0, 0), window=self.body, anchor="nw", tags="body")
        self.scroller = ttk.Scrollbar(self, orient="vertical", command=self.canvas.yview)
        self.canvas.configure(yscrollcommand=self.scroller.set)
        self.canvas.grid(row=5, column=0, sticky="nsew", padx=(6, 0), pady=6)
        self.scroller.grid(row=5, column=1, sticky="ns", pady=6)
        self.body.bind("<Configure>",
                       lambda _e: self.canvas.configure(scrollregion=self.canvas.bbox("all")))
        self.canvas.bind("<Configure>", lambda _e: self.canvas.itemconfigure(
            "body", width=self.canvas.winfo_width()))
        bind_mousewheel(self, self.canvas)

        ttk.Label(self, text="Schema (XSD)", style="Section.TLabel").grid(
            row=6, column=0, sticky="w", padx=8)
        self.schema_text = tk.Text(self, height=9, wrap="word", relief="flat", borderwidth=0,
                                   background="#ffffff", foreground="#1d1d1f", padx=8, pady=6)
        self.schema_text.grid(row=7, column=0, columnspan=2, sticky="nsew", padx=6, pady=(2, 6))
        self.schema_text.configure(state="disabled")

        self.rowconfigure(5, weight=3)
        self.rowconfigure(7, weight=2)
        self.columnconfigure(0, weight=1)

    # -- loading ---------------------------------------------------------

    def load(self, doc: DocumentModel | None, element, issues=None) -> None:
        self._element = element
        self._attr_labels.clear()
        for child in list(self.body.winfo_children()):
            child.destroy()
        self._set_schema_text("")
        self.set_issues(issues)

        if doc is None or element is None:
            self._block = None
            self.strip.configure(background="#dadce0")
            self.heading.configure(text="Nothing selected")
            self.subheading.configure(
                text="Select a block in the tree or the diagram to edit its properties.")
            return

        block = doc.block_of(element)
        self._block = block
        kind = kind_of(block)
        self.strip.configure(background=KIND_STYLES[kind][0])
        self.heading.configure(text=localname(str(element.tag)))
        detail = block.type_name if block is not None and block.type_name else ""
        self.subheading.configure(text="  ·  ".join(
            part for part in (KIND_STYLES[kind][2] + (" · mixed" if block and block.mixed else ""),
                              detail) if part))

        if block is None:
            ttk.Label(self.body, text="This element is not described by the schema.",
                      foreground=ISSUE_TEXT["error"], wraplength=280).pack(anchor="w", padx=2)
            self._add_generic_attributes(element)
            self._add_value_editor(element, None)
            return

        if block.attributes:
            frame = self._section("Attributes")
            for index, attr in enumerate(block.attributes):
                self._add_attribute_row(frame, index * 2, element, attr)
        self._add_value_editor(element, block)
        self._set_schema_text(describe(block))

    def set_issues(self, issues) -> None:
        """Refresh only the problem list (used after in-place edits)."""
        for child in list(self.issue_box.winfo_children()):
            child.destroy()
        seen = set()
        for issue in issues or []:
            if issue.message in seen:
                continue
            seen.add(issue.message)
            ttk.Label(self.issue_box,
                      text="{} {}".format(ISSUE_MARKS.get(issue.severity, "•"), issue.message),
                      foreground=ISSUE_TEXT.get(issue.severity, "#202124"),
                      wraplength=300, justify="left").pack(anchor="w", fill="x", pady=(3, 0))

    def _section(self, title: str) -> ttk.LabelFrame:
        frame = ttk.LabelFrame(self.body, text=title, padding=(8, 4, 8, 6))
        frame.pack(fill="x", padx=2, pady=(0, 8))
        frame.columnconfigure(1, weight=1)
        return frame

    def _add_generic_attributes(self, element) -> None:
        for name, value in element.attrib.items():
            if name.startswith("{"):
                continue
            row = ttk.Frame(self.body)
            row.pack(fill="x", pady=1)
            ttk.Label(row, text=name, width=15).pack(side="left")
            ttk.Label(row, text=value or "(empty)", style="Hint.TLabel").pack(side="left")

    # -- field builders --------------------------------------------------

    def _add_attribute_row(self, frame, row: int, element, spec) -> None:
        missing = spec.required and not spec.read_only and not element.get(spec.name)
        label = ttk.Label(frame, text=spec.name + (" *" if spec.required else ""))
        if missing:
            label.configure(foreground=ISSUE_TEXT["error"])
        label.grid(row=row, column=0, sticky="w", padx=(0, 8), pady=2)
        self._attr_labels[spec.name] = (label, spec)

        value = (spec.fixed or "") if spec.read_only else (element.get(spec.name) or "")
        var = tk.StringVar(value=value)
        commit = lambda _e=None, n=spec.name, v=var, el=element: self._commit(el, n, v.get())

        if spec.enumerations or spec.is_boolean:
            choices = [""] + (list(spec.enumerations) if spec.enumerations else ["true", "false"])
            widget = ttk.Combobox(frame, textvariable=var, values=choices,
                                  state="disabled" if spec.read_only else "readonly")
            if not spec.read_only:
                widget.bind("<<ComboboxSelected>>", commit)
        else:
            widget = ttk.Entry(frame, textvariable=var,
                               state="readonly" if spec.read_only else "normal")
            if not spec.read_only:
                widget.bind("<Return>", commit)
                widget.bind("<FocusOut>", commit)
        widget.grid(row=row, column=1, sticky="ew", pady=2)

        if not spec.required and not spec.read_only:
            ttk.Button(frame, text="✕", width=2, style="Toolbar.TButton",
                       command=lambda: (var.set(""), commit())).grid(
                row=row, column=2, padx=(3, 0))

        hints = []
        if spec.fixed is not None:
            hints.append("fixed")
        elif spec.default is not None:
            hints.append(f"default {spec.default}")
        if spec.documentation:
            hints.append(spec.documentation)
        if hints:
            ttk.Label(frame, text=" · ".join(hints), style="Hint.TLabel",
                      wraplength=250, justify="left").grid(
                row=row + 1, column=0, columnspan=3, sticky="w")

    def _add_value_editor(self, element, block: BlockSpec | None) -> None:
        if block is not None and block.leaf is None and not block.mixed:
            return
        frame = self._section("Value")
        frame.columnconfigure(0, weight=1)
        leaf = block.leaf if block is not None else None
        if leaf is not None and leaf.enumerations:
            var = tk.StringVar(value=(element.text or "").strip())
            combo = ttk.Combobox(frame, textvariable=var, state="readonly",
                                 values=[""] + list(leaf.enumerations))
            combo.grid(row=0, column=0, sticky="ew")
            combo.bind("<<ComboboxSelected>>",
                       lambda _e, v=var, el=element: self._commit_text(el, v.get()))
            return
        editor = ResizableText(frame, height=4)
        editor.insert(element.text or "")
        editor.grid(row=0, column=0, sticky="ew")
        editor.bind("<FocusOut>",
                    lambda _e, el=element: self._commit_text(el, editor.get("1.0", "end-1c")))
        ttk.Button(frame, text="Apply value", style="Toolbar.TButton",
                   command=lambda el=element: self._commit_text(
                       el, editor.get("1.0", "end-1c"))).grid(row=1, column=0, sticky="e", pady=(4, 0))

    # -- commits ---------------------------------------------------------

    def _commit(self, element, name: str, value: str) -> None:
        if element is not self._element:
            return
        self.on_change(element, "attribute", name, value)
        entry = self._attr_labels.get(name)
        if entry is not None:
            label, spec = entry
            missing = spec.required and not spec.read_only and not element.get(name)
            label.configure(foreground=ISSUE_TEXT["error"] if missing else self._default_fg)

    def _commit_text(self, element, value: str) -> None:
        if element is self._element:
            self.on_change(element, "text", "", value)

    def _set_schema_text(self, text: str) -> None:
        self.schema_text.configure(state="normal")
        self.schema_text.delete("1.0", "end")
        self.schema_text.insert("1.0", text)
        self.schema_text.configure(state="disabled")


# ---------------------------------------------------------------------------
# Source view
# ---------------------------------------------------------------------------

#: Above this many characters the source tab skips regex highlighting (tens
#: of thousands of tag_add calls) and shows plain text instead — the content
#: stays identical, only the colours are dropped for very large files.
SOURCE_HIGHLIGHT_LIMIT = 200_000

class SourceView(ttk.Frame):
    """Read-only, syntax-coloured XML of the live buffer (as it will be saved)."""

    TAG_RE = re.compile(r"</?[\w:.\-]+|\??/?>")
    ATTR_RE = re.compile(r"""([\w:.\-]+)(\s*=\s*)("[^"]*"|'[^']*')""")
    COMMENT_RE = re.compile(r"<!--.*?-->")

    def __init__(self, master: tk.Misc) -> None:
        super().__init__(master)
        bar = ttk.Frame(self)
        bar.grid(row=0, column=0, columnspan=2, sticky="ew", padx=4, pady=4)
        copy = ttk.Button(bar, text="Copy XML", style="Toolbar.TButton", command=self._copy)
        copy.pack(side="left")
        self.info = ttk.Label(bar, text="", style="Hint.TLabel")
        self.info.pack(side="right")

        mono = tkfont.nametofont("TkFixedFont").copy()
        mono.configure(size=10)
        self.text = tk.Text(self, wrap="none", font=mono, background="#fbfbfb",
                            foreground="#202124", relief="flat", borderwidth=0, padx=8, pady=6)
        scroll_y = ttk.Scrollbar(self, orient="vertical", command=self.text.yview)
        scroll_x = ttk.Scrollbar(self, orient="horizontal", command=self.text.xview)
        self.text.configure(yscrollcommand=scroll_y.set, xscrollcommand=scroll_x.set)
        self.text.grid(row=1, column=0, sticky="nsew")
        scroll_y.grid(row=1, column=1, sticky="ns")
        scroll_x.grid(row=2, column=0, sticky="ew")
        self.rowconfigure(1, weight=1)
        self.columnconfigure(0, weight=1)
        self.text.tag_configure("tag", foreground="#1a73e8")
        self.text.tag_configure("attr", foreground="#b06000")
        self.text.tag_configure("value", foreground="#188038")
        self.text.tag_configure("comment", foreground="#80868b")
        self.text.configure(state="disabled")

    def show(self, content: str) -> None:
        # The source tab is usually hidden while editing: skip the expensive
        # regex highlighting until the user actually opens it (see
        # editor._on_tab_changed). Plain insert keeps edits cheap; the full
        # refresh happens on tab switch.
        if self.winfo_viewable():
            self._show_highlighted(content)
        else:
            self._pending = content
            self.info.configure(text="")

    def refresh_if_visible(self) -> None:
        """Apply a deferred paint if the Source tab is currently showing."""
        pending = getattr(self, "_pending", None)
        if pending is None or not self.winfo_viewable():
            return
        self._pending = None
        self._show_highlighted(pending)

    def _show_highlighted(self, content: str) -> None:
        top = self.text.yview()[0]
        self.text.configure(state="normal")
        self.text.delete("1.0", "end")
        self.text.insert("1.0", content)
        if len(content) <= SOURCE_HIGHLIGHT_LIMIT:
            for number, line in enumerate(content.split("\n"), 1):
                if "<" not in line:
                    continue
                for match in self.TAG_RE.finditer(line):
                    self.text.tag_add("tag", f"{number}.{match.start()}", f"{number}.{match.end()}")
                for match in self.ATTR_RE.finditer(line):
                    self.text.tag_add("attr", f"{number}.{match.start(1)}", f"{number}.{match.end(1)}")
                    self.text.tag_add("value", f"{number}.{match.start(3)}", f"{number}.{match.end(3)}")
                for match in self.COMMENT_RE.finditer(line):
                    self.text.tag_add("comment", f"{number}.{match.start()}", f"{number}.{match.end()}")
            self.info.configure(text=f"{content.count(chr(10)) + 1 if content else 0} lines")
        else:
            shown_kb = len(content.encode("utf-8", "replace")) // 1024
            self.info.configure(text=f"{content.count(chr(10)) + 1} lines · {shown_kb} KB — "
                                     "highlighting off for large files")
        self.text.configure(state="disabled")
        self.text.yview_moveto(top)

    def _copy(self) -> None:
        self.clipboard_clear()
        self.clipboard_append(self.text.get("1.0", "end-1c"))


# ---------------------------------------------------------------------------
# Diagram
# ---------------------------------------------------------------------------

#: Files this size (or larger) open with the diagram pre-folded: one card per
#: top-level section instead of one card per element, so the first paint is
#: fast and the user unfolds only what they need.
LARGE_DIAGRAM_ELEMENTS = 120

NODE_H, HEAD_H = 50, 26
GAP_X, GAP_Y, MARGIN = 70, 12, 28
MIN_W, MAX_W = 160, 320
TOGGLE_R = 9


@dataclass(eq=False)
class _Node:
    nid: int
    element: object
    depth: int
    path: tuple
    title: str
    subtitle: str
    kind: str
    occurs: str
    optional: bool
    severity: str
    has_children: bool
    block: object = None
    children: list = field(default_factory=list)
    hidden: int = 0
    x: float = 0.0
    y: float = 0.0
    w: float = MIN_W


class BlockDiagram(ttk.Frame):
    """Colour-coded, foldable left-to-right graph of the document.

    * one card per block: coloured header (kind), name, occurrences badge,
      key attributes / value underneath, ✖/⚠ badge when it has problems;
    * dashed connectors = optional blocks;
    * ⊖ / ⊕n button on the card edge folds/unfolds a whole branch
      (the number is how many blocks are hidden);
    * click = select (synced with the tree and the inspector),
      double-click = fold/unfold, right-click = action menu,
      hover = tooltip, Ctrl+wheel = zoom, drag background = pan.
    """

    def __init__(self, master: tk.Misc, on_select: Callable[[object], None],
                 on_context: Callable | None = None) -> None:
        super().__init__(master)
        self.on_select = on_select
        self.on_context = on_context
        self._doc: DocumentModel | None = None
        self._issues: list[Issue] = []
        self._nodes: list[_Node] = []
        self._items: dict[int, dict] = {}
        self._hit: dict[int, tuple] = {}
        self._collapsed: set[tuple] = set()
        self._selected = None
        self._selected_nid: int | None = None
        self._hover: int | None = None
        self._panning = False
        self.zoom = 1.0
        self._size = (1.0, 1.0)
        self._zoom_var = tk.StringVar(value="100%")
        self._severity: dict[int, str] = {}
        self._dirty = True          # _redraw() is deferred until the tab shows
        self._needs_fit = True      # "fit on first visible paint" for this doc

        self._family = tkfont.nametofont("TkDefaultFont").actual("family")
        self._m_title = tkfont.Font(family=self._family, size=-13, weight="bold")
        self._m_sub = tkfont.Font(family=self._family, size=-11)
        self._make_fonts()

        self._build_toolbar()
        self.canvas = tk.Canvas(self, background="#f6f8fb", highlightthickness=0, takefocus=1)
        scroll_y = ttk.Scrollbar(self, orient="vertical", command=self.canvas.yview)
        scroll_x = ttk.Scrollbar(self, orient="horizontal", command=self.canvas.xview)
        self.canvas.configure(yscrollcommand=scroll_y.set, xscrollcommand=scroll_x.set)
        self.canvas.grid(row=1, column=0, sticky="nsew")
        scroll_y.grid(row=1, column=1, sticky="ns")
        scroll_x.grid(row=2, column=0, sticky="ew")
        ttk.Label(self, style="Hint.TLabel", text=(
            "Click: select  ·  Double-click: fold/unfold  ·  Right-click: actions  ·  "
            "Ctrl+wheel: zoom  ·  Drag the background: pan  ·  dashed link = optional block")
        ).grid(row=3, column=0, columnspan=2, sticky="w", padx=6, pady=3)
        self.rowconfigure(1, weight=1)
        self.columnconfigure(0, weight=1)

        self._tip = Tip(self.canvas)
        c = self.canvas
        c.bind("<ButtonPress-1>", self._on_press)
        c.bind("<B1-Motion>", self._on_drag)
        c.bind("<ButtonRelease-1>", self._on_release)
        c.bind("<Double-Button-1>", self._on_double)
        c.bind("<Motion>", self._on_motion)
        c.bind("<Leave>", self._on_leave)
        c.bind("<MouseWheel>", self._on_wheel)
        c.bind("<Button-4>", self._on_wheel)
        c.bind("<Button-5>", self._on_wheel)
        c.bind("<Map>", lambda _e: self.redraw_if_visible())
        for sequence in context_sequences(c):
            c.bind(sequence, self._on_context)

    # -- toolbar ---------------------------------------------------------

    def _build_toolbar(self) -> None:
        bar = ttk.Frame(self, padding=(6, 4))
        bar.grid(row=0, column=0, columnspan=2, sticky="ew")

        def button(text: str, command, tip: str) -> None:
            widget = ttk.Button(bar, text=text, command=command, style="Toolbar.TButton")
            widget.pack(side="left", padx=1)
            Tip(widget, tip)

        button("Expand all", self.expand_all, "Unfold every block")
        button("Collapse all", self.collapse_all, "Fold everything below the first level")
        ttk.Separator(bar, orient="vertical").pack(side="left", fill="y", padx=8)
        button("−", lambda: self.set_zoom(self.zoom / 1.2), "Zoom out (Ctrl+wheel)")
        ttk.Label(bar, textvariable=self._zoom_var, width=5, anchor="center").pack(side="left")
        button("+", lambda: self.set_zoom(self.zoom * 1.2), "Zoom in (Ctrl+wheel)")
        button("Fit", self.fit, "Fit the whole diagram in the view")
        button("100%", lambda: self.set_zoom(1.0), "Reset the zoom")

        for kind in reversed(("root", "container", "value", "text", "freeform")):
            accent, _tint, label = KIND_STYLES[kind]
            ttk.Label(bar, text=label, style="Hint.TLabel").pack(side="right", padx=(0, 10))
            tk.Frame(bar, width=12, height=12, background=accent).pack(side="right", padx=(0, 3))

    def _make_fonts(self) -> None:
        def px(size: int) -> int:
            return -max(7, round(size * self.zoom))
        self._f_title = tkfont.Font(family=self._family, size=px(13), weight="bold")
        self._f_sub = tkfont.Font(family=self._family, size=px(11))
        self._f_badge = tkfont.Font(family=self._family, size=px(10), weight="bold")

    # -- public API ------------------------------------------------------

    def render(self, doc: DocumentModel | None, issues: list[Issue] | None = None) -> None:
        if doc is not self._doc:
            self._collapsed.clear()
            self._selected = None
            self._needs_fit = True
            if doc is not None:
                # Large documents (documentation.xml, …): fold every first-level
                # branch so the first paint draws a handful of cards instead of
                # the whole tree. Unfolding is one click per section.
                count = sum(1 for node in doc.root.iter() if isinstance(node.tag, str))
                if count >= LARGE_DIAGRAM_ELEMENTS:
                    kids = [c for c in doc.root if isinstance(c.tag, str)]
                    self._collapsed = {(index,) for index in range(len(kids))}
        self._doc = doc
        self._issues = list(issues or [])
        self._severity = {id(issue.element): issue.severity for issue in self._issues
                          if issue.element is not None}
        if self._visible():
            self._redraw()
            self._dirty = False
        else:
            # Off-screen redraws only burn time: remember the state, paint when
            # the user actually switches to the Diagram tab.
            self._dirty = True

    def _visible(self) -> bool:
        try:
            return bool(self.winfo_viewable() and self.canvas.winfo_width() >= 60)
        except tk.TclError:
            return False

    def redraw_if_visible(self) -> bool:
        """Paint a deferred redraw if the tab is showing; True when painted."""
        if self._doc is None or not self._visible():
            return False
        if not self._dirty:
            return False
        self._redraw()
        self._dirty = False
        if self._needs_fit:
            self._needs_fit = False
            self.fit()
            self._scroll_to(self._selected)
        return True

    def select_element(self, element, reveal: bool = True) -> None:
        """Highlight *element* (unfolding its ancestors and scrolling to it)."""
        self._selected = element
        if element is not None and self._doc is not None and reveal:
            path = self._path_of(element)
            if path is not None:
                changed = False
                for depth in range(len(path)):
                    if path[:depth] in self._collapsed:
                        self._collapsed.discard(path[:depth])
                        changed = True
                if changed:
                    self._redraw()
        self._apply_selection()
        if reveal:
            self._scroll_to(element)

    def expand_all(self) -> None:
        self._collapsed.clear()
        self._redraw()

    def collapse_all(self) -> None:
        if self._doc is None:
            return
        self._collapsed = {path for path in self._container_paths() if path}
        self._redraw()

    def toggle(self, node: _Node) -> None:
        if not node.has_children:
            return
        if node.path in self._collapsed:
            self._collapsed.discard(node.path)
        else:
            self._collapsed.add(node.path)
        self._redraw()

    def set_zoom(self, value: float, anchor=None, reset_view: bool = False) -> None:
        value = max(0.35, min(2.0, value))
        if abs(value - self.zoom) < 1e-3 and not reset_view:
            return
        c = self.canvas
        ax, ay = anchor if anchor else (c.winfo_width() / 2, c.winfo_height() / 2)
        mx, my = c.canvasx(ax) / self.zoom, c.canvasy(ay) / self.zoom
        self.zoom = value
        self._make_fonts()
        self._zoom_var.set(f"{round(value * 100)}%")
        self._redraw(view=(0.0, 0.0) if reset_view else (mx * value - ax, my * value - ay))

    def fit(self) -> None:
        if self._doc is None:
            return
        self.update_idletasks()
        avail_w = max(200, self.canvas.winfo_width())
        avail_h = max(200, self.canvas.winfo_height())
        zoom = min(avail_w / self._size[0], avail_h / self._size[1])
        self.set_zoom(max(0.35, min(1.0, zoom)), reset_view=True)

    # -- model helpers ---------------------------------------------------

    def _container_paths(self) -> list[tuple]:
        result: list[tuple] = []

        def walk(element, path: tuple) -> None:
            kids = [c for c in element if isinstance(c.tag, str)]
            if kids:
                result.append(path)
            for index, kid in enumerate(kids):
                walk(kid, path + (index,))

        walk(self._doc.root, ())
        return result

    @staticmethod
    def _path_of(element):
        parts = []
        node = element
        while node is not None and node.getparent() is not None:
            siblings = [c for c in node.getparent() if isinstance(c.tag, str)]
            if node not in siblings:
                return None
            parts.append(siblings.index(node))
            node = node.getparent()
        return tuple(reversed(parts))

    @staticmethod
    def _subtitle(element, block, kids: list) -> str:
        # Captions stay short on purpose: the diagram measures every caption
        # with the Tk text engine, so a 6 000-char markdown body here used to
        # cost tens of seconds per redraw on documentation.xml.
        parts = [f"{k}={v[:60]}" for k, v in element.attrib.items()
                 if not k.startswith("{") and v][:2]
        text = re.sub(r"\s+", " ", element.text or "").strip()
        if text and not kids:
            parts.append(f"“{text[:160]}{'…' if len(text) > 160 else ''}”")
        if not parts:
            parts.append(f"{len(kids)} block(s)" if kids else
                         (KIND_STYLES[kind_of(block)][2].lower()))
        return "  ·  ".join(parts)

    def _fit(self, text: str, font: tkfont.Font, max_width: float) -> str:
        # Binary search on the prefix length: the old char-by-char loop
        # called font.measure() once per character (~6 000 calls for one
        # documentation chapter), which dominated large-file redraws.
        if font.measure(text) <= max_width:
            return text
        if font.measure("…") > max_width:
            return "…"
        lo, hi = 0, len(text)
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if font.measure(text[:mid] + "…") <= max_width:
                lo = mid
            else:
                hi = mid - 1
        return text[:lo] + "…"

    # -- layout ----------------------------------------------------------

    def _collect(self, element, depth: int, path: tuple) -> _Node:
        doc = self._doc
        block = doc.block_of(element)
        particle = doc.particle_of(element)
        kids = [c for c in element if isinstance(c.tag, str)]
        node = _Node(
            nid=len(self._nodes), element=element, depth=depth, path=path,
            title=localname(str(element.tag)),
            subtitle=self._subtitle(element, block, kids),
            kind=kind_of(block),
            occurs=particle.occurs_label if particle is not None else "",
            optional=particle is not None and particle.min_occurs == 0,
            severity=self._severity.get(id(element), "") if self._severity else "",
            has_children=bool(kids), block=block)
        self._nodes.append(node)
        if kids:
            if path in self._collapsed:
                node.hidden = sum(1 for d in element.iterdescendants() if isinstance(d.tag, str))
            else:
                for index, child in enumerate(kids):
                    node.children.append(self._collect(child, depth + 1, path + (index,)))
        head_w = (self._m_title.measure(node.title) + 20
                  + (self._m_sub.measure(node.occurs) + 16 if node.occurs else 0)
                  + (26 if node.severity else 0))
        sub_w = self._m_sub.measure(node.subtitle) + 34
        node.w = max(MIN_W, min(MAX_W, max(head_w, sub_w)))
        return node

    def _place(self, node: _Node) -> None:
        if not node.children:
            node.y = self._cursor
            self._cursor += NODE_H + GAP_Y
            return
        for child in node.children:
            self._place(child)
        node.y = (node.children[0].y + node.children[-1].y) / 2

    def _layout(self) -> None:
        self._nodes = []
        root = self._collect(self._doc.root, 0, ())
        col_w: dict[int, float] = {}
        for node in self._nodes:
            col_w[node.depth] = max(col_w.get(node.depth, 0), node.w)
        xs, x = {}, float(MARGIN)
        for depth in range(max(col_w) + 1):
            xs[depth] = x
            x += col_w[depth] + GAP_X
        for node in self._nodes:
            node.x, node.w = xs[node.depth], col_w[node.depth]
        self._cursor = float(MARGIN)
        self._place(root)
        self._size = (x - GAP_X + MARGIN, self._cursor - GAP_Y + MARGIN)

    # -- painting --------------------------------------------------------

    def _redraw(self, view=None) -> None:
        c = self.canvas
        if view is None:
            view = (c.canvasx(0), c.canvasy(0))
        self._tip.hide()
        c.delete("all")
        self._hit.clear()
        self._items.clear()
        self._nodes = []
        self._hover = None
        self._selected_nid = None
        if self._doc is None:
            c.configure(scrollregion=(0, 0, 1, 1))
            c.create_text(24, 24, anchor="nw", text="No document", fill="#80868b",
                          font=self._f_title)
            return
        self._layout()
        for node in self._nodes:
            for child in node.children:
                self._connector(node, child)
        for node in self._nodes:
            self._card(node)
        for node in self._nodes:
            if node.has_children:
                self._toggle_button(node)
        width, height = self._size[0] * self.zoom, self._size[1] * self.zoom
        c.configure(scrollregion=(0, 0, width, height))
        c.xview_moveto(max(0.0, min(1.0, view[0] / width)))
        c.yview_moveto(max(0.0, min(1.0, view[1] / height)))
        self._apply_selection()

    def _rrect(self, x1, y1, x2, y2, r, **kw) -> int:
        points = [x1 + r, y1, x2 - r, y1, x2, y1, x2, y1 + r, x2, y2 - r, x2, y2,
                  x2 - r, y2, x1 + r, y2, x1, y2, x1, y2 - r, x1, y1 + r, x1, y1]
        return self.canvas.create_polygon(points, smooth=True, **kw)

    def _connector(self, parent: _Node, child: _Node) -> None:
        z = self.zoom
        x1, y1 = (parent.x + parent.w) * z, (parent.y + NODE_H / 2) * z
        x2, y2 = child.x * z, (child.y + NODE_H / 2) * z
        mid = x1 + (x2 - x1) * 0.5
        options = {"fill": KIND_STYLES[parent.kind][0], "width": max(1.2, 1.6 * z),
                   "smooth": True, "splinesteps": 20, "arrow": "last",
                   "arrowshape": (7 * z, 8 * z, 3 * z)}
        if child.optional:
            options["dash"] = (5, 4)
        self.canvas.create_line(x1, y1, mid, y1, mid, y2, x2, y2, **options)

    def _card(self, node: _Node) -> None:
        c, z = self.canvas, self.zoom
        head, tint, _label = KIND_STYLES[node.kind]
        x, y = node.x * z, node.y * z
        w, h, hh, r = node.w * z, NODE_H * z, HEAD_H * z, 8 * z

        halo = self._rrect(x - 4 * z, y - 4 * z, x + w + 4 * z, y + h + 4 * z, 11 * z,
                           fill="#fdd663", outline="", state="hidden")
        self._rrect(x + 1.5 * z, y + 2.5 * z, x + w + 1.5 * z, y + h + 2.5 * z, r,
                    fill="#dadce0", outline="")
        parts = [
            self._rrect(x, y, x + w, y + h, r, fill=tint, outline=""),
            self._rrect(x, y, x + w, y + hh, r, fill=head, outline=""),
            c.create_rectangle(x, y + hh / 2, x + w, y + hh, fill=head, outline=""),
        ]
        right = 10 * z
        if node.severity:
            cx, cy = x + w - 14 * z, y + hh / 2
            parts.append(c.create_oval(cx - 8 * z, cy - 8 * z, cx + 8 * z, cy + 8 * z,
                                       fill="#ffffff", outline=""))
            parts.append(c.create_text(cx, cy, text=ISSUE_MARKS[node.severity],
                                       fill=ISSUE_COLOURS[node.severity], font=self._f_badge))
            right = 28 * z
        if node.occurs:
            parts.append(c.create_text(x + w - right, y + hh / 2, anchor="e", text=node.occurs,
                                       fill=tint, font=self._f_badge))
            right += self._f_badge.measure(node.occurs) + 8 * z
        parts.append(c.create_text(
            x + 10 * z, y + hh / 2, anchor="w", fill="#ffffff", font=self._f_title,
            text=self._fit(node.title, self._f_title, w - 10 * z - right)))
        sub_room = w - 20 * z - ((TOGGLE_R + 2) * z if node.has_children else 0)
        parts.append(c.create_text(
            x + 10 * z, y + hh + (h - hh) / 2, anchor="w", fill="#3c4043", font=self._f_sub,
            text=self._fit(node.subtitle, self._f_sub, sub_room)))
        frame = self._rrect(x, y, x + w, y + h, r, fill="", outline=head, width=1)
        parts.append(frame)
        for item in parts:
            self._hit[item] = ("node", node.nid)
        self._items[node.nid] = {"frame": frame, "halo": halo}

    def _toggle_button(self, node: _Node) -> None:
        c, z = self.canvas, self.zoom
        head = KIND_STYLES[node.kind][0]
        cx, cy, r = (node.x + node.w) * z, (node.y + NODE_H / 2) * z, TOGGLE_R * z
        collapsed = node.path in self._collapsed
        oval = c.create_oval(cx - r, cy - r, cx + r, cy + r,
                             fill=head if collapsed else "#ffffff", outline=head,
                             width=max(1.5, 1.5 * z))
        label = c.create_text(cx, cy, text=str(min(node.hidden, 99)) if collapsed else "−",
                              fill="#ffffff" if collapsed else head, font=self._f_badge)
        self._hit[oval] = ("toggle", node.nid)
        self._hit[label] = ("toggle", node.nid)

    # -- selection / hover styling ---------------------------------------

    def _style_node(self, node: _Node) -> None:
        items = self._items.get(node.nid)
        if not items:
            return
        selected = node.nid == self._selected_nid
        colour, width = KIND_STYLES[node.kind][0], 1
        if node.severity:
            colour, width = ISSUE_COLOURS[node.severity], 2
        if node.nid == self._hover:
            width = max(width, 2)
        if selected:
            colour, width = "#202124", 3
        self.canvas.itemconfigure(items["frame"], outline=colour, width=max(1.0, width * self.zoom))
        self.canvas.itemconfigure(items["halo"], state="normal" if selected else "hidden")

    def _apply_selection(self) -> None:
        self._selected_nid = None
        for node in self._nodes:
            if node.element is self._selected:
                self._selected_nid = node.nid
                break
        for node in self._nodes:
            self._style_node(node)

    def _scroll_to(self, element) -> None:
        c = self.canvas
        if element is None or self._doc is None or c.winfo_width() < 60 or c.winfo_height() < 60:
            return
        node = next((n for n in self._nodes if n.element is element), None)
        if node is None:
            return
        z = self.zoom
        left, right = node.x * z, (node.x + node.w) * z
        top, bottom = node.y * z, (node.y + NODE_H) * z
        total_w, total_h = self._size[0] * z, self._size[1] * z
        width, height = c.winfo_width(), c.winfo_height()
        if left < c.canvasx(0) + 10 or right > c.canvasx(width) - 10:
            c.xview_moveto(max(0.0, (left + right) / 2 - width / 2) / total_w)
        if top < c.canvasy(0) + 10 or bottom > c.canvasy(height) - 10:
            c.yview_moveto(max(0.0, (top + bottom) / 2 - height / 2) / total_h)

    # -- events ----------------------------------------------------------

    def _hit_at(self, event):
        cx, cy = self.canvas.canvasx(event.x), self.canvas.canvasy(event.y)
        for item in reversed(self.canvas.find_overlapping(cx, cy, cx, cy)):
            hit = self._hit.get(item)
            if hit is not None:
                return hit
        return None

    def _on_press(self, event) -> None:
        self.canvas.focus_set()
        self._tip.hide()
        hit = self._hit_at(event)
        if hit is None:
            self._panning = True
            self.canvas.scan_mark(event.x, event.y)
            self.canvas.configure(cursor="fleur")
            return
        kind, nid = hit
        node = self._nodes[nid]
        if kind == "toggle":
            self.toggle(node)
        else:
            self.on_select(node.element)

    def _on_drag(self, event) -> None:
        if self._panning:
            self.canvas.scan_dragto(event.x, event.y, gain=1)

    def _on_release(self, event) -> None:
        if self._panning:
            self._panning = False
            self.canvas.configure(cursor="hand2" if self._hit_at(event) else "")

    def _on_double(self, event) -> None:
        hit = self._hit_at(event)
        if hit is not None:
            self.toggle(self._nodes[hit[1]])

    def _on_motion(self, event) -> None:
        if self._panning:
            return
        hit = self._hit_at(event)
        nid = hit[1] if hit else None
        self.canvas.configure(cursor="hand2" if hit else "")
        if nid != self._hover:
            old, self._hover = self._hover, nid
            for index in (old, nid):
                if index is not None and index < len(self._nodes):
                    self._style_node(self._nodes[index])
            self._tip.hide()
            if nid is not None:
                self._tip.arm(self._tip_text(self._nodes[nid]))

    def _on_leave(self, _event) -> None:
        self._tip.hide()
        if self._hover is not None:
            old, self._hover = self._hover, None
            if old < len(self._nodes):
                self._style_node(self._nodes[old])

    def _on_context(self, event) -> None:
        hit = self._hit_at(event)
        if hit is None or self.on_context is None:
            return
        node = self._nodes[hit[1]]
        self.on_select(node.element)
        self.on_context(node.element, event)

    def _on_wheel(self, event) -> None:
        self._tip.hide()
        delta = event.delta if event.delta else (120 if event.num == 4 else -120)
        if event.state & 0x4:      # Ctrl -> zoom around the pointer
            self.set_zoom(self.zoom * (1.1 if delta > 0 else 1 / 1.1), anchor=(event.x, event.y))
        elif event.state & 0x1:    # Shift -> horizontal scroll
            self.canvas.xview_scroll(-1 if delta > 0 else 1, "units")
        else:
            self.canvas.yview_scroll(-1 if delta > 0 else 1, "units")

    def _tip_text(self, node: _Node) -> str:
        block = node.block
        title = node.title + (f"  ({block.type_name})" if block is not None and block.type_name else "")
        lines = [title, KIND_STYLES[node.kind][2] + (f" · {node.occurs}" if node.occurs else "")]
        for name, value in list(node.element.attrib.items())[:8]:
            if not name.startswith("{"):
                shown = value if len(value) <= 80 else value[:79] + "…"
                lines.append(f"  {name} = {shown}")
        for issue in self._issues:
            if issue.element is node.element:
                lines.append(f"{ISSUE_MARKS.get(issue.severity, '•')} {issue.message}")
        if block is not None and block.documentation:
            doc = block.documentation.strip()
            lines += ["", doc if len(doc) < 260 else doc[:259] + "…"]
        if node.has_children:
            lines += ["", "Double-click to fold / unfold"]
        return "\n".join(lines)