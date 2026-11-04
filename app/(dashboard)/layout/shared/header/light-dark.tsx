"use client";

import { Button } from "@/components/ui/button";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => {};

const LightDark = () => {
  const { theme: activeMode, setTheme: setActiveMode } = useTheme();
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const toggleTheme = () => {
    setActiveMode(activeMode === "light" ? "dark" : "light");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {activeMode === "light" ? (
        <Button
          variant="ghost"
          className="h-10 w-10 hover:bg-primary/5 rounded-full cursor-pointer"
          onClick={toggleTheme}
        >
          <Moon className="size-5" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="h-10 w-10 hover:bg-primary/5 rounded-full cursor-pointer"
          onClick={toggleTheme}
        >
          <Sun className="size-5" />
        </Button>
      )}
    </div>
  );
};

export default LightDark;
