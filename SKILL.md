---
name: cartoon-video
description: Create original vertical animated cartoon shorts from an idea, script, or uploaded voiceover. Use when a user wants a short-form cartoon video planned, scripted, timed to narration, animated with a Three.js world and illustrated characters, sound-designed, rendered, or exported as an MP4. Also use when adapting the included soldier example or troubleshooting this workflow.
---

# Cartoon Video Skill

Help the user make an original, narration-led vertical cartoon short. The repository root is the skill directory: `engine/`, `tools/`, and `example/` are located directly inside it (there is no `kit/` subdirectory). Keep the user informed about the plan, review stills before a long render, and report any unavailable tools or incomplete stages honestly.

## Creative direction

The signature look is expressive, flat illustrated character cards in a colorful, dimensional 3D world: painted textures, inked outlines, atmospheric lighting, depth of field, and smooth camera movement. Default to a vertical 9:16 composition, 1080×1920, at 30 fps. Use visual storytelling, readable silhouettes, deliberate staging, and reactions that land with the narration.

- Stories, characters, and shot designs must be original; do not reproduce another creator's video shot-for-shot.
- Do not make real, named living people characters or include brand mascots/logos.
- Do not add captions unless requested. Any in-world text must be correctly oriented and readable.
- Avoid graphic content and do not make real living people the target of ridicule.
- Verify factual claims when browsing/research tools are available. Label legends and disputed stories clearly; never present a viral anecdote as confirmed fact.
- Preserve the user's voice recording. Time the visuals to it; do not edit or retime the narration to fit the animation.
- Keep narration intelligible. Music and effects should support, not overpower, the voice.

## Stage 1 — Find the starting point

First check the user's message and attachments. If a voiceover is present, use it and ask for the final script only if needed to resolve timing. Otherwise ask whether the user has a voiceover, has a script and needs to record it, or wants ideas and a script. Ask for target duration if unknown; default to 20–30 seconds, with 45–60 seconds available when requested.

Do not ask for information already provided. Keep the next step clear and give the user a concise progress checklist for multi-step work.

## Stage 2 — Ideas (when requested)

Give exactly 10 numbered ideas, then ask the user to choose one or request more. Each idea includes:

- A curiosity-driven title (about 5–8 words).
- A strong opening hook stated plainly.
- The twist/payoff in one line.
- Why the story will animate well (2–3 visual moments).
- Whether it is documented history, disputed, or folklore.

Favor a clear character, concrete stakes, visible cause and effect, escalation, and an ironic or surprising payoff. Vary eras and themes. Research the key facts for anything described as true when research tools are available.

## Stage 3 — Write the narration

Write narration only—no stage directions in the spoken copy. Aim for roughly 3.7 spoken words per second (about 75 words for 20 seconds, 110 for 30 seconds, or 220 for 60 seconds). Structure it as:

1. Hook: open with the surprising claim, without a long setup.
2. Setting: establish when, where, and who with a concrete detail.
3. Escalation: build through 2–4 increasingly vivid beats.
4. Pivot: explain the mechanism or reveal the key fact.
5. Payoff: end with a short, memorable twist.

Use conversational language, contractions, and mostly short sentences. Write numbers as spoken words when that improves narration. Do not describe what the viewer can already see. Return the script in a copyable block with a word count and estimated duration, followed by a short visual plan and practical recording guidance. Ask for the voiceover when the script is approved. Keep the final script text for timing; if the recording differs, get the actual spoken version.

## Stage 4 — Build from a voiceover

Work through the stages below and ask questions only when a missing input blocks progress. Use the user's approved script as the timing reference. If no speech recognizer is available, the script is required: do not claim to understand or transcribe audio without a suitable tool.

### 4.1 Prepare the project

The skill kit is at the repository root. Create a separate working project using:

```bash
bash <skill-root>/tools/setup.sh <project-directory>
```

Use the actual installation path for `<skill-root>`. The setup script copies `engine/`, `tools/`, and the worked example starter files into the project, and may retrieve Three.js and character-library code from upstream sources. Do not refer to `<skill-root>/kit/tools/setup.sh`; that path does not exist in this repository.

