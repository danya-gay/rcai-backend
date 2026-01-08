const { OpenAI } = require('openai');

module.exports = async (req, res) => {
  // CORS настройки для доступа с любого устройства
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const openai = new OpenAI({ 
    apiKey: process.env.API_KEY, 
    baseURL: "https://api.groq.com/openai/v1" 
  });

  if (req.method === 'POST') {
    const { prompt } = req.body;
    try {
      const completion = await openai.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
            { 
              role: "system", 
              content: "Ты — RCAI, Народный ИИ Красного Альянса. Твоя цель — помогать гражданам, отвечать на вопросы и укреплять веру в Кристалл. Ты вежлив, мудр и патриотичен. Ты не личный ассистент, а общественное достояние." 
            },
            { role: "user", content: prompt }
        ],
      });
      res.status(200).json({ answer: completion.choices[0].message.content });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).send('Метод не разрешен');
  }
};
