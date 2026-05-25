const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

async function getSettings() {
  const data = await chrome.storage.sync.get(['provider', 'apiKey', 'language', 'style']);
  return {
    provider: data.provider || 'gemini',
    apiKey: data.apiKey || '',
    language: data.language || 'en',
    style: data.style || 'detailed',
  };
}

function buildPrompt(transcript, language, style) {
  const langMap = {
    en: 'English',
    tr: 'Turkish',
    de: 'German',
    fr: 'French',
    es: 'Spanish',
    ar: 'Arabic',
  };

  const styleInstructions = {
    detailed: `Provide:
1. A one-sentence summary
2. Key points (bullet points, 3-5 items)
3. Main takeaway`,
    concise: `Provide:
1. Key points only (bullet points, 3-5 items)
Keep it very brief.`,
    tldr: `Provide only a single TL;DR sentence. Keep it under 40 words.`,
  };

  return `You are a YouTube video summarizer. Summarize the following transcript in ${langMap[language] || 'English'}.

${styleInstructions[style] || styleInstructions.detailed}

Transcript:
${transcript}`;
}

async function callGemini(prompt, apiKey) {
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Gemini API error');
  return data.candidates[0].content.parts[0].text;
}

async function callOpenAI(prompt, apiKey) {
  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1024,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'OpenAI API error');
  return data.choices[0].message.content;
}

function parseSummary(text, style) {
  if (style === 'tldr') {
    return { oneLiner: text, keyPoints: [], takeaway: '' };
  }

  const parts = { oneLiner: '', keyPoints: [], takeaway: '' };
  let currentSection = '';

  const lines = text.split('\n').filter(l => l.trim());

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^1[\.\)]\s|one[-\s]sentence|summary/i.test(trimmed) && trimmed.length < 80) {
      currentSection = 'oneLiner';
      const content = trimmed.replace(/^1[\.\)]\s*/, '').replace(/^one[-\s]sentence[:\s]*/i, '').trim();
      if (content && content.length > 10) parts.oneLiner = content.replace(/^"|"$/g, '');
      continue;
    }

    if (/^2[\.\)]\s|key[-\s]points|bullets/i.test(trimmed) && trimmed.length < 80) {
      currentSection = 'keyPoints';
      continue;
    }

    if (/^3[\.\)]\s|main[-\s]takeaway|takeaway/i.test(trimmed) && trimmed.length < 80) {
      currentSection = 'takeaway';
      const content = trimmed.replace(/^3[\.\)]\s*/, '').replace(/^main[-\s]takeaway[:\s]*/i, '').trim();
      if (content && content.length > 5) parts.takeaway = content;
      continue;
    }

    if (currentSection === 'oneLiner' && !parts.oneLiner) {
      parts.oneLiner = trimmed.replace(/^"|"$/g, '');
      continue;
    }

    if (currentSection === 'keyPoints') {
      const clean = trimmed.replace(/^[-•*]\s*/, '').replace(/^\d+[\.\)]\s*/, '').trim();
      if (clean && clean.length > 5) parts.keyPoints.push(clean);
      continue;
    }

    if (currentSection === 'takeaway') {
      parts.takeaway = trimmed;
      currentSection = '';
    }
  }

  if (!parts.oneLiner && parts.keyPoints.length > 0) {
    parts.oneLiner = parts.keyPoints[0];
    parts.keyPoints = parts.keyPoints.slice(1);
  }

  if (parts.keyPoints.length === 0 && parts.oneLiner && parts.oneLiner.length > 100) {
    parts.keyPoints = parts.oneLiner.split(/(?<=\.)\s+/).filter(s => s.trim().length > 20).slice(0, 5);
    parts.oneLiner = '';
  }

  return parts;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    (async () => {
      const settings = await getSettings();

      if (!settings.apiKey) {
        sendResponse({ error: 'Please configure your API key in Settings' });
        return;
      }

      if (!request.transcript || request.transcript.length < 50) {
        sendResponse({ error: 'Transcript too short to summarize' });
        return;
      }

      const prompt = buildPrompt(request.transcript.slice(0, 25000), settings.language, settings.style);

      try {
        let result;
        if (settings.provider === 'openai') {
          result = await callOpenAI(prompt, settings.apiKey);
        } else {
          result = await callGemini(prompt, settings.apiKey);
        }

        const parsed = parseSummary(result, settings.style);
        sendResponse({ success: true, ...parsed });
      } catch (err) {
        sendResponse({ error: err.message });
      }
    })();
    return true;
  }

  if (request.action === 'testApiKey') {
    (async () => {
      const settings = await getSettings();
      if (!settings.apiKey) {
        sendResponse({ success: false, error: 'No API key configured' });
        return;
      }

      try {
        if (settings.provider === 'openai') {
          await callOpenAI('Say "ok" in one word.', settings.apiKey);
        } else {
          await callGemini('Say "ok" in one word.', settings.apiKey);
        }
        sendResponse({ success: true });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }
});
