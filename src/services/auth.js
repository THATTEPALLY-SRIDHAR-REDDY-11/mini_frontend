const USER_STORAGE_KEY = 'sfwm_current_user';

export function setCurrentUser(user) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function clearCurrentUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
}
