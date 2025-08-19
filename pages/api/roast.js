import { fetchGitHubUser, fetchUserRepos, fetchRepoCommits, fetchUserEvents } from '../../lib/github';
import { generateRoast } from '../../lib/roaster';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.query; // API key is now server-managed via environment variable only

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Fetch user data
    const userData = await fetchGitHubUser(username);
    
    // Fetch user's repositories
    const repos = await fetchUserRepos(username, 10);
    
    // Fetch commits from recent repositories
    let allCommits = [];
    for (let i = 0; i < Math.min(3, repos.length); i++) {
      const repo = repos[i];
      try {
        const commits = await fetchRepoCommits(username, repo.name, 5);
        allCommits.push(...commits);
      } catch (error) {
        // Skip repos we can't access (private repos, etc.)
        continue;
      }
    }
    
    // Fetch recent activity
    const events = await fetchUserEvents(username, 30);
    
    // Generate the roast (now async to support Gemini)
  const roastData = await generateRoast(userData, repos, allCommits, events);
    
    // Return the result
    res.status(200).json({
      username: userData.login,
      name: userData.name,
      avatar_url: userData.avatar_url,
      roasts: roastData.roasts,
      stats: roastData.stats
    });

  } catch (error) {
    console.error('Error generating roast:', error);
    
    if (error.message === 'GitHub user not found') {
      return res.status(404).json({ error: 'GitHub user not found. Check the username and try again.' });
    }
    
    return res.status(500).json({ 
      error: 'Failed to analyze GitHub profile. The user might have limited public activity.' 
    });
  }
}