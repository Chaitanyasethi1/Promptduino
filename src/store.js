import { create } from 'zustand';

export const useStore = create((set) => ({
  code: `void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println("Hello, PromptDuino!");
}

void loop() {
  // put your main code here, to run repeatedly:
  delay(1000);
}`,
  setCode: (code) => set({ code }),
  serialLogs: [],
  addSerialLog: (log) => set((state) => ({ serialLogs: [...state.serialLogs, log] })),
  clearSerialLogs: () => set({ serialLogs: [] }),
  isSimulating: false,
  setIsSimulating: (isSimulating) => set({ isSimulating }),
  isCompiling: false,
  
  compileCode: async () => {
    set({ isCompiling: true });
    set({ serialLogs: [] });
    const { code, addSerialLog } = useStore.getState();
    const backendUrl = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api/compile` : '/api/compile';

    try {
      addSerialLog({ type: 'received', text: "Verifying (Compiling) sketch..." });
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      if (data.logs && Array.isArray(data.logs)) {
         data.logs.forEach(logLine => addSerialLog({ type: 'received', text: logLine }));
      }
    } catch (err) {
      addSerialLog({ type: 'received', text: `Connection Error: ${err.message}` });
    } finally {
      set({ isCompiling: false });
    }
  },

  uploadCode: async () => {
    set({ isSimulating: true });
    set({ serialLogs: [] });
    const { code, addSerialLog } = useStore.getState();
    const backendUrl = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api/simulate` : '/api/simulate';

    try {
      addSerialLog({ type: 'received', text: "Compiling and Uploading to Simulator..." });
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      if (data.logs && Array.isArray(data.logs)) {
         data.logs.forEach(logLine => addSerialLog({ type: 'received', text: logLine }));
      }
    } catch (err) {
      addSerialLog({ type: 'received', text: `Connection Error: ${err.message}` });
    } finally {
      set({ isSimulating: false });
    }
  },
}));
