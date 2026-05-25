const $ = (sel) => document.querySelector(sel);

const elements = {
  notYoutube: $('#not-youtube'),
  loading: $('#loading'),
  loadingText: $('#loading-text'),
  error: $('#error'),
  errorText: $('#error-text'),
  retryBtn: $('#retry-btn'),
  result: $('#result'),
  videoTitle: $('#video-title'),
  summarizeBtn: $('#summarize-btn'),
  copyBtn: $('#copy-btn'),
  summaryContent: $('#summary-content'),
  oneLiner: $('#one-liner'),
  keyPoints: $('#key-points'),
  takeaway: $('#takeaway'),
  noTranscript: $('#no-transcript'),
  settingsLink: $('#settings-link'),
};

function showOnly(el) {
  [elements.notYoutube, elements.loading, elements.error, elements.result].forEach(e => e.classList.add('hidden'));
  el.classList.remove('hidden');
}

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function isYouTubeWatch(url) {
  try {
    const u = new URL(url);
    return u.hostname.includes('youtube.com') && u.searchParams.has('v');
  } catch {
    return false;
  }
}

function setLoading(text) {
  elements.loadingText.textContent = text;
  showOnly(elements.loading);
}

function showError(msg) {
  elements.errorText.textContent = msg;
  showOnly(elements.error);
}

async function summarize() {
  setLoading('Getting transcript...');

  const tab = await getCurrentTab();

  let transcriptData;
  try {
    transcriptData = await chrome.tabs.sendMessage(tab.id, { action: 'getTranscript' });
  } catch {
    showError('Cannot access this page. Try refreshing YouTube.');
    return;
  }

  if (transcriptData.error) {
    if (transcriptData.error.includes('No transcript')) {
      showOnly(elements.result);
      elements.noTranscript.classList.remove('hidden');
    } else {
      showError(transcriptData.error);
    }
    return;
  }

  elements.videoTitle.textContent = transcriptData.title;

  setLoading('Summarizing with AI...');

  try {
    const result = await chrome.runtime.sendMessage({
      action: 'summarize',
      transcript: transcriptData.transcript,
    });

    if (result.error) {
      showError(result.error);
      return;
    }

    elements.oneLiner.textContent = result.oneLiner || 'Summary generated successfully.';

    elements.keyPoints.innerHTML = '';
    if (result.keyPoints && result.keyPoints.length > 0) {
      result.keyPoints.forEach(point => {
        const li = document.createElement('li');
        li.textContent = point;
        elements.keyPoints.appendChild(li);
      });
    } else {
      elements.keyPoints.innerHTML = '<li>No key points extracted.</li>';
    }

    elements.takeaway.textContent = result.takeaway || '';

    showOnly(elements.result);
    elements.summaryContent.classList.remove('hidden');
    elements.noTranscript.classList.add('hidden');
    elements.summarizeBtn.textContent = '✨ Re-summarize';
  } catch (err) {
    showError(err.message);
  }
}

async function init() {
  const tab = await getCurrentTab();

  if (!tab.url || !isYouTubeWatch(tab.url)) {
    showOnly(elements.notYoutube);
    return;
  }

  showOnly(elements.result);
  elements.summaryContent.classList.add('hidden');
  elements.noTranscript.classList.add('hidden');
  elements.summarizeBtn.textContent = '✨ Summarize';
  elements.summarizeBtn.addEventListener('click', summarize);
  elements.retryBtn.addEventListener('click', summarize);
  elements.settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  elements.copyBtn.addEventListener('click', async () => {
    const text = [
      elements.oneLiner.textContent,
      '',
      ...Array.from(elements.keyPoints.children).map(li => `• ${li.textContent}`),
      '',
      elements.takeaway.textContent,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      elements.copyBtn.textContent = '✅';
      setTimeout(() => { elements.copyBtn.textContent = '📋'; }, 2000);
    } catch {
      elements.copyBtn.textContent = '❌';
      setTimeout(() => { elements.copyBtn.textContent = '📋'; }, 2000);
    }
  });
}

init();
