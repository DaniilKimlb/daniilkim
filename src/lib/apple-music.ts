export function getAppleMusicSearchUrl(artist: string, track: string): string {
  const query = encodeURIComponent(`${track} ${artist}`)
  return `https://music.apple.com/search?term=${query}`
}

export function getAppleMusicDeepLink(artist: string, track: string): string {
  const query = encodeURIComponent(`${track} ${artist}`)
  return `https://music.apple.com/search?term=${query}`
}

export function getItunesSearchUrl(artist: string, track: string): string {
  const query = encodeURIComponent(`${track} ${artist}`)
  return `https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=1`
}

export function getAppleMusicUrl(artist: string, track: string): string {
  return getAppleMusicSearchUrl(artist, track)
}
