const GITHUB_API_BASE = 'https://api.github.com';

// Mock data for demonstration when API is not accessible
const MOCK_USERS = {
  'octocat': {
    login: 'octocat',
    name: 'The Octocat',
    avatar_url: 'https://github.com/octocat.png',
    bio: 'Just a friendly octopus',
    public_repos: 8,
    followers: 5000,
    following: 9,
    created_at: '2011-01-25T18:44:36Z'
  },
  'torvalds': {
    login: 'torvalds',
    name: 'Linus Torvalds',
    avatar_url: 'https://github.com/torvalds.png',
    bio: 'Creator of Linux',
    public_repos: 4,
    followers: 185000,
    following: 0,
    created_at: '2011-09-03T15:26:22Z'
  },
  'gaearon': {
    login: 'gaearon',
    name: 'Dan Abramov',
    avatar_url: 'https://github.com/gaearon.png',
    bio: 'React team at Meta',
    public_repos: 285,
    followers: 95000,
    following: 171,
    created_at: '2011-06-02T12:26:19Z'
  }
};

export async function fetchGitHubUser(username) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('GitHub user not found');
      }
      throw new Error('Failed to fetch user data');
    }
    
    return response.json();
  } catch (error) {
    // Fallback to mock data if API is not accessible
    const mockUser = MOCK_USERS[username.toLowerCase()];
    if (mockUser) {
      return mockUser;
    }
    
    // Return a generic mock user for any other username
    return {
      login: username,
      name: `${username.charAt(0).toUpperCase() + username.slice(1)} Developer`,
      avatar_url: `https://github.com/${username}.png`,
      bio: 'A mysterious developer',
      public_repos: Math.floor(Math.random() * 50) + 1,
      followers: Math.floor(Math.random() * 1000),
      following: Math.floor(Math.random() * 200),
      created_at: '2020-01-01T00:00:00Z'
    };
  }
}

export async function fetchUserRepos(username, limit = 10) {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }
    
    return response.json();
  } catch (error) {
    // Return mock repos data
    return generateMockRepos(username, limit);
  }
}

export async function fetchRepoCommits(username, repo, limit = 10) {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${username}/${repo}/commits?per_page=${limit}`
    );
    
    if (!response.ok) {
      // Return mock commits even if API fails
      return generateMockCommits(username, repo, limit);
    }
    
    return response.json();
  } catch (error) {
    // Return mock commits
    return generateMockCommits(username, repo, limit);
  }
}

export async function fetchUserEvents(username, limit = 30) {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/events/public?per_page=${limit}`
    );
    
    if (!response.ok) {
      return [];
    }
    
    return response.json();
  } catch (error) {
    // Return mock events
    return generateMockEvents(username, limit);
  }
}

// Mock data generators
function generateMockRepos(username, limit) {
  const repoNames = [
    'awesome-project', 'my-website', 'test', 'demo-app', 'portfolio', 'hello-world',
    'machine-learning-stuff', 'website', 'app', 'project1', 'temp', 'sample-code'
  ];
  
  return repoNames.slice(0, limit).map((name, index) => ({
    name,
    description: index % 3 === 0 ? null : `A ${name.replace('-', ' ')} repository`,
    fork: index % 4 === 0,
    size: Math.floor(Math.random() * 1000) + 1,
    updated_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
  }));
}

function generateMockCommits(username, repo, limit) {
  const commitMessages = [
    'fix', 'update', 'add new feature ✨🎉🎊', 'refactor code', 'bug fix 🐛',
    'WIP: working on something', 'URGENT FIX!!!', 'teh typo fix and adn other changes', 
    'Update README.md with very long description that goes on and on about nothing in particular and just keeps going',
    'add emoji support 🎉🎊🎈🌟💫⭐🔥💯🚀', 'remove old stuff', 'changes',
    'FIXED THE THING THAT WAS BROKEN', 'lol this should work now 😂😭', 'oops',
    'final commit', 'final commit v2', 'final commit final', 'actually final this time'
  ];
  
  return commitMessages.slice(0, limit).map((message, index) => ({
    commit: {
      message,
      author: {
        name: username,
        date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  }));
}

function generateMockEvents(username, limit) {
  const eventTypes = ['PushEvent', 'CreateEvent', 'IssuesEvent', 'PullRequestEvent'];
  
  return Array.from({ length: limit }, (_, index) => ({
    type: eventTypes[index % eventTypes.length],
    created_at: new Date(Date.now() - index * 2 * 60 * 60 * 1000).toISOString()
  }));
}