import Link from 'next/link';
import { Presentation } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b bg-white">
      <Link href="/dashboard" className="flex items-center justify-center gap-2 text-lg font-semibold">
        <Presentation className="h-6 w-6 text-indigo-600" />
        <span>SlidesAI</span>
      </Link>
    </header>
  );
} 