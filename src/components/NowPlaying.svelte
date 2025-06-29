<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { fetchLastfmTrack, type NowPlaying } from '../lib/lastfm'
  import { getConfig } from '../lib/config'

  let nowPlaying: NowPlaying | undefined = undefined
  let updateTimer: number

  const config = getConfig()

  async function updateNowPlaying() {
    try {
      const track = await fetchLastfmTrack(config.apiKey, config.username)

      nowPlaying = track
        ? {
            state: { isPlaying: track.isPlaying },
            track: {
              name: track.name,
              artist: track.artist,
              album: track.album,
              url: track.url,
              coverUrl: track.coverUrl,
            },
          }
        : { state: { isPlaying: false } }
    } catch (error) {
      console.error('Failed to fetch Last.fm track:', error)
      nowPlaying = { state: { isPlaying: false } }
    }

    clearTimeout(updateTimer)
    updateTimer = window.setTimeout(updateNowPlaying, config.updateInterval)
  }

  function onVisibilityChange() {
    if (document.hidden) {
      clearTimeout(updateTimer)
    } else {
      updateNowPlaying()
    }
  }

  onMount(() => {
    updateNowPlaying()
    document.addEventListener('visibilitychange', onVisibilityChange)
  })

  onDestroy(() => {
    clearTimeout(updateTimer)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })
</script>

{#if nowPlaying === undefined}
  <div class="h-5 w-5 opacity-0 transition-opacity duration-200 sm:h-6 sm:w-6" />
{:else if nowPlaying.state.isPlaying && nowPlaying.track}
  <div class="opacity-100 transition-opacity duration-500">
    <a
      href={nowPlaying.track.url}
      class="track-link flex items-center"
      title={`${nowPlaying.track.name} – ${nowPlaying.track.artist}`}
      rel="nofollow"
    >
      <figure
        class="mr-2 h-5 w-5 flex-shrink-0 overflow-hidden rounded-sm bg-slate-200 shadow transition-transform duration-300 dark:bg-slate-600 sm:mr-3 sm:h-6 sm:w-6"
      >
        <img
          src={nowPlaying.track.coverUrl}
          height={64}
          width={64}
          alt={`${nowPlaying.track.name} – ${nowPlaying.track.artist}`}
          loading="lazy"
          decoding="async"
        />
      </figure>
      <span
        class="inline-block max-w-xs truncate font-medium text-slate-800 dark:text-slate-200"
      >
        {nowPlaying.track.name}
      </span>
      <span class="mx-2 inline-block">–</span>
      <span class="inline-block max-w-max truncate text-slate-500 dark:text-slate-300">
        {nowPlaying.track.artist}
      </span>
    </a>
  </div>
{:else}
  <div class="flex items-center opacity-60 transition-opacity duration-200">
    <img
      src="https://cdn.brandfetch.io/id_yBTuraI/theme/light/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B"
      alt="not-playing"
      class="mr-2 h-5 w-5 flex-shrink-0 opacity-90 sm:mr-3 sm:h-6 sm:w-6"
    />
    <span class="text-slate-700 dark:text-slate-500">Not Playing</span>
  </div>
{/if}

<style>
  .track-link {
    text-decoration: none;
  }
</style>
