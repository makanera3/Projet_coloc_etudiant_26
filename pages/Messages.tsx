
import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../services/storage';
import { Message } from '../types';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';

export const Messages: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fix: Updated useEffect to await storage.getMessages()
    useEffect(() => {
        const fetchMessages = async () => {
            const data = await storage.getMessages();
            setMessages(data);
        };
        fetchMessages();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Fix: Made handleSend async to await storage calls
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !user) return;

        await storage.addMessage({
            sender: user.username,
            content: inputText
        });
        const data = await storage.getMessages();
        setMessages(data);
        setInputText('');
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-extrabold text-slate-900">Messagerie</h1>
            </div>
            
            <div className="flex-1 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden relative">
                {/* Chat Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/crossword.png')] pointer-events-none"></div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 relative z-10">
                    <div className="text-center text-xs text-slate-400 font-medium my-4">
                        <span className="bg-slate-100 px-3 py-1 rounded-full">Aujourd'hui</span>
                    </div>

                    {messages.map((msg) => {
                        const isMe = msg.sender === user?.username;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                                <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`px-5 py-3 shadow-sm text-sm leading-relaxed ${
                                        isMe 
                                        ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-2xl rounded-br-sm' 
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-bl-sm'
                                    }`}>
                                        <p>{msg.content}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 px-1">
                                        {!isMe && <span className="text-xs font-bold text-slate-500">{msg.sender}</span>}
                                        <span className="text-[10px] text-slate-400">
                                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-slate-100 relative z-20">
                    <form onSubmit={handleSend} className="flex gap-3 items-end">
                        <button type="button" className="p-3 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                        </button>
                        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-violet-100 focus-within:border-violet-400 transition-all">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Écrivez votre message..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400"
                            />
                        </div>
                        <Button type="submit" className="rounded-xl px-4 py-3 shadow-violet-500/20">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};
