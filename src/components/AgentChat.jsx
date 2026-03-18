import { Bot, User, Send, Sparkles } from 'lucide-react';

export default function AgentChat() {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-2 bg-[#F5F4F0] border-b border-[#E5E5E5]">
        <div className="flex items-center text-xs font-semibold text-[#555555]">
          <Sparkles size={14} className="mr-2 text-[#007acc]" />
          PROMPTDUINO AGENT
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-start">
          <div className="bg-[#007acc] rounded-full p-2 mr-3 shrink-0 shadow-sm">
            <Bot size={16} className="text-white" />
          </div>
          <div className="bg-[#F5F4F0] border border-[#E5E5E5] px-4 py-2 rounded-2xl rounded-tl-none text-sm text-[#333333] shadow-sm">
            Hello! I am the PromptDuino agent. Describe what you'd like your Arduino to do, and I'll generate the code.
          </div>
        </div>

        <div className="flex items-start justify-end">
          <div className="bg-[#007acc] px-4 py-2 rounded-2xl rounded-tr-none text-sm text-white max-w-[80%] shadow-sm">
            Make an LED blink on pin 13 every 500ms
          </div>
          <div className="bg-[#EAE9E4] outline outline-1 outline-[#D1D1D1] rounded-full p-2 ml-3 shrink-0 shadow-sm">
            <User size={16} className="text-[#555555]" />
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 bg-[#F5F4F0] border-t border-[#E5E5E5]">
        <div className="relative flex items-center">
          <input 
            type="text" 
            className="w-full bg-white border border-[#D1D1D1] text-sm text-[#333333] rounded-full outline-none py-2 pl-4 pr-10 focus:ring-2 focus:ring-[#007acc]/20 focus:border-[#007acc] shadow-sm placeholder-[#999999]"
            placeholder="Type your prompt..."
          />
          <button className="absolute right-3 text-[#007acc] hover:text-[#005f9e] transition-colors">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
