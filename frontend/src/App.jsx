import Navbar from './components/Navbar';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import SerialMonitor from './components/SerialMonitor';
import SimulationPanel from './components/SimulationPanel';
import AgentChat from './components/AgentChat';

function App() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#FAF9F6] text-[#333333] overflow-hidden">
      {/* Top Navbar */}
      <nav className="h-12 border-b border-[#E5E5E5] bg-[#F5F4F0] shrink-0">
        <Navbar />
      </nav>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: File Explorer */}
        <aside className="w-64 border-r border-[#E5E5E5] shrink-0 flex flex-col bg-[#F5F4F0]">
          <FileExplorer />
        </aside>

        {/* Center Column: Editor & Serial Monitor */}
        <section className="flex flex-col flex-1 border-r border-[#E5E5E5] min-w-0">
          <div className="flex-1 min-h-0 bg-white">
            <CodeEditor />
          </div>
          <div className="h-48 border-t border-[#E5E5E5] bg-white shrink-0">
            <SerialMonitor />
          </div>
        </section>

        {/* Right Column: Simulation & Agent Chat */}
        <aside className="w-96 shrink-0 flex flex-col bg-[#F5F4F0]">
          <div className="flex-1 border-b border-[#E5E5E5] min-h-0">
            <SimulationPanel />
          </div>
          <div className="flex-1 min-h-0">
            <AgentChat />
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
