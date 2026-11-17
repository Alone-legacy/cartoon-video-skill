# Contributing

Thanks for helping improve Cartoon Video Skill. Contributions to the skill instructions, starter examples, renderer, and project utilities are welcome.

## Before opening a change

- Keep the skill compatible with both Claude Code and OpenCode by preserving a standard `SKILL.md` with valid YAML frontmatter (`name` and `description`).
- Keep paths in the instructions consistent with the repository. The skill root contains `engine/`, `tools/`, and `example/`; `tools/setup.sh` is the canonical project setup entry point.
- Keep new example stories original and avoid copyrighted characters, logos, music, or other assets unless they are appropriately licensed.
- Avoid committing generated frames, rendered videos, local audio recordings, credentials, or machine-specific paths.
- When changing rendering or setup behavior, update the README and test the affected commands in a clean working directory where possible.
- Respect third-party licenses and document newly introduced dependencies.

## Suggested checks

```bash
bash -n setup.sh tools/setup.sh tools/finish.sh
python3 -m py_compile tools/timing.py tools/sheet.py
```

If Python checks create `__pycache__` files, do not include them in the change. For renderer changes, run a small still-frame render and inspect the result before submitting.
