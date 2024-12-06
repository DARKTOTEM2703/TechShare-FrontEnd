const TOKEN_KEY = "sessionToken";
const USER_ID_KEY = "userId";
const USER_EMAIL_KEY = "userEmail";
const USER_NAME_KEY = "userName";

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
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
