exports.chatMessage = async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message || !String(message).trim()) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
        const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

        if (!apiKey) {
            return res.status(500).json({
                message: 'OPENAI_API_KEY is not configured in backend .env'
            });
        }

        const normalizedHistory = Array.isArray(history)
            ? history
                .filter(item => item && typeof item.content === 'string' && ['user', 'assistant'].includes(item.role))
                .slice(-12)
            : [];

        const messages = [
            {
                role: 'system',
                content: 'You are StockSense AI assistant. Help users with stocks, portfolio tracking, risk basics, and app guidance. Keep responses concise, practical, and easy to understand.'
            },
            ...normalizedHistory,
            { role: 'user', content: String(message).trim() }
        ];

        const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                messages,
                temperature: 0.4
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(502).json({
                message: 'Chat provider request failed',
                details: errorText
            });
        }

        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content;

        if (!reply) {
            return res.status(502).json({ message: 'No response content from chat provider' });
        }

        return res.json({ reply });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to process chat message', error: err.message });
    }
};
