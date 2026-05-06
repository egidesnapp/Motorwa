'use client';

import { useState, useEffect } from 'react';
import { Search, Send, Phone, Flag } from 'lucide-react';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch('/api/v1/conversations');
        const data = await res.json();
        if (data.success) setConversations(data.data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      const res = await fetch(`/api/v1/conversations/${selectedConversation}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-[calc(100vh-10rem)] flex overflow-hidden">
      {/* Conversation List */}
      <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search messages..." className="input w-full pl-10" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 border-b border-gray-50 animate-pulse flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No messages yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition-colors text-left ${
                  selectedConversation === conv.id ? 'bg-gold-pale' : ''
                }`}
              >
                <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {conv.otherUser?.fullName?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm truncate">{conv.otherUser?.fullName}</span>
                    <span className="text-xs text-gray-400">{conv.lastMessageAt}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content || 'Start a conversation'}</p>
                  <p className="text-xs text-gray-400 truncate">{conv.listing?.title}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        {selectedConversation ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedConversation(null)} className="md:hidden p-1">
                  ←
                </button>
                <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white text-sm font-bold">
                  J
                </div>
                <div>
                  <div className="font-medium text-sm">Jean Pierre</div>
                  <div className="text-xs text-gray-500">Re: 2020 Toyota Camry</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Phone size={18} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Flag size={18} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
                  <p className="text-sm">Hello, is this car still available?</p>
                  <span className="text-xs text-gray-400 mt-1">10:30 AM</span>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-navy text-white rounded-lg px-4 py-2 max-w-xs">
                  <p className="text-sm">Yes, it is still available. Would you like to schedule a viewing?</p>
                  <span className="text-xs text-white/60 mt-1">10:32 AM ✓✓</span>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="input flex-1"
              />
              <button onClick={sendMessage} className="btn-primary px-4">
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm mt-1">Choose from your existing conversations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
