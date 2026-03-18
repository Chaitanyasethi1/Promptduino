import Editor from '@monaco-editor/react';

export default function CodeEditor() {
  const defaultCode = `void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println("Hello, PromptDuino!");
}

void loop() {
  // put your main code here, to run repeatedly:
  delay(1000);
}`;

  return (
    <div className="h-full w-full flex flex-col bg-white">
      <div className="flex items-center h-9 bg-[#F5F4F0] px-4 text-xs">
        <div className="bg-white px-4 h-full flex items-center border-t-2 border-[#007acc] text-[#333333] font-medium border-x border-r-[#E5E5E5] border-l-[#E5E5E5]">
          main.ino
        </div>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="cpp"
          defaultValue={defaultCode}
          theme="light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
        />
      </div>
    </div>
  );
}
