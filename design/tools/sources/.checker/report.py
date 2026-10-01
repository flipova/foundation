from __future__ import annotations

from dataclasses import dataclass, field

from .model import Diagnostic, Rule


@dataclass
class Report:
    diagnostics: list[Diagnostic] = field(default_factory=list)

    def add(self, rule: Rule, file_: str, line: int | None, message: str) -> None:
        self.diagnostics.append(Diagnostic(rule.id, rule.severity, file_, line, message))

    @property
    def errors(self) -> list[Diagnostic]:
        return [d for d in self.diagnostics if d.severity == "error"]

    @property
    def warnings(self) -> list[Diagnostic]:
        return [d for d in self.diagnostics if d.severity == "warning"]
