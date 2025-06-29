import { MainNav } from '@/components/main-nav';

import SideNav from './side-nav';

export async function SiteHeader() {
  return (
    <header className='sticky top-0 z-40 mx-auto flex w-full items-center justify-center bg-transparent backdrop-blur-lg dark:bg-zinc-800'>
      <div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
        <MainNav />
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <SideNav />
        </div>
      </div>
    </header>
  );
}
