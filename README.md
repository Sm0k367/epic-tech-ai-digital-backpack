<p align="center">
  <img src="https://raw.githubusercontent.com/Sm0k367/epic-tech-ai-digital-backpack/main/apps/host/public/pixio-chat-image-2026-03-06T02-44-11-919Z" width="120" alt="Living Logo"/>
</p>

<h1 align="center">
  🎒 Epic Tech AI – Digital Backpack
</h1>

<p align="center">
  <b>Zero-config · Edge-first · Self-healing</b><br/>
  A modular creative playground that never sleeps, never breaks, never stops evolving.
</p>

<p align="center">
  <img alt="Vercel" src="https://vercelbadge.vercel.app/api/Sm0k367/epic-tech-ai-digital-backpack?style=flat-square"/>
  <img alt="License" src="https://img.shields.io/badge/license-MIT-00ff88?style=flat-square"/>
  <img alt="Node" src="https://img.shields.io/badge/node-≥18-339933?style=flat-square&logo=nodedotjs"/>
</p>

---

## ⚡ One-Command Spawn

```bash
pnpm install && pnpm dev      # localhost:3000
pnpm deploy                   # global edge in 30s
```

---

## 🧩 Live Modules

| Module | Status | Description |
|--------|--------|-------------|
| 🎵 **Music Vault** | 🔴 alpha | Real-time DAW w/ AI music generation |
| 💻 **Code Vault** | 🔴 alpha | AI-powered code generation + GitHub integration |
| 🎮 **Game Labs** | 🔴 alpha | Interactive game development environment |
| 💬 **Chat Nexus** | 🔴 alpha | Persistent AI conversations with context |

---

## 🔑 API Configuration

**Quick Setup:**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

**📚 Full Guide:** See [API_SETUP.md](./API_SETUP.md) for detailed instructions

**Required APIs:**
- OpenAI (Chat Nexus)
- Replicate (Music Vault)
- Supabase (Database)
- GitHub (Code Vault)

**🌐 Static HTML Version:** Open `public/index.html` for standalone version with built-in API configuration UI

---

## 🛠️ Stack

<p align="left">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript"/>
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-3-cyan?style=flat-square&logo=tailwindcss"/>
  <img alt="Turbo" src="https://img.shields.io/badge/Turbo-build%20pipeline-000?style=flat-square"/>
  <img alt="Rust" src="https://img.shields.io/badge/Rust-WASM-orange?style=flat-square&logo=rust"/>
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-deployment-000?style=flat-square&logo=vercel"/>
</p>

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8.15.0+
- API keys (see [API_SETUP.md](./API_SETUP.md))

### Installation

```bash
# Clone the repository
git clone https://github.com/Sm0k367/epic-tech-ai-digital-backpack.git
cd epic-tech-ai-digital-backpack

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
epic-tech-ai-digital-backpack/
├── apps/host/              # Main Next.js app
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   └── lib/           # API helpers & utilities
│   └── public/            # Static assets + standalone HTML
├── packages/
│   ├── core/              # Rust/WASM core
│   ├── ui/                # Shared components
│   ├── bus/               # Event system
│   └── db/                # Database utilities
├── .env.example           # Environment template
├── API_SETUP.md           # API configuration guide
└── vercel.json            # Deployment config
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Manual

```bash
pnpm deploy
```

---

## 🧪 Development Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter
pnpm clean        # Clean build artifacts
```

---

## 🗺️ Roadmap

- [ ] P2P fallback mesh
- [ ] Shader-driven UI
- [ ] Token-weighted governance
- [ ] Decentralized identity
- [ ] Real-time collaboration
- [ ] Plugin marketplace

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md)

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📝 License

MIT – fork, remix, spawn your own universe.

---

## 📚 Documentation

- [API Setup Guide](./API_SETUP.md) - Complete API configuration
- [Contributing](./CONTRIBUTING.md) - How to contribute
- [License](./LICENSE) - MIT License

---

## 🙏 Acknowledgments

- Next.js team
- Vercel platform
- OpenAI, Anthropic, Replicate
- Supabase infrastructure

---

**Built with ❤️ by Epic Tech AI**
