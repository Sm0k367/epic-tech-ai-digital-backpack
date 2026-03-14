# 🔑 API Configuration Guide

This guide will help you set up all the necessary API keys for the Epic Tech AI Digital Backpack.

## 📋 Quick Start

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your API keys in `.env.local`

3. Restart your development server

## 🔐 Required API Keys

### 1. OpenAI API Key (Required for Chat Nexus)

**What it's for:** Powers AI conversations and text generation

**How to get it:**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add to `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

**Cost:** Pay-as-you-go, ~$0.002 per 1K tokens

---

### 2. Anthropic API Key (Optional - Alternative AI)

**What it's for:** Alternative AI provider with Claude models

**How to get it:**
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
   ```

**Cost:** Pay-as-you-go, pricing varies by model

---

### 3. Replicate API Token (Required for Music Vault)

**What it's for:** AI model hosting for music generation and other ML models

**How to get it:**
1. Go to [Replicate](https://replicate.com/account/api-tokens)
2. Sign up or log in
3. Copy your API token (starts with `r8_`)
4. Add to `.env.local`:
   ```
   REPLICATE_API_TOKEN=r8_your-actual-token-here
   ```

**Cost:** Pay-as-you-go, varies by model

---

### 4. Supabase (Required for Database)

**What it's for:** Database and authentication backend

**How to get it:**
1. Go to [Supabase](https://app.supabase.com/)
2. Create a new project
3. Go to Settings → API
4. Copy the following:
   - Project URL
   - `anon` public key
   - `service_role` secret key
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

**Cost:** Free tier available, then pay-as-you-go

---

### 5. GitHub Personal Access Token (Required for Code Vault)

**What it's for:** Repository management and code operations

**How to get it:**
1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
4. Generate and copy the token (starts with `ghp_`)
5. Add to `.env.local`:
   ```
   GITHUB_TOKEN=ghp_your-actual-token-here
   ```

**Cost:** Free

---

## 🎯 Optional Integrations

### Vercel Analytics

For production analytics:
```
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

### Sentry Error Tracking

For error monitoring:
```
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use environment variables** - Never hardcode API keys
3. **Rotate keys regularly** - Especially if exposed
4. **Use different keys** - Separate keys for dev/staging/production
5. **Monitor usage** - Set up billing alerts on all platforms

---

## 🌐 Using the Static HTML Version

The standalone `index.html` file includes a built-in API configuration interface:

1. Open `public/index.html` in your browser
2. Click the "⚙️ API Settings" button in the top-right
3. Enter your API keys
4. Click "💾 Save Configuration"

Your keys are stored securely in browser localStorage and never sent to any server.

---

## 🧪 Testing Your Configuration

### Test OpenAI:
```javascript
const response = await window.EpicAPI.callOpenAI('Hello, world!');
console.log(response);
```

### Test Anthropic:
```javascript
const response = await window.EpicAPI.callAnthropic('Hello, Claude!');
console.log(response);
```

### Check if configured:
```javascript
console.log(window.EpicAPI.isConfigured()); // true/false
```

---

## 🚨 Troubleshooting

### "API key not configured" error
- Check that your `.env.local` file exists
- Verify the key format matches the examples
- Restart your development server

### "Invalid API key" error
- Verify the key is correct and active
- Check for extra spaces or quotes
- Ensure the key hasn't been revoked

### Keys not loading in browser
- Clear browser localStorage
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors

---

## 📞 Support

If you need help:
1. Check the [GitHub Issues](https://github.com/Sm0k367/epic-tech-ai-digital-backpack/issues)
2. Review API provider documentation
3. Verify your billing status on each platform

---

## 💡 Cost Optimization Tips

1. **Set usage limits** on all API platforms
2. **Use caching** to reduce API calls
3. **Monitor usage** with platform dashboards
4. **Start with free tiers** to test functionality
5. **Use cheaper models** for development (e.g., GPT-3.5 instead of GPT-4)

---

**Last Updated:** March 2026
