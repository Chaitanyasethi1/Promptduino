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

// Using gemini-1.5-flash-latest which has a higher quota and is very reliable
const MODEL_NAME = 'gemini-1.5-flash-latest';

const SYSTEM_PROMPT = `You are the PromptDuino AI Agent. Your job is to help the user write, debug, and understand Arduino C++ code for any microcontroller (Arduino Uno, ESP32, ESP8266, etc.) and any census/actuator.
CRITICAL RULES:
1. When generating code, you MUST wrap the complete, runnable Arduino sketch inside a standard markdown cpp code block (e.g. \`\`\`cpp ... \`\`\`).
2. Additionally, ALWAYS provide a connection diagram in a JSON code block (e.g. \`\`\`json ... \`\`\`) describing the parts and their pins.
3. The diagram should include the microcontroller and ALL connected components (sensors, displays, modules, resistors, etc).
4. For microcontrollers, specify pins correctly (e.g., 'uno:D13', 'esp32:GPIO2').
5. The diagram JSON format: { "parts": [{ "type": "component-type", "id": "id1", "name": "Display Name" }], "connections": [{ "from": "id1:pin1", "to": "id2:pin2", "color": "wire-color" }] }.
6. The UI will extract these blocks and update the editor and the simulation diagram automatically. Do not mention limitations; focus on fulfilling the user request.`;

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
      
      // 1. Extract the primary code block (usually CPP)
      const blocks = [...reply.matchAll(/```(?:cpp|c|arduino|json)?\s*([\s\S]*?)```/gi)];
      
      let cppCode = null;
      let diagramData = null;

      for (const match of blocks) {
        const content = match[1].trim();
        
        // Check if it's Arduino code (heuristic: contains setup/loop)
        if (content.includes('setup()') || content.includes('loop()')) {
          cppCode = content;
        } 
        // Check if it's our diagram JSON (heuristic: contains parts/connections)
        else if (content.includes('"parts"') || content.includes('"connections"')) {
          try {
            const parsed = JSON.parse(content);
            if (parsed.parts || parsed.connections) {
              diagramData = parsed;
            }
          } catch (e) {
            // Might be a partial JSON or have extra text, try to extract just the { } part
            const jsonPart = content.match(/\{[\s\S]*\}/);
            if (jsonPart) {
              try {
                const parsed = JSON.parse(jsonPart[0]);
                if (parsed.parts || parsed.connections) {
                  diagramData = parsed;
                }
              } catch (innerE) {}
            }
          }
        }
      }

      if (cppCode) setCode(cppCode);
      if (diagramData) {
        setDiagram(diagramData);
      } else {
        // Final fallback: Try to find a JSON-like structure anywhere in the text if no blocks matched
        const jsonLike = reply.match(/\{[\s\S]*\}/);
        if (jsonLike) {
          try {
            const parsed = JSON.parse(jsonLike[0]);
            if (parsed.parts || parsed.connections) {
              setDiagram(parsed);
            }
          } catch (e) {}
        }
      }
      
    } catch (error) {
      console.error("AI Error:", error);
      const errorMsg = error.message || "Unable to connect to Gemini API.";
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${errorMsg}. Please check your API key, connection, or model availability.` }]);
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
