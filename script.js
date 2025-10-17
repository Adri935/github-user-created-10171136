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

// Handle form submission
document.getElementById('github-user-r8s2').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const token = getUrlParameter('token');
  
  if (!username) {
    document.getElementById('github-created-at').textContent = 'Please enter a username';
    return;
  }
  
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
    document.getElementById('github-created-at').textContent = createdAt;
  } catch (error) {
    document.getElementById('github-created-at').textContent = `Error: ${error.message}`;
  }
});