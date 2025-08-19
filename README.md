# Git Rekt 🔥

A web app that takes a GitHub username and roasts them based on their contributions, commit messages, and questionable emoji use.

## Features

- 🔍 **Profile Analysis**: Analyzes GitHub profiles, repositories, and activity patterns
- 📝 **Commit Message Roasting**: Identifies generic messages, emoji overuse, and poor formatting
- 📊 **Repository Quality Check**: Evaluates repo naming, descriptions, and maintenance
- 🎯 **Activity Pattern Analysis**: Looks at coding habits and contribution patterns
- 🤖 **AI-Powered Roasts**: Optional Google Gemini integration for more creative and personalized roasts
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/PATTASWAMY-VISHWAK-YASASHREE/git-rekt.git
   cd git-rekt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional)**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your Google Gemini API key for enhanced roasts
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How It Works

1. Enter a GitHub username
2. (Site owner only) Server may have a Google Gemini API key configured; end users no longer supply keys.
3. The app fetches public data from GitHub's API:
   - User profile information
   - Recent repositories
   - Commit messages from recent repos
   - Public activity events
4. Analyzes the data for roasting opportunities:
   - Generic commit messages ("fix", "update", etc.)
   - Emoji overuse in commits
   - Poor repository naming conventions
   - Inconsistent contribution patterns
   - Profile completeness issues
5. Generates personalized roasts:
   - **With Gemini API**: Uses AI to create witty, context-aware roasts
   - **Fallback**: Uses traditional pattern-based roasts if no API key provided

## Roasting Categories

### 📝 Commit Messages
- Generic messages without context
- Excessive emoji usage
- Overly long commit messages
- All caps messages
- Common typos

### 📂 Repository Quality  
- Generic repository names
- Missing descriptions
- Abandoned projects
- Too many forks vs original work

### 👤 Profile Analysis
- Follower/following ratios
- Missing bio information
- Account age vs activity level

### ⏰ Activity Patterns
- Weekend warrior coding
- Late night commits
- Commit frequency patterns

## Tech Stack

- **Frontend**: Next.js with React
- **Styling**: CSS Modules
- **API**: Next.js API Routes
- **Data Source**: GitHub REST API
- **AI Integration**: Google Gemini API (optional)

## Configuration

### Google Gemini API (Server-managed)

AI-powered roasts are enabled solely via a server-side environment variable. End users cannot (and need not) provide their own keys.

1. Obtain an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set `GEMINI_API_KEY` in your deployment environment (e.g. Netlify UI > Site settings > Environment variables)
3. (Optional) For local development create `.env.local` with:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
4. Restart dev server. The frontend never receives this key; it stays on the server.

If the key is absent, the app falls back to traditional pattern-based roasts.

## API Usage

The app uses GitHub's public API and doesn't require authentication. It only accesses publicly available information.

## Contributing

Feel free to contribute by:
- Adding new roasting categories
- Improving the analysis logic
- Enhancing the UI/UX
- Adding more emoji crimes detection

## Deployment

### Netlify (Recommended for public deployment)

1. **Fork this repository** to your GitHub account

2. **Connect to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account and select the forked repository
   - Netlify will automatically detect the Next.js configuration

3. **Deploy**: 
   - Build command: `npm run build`
   - Publish directory: `.next`
   - (Optional) Set `GEMINI_API_KEY` in environment to enable AI roasts globally.

4. **Done!** Your app will be live and users can optionally provide their own Gemini API keys for AI roasts.

### Other Platforms

The app can also be deployed to:
- **Vercel**: Perfect for Next.js, automatic deployments
- **Railway**: Good for containerized deployments
- **Heroku**: Classic PaaS option

For self-hosting or private deployment, you can set the `GEMINI_API_KEY` environment variable to provide a default API key.

## Disclaimer

This app is meant for entertainment purposes only. All roasts are generated based on publicly available GitHub data and are intended to be humorous, not offensive.

## License

ISC License - feel free to use this code for your own projects!

---

Made with 💔 and questionable life choices