Check for Node.js 22.6+, Python 3 with NumPy (and Pillow for contact sheets), FFmpeg/FFprobe, Git, and Playwright with Chromium. Explain missing prerequisites and ask before making consequential system-wide changes. Do not disable TLS, bypass a proxy, or use untrusted executable downloads to work around network restrictions. Use Chromium software WebGL only as a fallback and warn that it can render slowly.

### 4.2 Time the narration

From the project directory, run:

```bash
python3 timing.py voice.mp3 script.txt --out work
```

The timing tool uses Whisper/faster-whisper word timestamps if available. Otherwise, with a script, it aligns phrases to detected speech segments. Inspect `work/phrases.json`; correct obvious phrase-boundary errors before planning shots. Total frame count is approximately duration × 30. If neither speech recognition nor final script is available, ask for the script rather than guessing.

### 4.3 Plan shots before coding

Write a `work/PLAN.md` with one row per shot: start/end frames, spoken phrase, setting, lighting, camera move, characters/poses/expressions, effects, and sound cues.

- Put a compelling hook image at frame 0.
- Usually use one shot per phrase; combine very short phrases where useful.
- Show each sentence with concrete visual action or a prop carrying the joke.
- Vary shot size and composition: close-up, wide reveal, two-shot, insert, reaction, and environment move.
- Use lighting to clarify story beats. Make time jumps visually legible.
- Stage the twist deliberately; land its visual payoff on the final words.

### 4.4 Build the world and cast

Use `engine/` and the copied project files as the source of truth. Adapt `web/story.js` from `example/soldier/story.js` and the copied audio cue table from `example/soldier/audio.py`; do not overwrite the example in the skill repository. Follow the contracts and exports in the copied engine and example code.

Build environments from simple 3D geometry and painted materials. Keep the vertical frame in mind when staging depth and foreground objects. Make story-driven set pieces controllable by frame/time, and ensure the world state is deterministic for any requested frame. Keep character cards readable, with appropriate poses, expressions, blinking, and subtle idle motion. Use smooth camera glides, intentional focus, and secondary motion without distracting from the narration. Verify that diegetic text is not mirrored.

If character source code is changed, follow the generated project's documented rebuild procedure. Render a character test/contact sheet before relying on a new design. Avoid altering the renderer's core material/depth/ink contracts unless the scene requires it and the result has been checked.

### 4.5 Sound design

Adapt the example cue table to the story. Use music to establish tone and support pacing; use sound effects on meaningful actions, transitions, and reveals. Keep the narration in front, prevent effects from startling above it, and avoid using copyrighted music or effects without permission. Render/check the mix before encoding; report any unresolved clipping or balance issue instead of claiming the audio has passed QA.

Lock the picture timing before finalizing cues. If shot timing changes, revisit the sound cue timing and mix.

### 4.6 Review, render, and finish

Render representative frames from each shot, plus transitions and key actions. Create a contact sheet with the provided utilities and inspect it (or use available image-viewing tools). Fix framing, occlusion, mirrored text, blank frames, lighting, and character readability before starting the long render. Share the review sheet and a concise shot summary with the user when the environment supports file sharing, then proceed with the full render.

Typical project commands (run from the generated project directory):

```bash
node render.mjs stills/review "0,60,120"
python3 sheet.py stills/review stills/contact-sheet.jpg
node render.mjs frames "0-<last-frame>"
bash finish.sh "Title Of Short"
```

Use the actual frame range derived from the voiceover. Resume only if the renderer's resume mode is supported by the copied version. Check process completion and errors; do not assume a started background process finished. The finish utility encodes an MP4 and prints basic media/black/freeze/loudness checks. Inspect the final file and QA output, and be transparent if any check could not run.

Deliver the MP4 and a short description of the shots when file-sharing tools are available. Otherwise provide the exact output path and explain how the user can retrieve it. Offer focused revisions or captions only if requested.

## Repository and dependency notes

- `engine/`: Three.js renderer and world, paint, motion, and character helpers.
- `tools/`: project setup, timing, frame render, contact sheet, and finishing scripts. Prefer these canonical scripts from the skill repository.
- `example/soldier/`: worked example; use it as a starter, not as a story to repeat automatically.
- The setup process retrieves some third-party dependencies. Respect their upstream licenses and do not claim ownership of third-party code.
- Generated audio, frames, contact sheets, and MP4 files belong in the user's working project. Do not commit private voice recordings or secrets to the skill repository.
