# CopyTrade Deployment & Production Guide

Follow these steps to launch your elite terminal.

### 1. Intelligence Layer (Gemini API)
Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create a Gemini API Key. This powers the Sarah (Account Manager) and Market Analyst Hub engines.

### 2. Project Repository
1. Initialize a GitHub repository.
2. Push all project files.
3. Vercel will automatically detect the `vite.config.js` and build a hardened production version of the app.

### 3. Vercel Configuration
1. Connect your repo to [Vercel](https://vercel.com).
2. **Environment Variables**:
   - `API_KEY`: [Your Gemini API Key]
   - `VERCEL_API_KEY`: `vck_3pJEM6YVGKmJiwXjC4jDZj4ULBghTefv6ObCCKSftWK63XQXL73HAcik`
3. Click **Deploy**.

### 4. Running Non-Stop
Once deployed on Vercel, the application is hosted on globally distributed edge servers. It runs **non-stop 24/7** without any need for local hosting or manual restarts. The serverless architecture ensures 99.9% uptime.

### 5. Backend Capabilities
**Q: Can I build a backend in Vercel?**
**A: YES.** You can easily extend this app by creating an `/api` folder in the root directory. Vercel automatically treats files in that folder as Serverless Functions (Node.js, Python, or Go). This is perfect for storing user databases (like PostgreSQL) or handling private API calls.

### 6. Source Protection
The current build is configured to:
- Disable Source Maps.
- Strip Console Logs.
- Deter inspection shortcuts.
- Minify and Obfuscate logic via Terser.

Your terminal is now ready for institutional-grade deployment.