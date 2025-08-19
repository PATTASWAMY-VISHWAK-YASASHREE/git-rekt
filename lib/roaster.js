// Roasting logic for analyzing GitHub users
import { generateGeminiRoasts, isGeminiAvailable } from './gemini.js';

export async function generateRoast(userData, repos, commits, events, apiKey = null) {
  const roasts = [];
  let emojiCrimes = 0;
  let usingGemini = false;
  
  // Analyze commit messages
  const commitMessages = commits.map(commit => commit.commit.message);
  const commitRoasts = analyzeCommitMessages(commitMessages);
  emojiCrimes += commitRoasts.emojiCrimes;
  
  // Analyze repository names and descriptions
  const repoRoasts = analyzeRepositories(repos);
  
  // Analyze user profile
  const profileRoasts = analyzeProfile(userData);
  
  // Analyze contribution patterns
  const activityRoasts = analyzeActivity(events, userData);
  
  // Collect analysis results for Gemini
  const analysisResults = {
    genericCommits: commitRoasts.genericCount || 0,
    emojiCrimes: emojiCrimes,
    abandonedRepos: repoRoasts.abandonedCount || 0,
    genericRepoNames: repoRoasts.genericCount || 0,
    missingDescriptions: repoRoasts.missingDescriptions || 0
  };
  
  // Try to generate roasts with Gemini first
  if (apiKey || isGeminiAvailable()) {
    try {
      const geminiResult = await generateGeminiRoasts(userData, repos, commits, events, analysisResults, apiKey);
      if (geminiResult.usingGemini && geminiResult.roasts.length > 0) {
        roasts.push(...geminiResult.roasts);
        usingGemini = true;
      }
    } catch (error) {
      console.error('Gemini generation failed, falling back to traditional roasts:', error);
    }
  }
  
  // If Gemini didn't work or no API key, use traditional roasts
  if (roasts.length === 0) {
    roasts.push(...commitRoasts.roasts);
    roasts.push(...repoRoasts.roasts);
    roasts.push(...profileRoasts.roasts);
    roasts.push(...activityRoasts.roasts);
    
    // If no specific roasts found, add general ones
    if (roasts.length === 0) {
      roasts.push("Your GitHub is so clean, it's suspicious. Are you hiding your real work in private repos? 🤔");
    }
  }
  
  return {
    roasts,
    stats: {
      commits_analyzed: commits.length,
      emoji_crimes: emojiCrimes,
      public_repos: userData.public_repos,
      followers: userData.followers,
      using_gemini: usingGemini
    }
  };
}

function analyzeCommitMessages(messages) {
  const roasts = [];
  let emojiCrimes = 0;
  
  // Check for generic messages
  const genericMessages = messages.filter(msg => 
    /^(fix|update|change|add|remove)$/i.test(msg.trim()) ||
    /^(wip|work in progress)$/i.test(msg.trim())
  );
  
  if (genericMessages.length > 2) {
    roasts.push(`${genericMessages.length} commits with messages like "fix" or "update"? Your commit history reads like a broken keyboard! 🎹💔`);
  }
  
  // Check for emoji overuse
  const emojiPattern = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const messagesWithEmojis = messages.filter(msg => emojiPattern.test(msg));
  
  if (messagesWithEmojis.length > 3) {
    emojiCrimes = messagesWithEmojis.length;
    roasts.push(`${messagesWithEmojis.length} commits with emojis? Your commit messages look like a teenager's text messages! 🙄📱`);
  }
  
  // Check for very long commit messages
  const longMessages = messages.filter(msg => msg.length > 100);
  if (longMessages.length > 2) {
    roasts.push("Writing novels in your commit messages? Save some characters for your actual code! 📚✍️");
  }
  
  // Check for all caps
  const shoutyMessages = messages.filter(msg => msg === msg.toUpperCase() && msg.length > 5);
  if (shoutyMessages.length > 0) {
    roasts.push("CALM DOWN! Your commit messages don't need to shout. We can hear you just fine. 📢😤");
  }
  
  // Check for typos in common words
  const typoMessages = messages.filter(msg => 
    /\b(teh|adn|hte|taht|waht|whith|thier|recieve)\b/i.test(msg)
  );
  if (typoMessages.length > 0) {
    roasts.push("Typos in commit messages? Maybe spend less time coding and more time learning to spell! 📝🤦");
  }
  
  return { 
    roasts, 
    emojiCrimes,
    genericCount: genericMessages.length
  };
}

