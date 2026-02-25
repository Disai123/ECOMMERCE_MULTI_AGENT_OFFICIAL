import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Loader2 } from 'lucide-react';
import api from '../api';

const AIWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I am your AI shopping assistant. I can find products and even checkout for you. How can I help today?' }
    ]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMsg = { role: 'user', content: query };
        setMessages(prev => [...prev, userMsg]);
        setQuery('');
        setLoading(true);

        try {
            const res = await api.post('/chat', { content: query });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
                >
                    <MessageSquare className="w-6 h-6" />
                </button>
            ) : (
                <div className="w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px]">
                    <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bot className="w-6 h-6" />
                            <div>
                                <h3 className="font-bold">AI Assistant</h3>
                                <p className="text-[10px] opacity-80 font-medium">Powered by LangGraph & MCP</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                                    <span className="text-xs text-slate-500 italic">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2 bg-slate-50">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 text-sm bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                        <button type="submit" disabled={loading} className="p-2.5 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors shadow-sm">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AIWidget;
