import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useStore } from '../store';

let ai = null;
try {
  if (import.meta.env.VITE_GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  }
} catch (e) {
  console.error("Gemini API missing or failed to initialize", e);
}

// Using gemini-2.5-flash which is extremely fast for coding tasks
const MODEL_NAME = 'gemini-2.5-flash';

const SYSTEM_PROMPT = `You are the PromptDuino AI Agent. Your job is to help the user write, debug, and understand Arduino C++ code. Provide clear and concise explanations. 
CRITICAL RULES:
1. When generating code, you MUST wrap the complete, runnable Arduino sketch inside a standard markdown cpp code block (e.g. \`\`\`cpp ... \`\`\`).
2. Additionally, ALWAYS provide a connection diagram in a JSON code block (e.g. \`\`\`json ... \`\`\`) describing the parts and their pins.
3. The diagram JSON should follow this structure: { "parts": [{ "type": "arduino-uno", "id": "uno", "name": "Arduino Uno" }, { "type": "led", "id": "led1", "name": "Red LED" }], "connections": [{ "from": "uno:13", "to": "led1:anode" }, { "from": "uno:GND", "to": "led1:cathode" }] }.
4. The UI will extract these blocks and update the editor and the simulation diagram.`;

export default function AgentChat() {
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hello! I am the PromptDuino agent. Describe what you'd like your Arduino to do, and I'll generate the code." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const setCode = useStore(state => state.setCode);
  const setDiagram = useStore(state => state.setDiagram);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const currentCode = useStore.getState().code;
      const chatHistory = messages.map(msg => `**[${msg.role}]**: ${msg.text}`).join('\n');
      
      const prompt = `${SYSTEM_PROMPT}\n\n[Current Editor Code]:\n\`\`\`cpp\n${currentCode}\n\`\`\`\n\nChat History:\n${chatHistory}\n\n**[user]**: ${userMessage}\n**[model]**:`;

      if (!ai) {
        setMessages(prev => [...prev, { role: 'model', text: "Error: AI not initialized. Please ensure VITE_GEMINI_API_KEY is configured in Vercel Environment Variables or your local .env.local file." }]);
        setIsLoading(false);
        return;
      }
      
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });

      const reply = response.text || "Sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
      
      // Automatically extract markdown code block and inject into the CodeEditor
      const codeMatch = reply.match(/```(?:cpp|c|arduino)?\n([\s\S]*?)```/);
      if (codeMatch && codeMatch[1]) {
        setCode(codeMatch[1].trim());
      }
      
      // Automatically extract diagram.json block
      const jsonMatch = reply.match(/```(?:json)?\n([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          const data = JSON.parse(jsonMatch[1].trim());
          if (data.parts || data.connections) {
            setDiagram(data);
          }
        } catch (e) {
          console.error("Failed to parse diagram JSON", e);
        }
      }
      
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Error: Unable to connect to Gemini API. Please check your API key and connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#EFECE1]">
      <div className="flex items-center justify-between px-5 py-3 bg-[#EFECE1]">
        <div className="flex items-center text-xs font-semibold tracking-wide text-[#7A7870] uppercase">
          <Sparkles size={14} className="mr-2 text-[#798866]" />
          Agent
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="bg-[#798866] rounded-full p-2 mr-3 shrink-0 shadow-sm mt-1">
                <Bot size={15} className="text-[#F5F3EC]" />
              </div>
            )}
            
            <div className={`
              px-4 py-3 rounded-2xl text-[13.5px] shadow-sm leading-relaxed max-w-[85%] whitespace-pre-wrap
              ${msg.role === 'model' 
                ? 'bg-[#F5F3EC] border border-[#E0DCD1] text-[#3A3A3A] rounded-tl-sm' 
                : 'bg-[#E0DCD1] text-[#3A3A3A] rounded-tr-sm'
              }
            `}>
              {msg.text}
            </div>

            {msg.role === 'user' && (
              <div className="bg-[#F5F3EC] border border-[#E0DCD1] rounded-full p-2 ml-3 shrink-0 shadow-sm mt-1">
                <User size={15} className="text-[#7A7870]" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-[#798866] rounded-full p-2 mr-3 shrink-0 shadow-sm mt-1">
              <Bot size={15} className="text-[#F5F3EC]" />
            </div>
            <div className="bg-[#F5F3EC] border border-[#E0DCD1] px-4 py-3 rounded-2xl rounded-tl-sm text-[13.5px] text-[#A3B0A3] shadow-sm flex items-center">
              <Loader2 size={16} className="animate-spin mr-2" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-[#EFECE1]">
        <div className="relative flex items-center shadow-sm rounded-xl bg-[#F5F3EC] border border-[#E0DCD1] focus-within:border-[#A3B0A3] focus-within:ring-2 focus-within:ring-[#A3B0A3]/20 transition-all">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-[13.5px] text-[#3A3A3A] outline-none py-3 pl-4 pr-11 placeholder-[#A3B0A3]"
            placeholder="Type your prompt for Arduino..."
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 p-1.5 text-[#6392A8] hover:bg-[#EFECE1] disabled:opacity-50 disabled:hover:bg-transparent rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
