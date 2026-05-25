const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

async function loadSettings() {
  const data = await chrome.storage.sync.get(['provider', 'apiKey', 'language', 'style']);

  const provider = data.provider || 'gemini';
  $(`input[name="provider"][value="${provider}"]`).checked = true;

  $('#api-key').value = data.apiKey || '';
  $('#language').value = data.language || 'en';
  $('#style').value = data.style || 'detailed';
}

async function saveSettings() {
  const settings = {
    provider: document.querySelector('input[name="provider"]:checked').value,
    apiKey: $('#api-key').value.trim(),
    language: $('#language').value,
    style: $('#style').value,
  };

  if (!settings.apiKey) {
    showStatus('Please enter an API key', 'error');
    return;
  }

  await chrome.storage.sync.set(settings);
  showStatus('Settings saved successfully!', 'success');
}

function showStatus(msg, type) {
  const el = $('#save-status');
  el.textContent = msg;
  el.className = `save-status ${type}`;
  el.classList.remove('hidden');

  setTimeout(() => el.classList.add('hidden'), 3000);
}

async function testApiKey() {
  const btn = $('#test-btn');
  const originalText = btn.textContent;
  btn.textContent = 'Testing...';
  btn.disabled = true;

  try {
    const result = await chrome.runtime.sendMessage({ action: 'testApiKey' });

    if (result.success) {
      showStatus('API key works!', 'success');
    } else {
      showStatus(`Test failed: ${result.error}`, 'error');
    }
  } catch (err) {
    showStatus(`Error: ${err.message}`, 'error');
  }

  btn.textContent = originalText;
  btn.disabled = false;
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();

  $('#save-btn').addEventListener('click', saveSettings);
  $('#test-btn').addEventListener('click', testApiKey);
});