function analyzeRepositories(repos) {
  const roasts = [];
  
  // Check for abandoned projects (no recent activity)
  const oldRepos = repos.filter(repo => {
    const lastUpdate = new Date(repo.updated_at);
    const monthsAgo = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsAgo > 6;
  });
  
  if (oldRepos.length > 3) {
    roasts.push(`${oldRepos.length} repos gathering dust? You create projects faster than you abandon them! 🏚️💨`);
  }
  
  // Check for generic repo names
  const genericNames = repos.filter(repo => 
    /^(test|demo|sample|project|app|website|portfolio|temp)(\d+)?$/i.test(repo.name)
  );
  
  if (genericNames.length > 2) {
    roasts.push(`"test", "demo", "project"... Your creativity in naming repos is as impressive as a Windows temp folder! 📁😴`);
  }
  
  // Check for repos with no description
  const noDescription = repos.filter(repo => !repo.description);
  if (noDescription.length > repos.length / 2) {
    roasts.push("Half your repos have no description. Do you expect people to play guessing games? 🎲❓");
  }
  
  // Check for forked repos vs original
  const forkedRepos = repos.filter(repo => repo.fork);
  if (forkedRepos.length > repos.length * 0.7) {
    roasts.push("Mostly forks? You're like the friend who only shares memes but never creates original content! 🍴📋");
  }
  
  // Check for very small repos (might be empty or minimal)
  const tinyRepos = repos.filter(repo => repo.size < 10); // Size in KB
  if (tinyRepos.length > 3) {
    roasts.push("So many tiny repos! Quality over quantity, or are you just practicing git init? 🤏📦");
  }
  
  return { 
    roasts,
    abandonedCount: oldRepos.length,
    genericCount: genericNames.length,
    missingDescriptions: noDescription.length
  };
}

function analyzeProfile(userData) {
  const roasts = [];
  
  // Check follower to following ratio
  if (userData.following > userData.followers * 2 && userData.followers > 0) {
    roasts.push("Following more people than you have followers? Someone's a little desperate for connections! 👥💔");
  }
  
  // Check if they have no bio
  if (!userData.bio) {
    roasts.push("No bio? Let me guess... you're also the person who doesn't fill out their LinkedIn profile! 📝🙈");
  }
  
  // Check account age vs activity
  const accountAge = (Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365);
  if (accountAge > 2 && userData.public_repos < 5) {
    roasts.push(`${Math.floor(accountAge)} years on GitHub and only ${userData.public_repos} public repos? You're aging slower than your commit count! ⏳👴`);
  }
  
  // Check for zero followers with many repos
  if (userData.followers === 0 && userData.public_repos > 10) {
    roasts.push("Zero followers but lots of repos? You're coding in a void, my friend! 🕳️👤");
  }
  
  return { roasts };
}

function analyzeActivity(events, userData) {
  const roasts = [];
  
  // Check for weekend warrior pattern
  const recentEvents = events.slice(0, 20);
  const weekendEvents = recentEvents.filter(event => {
    const date = new Date(event.created_at);
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  });
  
  if (weekendEvents.length > recentEvents.length * 0.6) {
    roasts.push("Weekend warrior detected! Do you only code when normal people are having fun? 🏃‍♂️💻");
  }
  
  // Check for late night commits (assuming UTC)
  const lateNightEvents = recentEvents.filter(event => {
    const hour = new Date(event.created_at).getUTCHours();
    return hour >= 23 || hour <= 5;
  });
  
  if (lateNightEvents.length > 5) {
    roasts.push("3 AM commits? Either you're in a different timezone or you really need to fix your sleep schedule! 🌙💻");
  }
  
  // Check for commit spamming (many commits in short time)
  if (recentEvents.length > 15) {
    const pushEvents = recentEvents.filter(e => e.type === 'PushEvent');
    if (pushEvents.length > 8) {
      roasts.push("So many commits! Do you save your work every time you fix a typo? 💾🤯");
    }
  }
  
  return { roasts };
}