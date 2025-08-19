import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [username, setUsername] = useState('');
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
  // API key no longer accepted from client; server uses its own env var
      
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
          <p className={styles.apiKeyNote}>
            � AI roasts enabled by site owner. Your requests never see the API key.
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
              <Image 
                src={roast.avatar_url} 
                alt={`${roast.username}'s avatar`}
                className={styles.avatar}
                width={80}
                height={80}
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