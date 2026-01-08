const { OpenAI } = require('openai');

module.exports = async (req, res) => {
    // РАЗРЕШАЕМ ВСЁ (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const openai = new OpenAI({ 
        apiKey: process.env.API_KEY, 
        baseURL: "https://api.groq.com/openai/v1" 
    });

    if (req.method === 'POST') {
        try {
            const { prompt } = req.body;
            const completion = await openai.chat.completions.create({
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: prompt }],
            });
            return res.status(200).json({ answer: completion.choices[0].message.content });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    res.status(200).send("Используйте POST запрос");
};
