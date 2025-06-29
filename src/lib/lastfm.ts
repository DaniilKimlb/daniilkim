export interface LastfmTrack {
  name: string
  artist: string
  album: string
  url: string
  coverUrl: string
  isPlaying: boolean
  timestamp?: number
}

export interface LastfmResponse {
  recenttracks: {
    track: any[] | any
  }
  error?: number
  message?: string
}

export type NowPlaying = {
  state: {
    isPlaying: boolean
  }
  track?: {
    name: string
    url: string
    album: string
    artist: string
    coverUrl: string
  } | null
}

/**
 * Get the best available image from Last.fm image array
 */
export function getBestImage(images: any[]): string | null {
  if (!images || !Array.isArray(images)) return null

  const sizes = ['extralarge', 'large', 'medium', 'small']

  for (const size of sizes) {
    const image = images.find((img) => img.size === size)
    if (image?.['#text']) {
      return image['#text']
    }
  }

  return null
}

/**
 * Generate a default gradient image for tracks without artwork
 */
export function getDefaultImage(seed: string = 'default'): string {
  const gradients = [
    ['#1ed760', '#1db954'], // Spotify green
    ['#8b5cf6', '#ec4899'], // Purple to pink
    ['#06b6d4', '#3b82f6'], // Cyan to blue
    ['#10b981', '#059669'], // Green shades
    ['#f59e0b', '#ea580c'], // Orange shades
    ['#ef4444', '#dc2626'], // Red shades
  ]

  const index = seed.length % gradients.length
  const [color1, color2] = gradients[index]

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" fill="url(#grad${index})" rx="8"/>
      <circle cx="32" cy="32" r="12" fill="none" stroke="white" stroke-width="2" opacity="0.8"/>
      <circle cx="32" cy="32" r="3" fill="white" opacity="0.9"/>
    </svg>
  `)}`
}

/**
 * Parse Last.fm track data into our format
 */
export function parseTrack(trackData: any): LastfmTrack | null {
  if (!trackData) return null

  const isPlaying = trackData['@attr']?.nowplaying === 'true'
  const artist = trackData.artist?.['#text'] || trackData.artist || 'Unknown Artist'
  const name = trackData.name || 'Unknown Track'

  return {
    name,
    artist,
    album: trackData.album?.['#text'] || '',
    url: trackData.url || '#',
    coverUrl: getBestImage(trackData.image) || getDefaultImage(artist + name),
    isPlaying,
    timestamp: trackData.date?.uts ? parseInt(trackData.date.uts) : undefined,
  }
}

/**
 * Fetch current/recent track from Last.fm API
 */
export async function fetchLastfmTrack(
  apiKey: string,
  username: string,
): Promise<LastfmTrack | null> {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`
  console.log(url, 'url')
  try {
    const response = await fetch(url)
    const data: LastfmResponse = await response.json()
    if (data.error) {
      throw new Error(data.message || `Last.fm API Error: ${data.error}`)
    }

    if (!data.recenttracks?.track) {
      return null
    }

    const trackData = Array.isArray(data.recenttracks.track)
      ? data.recenttracks.track[0]
      : data.recenttracks.track

    return parseTrack(trackData)
  } catch (error) {
    console.error('Last.fm API Error:', error)
    throw error
  }
}

/**
 * Format time ago string
 */
export function formatTimeAgo(timestamp: number): string | null {
  const now = Date.now() / 1000
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return null // Don't show very old tracks
}
