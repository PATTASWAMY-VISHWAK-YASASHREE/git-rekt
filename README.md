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
2. The app fetches public data from GitHub's API:
   - User profile information
   - Recent repositories
   - Commit messages from recent repos
   - Public activity events
3. Analyzes the data for roasting opportunities:
   - Generic commit messages ("fix", "update", etc.)
   - Emoji overuse in commits
   - Poor repository naming conventions
   - Inconsistent contribution patterns
   - Profile completeness issues
4. Generates personalized roasts:
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

### Google Gemini API (Optional)

To enable AI-powered roasts, you'll need a Google Gemini API key:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

If no API key is provided, the app will use traditional hardcoded roasts as fallback.

## API Usage

The app uses GitHub's public API and doesn't require authentication. It only accesses publicly available information.

## Contributing

Feel free to contribute by:
- Adding new roasting categories
- Improving the analysis logic
- Enhancing the UI/UX
- Adding more emoji crimes detection

## Deployment

The app can be easily deployed to platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Heroku

## Disclaimer

This app is meant for entertainment purposes only. All roasts are generated based on publicly available GitHub data and are intended to be humorous, not offensive.

## License

ISC License - feel free to use this code for your own projects!

---

Made with 💔 and questionable life choices