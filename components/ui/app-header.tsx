import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b bg-white">
      <Link href="/dashboard" className="flex items-center justify-center gap-3 text-lg font-semibold">
        <img 
          src="/assets/Zentable_icon.png" 
          alt="Zentable Logo" 
          className="h-6 w-6"
        />
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Zentable
        </span>
      </Link>
    </header>
  );
} 