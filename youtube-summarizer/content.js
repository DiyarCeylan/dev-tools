const TRANSCRIPT_API = 'https://youtubetranscript.com/api';

function getVideoId() {
  const url = new URL(window.location.href);
  return url.searchParams.get('v');
}

function getVideoTitle() {
  const el = document.querySelector('h1 yt-formatted-string');
  return el ? el.textContent.trim() : 'Unknown Title';
}

async function fetchTranscript(videoId) {
  const url = `${TRANSCRIPT_API}?vid=${videoId}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.error || !Array.isArray(data)) {
    throw new Error(data.error || 'No transcript available');
  }

  return data
    .map(seg => seg.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTranscript') {
    const videoId = getVideoId();
    if (!videoId) {
      sendResponse({ error: 'No video ID found' });
      return;
    }

    fetchTranscript(videoId)
      .then(transcript => sendResponse({ transcript, videoId, title: getVideoTitle() }))
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }
});
