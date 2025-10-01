const TOKEN_KEY = "sessionToken";
const USER_ID_KEY = "userId";
const USER_EMAIL_KEY = "userEmail";
const USER_NAME_KEY = "userName";

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

// Store token and also extract common claims (id, user_name) and save them
export const setTokenWithClaims = (token: string) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(TOKEN_KEY, token);

    const parts = token.split('.');
    if (parts.length < 2) return;
    let payload = parts[1];
    const pad = (4 - (payload.length % 4)) % 4;
    payload += '='.repeat(pad);
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = atob(payload);
    // atob returns a binary string; decode to UTF-8
    try {
      const arr = Array.prototype.map.call(bytes, function(c: string) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('');
      const json = decodeURIComponent(arr);
      const claims = JSON.parse(json);
      if (claims.id) setUserId(String(claims.id));
      if (claims.user_name) setUserName(String(claims.user_name));
  } catch {
      // fallback: try direct JSON parse
      try {
        const claims = JSON.parse(bytes as unknown as string);
        if (claims.id) setUserId(String(claims.id));
        if (claims.user_name) setUserName(String(claims.user_name));
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore decode errors
  }
};

export const setUserId = (userId: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_ID_KEY, userId);
  }
};

export const setUserEmail = (email: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_EMAIL_KEY, email);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null; // Retorna null si no estás en el cliente
};

export const getUserId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(USER_ID_KEY);
  }
  return null;
};

export const getUserEmail = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(USER_EMAIL_KEY);
  }
  return null;
};

export const setUserName = (name: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_NAME_KEY, name);
  }
};

export const getUserName = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(USER_NAME_KEY);
  }
  return null;
};

export const clearStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_NAME_KEY);
  }
};
