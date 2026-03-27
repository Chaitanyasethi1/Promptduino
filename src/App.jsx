import Navbar from './components/Navbar.jsx';
import FileExplorer from './components/FileExplorer.jsx';
import CodeEditor from './components/CodeEditor.jsx';
import SerialMonitor from './components/SerialMonitor.jsx';
import SimulationPanel from './components/SimulationPanel.jsx';
import AgentChat from './components/AgentChat.jsx';

function App() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#F5F3EC] text-[#3A3A3A] overflow-hidden font-sans">
      {/* Top Navbar */}
      <nav className="h-12 border-b border-[#E0DCD1] bg-[#EFECE1] shrink-0">
        <Navbar />
      </nav>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: File Explorer */}
        <aside className="w-64 border-r border-[#E0DCD1] shrink-0 flex flex-col bg-[#EFECE1]">
          <FileExplorer />
        </aside>

        {/* Center Column: Editor & Serial Monitor */}
        <section className="flex flex-col flex-1 border-r border-[#E0DCD1] min-w-0">
          <div className="flex-1 min-h-0 bg-[#F5F3EC]">
            <CodeEditor />
          </div>
          <div className="h-56 border-t border-[#E0DCD1] bg-[#F5F3EC] shrink-0">
            <SerialMonitor />
          </div>
        </section>

        {/* Right Column: Simulation & Agent Chat */}
        <aside className="w-[420px] shrink-0 flex flex-col bg-[#EFECE1] border-l border-[#E0DCD1]">
          <div className="h-[45%] border-b border-[#E0DCD1] min-h-0 overflow-hidden">
            <SimulationPanel />
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <AgentChat />
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
