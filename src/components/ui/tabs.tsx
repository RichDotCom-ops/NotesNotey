"use client";
import * as React from "react";


export function Tabs({ defaultValue, className, children }: { defaultValue: string, className?: string, children: React.ReactNode }) {
  const [active, setActive] = React.useState(defaultValue);
  // Provide context for triggers and content
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

type TabsContextType = { active: string; setActive: (v: string) => void };
const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be used inside <Tabs>');
  return ctx;
}

export function TabsList({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}

export function TabsTrigger({ value, children }: { value: string, children: React.ReactNode }) {
  const { active, setActive } = useTabs();
  const isActive = active === value;
  return (
    <button
      type="button"
      className={
        (isActive
          ? 'font-bold text-primary bg-gradient-to-r from-pink-500 to-yellow-500 text-white shadow-md '
          : 'text-muted-foreground bg-zinc-800 text-white hover:bg-zinc-700 ') +
        ' transition-colors px-3 py-1 rounded-md mx-0.5 outline-none focus-visible:ring-2 focus-visible:ring-pink-400 text-xs md:text-sm md:px-4 md:py-2' // smaller on mobile
      }
      onClick={() => setActive(value)}
      // aria-selected removed to avoid warning: The attribute aria-selected is not supported by the role button.
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: { value: string, children: React.ReactNode }) {
  const { active } = useTabs();
  if (active !== value) return null;
  return <div>{children}</div>;
}
