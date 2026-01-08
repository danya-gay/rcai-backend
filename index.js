const { OpenAI } = require('openai');

module.exports = async (req, res) => {
  // 1. ЖЕСТКИЕ НАСТРОЙКИ CORS (РАЗРЕШАЕМ ВСЁ)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешить всем, включая GitHub Pages
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 2. ОБРАБОТКА ПРЕДВАРИТЕЛЬНОГО ЗАПРОСА (PREFLIGHT)
  // Именно на этом этапе у вас сейчас происходит сбой
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. ЛОГИКА ИИ
  const openai = new OpenAI({ 
    apiKey: process.env.API_KEY, 
    baseURL: "https://api.groq.com/openai/v1" 
  });

  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;
      const completion = await openai.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
            { role: "system", content: "Ты — RCAI, Народный ИИ Альянса. Отвечай мудро и патриотично." },
            { role: "user", content: prompt }
        ],
      });
      res.status(200).json({ answer: completion.choices[0].message.content });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(200).send("Сервер RCAI готов к работе. Жду POST запрос.");
  }
};
