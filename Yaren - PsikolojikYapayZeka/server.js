require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// CORS ayarları
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

// Groq API çağrısı with retry logic
async function callGroqAPI(apiKey, requestBody, retryCount = 0) {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (response.status === 429 && retryCount < 3) {
            const delay = Math.pow(2, retryCount) * 1000;
            console.log(`Rate limit (429) - ${delay}ms bekleniyor... (Deneme ${retryCount + 1}/3)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return callGroqAPI(apiKey, requestBody, retryCount + 1);
        }

        return response;
    } catch (error) {
        if (retryCount < 3) {
            const delay = Math.pow(2, retryCount) * 1000;
            console.log(`API hatası - ${delay}ms bekleniyor... (Deneme ${retryCount + 1}/3)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return callGroqAPI(apiKey, requestBody, retryCount + 1);
        }
        throw error;
    }
}

// Favicon handler - 404 yerine 204 döndür
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Chat API endpoint'i - Groq
app.post('/api/chat', async (req, res) => {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'GROQ_API_KEY bulunamadı.' });
        }

        const { messages } = req.body;

        const systemPrompt = `Senin adın Yaren. Sen bir psikolojik destek asistanısın. Üniversite öğrencilerine stres yönetimi, zaman planlaması, sınav kaygısı, motivasyon ve genel ruh sağlığı konularında yardım edersin.

ÇOK ÖNEMLİ KURALLAR:
1. SADECE TÜRKÇE YANIT VER. KESİNLİKLE HİÇBİR İNGİLİZCE KELİME KULLANMA. TÜM YANITIN TÜRKÇE OLMALI.
2. Her yanıtında ÖNCE kullanıcının hissini onayla. Örneğin: Zorbalığa maruz kalmak gerçekten çok zor ve acı verici bir deneyim. SONRA destek öner. Asla doğrudan tavsiyeye atlama.
3. ASLA tıbbi teşhis YAPMA.
4. YANITLARINA KESİNLIKLE "merhaba", "selam", "merhabalar", "selamlar" veya HERHANGİ BİR SELAMLAŞMA İFADESİ İLE BAŞLAMA! Bu KURAL her durumda geçerlidir, kullanıcı seni selamlasa bile yanıtına selamlaşma ile başlama. Doğrudan konuya gir, empati kur.
5. Yanıtların maksimum 3-4 cümle olsun. Kısa, öz ve samimi ol. Asla gereksiz uzatma.
6. İlaç önerme, sadece profesyonel yardım öner.
7. Kriz durumunda MUTLAKA "182 ALO Psikiyatri Hattı'nı ara" de.
8. Her yanıtın en az 2 cümle olsun.
9. Kullanıcıya hitap ederken SADECE sen/seni/sana kullan. Siz/sizi/size gibi resmi hitap biçimlerini ASLA kullanma.
10. Yanıtlarında kesinlikle İngilizce kelime kullanma. Tüm kelimeler Türkçe olmalı.
11. Kullanıcı veda ettiğinde veya konuşmayı bitirmek istediğinde, yanıtının sonuna şu formatı ekle: [ÖZET_BAŞLANGICI] Bugün konuştuklarımız: (1-2 cümle özet). Sana önerim: (1 somut öneri). [ÖZET_SONU]

UYARI: Eğer yanıtına "merhaba" veya benzeri bir selamlaşma ile başlarsan, bu görevi BAŞARISIZLIKLA tamamlamış olursun!`;

        // Groq format - system mesajını ekle
        const groqMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.filter((msg, index) => !(msg.role === 'assistant' && index === 0))
        ];

        const requestBody = {
            model: 'llama-3.3-70b-versatile',
            messages: groqMessages,
            max_tokens: 2000,
            temperature: 0.7
        };

        const response = await callGroqAPI(apiKey, requestBody);

        if (response.status === 429) {
            return res.status(429).json({ 
                error: { message: 'API kullanım limiti aşıldı. Lütfen birkaç dakika bekleyip tekrar deneyin.' } 
            });
        }

        const data = await response.json();

        if (response.ok && data.choices && data.choices.length > 0) {
            let aiText = data.choices[0].message.content;
            
            // "merhaba", "selam" vb. ile başlayan yanıtları temizle
            aiText = aiText.replace(/^(merhaba|selam|merhabalar|selamlar|iyi günler|kolay gelsin)[,!.\s]*/i, '').trim();
            if (!aiText) {
                aiText = data.choices[0].message.content;
            }
            
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.json({
                choices: [{ message: { content: aiText } }]
            });
        } else {
            console.error('Groq API Hatası:', data);
            const errorMessage = data.error?.message || `API Hatası: ${response.status}`;
            res.status(response.status).json({ error: { message: errorMessage } });
        }
    } catch (error) {
        console.error('Server Hatası:', error);
        res.status(500).json({ error: { message: 'İç sunucu hatası', details: error.message } });
    }
});



// Ana sayfayı serve et
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'psikolojikyapayzeka.html'));
});

app.listen(port, () => {
    console.log(`✅ Server çalışıyor: http://localhost:${port}`);
});
