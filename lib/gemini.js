// Google Gemini API integration for enhanced roast generation
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
function initializeGemini(apiKey = null) {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    console.log('No API key provided and GEMINI_API_KEY not found, using fallback roasts');
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    return model;
  } catch (error) {
    console.error('Failed to initialize Gemini API:', error);
    return null;
  }
}

// Generate roasts using Gemini API
export async function generateGeminiRoasts(userData, repos, commits, events, analysisResults, apiKey = null) {
  // Initialize Gemini with the provided API key or environment variable
  const model = initializeGemini(apiKey);
  if (!model) {
    return { roasts: [], usingGemini: false };
  }

  try {
    const prompt = createRoastPrompt(userData, repos, commits, events, analysisResults);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response to extract individual roasts
    const roasts = parseGeminiResponse(text);
    
    return { roasts, usingGemini: true };
  } catch (error) {
    console.error('Error generating roasts with Gemini:', error);
    return { roasts: [], usingGemini: false };
  }
}

// Create a detailed prompt for Gemini based on GitHub analysis
function createRoastPrompt(userData, repos, commits, events, analysisResults) {
  const commitMessages = commits.map(c => c.commit.message).slice(0, 10);
  const repoNames = repos.map(r => r.name).slice(0, 8);
  
  return `You are a witty, sarcastic GitHub roaster. Generate 3-5 creative and humorous roasts for a GitHub user based on their activity. Be playful and funny, not mean or offensive. Use emojis for fun.

GitHub User Analysis:
- Username: ${userData.login}
- Name: ${userData.name || 'No name provided'}
- Bio: ${userData.bio || 'No bio'}
- Public Repos: ${userData.public_repos}
- Followers: ${userData.followers}
- Following: ${userData.following}
- Account Age: ${Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365))} years

Recent Repository Names:
${repoNames.join(', ')}

Recent Commit Messages:
${commitMessages.join('\n')}

Analysis Summary:
- Has ${analysisResults.genericCommits || 0} generic commit messages
- Has ${analysisResults.emojiCrimes || 0} commits with excessive emojis
- Has ${analysisResults.abandonedRepos || 0} abandoned repositories
- Has ${analysisResults.genericRepoNames || 0} generically named repositories
- Has ${analysisResults.missingDescriptions || 0} repos without descriptions

Generate 3-5 witty roasts as a JSON array of strings. Focus on their coding patterns, repo naming, commit messages, and GitHub activity. Make them funny but not cruel. Example format:
["Roast 1 with emoji 🔥", "Roast 2 with emoji 😂", "Roast 3 with emoji 💻"]

JSON Response:`;
}

// Parse Gemini response and extract roasts
function parseGeminiResponse(text) {
  try {
    // Try to extract JSON array from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const roasts = JSON.parse(jsonMatch[0]);
      if (Array.isArray(roasts) && roasts.length > 0) {
        return roasts.filter(roast => typeof roast === 'string' && roast.trim().length > 0);
      }
    }
    
    // Fallback: split by lines and clean up
    const lines = text.split('\n')
      .filter(line => line.trim().length > 10)
      .map(line => line.replace(/^[-*"]\s*/, '').replace(/["]*$/, '').trim())
      .filter(line => line.length > 0);
    
    return lines.slice(0, 5); // Limit to 5 roasts
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return [];
  }
}

// Check if Gemini is available (either environment variable or can be provided by user)
export function isGeminiAvailable() {
  return !!process.env.GEMINI_API_KEY;
}