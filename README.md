# MoodMuse — AI-First Journaling Companion

MoodMuse is a warm, emotionally intelligent journaling app powered by AI. It’s designed to let users write how they feel and receive honest, supportive reflections — like a wise friend who listens, comforts, and calls you out gently when needed.

---

## Status: Work in Progress

> ⚠️ This is a live experiment. I’m currently building MoodMuse using AI-first tools like [Lovable.dev](https://lovable.dev) to explore how far I can go in creating functional web apps with minimal hand-written code.

Rather than coding every line manually, I’m designing the **architecture, UX, prompts, and emotional tone**, while using AI to assist with the implementation. This is part of my journey in learning how to **build with AI instead of just building AI**.

---

## Features (WIP)

-  Mood Selector — choose your current emotional state
-  Journal Entry — open-ended expressive writing
-  AI Reflections — 2–3 paragraph empathetic responses via HuggingFace
-  API Key setup — stores key locally in browser
-  Reflection History — see your past emotional journeys

---

## Philosophy

> MoodMuse is not here to tell you what you *want* to hear, but what you *need* — with compassion, clarity, and care. It’s not therapy. It’s not a hype machine. It’s emotional reflection for modern minds.

---

## Tech Stack

- **Frontend:** React + TypeScript
- **Build Tool:** Vite (planned)
- **AI:** Hugging Face Inference API (`HelpingAI-9B` model)
- **State Management:** React Hooks
- **Storage:** LocalStorage (for reflections + API key)
- **No-code Layer:** [Lovable.dev](https://lovable.dev)

---

## Getting Started (Local Setup - once ready)

> Not yet fully functional, but this will be the setup path:

```bash
git clone https://github.com/YOUR_USERNAME/moodmuse.git
cd moodmuse
npm install
npm run dev
