# Cartoon Video Skill

> Turn a voiceover into an original, polished vertical cartoon short—with a story, a 3D world, expressive 2D characters, sound, and an MP4 render.

**Cartoon Video** is an Agent Skill for **Claude Code** and **OpenCode**. It guides an AI coding agent through the creative and technical workflow for making short-form animated videos: idea development, narration, voiceover timing, shot planning, Three.js scene construction, sound design, frame rendering, and final video checks.

**Repository description:** An Agent Skill for Claude Code and OpenCode that helps create original 9:16 animated cartoon shorts from a voiceover, including story planning, 3D scenes, sound, rendering, and MP4 export.

## What it does

- Develops short, curiosity-driven story ideas and narration scripts.
- Uses an uploaded voiceover as the timing source for a vertical animation.
- Builds a colorful Three.js world with expressive illustrated character cards, painted materials, outlines, lighting, and camera movement.
- Plans music and sound effects to support the narration.
- Renders frames, creates review contact sheets, encodes an MP4, and performs basic visual/audio checks.

The included example is **“The Soldier Who Never Left”** in `example/soldier/`.

## Install the skill

Install the repository as a directory named `cartoon-video` in the relevant skills folder. Keep `SKILL.md`, `engine/`, `tools/`, and `example/` together—the skill references these files relative to its own directory.

### Claude Code — user-level skill

```bash
mkdir -p ~/.claude/skills
 git clone https://github.com/saghir102ahmad-svg/cartoon-video-skill.git ~/.claude/skills/cartoon-video
```

To install it only for the current project, clone into:

```text
<project>/.claude/skills/cartoon-video/
```

### OpenCode — user-level skill

```bash
mkdir -p ~/.config/opencode/skills
 git clone https://github.com/saghir102ahmad-svg/cartoon-video-skill.git ~/.config/opencode/skills/cartoon-video
```

For a project-only install, use:

```text
<project>/.opencode/skills/cartoon-video/
```

Restart or reload the agent after installing if the skill is not detected. See the [Claude Code skills documentation](https://code.claude.com/docs/en/skills) and [OpenCode skills documentation](https://opencode.ai/docs/skills/) for current discovery behavior.

## Use the skill

Ask the agent to use the skill and describe your goal, for example:

> Use the cartoon-video skill. I want a 30-second vertical cartoon short about an unusual historical event. Give me ideas first.

Or, if you already have narration:

> Use the cartoon-video skill to make a vertical animated short from the attached voiceover. The final script is attached too.

The skill starts by clarifying whether you have a voiceover, a script, or need an idea. It then guides the work through the stages in [`SKILL.md`](SKILL.md). A voiceover is required for the audio-driven rendering workflow; if the recording differs from the approved script, provide the final spoken text so timing can be checked.

## Render-tool setup

The agent skill describes the workflow; the included scripts provide the starter project and rendering utilities. To create a separate working project, run the canonical setup script from this repository:

```bash
bash tools/setup.sh ~/shorts/my-short
cd ~/shorts/my-short
```

The setup script copies the engine, tools, and worked-example starter files into the new project and retrieves required third-party code/dependencies. Generated project files and final renders belong in that working project, not in the skill installation directory.

### Requirements

- Node.js **22.6 or newer** (the setup process uses Node's built-in TypeScript type stripping).
- Python 3 and NumPy; Pillow is needed for contact sheets.
- FFmpeg and FFprobe.
- Git and network access to retrieve the renderer dependencies.
- Playwright with a Chromium browser for frame rendering.

Dependency availability can vary by operating system. Review `tools/setup.sh` before running it, and install only dependencies you trust. The renderer can use Chromium's software WebGL fallback when a compatible GPU is unavailable; this can be considerably slower.

### Typical project workflow

1. Put the voiceover and its final narration text in the project directory.
2. Generate word/phrase timing data:

   ```bash
   python3 timing.py voice.mp3 script.txt --out work
   ```

3. Plan shots against the timing data and adapt `web/story.js` and the example world/cast to the new story.
4. Render representative frames and review a contact sheet before rendering the full sequence. For example:

   ```bash
   node render.mjs stills/review "0,60,120"
   python3 sheet.py stills/review stills/contact-sheet.jpg
   ```

5. Create the story's audio mix, render all frames, then encode and run the final checks:

   ```bash
   node render.mjs frames "0-<last-frame>"
   bash finish.sh "My Short"
   ```

The exact project files and commands can vary with the story; follow the installed skill instructions and inspect the generated project before rendering. Rendering at 1080×1920 and 30 fps is resource-intensive. Always review the stills and the finished video rather than assuming a successful process means the output looks correct.

## Repository layout

```text
.
├── SKILL.md                 # Agent instructions and creative/rendering workflow
├── README.md                # Project overview, installation, and quick start
├── engine/                  # Three.js renderer, world, materials, motion, and character helpers
├── tools/                   # Project setup, timing, rendering, contact sheets, and MP4 finishing
└── example/soldier/         # Worked story and audio example, plus example stills
```

`tools/` contains the canonical setup and project utilities. The root-level helper files are retained for compatibility with the current example/tooling; use `tools/setup.sh` when creating a project from the repository.

## Creative and safety guidelines

- Create original stories, characters, and shots. Do not recreate another creator's video shot-for-shot.
- Do not use real, named living people as characters, or use brand mascots/logos.
- Do not add captions unless requested. Keep any diegetic text correctly oriented and readable.
- Preserve the voiceover; time visuals to the narration rather than editing the narration to fit the animation.
- Keep narration clear and sound effects controlled beneath it.
- Verify factual claims when research tools are available, and distinguish documented facts from legends or disputed accounts.

## Attribution

The existing skill and repository materials credit [mromidev/claude-animated-shorts](https://github.com/mromidev/claude-animated-shorts) as an inspiration/source for parts of the character-drawing approach. `tools/setup.sh` may fetch third-party code at setup time. Review upstream licenses and notices for dependencies before redistributing a bundled or modified copy.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for guidelines on improving the skill, examples, and tools.
