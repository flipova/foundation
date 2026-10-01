from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class ValidationError:
    file: str
    line: int | None
    column: int | None
    message: str
    severity: str = "error"

    def __str__(self) -> str:
        loc = f"{self.file}"
        if self.line is not None:
            loc += f":{self.line}"
            if self.column is not None:
                loc += f":{self.column}"
        return f"[{self.severity.upper()}] {loc}: {self.message}"


@dataclass
class LintResult:
    errors: list = field(default_factory=list)
    files_checked: int = 0
    files_valid: int = 0
    files_invalid: int = 0

    @property
    def success(self) -> bool:
        return self.files_invalid == 0

    def merge(self, other: LintResult) -> None:
        self.errors.extend(other.errors)
        self.files_checked += other.files_checked
        self.files_valid += other.files_valid
        self.files_invalid += other.files_invalid

    def summary(self) -> str:
        return (
            f"Files checked: {self.files_checked}\n"
            f"Valid: {self.files_valid}\n"
            f"Invalid: {self.files_invalid}"
        )
