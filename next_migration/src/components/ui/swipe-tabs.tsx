import * as TabsPrimitive from '@radix-ui/react-tabs';

import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

const SwipeableTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  React.ComponentPropsWithoutRef<typeof Tabs> & {
    tabs: { value: string; label: string; content: React.ReactNode }[];
  }
>(({ className, tabs, ...props }, ref) => {
  const [activeTab, setActiveTab] = React.useState(tabs[0].value);

  const handleSwipe = (direction: number) => {
    const currentIndex = tabs.findIndex((tab) => tab.value === activeTab);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < tabs.length) {
      setActiveTab(tabs[newIndex].value);
    }
  };

  return (
    <Tabs ref={ref} className={cn('w-full', className)} value={activeTab} onValueChange={setActiveTab} {...props}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <AnimatePresence initial={false} custom={activeTab}>
        <motion.div
          key={activeTab}
          custom={activeTab}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag='x'
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            if (offset.x > 100) {
              handleSwipe(-1);
            } else if (offset.x < -100) {
              handleSwipe(1);
            }
          }}
          className='w-full'
        >
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </motion.div>
      </AnimatePresence>
    </Tabs>
  );
});
SwipeableTabs.displayName = 'SwipeableTabs';

export { Tabs, TabsList, TabsTrigger, TabsContent, SwipeableTabs };
