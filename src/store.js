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
}));
