'use client';

import React from 'react';
import { 
  Image, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Users, 
  Zap,
  Search,
  Bell,
  Menu
} from 'lucide-react';
import { Button } from './ui/button';

interface AppShellProps {
  children: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const sidebarItems = [
  { id: 'campaigns', icon: Image, label: 'Ad Images' },
  { id: 'templates', icon: Zap, label: 'Templates' },
  { id: 'humans', icon: Users, label: 'Humans' },
  { id: 'language', icon: HelpCircle, label: 'Language' },
  { id: 'teams', icon: Users, label: 'Teams' },
  { id: 'customers', icon: Users, label: 'Customers' },
  { id: 'insights', icon: BarChart3, label: 'Insights' },
  { id: 'feedback', icon: HelpCircle, label: 'Feedback' },
];

export default function AppShell({ 
  children, 
  activeSection = 'campaigns',
  onSectionChange 
}: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-card/50 backdrop-blur-xl border-r border-white/10
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AdSpark AI</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange?.(item.id)}
                className={`
                  sidebar-item w-full
                  ${activeSection === item.id ? 'active' : ''}
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <header className="h-16 bg-card/30 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search data..."
                className="w-96 pl-10 pr-4 py-2 bg-background/50 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button size="sm">
              Connect
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
