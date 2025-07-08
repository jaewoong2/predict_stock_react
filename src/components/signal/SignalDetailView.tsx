"use client";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { SignalDetailContent } from "./SignalDetailContent";
import { useRouter } from "next/navigation";

interface SignalDetailViewProps {
  open: boolean;
  symbol: string;
  aiModel: string;
  date?: string;
}

export const SignalDetailView: React.FC<SignalDetailViewProps> = ({
  open,
  symbol,
  aiModel,
  date,
}) => {
  const router = useRouter();
  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      router.back();
    }
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="mx-auto w-full max-w-4xl pb-10 !select-text max-sm:max-h-[70vh] max-sm:w-[calc(100%-14px)] sm:max-h-[80vh]">
        <SignalDetailContent symbol={symbol} aiModel={aiModel} date={date} />
      </DrawerContent>
    </Drawer>
  );
};
