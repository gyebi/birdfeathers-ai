export function saveState(key, value){
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadState(key){
  const data = localStorage.getItem(key)

  if(!data) return null

  return JSON.parse(data)
}

export function clearState(key){
  localStorage.removeItem(key)
}