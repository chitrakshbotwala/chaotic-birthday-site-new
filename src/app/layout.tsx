'use client';

import './globals.css'
import { Inter } from 'next/font/google'
import { useState } from 'react';
import WarningWrapper from '@/components/WarningWrapper'
import NavBar from '@/components/NavBar'
import SecurityCodeModal from '@/components/SecurityCodeModal'

const inter = Inter({ subsets: ['latin'] })

// Metadata is defined in a separate file for server components

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [modalOpen, setModalOpen] = useState(true);
  
  const handleSecuritySuccess = () => {
    setModalOpen(false);
    
    // Play P Diddy song using a direct iframe embed for better compatibility
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/tEKi6vnPApI?autoplay=1&start=45&loop=1&playlist=tEKi6vnPApI&controls=0&disablekb=1';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.style.position = 'absolute';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    document.body.appendChild(iframe);
  };
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <WarningWrapper />
        <NavBar />
        <main className="min-h-screen pt-4">
          {children}
        </main>
        
        {/* Security Code Modal */}
        {modalOpen && <SecurityCodeModal onCodeSuccess={handleSecuritySuccess} />}
      </body>
    </html>
  )
}
