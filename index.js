const { OpenAI } = require('openai');

module.exports = async (req, res) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  if (req.method === 'POST') {
    const { prompt } = req.body;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
      });
      res.status(200).json({ answer: completion.choices[0].message.content });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).send('Метод не разрешен');
  }
};
