import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [username, setUsername] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [roast, setRoast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setRoast(null);

    try {
      const url = new URL('/api/roast', window.location.origin);
      url.searchParams.append('username', username);
      if (apiKey.trim()) {
        url.searchParams.append('apiKey', apiKey.trim());
      }
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate roast');
      }

      setRoast(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Git Rekt - GitHub Roaster</title>
        <meta name="description" content="Get roasted based on your GitHub activity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Git Rekt 🔥
        </h1>

        <p className={styles.description}>
          Enter a GitHub username and get roasted based on their contributions, 
          commit messages, and questionable emoji use 🪄 📟 🦴 💾 🫠
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username"
            className={styles.input}
            disabled={loading}
          />
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Google Gemini API Key (optional - for AI roasts)"
            className={styles.input}
            disabled={loading}
          />
          <p className={styles.apiKeyNote}>
            💡 Want AI-powered roasts? Add your <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Gemini API key</a> above. 
            Without it, you&apos;ll get our classic hardcoded roasts (still brutal! 🔥)
          </p>
          <button 
            type="submit" 
            className={styles.button}
            disabled={loading || !username.trim()}
          >
            {loading ? 'Generating Roast...' : 'Roast Me! 🔥'}
          </button>
        </form>

        {error && (
          <div className={styles.error}>
            <h3>Oops! 😅</h3>
            <p>{error}</p>
          </div>
        )}

        {roast && (
          <div className={styles.roastContainer}>
            <div className={styles.userInfo}>
              <img 
                src={roast.avatar_url} 
                alt={`${roast.username}&apos;s avatar`}
                className={styles.avatar}
              />
              <h2>@{roast.username}</h2>
              <p>{roast.name || 'Anonymous Developer'}</p>
            </div>
            
            <div className={styles.roastContent}>
              <h3>Your Roast 🔥</h3>
              {roast.roasts.map((roastText, index) => (
                <p key={index} className={styles.roastText}>
                  {roastText}
                </p>
              ))}
            </div>

            <div className={styles.stats}>
              <h4>The Evidence 📊</h4>
              <ul>
                <li>Public Repos: {roast.stats.public_repos}</li>
                <li>Followers: {roast.stats.followers}</li>
                <li>Recent Commits Analyzed: {roast.stats.commits_analyzed}</li>
                <li>Emoji Crimes Detected: {roast.stats.emoji_crimes}</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>
          Made with 💔 and questionable life choices
        </p>
      </footer>
    </div>
  );
}