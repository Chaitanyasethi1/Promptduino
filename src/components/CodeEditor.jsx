import Editor, { useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';
import { useStore } from '../store';

export default function CodeEditor() {
  const monaco = useMonaco();
  const code = useStore(state => state.code);
  const setCode = useStore(state => state.setCode);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('warm-light', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '7A7870', fontStyle: 'italic' },
          { token: 'keyword', foreground: '6392A8' },
          { token: 'string', foreground: 'D18F52' },
          { token: 'number', foreground: '798866' },
        ],
        colors: {
          'editor.background': '#F5F3EC',
          'editor.lineHighlightBackground': '#EFECE1',
          'editorLineNumber.foreground': '#B3B0A3',
          'editorIndentGuide.background': '#E0DCD1',
          'editorSuggestWidget.background': '#EFECE1',
          'editorSuggestWidget.border': '#E0DCD1',
        }
      });
      monaco.editor.setTheme('warm-light');
    }
  }, [monaco]);


  return (
    <div className="h-full w-full flex flex-col bg-[#F5F3EC]">
      <div className="flex items-end h-10 bg-[#EFECE1] px-4 pt-1">
        <div className="bg-[#F5F3EC] px-6 h-full flex items-center border-t-2 border-[#6392A8] text-[#3A3A3A] text-sm font-medium rounded-t-lg shadow-[0_-2px_4px_rgba(0,0,0,0.02)] border-x border-[#E0DCD1] z-10">
          main.ino
        </div>
      </div>
      <div className="flex-1 border-t border-[#E0DCD1] -mt-[1px]">
        <Editor
          height="100%"
          defaultLanguage="cpp"
          value={code}
          onChange={(val) => setCode(val)}
          theme="warm-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 20 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            renderLineHighlight: 'all',
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
          }}
        />
      </div>
    </div>
  );
}
