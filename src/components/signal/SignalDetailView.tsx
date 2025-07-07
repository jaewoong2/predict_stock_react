"use client";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { SignalDetailContent } from "./SignalDetailContent";

interface SignalDetailViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  symbol: string;
  aiModel: string;
  date?: string;
}

export const SignalDetailView: React.FC<SignalDetailViewProps> = ({
  open,
  onOpenChange,
  symbol,
  aiModel,
  date,
}) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto w-full max-w-4xl pb-10 !select-text max-sm:max-h-[70vh] max-sm:w-[calc(100%-14px)] sm:max-h-[80vh]">
        <SignalDetailContent symbol={symbol} aiModel={aiModel} date={date} />
      </DrawerContent>
    </Drawer>
  );
};
