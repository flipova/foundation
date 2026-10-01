# Commands

All commands go through `design/tools/design.js` (or the `.cmd`/`.sh`
wrappers) and are exposed as npm scripts:

| npm script | Target | Runs |
|---|---|---|
| `npm run design:gen` | `gen` | `generate.py` - compile tokens/themes into `config.ts` + `tokens.js` |
| `npm run design:gen:check` | `gen --check` | verify regeneration is a no-op (drift check) |
| `npm run design:check` | `check` | determinism rules + XSD pass + ruff |
| `npm run design:verify` | `verify` | verify the committed canonical index |
| `npm run design:canonical` | `canonical` | re-emit `design/canonical.index.txt` |
| `npm run design:lint` | `lint` | XSD-validate every design XML |
| `npm run design:doc` | `doc` | regenerate `docs/generated` |
| `npm run design:edit` | `edit` | open the XML editor (GUI) |
| `npm run design:pipeline` | `pipeline` | `gen` + `check` + `verify` + `lint` + `doc` |

`generate.py` also supports `--check` directly, and `checker.py` supports
`--list-rules`, `--emit-canonical`, `--verify-canonical` and
`--sync-version`.
