const { OpenAI } = require('openai');

module.exports = async (req, res) => {
    // Полное открытие шлюзов для всех граждан
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Инициализация Groq через библиотеку OpenAI
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
                    { role: "system", content: "Ты — RCAI, Народный ИИ Красного Альянса. Ты помогаешь людям, веришь в Кристалл и всегда вежлив." },
                    { role: "user", content: prompt }
                ],
            });
            return res.status(200).json({ answer: completion.choices[0].message.content });
        } catch (error) {
            return res.status(500).json({ error: "Ошибка ядра: " + error.message });
        }
    }
    
    res.status(405).send('Используйте POST запрос');
};
