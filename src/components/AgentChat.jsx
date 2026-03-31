import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles, Loader2, RotateCcw } from 'lucide-react';
import { useStore } from '../store.js';

// Using OpenRouter's more stable Qwen 2.5 72B model
const MODEL_NAME = 'qwen/qwen3.6-plus-preview:free';

const SYSTEM_PROMPT = `You are the PromptDuino AI Agent, a master hardware architect. Your mission is to provide 100% accurate Arduino/ESP32 code and accompanying circuit diagrams.

CRITICAL HARDWARE RULES:
1. CODE BLOCK (\`\`\`cpp): Provide a complete, optimized Arduino sketch.
2. JSON BLOCK (\`\`\`json): Explicitly describe the physical circuit map.
   - Format: { "parts": [{ "type": "model", "id": "id", "name": "Label" }], "connections": [{ "from": "id1:pin", "to": "id2:pin", "color": "color" }] }
3. PINOUT PRECISION:
   - ESP32: Use physical GPIO numbers (e.g., 'GPIO21', 'GPIO22'). Use '3V3', 'GND', 'VIN'.
   - Arduino Uno: Use 'D0-D13' for digital, 'A0-A5' for analog, '5V', '3.3V', 'GND'.
   - I2C Devices: Always map to 'SDA' and 'SCL' on the sensor side.
   - LCD 16x2: Use pins [VSS, VDD, VO, RS, RW, E, D4-D7, A, K].
4. ID CONVENTION: Use lowercase alphanumeric (e.g., 'lcd1', 'uno'). NO SPACES.
5. WIRE COLORS: Mandate realistic colors (e.g., 'red' for VCC/5V, 'black' for GND, 'yellow' for Data).
6. SPACING: Ensure you describe every physical connection requested or required for the sensor to work (don't forget power/ground).

The UI will render these blocks. Your diagrams must match real-world wiring diagrams for clarity.`;

export default function AgentChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I am the PromptDuino agent. Describe what you'd like your Arduino to do, and I'll generate the code." }
  ]);

  // API Key Management 
  const envKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const storageKey = localStorage.getItem('AI_API_KEY');
  const isValid = (k) => k && k !== 'undefined' && k !== 'null' && k.startsWith('sk-or-');
  
  // No longer hardcoding the key for security. Use environment variables.
  const [apiKey, setApiKey] = useState(isValid(envKey) ? envKey : (isValid(storageKey) ? storageKey : null));
  const [isKeyValid, setIsKeyValid] = useState(isValid(apiKey));

  // Dynamic fallback for local development (src/groq-key.js)
  useEffect(() => {
    if (!isKeyValid) {
      const loadLocalKey = async () => {
        if (import.meta.env.PROD) return;
        try {
          const keyPath = '../groq-key.js';
          const mod = await import(/* @vite-ignore */ keyPath);
          const localKey = mod.OPENROUTER_API_KEY;
          if (localKey && isValid(localKey)) {
            setApiKey(localKey);
            setIsKeyValid(true);
          }
        } catch (e) {
          // File missing in production/Vercel
        }
      };
      loadLocalKey();
    }
  }, [isKeyValid, isValid]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const setCode = useStore((state) => state.setCode);
  const setDiagram = useStore((state) => state.setDiagram);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const saveApiKey = () => {
    const rawInput = input.trim().replace(/^["']|["']$/g, ''); // Handle accidental quotes
    if (isValid(rawInput)) {
      localStorage.setItem('AI_API_KEY', rawInput);
      setApiKey(rawInput);
      setIsKeyValid(true);
      setInput('');
      setMessages(prev => [...prev, { role: 'assistant', text: "API Key saved successfully! How can I help you today?" }]);
    } else {
      setMessages(prev => [...prev, { role: 'assistant', text: "That doesn't look like a valid OpenRouter API Key (should start with 'sk-or-')." }]);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!isKeyValid && !apiKey) {
      if (isValid(input.trim())) {
        saveApiKey();
        return;
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: "API Key nahi mili! Agar aapne .env.local mein key daal di hai, toh please terminal mein 'npm run dev' ko restart karein aur page refresh karein." }]);
        return;
      }
    }
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const currentCode = useStore.getState().code;
      const chatHistory = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.text
      }));
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey.trim()}`,
          "HTTP-Referer": "https://www.promptduino.in/", 
          "X-OpenRouter-Title": "PromptDuino",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": MODEL_NAME,
          "messages": [
            { "role": "system", "content": SYSTEM_PROMPT },
            ...chatHistory,
            { "role": "user", "content": `[Current Editor Code]:\n\`\`\`cpp\n${currentCode}\n\`\`\`\n\nUser Request: ${userMessage}` }
          ],
          "temperature": 0.2
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const completion = await response.json();
      const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      
      // Extract logic
      const blocks = [...reply.matchAll(/```(?:cpp|c|arduino|json)?\s*([\s\S]*?)```/gi)];
      
      let cppCode = null;
      let diagramData = null;

      for (const match of blocks) {
        const content = match[1].trim();
        if (content.includes('setup()') || content.includes('loop()')) {
          cppCode = content;
        } else if (content.includes('"parts"') || content.includes('"connections"')) {
          try {
            const parsed = JSON.parse(content);
            if (parsed.parts || parsed.connections) {
              diagramData = parsed;
            }
          } catch (e) {
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
      if (diagramData) setDiagram(diagramData);
      
    } catch (error) {
      console.error("AI Error:", error);
      
      const isUnauthorized = error.message && (error.message.includes('401') || error.message.includes('Unauthorized'));
      
      if (isUnauthorized) {
        localStorage.removeItem('AI_API_KEY');
        setIsKeyValid(false);
        setApiKey(null);
        setMessages(prev => [...prev, { role: 'assistant', text: "Error: 401 Invalid API Key. The stored key was rejected. Please paste a fresh, valid API Key below to reset." }]);
      } else {
        const errorMsg = error.message || "Unable to connect to AI service.";
        setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${errorMsg}. Please check your connection or model availability.` }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualReset = () => {
    localStorage.removeItem('AI_API_KEY');
    setIsKeyValid(false);
    setApiKey(null);
    setMessages(prev => [...prev, { role: 'assistant', text: "API Key cleared. Please paste your fresh API Key below." }]);
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
        <button 
          onClick={handleManualReset}
          title="Reset API Key"
          className="p-1 hover:bg-[#E0DCD1] rounded-md transition-colors text-[#7A7870]"
        >
          <RotateCcw size={13} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="bg-[#798866] rounded-full p-2 mr-3 shrink-0 shadow-sm mt-1">
                <Bot size={15} className="text-[#F5F3EC]" />
              </div>
            )}
            
            <div className={`
              px-4 py-3 rounded-2xl text-[13.5px] shadow-sm leading-relaxed max-w-[85%] whitespace-pre-wrap
              ${msg.role === 'assistant' 
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
