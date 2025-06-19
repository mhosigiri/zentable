export interface Theme {
  id: string;
  name: string;
  category: 'gradient' | 'solid' | 'pattern' | 'glass';
  background: string;
  preview: string;
  textColor: string;
  accentColor: string;
}

export const themes: Theme[] = [
  // Gradient Themes
  {
    id: 'gradient-sunset',
    name: 'Sunset',
    category: 'gradient',
    background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)',
    preview: 'bg-gradient-to-br from-red-500 via-yellow-400 to-pink-400',
    textColor: '#ffffff',
    accentColor: '#f59e0b'
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean',
    category: 'gradient',
    background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)',
    preview: 'bg-gradient-to-br from-blue-500 to-teal-400',
    textColor: '#ffffff',
    accentColor: '#06b6d4'
  },
  {
    id: 'gradient-forest',
    name: 'Forest',
    category: 'gradient',
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    preview: 'bg-gradient-to-br from-teal-600 to-green-400',
    textColor: '#ffffff',
    accentColor: '#10b981'
  },
  {
    id: 'gradient-fire',
    name: 'Fire',
    category: 'gradient',
    background: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
    preview: 'bg-gradient-to-br from-pink-600 to-orange-500',
    textColor: '#ffffff',
    accentColor: '#f97316'
  },
  {
    id: 'gradient-aurora',
    name: 'Aurora',
    category: 'gradient',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    preview: 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-400',
    textColor: '#ffffff',
    accentColor: '#8b5cf6'
  },
  {
    id: 'gradient-cosmic',
    name: 'Cosmic',
    category: 'gradient',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #764ba2 100%)',
    preview: 'bg-gradient-to-br from-blue-900 via-blue-700 to-purple-600',
    textColor: '#ffffff',
    accentColor: '#6366f1'
  },
  {
    id: 'gradient-tropical',
    name: 'Tropical',
    category: 'gradient',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
    preview: 'bg-gradient-to-br from-pink-400 via-red-400 to-blue-400',
    textColor: '#ffffff',
    accentColor: '#ec4899'
  },
  {
    id: 'gradient-neon',
    name: 'Neon',
    category: 'gradient',
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    preview: 'bg-gradient-to-br from-green-400 to-cyan-400',
    textColor: '#ffffff',
    accentColor: '#10b981'
  },
  {
    id: 'gradient-volcano',
    name: 'Volcano',
    category: 'gradient',
    background: 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)',
    preview: 'bg-gradient-to-br from-red-500 to-pink-600',
    textColor: '#ffffff',
    accentColor: '#ef4444'
  },
  {
    id: 'gradient-electric',
    name: 'Electric',
    category: 'gradient',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    preview: 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-400',
    textColor: '#ffffff',
    accentColor: '#8b5cf6'
  },
  {
    id: 'gradient-rainbow',
    name: 'Rainbow',
    category: 'gradient',
    background: 'linear-gradient(135deg, #ff0844 0%, #ffb199 25%, #43e97b 50%, #38f9d7 75%, #667eea 100%)',
    preview: 'bg-gradient-to-br from-red-500 via-orange-300 via-green-400 via-cyan-400 to-indigo-500',
    textColor: '#ffffff',
    accentColor: '#8b5cf6'
  },

  // Solid Color Themes
  {
    id: 'solid-midnight',
    name: 'Midnight',
    category: 'solid',
    background: '#1a1a2e',
    preview: 'bg-slate-900',
    textColor: '#ffffff',
    accentColor: '#6366f1'
  },
  {
    id: 'solid-snow',
    name: 'Snow',
    category: 'solid',
    background: '#f8fafc',
    preview: 'bg-slate-50',
    textColor: '#1f2937',
    accentColor: '#3b82f6'
  },
  {
    id: 'solid-emerald',
    name: 'Emerald',
    category: 'solid',
    background: '#065f46',
    preview: 'bg-emerald-800',
    textColor: '#ffffff',
    accentColor: '#10b981'
  },
  {
    id: 'solid-ruby',
    name: 'Ruby',
    category: 'solid',
    background: '#991b1b',
    preview: 'bg-red-800',
    textColor: '#ffffff',
    accentColor: '#ef4444'
  },
  {
    id: 'solid-amber',
    name: 'Amber',
    category: 'solid',
    background: '#92400e',
    preview: 'bg-amber-800',
    textColor: '#ffffff',
    accentColor: '#f59e0b'
  },

  // Pattern Themes
  {
    id: 'pattern-geometric',
    name: 'Geometric',
    category: 'pattern',
    background: `
      radial-gradient(circle at 25% 25%, #667eea 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, #764ba2 0%, transparent 50%),
      linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)
    `,
    preview: 'bg-gradient-to-br from-blue-500 to-purple-600',
    textColor: '#ffffff',
    accentColor: '#8b5cf6'
  },
  {
    id: 'pattern-waves',
    name: 'Waves',
    category: 'pattern',
    background: `
      repeating-linear-gradient(
        45deg,
        #667eea,
        #667eea 2px,
        #764ba2 2px,
        #764ba2 10px
      )
    `,
    preview: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    textColor: '#ffffff',
    accentColor: '#a855f7'
  },
  {
    id: 'pattern-dots',
    name: 'Dots',
    category: 'pattern',
    background: `
      radial-gradient(circle, #667eea 1px, transparent 1px),
      linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)
    `,
    preview: 'bg-gradient-to-br from-blue-400 to-blue-600',
    textColor: '#ffffff',
    accentColor: '#3b82f6'
  },

  // Glass Themes
  {
    id: 'glass-frosted',
    name: 'Frosted',
    category: 'glass',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    preview: 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm',
    textColor: '#1f2937',
    accentColor: '#6366f1'
  },
  {
    id: 'glass-tinted',
    name: 'Tinted',
    category: 'glass',
    background: 'linear-gradient(135deg, rgba(102,126,234,0.2) 0%, rgba(118,75,162,0.1) 100%)',
    preview: 'bg-gradient-to-br from-indigo-500/20 to-purple-600/10 backdrop-blur-sm',
    textColor: '#1f2937',
    accentColor: '#8b5cf6'
  },
  {
    id: 'glass-emerald',
    name: 'Emerald Glass',
    category: 'glass',
    background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(21,128,61,0.1) 100%)',
    preview: 'bg-gradient-to-br from-emerald-500/20 to-emerald-700/10 backdrop-blur-sm',
    textColor: '#1f2937',
    accentColor: '#10b981'
  }
];

export const defaultTheme: Theme = {
  id: 'default',
  name: 'Default',
  category: 'gradient',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  preview: 'bg-gradient-to-br from-indigo-500 to-purple-600',
  textColor: '#ffffff',
  accentColor: '#8b5cf6'
};

export const getThemeById = (id: string): Theme => {
  return themes.find(theme => theme.id === id) || defaultTheme;
};

export const getThemesByCategory = (category: Theme['category']): Theme[] => {
  return themes.filter(theme => theme.category === category);
}; 