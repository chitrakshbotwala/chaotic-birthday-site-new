'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { playSound } from '@/utils/soundUtils';

export default function NavBar() {
  const pathname = usePathname();
  
  const handleNavClick = () => {
    playSound('click');
  };
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <nav className="sticky top-0 z-40 w-full bg-gradient-to-r from-pink-900/90 to-purple-900/90 backdrop-blur-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="text-white font-bold text-xl flex items-center"
            onClick={handleNavClick}
          >
            <span className="mr-2">🐻‍❄️</span>
            Chaotic Birthday
          </Link>
          
          <div className="space-x-1 md:space-x-4">
            <Link 
              href="/"
              className={`px-3 py-1 rounded-full text-sm ${
                isActive('/') 
                  ? 'bg-pink-600 text-white' 
                  : 'text-white hover:bg-purple-800'
              }`}
              onClick={handleNavClick}
            >
              Home
            </Link>
            
            <Link 
              href="/modals"
              className={`px-3 py-1 rounded-full text-sm ${
                isActive('/modals') 
                  ? 'bg-pink-600 text-white' 
                  : 'text-white hover:bg-purple-800'
              }`}
              onClick={handleNavClick}
            >
              Modal Gallery
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 