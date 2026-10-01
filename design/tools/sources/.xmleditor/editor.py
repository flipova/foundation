"""Main window of the visual XML editor.

The window is assembled from the XSD-driven widgets: palette on the left
(schema profile always visible + what is allowed under the selection),
document blocks / diagram / source in the middle, typed inspector on the
right, problem list at the bottom. Every action routes through
``DocumentModel`` so undo/redo and dirty tracking are exact.
"""

from __future__ import annotations

import tkinter as tk
from pathlib import Path
from tkinter import filedialog, messagebox, simpledialog, ttk

from .blocks import can_add, contextual_entries, describe
from .model import DocumentModel, Issue, localname
from .widgets import (
    ISSUE_MARKS,
    ISSUE_TEXT,
    BlockDiagram,
    BlockPalette,
    Breadcrumb,
    DocumentTree,
    EmptyState,
    FileExplorer,
    PropertyPanel,
    SourceView,
    Tip,
    apply_theme,
)
from .xsdmodel import SchemaModel

APP_TITLE = "Flipova Foundation — XML block editor"


class XmlEditorApp:
    """The editor window (schema-driven: it knows no element name by heart)."""

    def __init__(self, schema: SchemaModel, path: Path | None = None) -> None:
        self.schema = schema
        self.doc: DocumentModel | None = None
        self.issues: list[Issue] = []
        self.selected = None
        self._keep_panel = False       # True while an inspector edit is being applied
        self._actions: dict[str, ttk.Button] = {}
        self._issue_map: dict[str, Issue] = {}

        self.root = tk.Tk()
        apply_theme(self.root)
        self.root.title(APP_TITLE)
        self.root.geometry("1400x900")
        self.root.minsize(1040, 660)
        self.root.protocol("WM_DELETE_WINDOW", self.quit)

        self._build_menu()
        self._build_toolbar()
        self._build_status()
        self._build_body()
        self._bind_keys()

        if path is not None:
            self.open_path(path)
        else:
            self.refresh()

    # -- construction ----------------------------------------------------

    def _build_menu(self) -> None:
        menubar = tk.Menu(self.root)

        file_menu = tk.Menu(menubar, tearoff=False)
        file_menu.add_command(label="New from schema…", accelerator="Ctrl+N",
                              command=self.choose_root)
        file_menu.add_command(label="Open…", accelerator="Ctrl+O", command=self.open_file)
        file_menu.add_separator()
        file_menu.add_command(label="Save", accelerator="Ctrl+S", command=self.save)
        file_menu.add_command(label="Save as…", command=self.save_as)
        file_menu.add_separator()
        file_menu.add_command(label="Exit", command=self.quit)
        menubar.add_cascade(label="File", menu=file_menu)

        edit_menu = tk.Menu(menubar, tearoff=False)
        edit_menu.add_command(label="Undo", accelerator="Ctrl+Z", command=self.undo)
        edit_menu.add_command(label="Redo", accelerator="Ctrl+Y", command=self.redo)
        edit_menu.add_separator()
        edit_menu.add_command(label="Auto-fix all issues", accelerator="F2",
                              command=self.auto_fix)
        edit_menu.add_separator()
        edit_menu.add_command(label="Add block", accelerator="Insert", command=self.add_block)
        edit_menu.add_command(label="Duplicate block", accelerator="Ctrl+D",
                              command=self.duplicate_block)
        edit_menu.add_command(label="Remove block", accelerator="Del", command=self.remove_block)
        edit_menu.add_separator()
        edit_menu.add_command(label="Move up", accelerator="Alt+Up",
                              command=lambda: self.move_block(-1))
        edit_menu.add_command(label="Move down", accelerator="Alt+Down",
                              command=lambda: self.move_block(1))
        menubar.add_cascade(label="Edit", menu=edit_menu)

        view_menu = tk.Menu(menubar, tearoff=False)
        view_menu.add_command(label="Blocks view", accelerator="Ctrl+1",
                              command=lambda: self.notebook.select(self.tree))
        view_menu.add_command(label="Diagram view", accelerator="Ctrl+2",
                              command=lambda: self.notebook.select(self.diagram))
        view_menu.add_command(label="Source view", accelerator="Ctrl+3",
                              command=lambda: self.notebook.select(self.source))
        view_menu.add_separator()
        view_menu.add_command(label="Search blocks", accelerator="Ctrl+F",
                              command=lambda: self.palette.focus_search())
        menubar.add_cascade(label="View", menu=view_menu)

        tools_menu = tk.Menu(menubar, tearoff=False)
        tools_menu.add_command(label="Validate (XSD)", accelerator="F5", command=self.validate_all)
        tools_menu.add_command(label="Schema profile summary", command=self.show_schema_summary)
        menubar.add_cascade(label="Tools", menu=tools_menu)

        help_menu = tk.Menu(menubar, tearoff=False)
        help_menu.add_command(label="About", command=self.show_about)
        menubar.add_cascade(label="Help", menu=help_menu)

        self.root.configure(menu=menubar)

    def _build_toolbar(self) -> None:
        bar = ttk.Frame(self.root, padding=(12, 10, 12, 6))
        bar.pack(fill="x")
        left = ttk.Frame(bar)
        left.pack(side="left", fill="x")
        right = ttk.Frame(bar)
        right.pack(side="right")

        def add(parent, key, label, tip, command,
                style="Toolbar.TButton", padx=(0, 6)):
            button = ttk.Button(parent, text=label, command=command, style=style)
            button.pack(side="left", padx=padx)
            Tip(button, tip)
            self._actions[key] = button

        # left: document lifecycle + history (block ops live in the menus,
        # the right-click menu and the keyboard to keep the bar calm)
        add(left, "new", "New", "New document from a schema root (Ctrl+N)",
            self.choose_root)
        add(left, "open", "Open", "Open an XML file (Ctrl+O)", self.open_file)
        add(left, "save", "Save", "Save the document (Ctrl+S)", self.save)
        ttk.Separator(left, orient="vertical").pack(side="left", fill="y",
                                                   padx=(4, 12))
        add(left, "undo", "Undo", "Undo (Ctrl+Z)", self.undo)
        add(left, "redo", "Redo", "Redo (Ctrl+Y)", self.redo, padx=(0, 0))

        # right: the two primary actions
        add(right, "validate", "Validate", "Validate against the XSD (F5)",
            self.validate_all, padx=(0, 8))
        add(right, "fix", "Auto-fix all",
            ("Add missing required blocks/attributes and correct "
             "invalid values in one click (F2)"),
            self.auto_fix, style="Accent.TButton", padx=(0, 0))

    def _build_body(self) -> None:
        outer = ttk.PanedWindow(self.root, orient="vertical")
        outer.pack(fill="both", expand=True, padx=10, pady=(4, 0))

        top = ttk.PanedWindow(outer, orient="horizontal")
        outer.add(top, weight=5)

        # far left: file explorer (XML files under the schema's folder = design/)
        self.explorer = FileExplorer(top, self.schema.path.parent,
                                     self._explorer_open)
        top.add(self.explorer, weight=1)

        # left: palette (schema profile is permanent, context list updates)
        self.palette = BlockPalette(top, self.on_palette_activate)
        self.palette.set_profile(self.schema.profile())
        top.add(self.palette, weight=1)

        # centre: breadcrumb + views (+ start screen while no document)
        center = ttk.Frame(top)
        top.add(center, weight=4)
        self.breadcrumb = Breadcrumb(center, self.select)
        self.breadcrumb.pack(fill="x", padx=10, pady=(8, 6))
        self.notebook = ttk.Notebook(center)
        self.notebook.pack(fill="both", expand=True, padx=10, pady=(0, 8))
        self.tree = DocumentTree(self.notebook, self.select, self.popup_menu)
        self.notebook.add(self.tree, text="Blocks")
        self.diagram = BlockDiagram(self.notebook, self.select, self.popup_menu)
        self.notebook.add(self.diagram, text="Diagram")
        self.source = SourceView(self.notebook)
        self.notebook.add(self.source, text="Source")
        self.notebook.bind("<<NotebookTabChanged>>", self._on_tab_changed)
        self.empty = EmptyState(center, list(self.schema.root_names),
                                self._new_from_root, self.open_file)

        # right: inspector
        self.properties = PropertyPanel(top, self.on_property_change)
        top.add(self.properties, weight=2)

        # bottom: problems
        issues_frame = ttk.Frame(outer)
        outer.add(issues_frame, weight=1)
        head = ttk.Frame(issues_frame)
        head.pack(fill="x", padx=10, pady=(6, 4))
        ttk.Label(head, text="Problems", style="Section.TLabel").pack(side="left")
        self.problem_summary = ttk.Label(head, text="", style="Hint.TLabel")
        self.problem_summary.pack(side="left", padx=10)
        self.show_warnings = tk.BooleanVar(value=True)
        ttk.Checkbutton(head, text="Show warnings", variable=self.show_warnings,
                        command=lambda: self._fill_issues(self.issues)).pack(side="right")
        fix_button = ttk.Button(head, text="Auto-fix all", style="Accent.TButton",
                                command=self.auto_fix)
        fix_button.pack(side="right", padx=(0, 8))
        Tip(fix_button, "Add every missing required block/attribute and correct "
                        "invalid values in one click (F2)")
        Tip(head, "Structural checks run live; press F5 for the full XSD validation")

        body = ttk.Frame(issues_frame)
        body.pack(fill="both", expand=True)
        self.issues_tree = ttk.Treeview(body, columns=("severity", "block", "message"),
                                        show="headings", height=6, selectmode="browse")
        for column, width, title in (("severity", 90, "Severity"), ("block", 260, "Block"),
                                     ("message", 800, "Diagnostic")):
            self.issues_tree.heading(column, text=title)
            self.issues_tree.column(column, width=width, stretch=(column == "message"))
        issues_y = ttk.Scrollbar(body, orient="vertical", command=self.issues_tree.yview)
        self.issues_tree.configure(yscrollcommand=issues_y.set)
        self.issues_tree.pack(side="left", fill="both", expand=True)
        issues_y.pack(side="right", fill="y")
        self.issues_tree.tag_configure("error", foreground=ISSUE_TEXT["error"])
        self.issues_tree.tag_configure("warning", foreground=ISSUE_TEXT["warning"])
        self.issues_tree.bind("<<TreeviewSelect>>", self._on_issue_activate)

    def _build_status(self) -> None:
        holder = ttk.Frame(self.root)
        holder.pack(side="bottom", fill="x")
        ttk.Separator(holder, orient="horizontal").pack(fill="x")
        bar = ttk.Frame(holder, padding=(12, 5))
        bar.pack(fill="x")
        self.status = tk.StringVar(value="Ready — F5: validate · F2: auto-fix")
        self.counts = tk.StringVar(value="")
        ttk.Label(bar, textvariable=self.status, anchor="w").pack(side="left", fill="x",
                                                                   expand=True)
        ttk.Label(bar, textvariable=self.counts, style="Hint.TLabel").pack(side="right")

    def _guard(self, func, views_only: bool = False):
        """Keyboard shortcut that never fires while the user is typing.

        ``views_only`` restricts it to the block tree / diagram, so Delete in
        a text field or in the palette can no longer remove a block.
        """
        editing = (tk.Entry, tk.Text, tk.Spinbox)

        def handler(event):
            widget = event.widget
            if isinstance(widget, editing):
                return None
            if views_only and widget not in (self.tree.tree, self.diagram.canvas):
                return None
            func()
            return "break"
        return handler

    def _bind_keys(self) -> None:
        r = self.root
        r.bind("<Control-n>", lambda _e: self.choose_root())
        r.bind("<Control-o>", lambda _e: self.open_file())
        r.bind("<Control-s>", lambda _e: self.save())
        r.bind("<Control-f>", lambda _e: self.palette.focus_search())
        r.bind("<F5>", lambda _e: self.validate_all())
        r.bind("<F2>", self._guard(self.auto_fix))
        for number, view in enumerate((self.tree, self.diagram, self.source), 1):
            r.bind(f"<Control-Key-{number}>", lambda _e, v=view: self.notebook.select(v))
        r.bind("<Control-z>", self._guard(self.undo))
        r.bind("<Control-y>", self._guard(self.redo))
        r.bind("<Control-Shift-Z>", self._guard(self.redo))
        r.bind("<Control-d>", self._guard(self.duplicate_block))
        r.bind("<Insert>", self._guard(self.add_block))
        r.bind("<Alt-Up>", self._guard(lambda: self.move_block(-1)))
        r.bind("<Alt-Down>", self._guard(lambda: self.move_block(1)))
        r.bind("<Delete>", self._guard(self.remove_block, views_only=True))

    # -- document lifecycle ----------------------------------------------

    def choose_root(self) -> None:
        """Pick a root element (declared in the schema) and create a document."""
        if not self._confirm_discard():
            return
        if not self.schema.root_names:
            messagebox.showinfo(APP_TITLE, "The schema declares no root element.")
            return
        dialog = tk.Toplevel(self.root)
        dialog.title("New document")
        dialog.transient(self.root)
        dialog.resizable(False, False)
        body = ttk.Frame(dialog, padding=12)
        body.pack(fill="both", expand=True)
        ttk.Label(body, text="Root element (declared in schema.xsd):").pack(anchor="w")
        choice = tk.StringVar(value=self.schema.root_names[0])
        combo = ttk.Combobox(body, textvariable=choice, values=self.schema.root_names,
                             state="readonly", width=48)
        combo.pack(fill="x", pady=(4, 0))
        info = tk.Text(body, height=9, width=68, wrap="word", relief="flat",
                       background="#ffffff", padx=8, pady=6)
        info.pack(pady=8)
        info.configure(state="disabled")

        def show_description(*_args) -> None:
            block = self.schema.root(choice.get())
            info.configure(state="normal")
            info.delete("1.0", "end")
            info.insert("1.0", describe(block) if block is not None else "")
            info.configure(state="disabled")

        combo.bind("<<ComboboxSelected>>", show_description)
        show_description()

        def confirm(_event=None) -> None:
            dialog.destroy()
            self.new_document(choice.get())

        row = ttk.Frame(body)
        row.pack(anchor="e")
        ttk.Button(row, text="Cancel", command=dialog.destroy).pack(side="left", padx=4)
        ttk.Button(row, text="Create", style="Accent.TButton", command=confirm).pack(
            side="left", padx=4)
        dialog.bind("<Return>", confirm)
        dialog.bind("<Escape>", lambda _e: dialog.destroy())
        combo.focus_set()
        dialog.wait_visibility()
        dialog.grab_set()

    def _new_from_root(self, root_name: str) -> None:
        if self._confirm_discard():
            self.new_document(root_name)

    def new_document(self, root_name: str) -> None:
        try:
            self.doc = DocumentModel.new(self.schema, root_name)
        except Exception as exc:  # noqa: BLE001 - reported to the user
            messagebox.showerror(APP_TITLE, f"cannot create <{root_name}>:\n{exc}")
            return
        self.selected = None
        self.refresh(full=False)
        self.select(self.doc.root, force=True)
        self.explorer.mark_current(None)
        self.status.set(f"New <{root_name}> document — the “Required” group lists what to fill in")

    def _explorer_open(self, path: Path) -> None:
        """Open *path* picked in the file explorer (usual dirty check)."""
        if (self.doc is not None and self.doc.path is not None
                and self.doc.path.resolve() == path.resolve()):
            self.status.set("That file is already open")
            return
        if not self._confirm_discard():
            return
        self.open_path(path)

    def open_file(self) -> None:
        if not self._confirm_discard():
            return
        initial = str(self.doc.path.parent) if self.doc is not None and self.doc.path else str(
            Path.cwd())
        path = filedialog.askopenfilename(
            title="Open XML", initialdir=initial,
            filetypes=[("XML files", "*.xml"), ("All files", "*.*")])
        if path:
            self.open_path(Path(path))

    def open_path(self, path: Path) -> None:
        try:
            self.doc = DocumentModel.load(self.schema, path)
        except Exception as exc:  # noqa: BLE001 - reported to the user
            messagebox.showerror(APP_TITLE, f"cannot open {path}:\n{exc}")
            return
        self.selected = None
        self.refresh(full=False)
        self.select(self.doc.root, force=True)
        self.status.set(f"Opened {path}")
        self.explorer.mark_current(Path(path))

    def save(self) -> None:
        if self.doc is None:
            return
        if self.doc.path is None:
            self.save_as()
            return
        try:
            self.doc.save()
        except Exception as exc:  # noqa: BLE001
            messagebox.showerror(APP_TITLE, f"cannot save:\n{exc}")
            return
        self.refresh(full=False)
        self.status.set(f"Saved {self.doc.path}")
        self.explorer.mark_current(self.doc.path)

    def save_as(self) -> None:
        if self.doc is None:
            return
        path = filedialog.asksaveasfilename(
            title="Save XML as", defaultextension=".xml",
            initialfile=self.doc.path.name if self.doc.path else "document.xml",
            filetypes=[("XML files", "*.xml"), ("All files", "*.*")])
        if path:
            self.doc.path = Path(path)
            self.save()

    def _confirm_discard(self) -> bool:
        if self.doc is None or not self.doc.dirty:
            return True
        answer = messagebox.askyesnocancel(
            APP_TITLE, "The current document has unsaved changes. Save them?")
        if answer is None:
            return False
        if answer:
            self.save()
            return not self.doc.dirty     # save-as cancelled -> stay
        return True

    def quit(self) -> None:
        if self._confirm_discard():
            self.root.destroy()

    # -- selection -------------------------------------------------------

    def _on_tab_changed(self, _event=None) -> None:
        """Paint deferred widgets when their tab becomes visible.

        The diagram and source tabs only paint on demand: this is what keeps
        large documents fast — editing in the Tree tab never pays for the
        diagram layout or the source highlighting.
        """
        try:
            current = self.notebook.nametowidget(self.notebook.select())
        except tk.TclError:
            return
        if current is self.diagram:
            if self.diagram.redraw_if_visible():
                self.root.after_idle(lambda: self.diagram.select_element(self.selected, reveal=False))
        elif current is self.source:
            self.source.refresh_if_visible()

    def select(self, element, force: bool = False) -> None:
        """Select *element* everywhere (tree, diagram, breadcrumb, inspector)."""
        if element is None or (element is self.selected and not force):
            return
        self.selected = element
        self._sync_selection()

    def _sync_selection(self) -> None:
        self.tree.select_element(self.selected)
        self.diagram.select_element(self.selected)
        self._update_breadcrumb()
        self.show_contextual()
        self._load_properties()
        self._update_actions()

    @staticmethod
    def _chain(element) -> list:
        chain = []
        node = element
        while node is not None:
            chain.append(node)
            node = node.getparent()
        chain.reverse()
        return chain

    def _update_breadcrumb(self) -> None:
        self.breadcrumb.show(self._chain(self.selected) if self.selected is not None else [])

    def show_contextual(self) -> None:
        """Bottom palette list = what the schema allows under the selection.

        The top list (schema profile) is never replaced by this.
        """
        if self.doc is None:
            self.palette.set_context("", contextual_entries(self.schema, None, []))
            return
        target = self.selected if self.selected is not None else self.doc.root
        block = self.doc.block_of(target)
        entries = contextual_entries(self.schema, block, self.doc.child_names(target))
        self.palette.set_context(localname(str(target.tag)), entries)

    # -- inserting blocks ------------------------------------------------

    def on_palette_activate(self, entry) -> None:
        """Double-click / button in the palette."""
        if entry.category == "Roots":
            self._new_from_root(entry.block.name)
            return
        if self.doc is None:
            self.status.set("Create or open a document first")
            return
        self.insert_entry(entry)

    def _find_host(self, start, name: str, free_key: bool):
        """Nearest element (start, then its ancestors) that may receive *name*."""
        node = start
        while node is not None:
            block = self.doc.block_of(node)
            if block is not None:
                particle = block.child(name)
                if particle is not None:
                    if can_add(particle, self.doc.child_names(node).count(name)):
                        return node
                elif free_key and block.allows_any and node is start:
                    return node
            node = node.getparent()
        return None

    def insert_entry(self, entry, target=None) -> None:
        """Insert a palette block, climbing to the nearest ancestor that accepts it."""
        name = entry.block.name
        free_key = name == "*"
        if free_key:
            name = (simpledialog.askstring(
                APP_TITLE, "Element name (this content model is open: xs:any):",
                parent=self.root) or "").strip()
            if not name:
                return
        start = target if target is not None else (
            self.selected if self.selected is not None else self.doc.root)
        host = self._find_host(start, name, free_key)
        element = self.doc.add_child(host, name) if host is not None else None
        if element is None:
            messagebox.showinfo(
                APP_TITLE,
                f"<{name}> cannot be inserted here: the schema does not allow it under "
                f"<{localname(str(start.tag))}> (or its parents), or the maximum number "
                "of occurrences is reached.")
            return
        self.selected = element
        self.refresh()
        self._sync_selection()
        self.status.set(f"Added <{name}> in <{localname(str(host.tag))}>")

    def on_property_change(self, element, kind: str, name: str, value: str) -> None:
        """Commit an inspector edit through the document model."""
        if self.doc is None:
            return
        if kind == "attribute":
            changed = self.doc.set_attribute(element, name, value)
        else:
            changed = self.doc.set_text(element, value)
        if changed:
            self.selected = element
            self._keep_panel = True       # keep the fields (and Tab focus) alive
            try:
                self.refresh()
            finally:
                self._keep_panel = False

    # -- context menu ----------------------------------------------------

    def popup_menu(self, element, event) -> None:
        """Right-click menu shared by the tree and the diagram."""
        if self.doc is None:
            return
        self.select(element)
        menu = tk.Menu(self.root, tearoff=False)
        block = self.doc.block_of(element)
        entries = contextual_entries(self.schema, block, self.doc.child_names(element))
        if entries:
            add = tk.Menu(menu, tearoff=False)
            previous = None
            for entry in entries:
                if previous is not None and entry.category != previous:
                    add.add_separator()
                previous = entry.category
                label = ("★ " if entry.category == "Required" else "") + entry.label
                add.add_command(label=label,
                                command=lambda e=entry, t=element: self.insert_entry(e, t))
            menu.add_cascade(label="Add block inside", menu=add)
        else:
            menu.add_command(label="Add block inside", state="disabled")
        menu.add_separator()
        is_root = element.getparent() is None
        menu.add_command(label="Duplicate", accelerator="Ctrl+D", command=self.duplicate_block,
                         state="disabled" if is_root else "normal")
        menu.add_command(label="Move up", accelerator="Alt+Up",
                         command=lambda: self.move_block(-1))
        menu.add_command(label="Move down", accelerator="Alt+Down",
                         command=lambda: self.move_block(1))
        menu.add_separator()
        menu.add_command(label="Remove", accelerator="Del", command=self.remove_block,
                         state="normal" if self._can_remove(element)[0] else "disabled")
        try:
            menu.tk_popup(event.x_root, event.y_root)
        finally:
            menu.grab_release()

    # -- commands --------------------------------------------------------

    def add_block(self) -> None:
        if self.doc is None:
            return
        entry = self.palette.selected_entry()
        if entry is None:
            self.status.set("Pick a block in the palette first (double-click adds it)")
            return
        self.on_palette_activate(entry)

    def _can_remove(self, element) -> tuple[bool, str]:
        if self.doc is None or element is None:
            return False, ""
        if element.getparent() is None:
            return False, "the document root cannot be removed"
        return self.doc.can_remove(element)

    def remove_block(self) -> None:
        if self.doc is None or self.selected is None:
            return
        allowed, reason = self._can_remove(self.selected)
        if not allowed:
            messagebox.showinfo(APP_TITLE, reason)
            return
        parent = self.selected.getparent()
        name = localname(str(self.selected.tag))
        if self.doc.remove(self.selected):
            self.selected = parent
            self.refresh()
            self._sync_selection()
            self.status.set(f"Removed <{name}>")

    def duplicate_block(self) -> None:
        if self.doc is None or self.selected is None:
            return
        clone = self.doc.duplicate(self.selected)
        if clone is None:
            messagebox.showinfo(APP_TITLE, "The schema allows only one occurrence here "
                                           "(the root cannot be duplicated).")
            return
        self.selected = clone
        self.refresh()
        self._sync_selection()
        self.status.set(f"Duplicated <{localname(str(clone.tag))}>")

    def move_block(self, delta: int) -> None:
        if self.doc is None or self.selected is None:
            return
        if self.doc.move(self.selected, delta):
            self.refresh()

    def undo(self) -> None:
        if self.doc is not None and self.doc.undo():
            self.refresh()
            self.status.set("Undo")

    def redo(self) -> None:
        if self.doc is not None and self.doc.redo():
            self.refresh()
            self.status.set("Redo")

    def auto_fix(self) -> None:
        """One click: repair every issue the block model can fix by itself."""
        if self.doc is None:
            self.status.set("Create or open a document first — "
                            "then Auto-fix repairs it in one click")
            return
        stats = self.doc.auto_fix()
        self.refresh(full=True)
        parts = []
        if stats["blocks"]:
            parts.append(f"+{stats['blocks']} required block(s)")
        if stats["attributes"]:
            parts.append(f"+{stats['attributes']} required attribute(s)")
        if stats["values"]:
            parts.append(f"{stats['values']} value(s) corrected")
        if stats["removed"]:
            parts.append(f"-{stats['removed']} extra occurrence(s)")
        message = "Auto-fix: " + (
            " · ".join(parts) if parts else "nothing to fix — already clean")
        if stats["unfixed"]:
            message += (f" · {stats['unfixed']} item(s) need manual attention "
                        "(see Problems)")
        self.status.set(message)

    def validate_all(self) -> None:
        """Run the authoritative XSD pass (same validator as the pipeline)."""
        if self.doc is None:
            return
        self.issues = self.doc.validate(self.schema.path)
        self.refresh(full=True, keep_issues=True)
        errors = [i for i in self.issues if i.severity == "error"]
        self.status.set(f"XSD validation: {len(errors)} error(s), "
                        f"{len(self.issues) - len(errors)} warning(s)")

    def show_schema_summary(self) -> None:
        profile = self.schema.profile()
        lines = [f"Schema: {self.schema.path}",
                 f"target namespace: {self.schema.target_namespace or '(none)'}",
                 "roots: {}".format(", ".join(self.schema.root_names)),
                 f"blocks: {len(self.schema.blocks)}", "",
                 "Profile:"]
        lines.extend(f"  {name:<30} {len(blocks)}" for name, blocks in profile.items())
        messagebox.showinfo(APP_TITLE, "\n".join(lines))

    def show_about(self) -> None:
        messagebox.showinfo(
            APP_TITLE,
            "Visual XML block editor for Flipova Foundation.\n\n"
            "The XSD (design/schema.xsd) is the single source of truth: roots, "
            "blocks, cardinalities, attributes, enumerations and documentation "
            "are all read from it at runtime, so any schema-valid XML is editable "
            "with no code change.\n\n"
            "Blocks nest like the schema content model; validation reuses "
            "design/tools/sources/linter.py, the same validator as the CLI pipeline.")

    # -- view refresh ----------------------------------------------------

    def refresh(self, full: bool = False, keep_issues: bool = False) -> None:
        """Recompute diagnostics and repaint every view from the live buffer."""
        path = self._selection_path()
        if self.doc is None:
            self.issues = []
        elif not keep_issues:
            self.issues = (self.doc.validate(self.schema.path) if full
                           else self.doc.structural_issues())
        self._refresh_views(path)

    def _selection_path(self):
        """Positional path of the selection: None = nothing, () = the root."""
        node = self.selected
        if self.doc is None or node is None:
            return None
        parts = []
        while node is not None and node.getparent() is not None:
            siblings = [c for c in node.getparent() if isinstance(c.tag, str)]
            if node not in siblings:
                return None
            parts.append(siblings.index(node))
            node = node.getparent()
        return tuple(reversed(parts))

    def _resolve_path(self, path):
        if self.doc is None or path is None:
            return None
        node = self.doc.root
        for index in path:
            children = [c for c in node if isinstance(c.tag, str)]
            if index >= len(children):
                return None
            node = children[index]
        return node

    def _refresh_views(self, path) -> None:
        doc = self.doc
        self.tree.refresh(doc, self.issues)
        self.diagram.render(doc, self.issues)
        self.source.show(doc.to_string() if doc is not None else "")
        self._fill_issues(self.issues)
        self.selected = self._resolve_path(path)
        if self.selected is not None:
            self.tree.select_element(self.selected)
        self.diagram.select_element(self.selected, reveal=False)
        self._update_breadcrumb()
        self.show_contextual()
        if self._keep_panel:
            self.properties.set_issues(self._relevant_issues())
        else:
            self._load_properties()
        self._update_status()
        self._update_actions()
        self._update_empty_state()

    def _on_tab_changed(self, _event=None) -> None:
        """Paint whatever the newly visible tab deferred while it was hidden."""
        try:
            widget = self.root.nametowidget(str(self.notebook.select()))
        except (tk.TclError, KeyError):
            return
        if widget is self.diagram:
            if self.diagram.redraw_if_visible() and self.selected is not None:
                self.diagram.select_element(self.selected)
        elif widget is self.source:
            self.source.refresh_if_visible()

    def _relevant_issues(self) -> list[Issue]:
        if self.selected is None:
            return []
        return [issue for issue in self.issues if issue.element is self.selected]

    def _load_properties(self) -> None:
        self.properties.load(self.doc, self.selected, self._relevant_issues())

    def _path_label(self, element) -> str:
        names = [localname(str(node.tag)) for node in self._chain(element)]
        return " › ".join(names if len(names) <= 3 else ["…"] + names[-3:])

    def _on_tab_changed(self, _event=None) -> None:
        """Paint whatever the newly visible tab has been waiting for.

        Heavy first-fits run while the user is looking at a fast view, not
        while the window is still opening — the tab event is the earliest
        moment we know the widget has a real size.
        """
        try:
            selected = self.notebook.nametowidget(self.notebook.select())
        except tk.TclError:
            return
        if selected is self.diagram:
            self.diagram.redraw_if_visible()
        elif selected is self.source:
            self.source.refresh_if_visible()

    def _fill_issues(self, issues: list[Issue]) -> None:
        self.issues_tree.delete(*self.issues_tree.get_children())
        self._issue_map.clear()
        errors = sum(1 for i in issues if i.severity == "error")
        warnings = len(issues) - errors
        if self.doc is None:
            self.problem_summary.configure(text="")
        elif not issues:
            self.problem_summary.configure(text="✔ No problem detected", foreground="#248a3d")
        else:
            self.problem_summary.configure(
                text=f"{errors} error(s) · {warnings} warning(s) — click a row to jump to the block",
                foreground=ISSUE_TEXT["error"] if errors else ISSUE_TEXT["warning"])
        for index, issue in enumerate(issues):
            if issue.severity != "error" and not self.show_warnings.get():
                continue
            iid = f"i{index}"
            if issue.element is not None:
                where = self._path_label(issue.element)
            elif issue.line is not None:
                where = f"line {issue.line}"
            else:
                where = ""
            self.issues_tree.insert(
                "", "end", iid=iid,
                values=(f"{ISSUE_MARKS.get(issue.severity, '•')} {issue.severity}",
                        where, issue.message),
                tags=(issue.severity,))
            self._issue_map[iid] = issue

    def _on_issue_activate(self, _event=None) -> None:
        selection = self.issues_tree.selection()
        if not selection:
            return
        issue = self._issue_map.get(selection[0])
        if issue is not None and issue.element is not None:
            self.select(issue.element, force=True)

    def _update_status(self) -> None:
        if self.doc is None:
            self.root.title(APP_TITLE)
            self.counts.set("")
            return
        location = str(self.doc.path) if self.doc.path else "(unsaved)"
        self.root.title("{} — {}{}".format(APP_TITLE, location, " *" if self.doc.dirty else ""))
        blocks = len(self.doc.elements_by_line())
        errors = sum(1 for issue in self.issues if issue.severity == "error")
        self.counts.set(f"{blocks} block(s) · {errors} error(s) · "
                        f"{len(self.issues) - errors} warning(s)")

    def _update_actions(self) -> None:
        """Enable only the toolbar buttons that make sense right now."""
        doc, sel = self.doc, self.selected

        def state(key: str, enabled: bool) -> None:
            button = self._actions.get(key)
            if button is not None:
                button.configure(state="normal" if enabled else "disabled")

        has_sel = doc is not None and sel is not None
        parent = sel.getparent() if has_sel else None
        index = count = 0
        if parent is not None:
            siblings = [c for c in parent if isinstance(c.tag, str)]
            if sel in siblings:
                index, count = siblings.index(sel), len(siblings)
        state("save", doc is not None)
        state("undo", doc is not None and doc.can_undo)
        state("redo", doc is not None and doc.can_redo)
        state("add", doc is not None)
        state("dup", has_sel and parent is not None)
        state("remove", has_sel and self._can_remove(sel)[0])
        state("up", has_sel and parent is not None and index > 0)
        state("down", has_sel and parent is not None and index < count - 1)
        state("fix", doc is not None)
        state("validate", doc is not None)

    def _on_tab_changed(self, _event=None) -> None:
        """Paint whatever the newly selected centre tab deferred while hidden."""
        try:
            selected = self.notebook.select()
        except tk.TclError:
            return
        if self.notebook.index(selected) == 1:      # Diagram tab
            self.diagram.redraw_if_visible()
        elif self.notebook.index(selected) == 2:    # Source tab
            self.source.refresh_if_visible()

    def _update_empty_state(self) -> None:
        if self.doc is None:
            self.empty.place(in_=self.notebook, x=0, y=0, relwidth=1, relheight=1)
            self.empty.lift()
        else:
            self.empty.place_forget()

    # -- entry point -----------------------------------------------------

    def run(self) -> int:
        self.root.mainloop()
        return 0


def launch(schema: SchemaModel, path: Path | None = None) -> int:
    """Create the application and enter its main loop."""
    return XmlEditorApp(schema, path).run()