import { useMemo, useState } from 'react';
import { sendChatMessage } from '../services/api';

const ChatBot = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi! I am StockSense AI. Ask me about your portfolio, stocks, or how to use the app.'
        }
    ]);

    const chatHistory = useMemo(
        () => messages.filter((m) => m.role === 'user' || m.role === 'assistant').slice(0, -1),
        [messages]
    );

    const handleSend = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMessage = { role: 'user', content: text };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await sendChatMessage(text, chatHistory);
            setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }]);
        } catch (err) {
            const message = err.response?.data?.message || 'Chat service unavailable.';
            setMessages((prev) => [...prev, { role: 'assistant', content: `Sorry, ${message}` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {open && (
                <div className="mb-3 h-[420px] w-[340px] rounded-2xl border border-gray-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                        <h3 className="text-sm font-semibold text-gray-900">StockSense Assistant</h3>
                        <button
                            onClick={() => setOpen(false)}
                            className="rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                        >
                            Close
                        </button>
                    </div>

                    <div className="h-[300px] overflow-y-auto px-3 py-3 space-y-2">
                        {messages.map((m, idx) => (
                            <div
                                key={`${m.role}-${idx}`}
                                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.role === 'user'
                                        ? 'ml-auto bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                {m.content}
                            </div>
                        ))}
                        {loading && (
                            <div className="inline-block rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-500">
                                Thinking...
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 p-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSend();
                                }}
                                placeholder="Ask about stocks..."
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading}
                                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => setOpen((v) => !v)}
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700"
            >
                {open ? 'Hide Chat' : 'AI Chat'}
            </button>
        </div>
    );
};

export default ChatBot;
