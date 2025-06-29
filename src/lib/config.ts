/**
 * Last.fm configuration with environment variables support
 */

// Environment variables (set in .env file)
export const LASTFM_CONFIG = {
  apiKey: import.meta.env.PUBLIC_LASTFM_API_KEY,
  username: import.meta.env.PUBLIC_LASTFM_USERNAME,
  updateInterval: parseInt(import.meta.env.PUBLIC_LASTFM_UPDATE_INTERVAL) || 30000,
  showWaves: import.meta.env.PUBLIC_LASTFM_SHOW_WAVES !== 'false',
} as const

/**
 * Get configuration with fallbacks
 */
export function getConfig(overrides: Partial<typeof LASTFM_CONFIG> = {}) {
  return {
    ...LASTFM_CONFIG,
    ...overrides,
  }
}
