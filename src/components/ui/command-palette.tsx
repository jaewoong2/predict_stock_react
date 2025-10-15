"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Home,
  TrendingUp,
  Newspaper,
  Search,
  BarChart3,
  Settings,
  Menu,
} from "lucide-react";

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  const controlledOpen = open !== undefined ? open : isOpen;

  const setControlledOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setIsOpen(open);
    }
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setControlledOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setControlledOpen]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      setControlledOpen(false);
      command();
    },
    [setControlledOpen],
  );

  const navigationItems = [
    {
      name: "Dashboard",
      icon: Home,
      action: () => router.push("/dashboard"),
    },
    {
      name: "OX Home",
      icon: Home,
      action: () => router.push("/ox/home"),
    },
    {
      name: "OX Dashboard",
      icon: BarChart3,
      action: () => router.push("/"),
    },
    {
      name: "Market",
      icon: TrendingUp,
      action: () => router.push("/market"),
    },
    {
      name: "Research",
      icon: Search,
      action: () => router.push("/research"),
    },
    {
      name: "ETF",
      icon: BarChart3,
      action: () => router.push("/etf"),
    },
    {
      name: "News",
      icon: Newspaper,
      action: () => router.push("/ox/news"),
    },
  ];

  const oxFeatures = [
    {
      name: "OX Predict",
      icon: TrendingUp,
      action: () => router.push("/ox/predict"),
    },
    {
      name: "Points",
      icon: Menu,
      action: () => router.push("/ox/points"),
    },
    {
      name: "Rewards",
      icon: Menu,
      action: () => router.push("/ox/rewards"),
    },
    {
      name: "Profile",
      icon: Settings,
      action: () => router.push("/ox/profile"),
    },
  ];

  return (
    <Dialog open={controlledOpen} onOpenChange={setControlledOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              {navigationItems.map((item) => (
                <CommandItem
                  key={item.name}
                  onSelect={() => runCommand(item.action)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="OX Features">
              {oxFeatures.map((item) => (
                <CommandItem
                  key={item.name}
                  onSelect={() => runCommand(item.action)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
