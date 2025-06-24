export function fetchWithAuth(url, { token, handleLogout, ...options } = {}) {
  // Get token from parameter or from localStorage as a fallback
  token = token || localStorage.getItem('token');
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  return fetch(url, { ...options, headers })
    .then(async res => {
      if (res.status === 401 || res.status === 403) {
        // Unauthorized, force logout if handler is provided
        if (typeof handleLogout === 'function') handleLogout();
        throw new Error('Unauthorized');
      }
      // Handle other errors or parse JSON
      return res;
    });
}
