// Helper function to get URL parameters
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Format date to YYYY-MM-DD UTC
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

// Calculate account age in years
function calculateAccountAge(createdAt) {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffMs = now - createdDate;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const years = Math.floor(diffDays / 365);
  return years;
}

// Handle form submission
document.getElementById('github-user-r8s2').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const token = getUrlParameter('token');
  const statusElement = document.getElementById('github-status');
  const createdAtElement = document.getElementById('github-created-at');
  const accountAgeElement = document.getElementById('github-account-age');
  
  if (!username) {
    createdAtElement.textContent = 'Please enter a username';
    accountAgeElement.textContent = '';
    return;
  }
  
  // Announce lookup start
  statusElement.textContent = `Looking up user ${username}...`;
  
  try {
    // Build API URL
    const apiUrl = `https://api.github.com/users/${encodeURIComponent(username)}`;
    
    // Set up headers
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };
    
    // Add token if provided
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }
    
    // Fetch user data
    const response = await fetch(apiUrl, { headers });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      } else if (response.status === 403) {
        throw new Error('Rate limit exceeded or access forbidden');
      } else {
        throw new Error(`API error: ${response.status}`);
      }
    }
    
    const userData = await response.json();
    
    // Format and display creation date
    const createdAt = formatDate(userData.created_at);
    createdAtElement.textContent = createdAt;
    
    // Calculate and display account age
    const accountAge = calculateAccountAge(userData.created_at);
    accountAgeElement.textContent = `Account age: ${accountAge} years`;
    
    // Announce success
    statusElement.textContent = `Successfully fetched data for user ${username}`;
  } catch (error) {
    createdAtElement.textContent = `Error: ${error.message}`;
    accountAgeElement.textContent = '';
    
    // Announce error
    statusElement.textContent = `Failed to fetch data for user ${username}: ${error.message}`;
  }
});