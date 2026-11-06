const PREFIX = 'sece43-quiz:'

export function load(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    return
  }
}

export function remove(key) {
  try {
    window.localStorage.removeItem(PREFIX + key)
  } catch {
    return
  }
}
