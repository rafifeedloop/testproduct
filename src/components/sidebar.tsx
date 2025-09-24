"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  TestTube2,
  Smartphone,
  TrendingUp,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Code,
  FileText,
  Users,
  FileJson
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Main",
      items: [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          href: "/",
          active: pathname === "/",
        },
        {
          icon: TestTube2,
          label: "Test Runs",
          href: "/test-runs",
          active: pathname.startsWith("/test-runs"),
        },
        {
          icon: Smartphone,
          label: "Devices",
          href: "/devices",
          active: pathname === "/devices",
        },
        {
          icon: Code,
          label: "Token",
          href: "/scripts",
          active: pathname.startsWith("/scripts"),
        },
        {
          icon: FileJson,
          label: "Scenarios",
          href: "/scenarios",
          active: pathname.startsWith("/scenarios"),
        },
      ]
    },
    {
      title: "Analytics",
      items: [
        {
          icon: TrendingUp,
          label: "Reports",
          href: "/reports",
          active: pathname === "/reports",
        },
        {
          icon: FileText,
          label: "Logs",
          href: "/logs",
          active: pathname === "/logs",
        },
      ]
    },
    {
      title: "Management",
      items: [
        {
          icon: Users,
          label: "Team",
          href: "/team",
          active: pathname === "/team",
        },
        {
          icon: Settings,
          label: "Settings",
          href: "/settings",
          active: pathname === "/settings",
        },
        {
          icon: HelpCircle,
          label: "Help",
          href: "/help",
          active: pathname === "/help",
        },
      ]
    }
  ];

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} h-full bg-[var(--surface)] border-r border-[var(--border-subtle)] transition-all duration-300 ${className}`}>
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="p-5 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] flex items-center justify-center shadow-[0_8px_24px_rgba(41,94,236,0.25)]">
                  <TestTube2 className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-semibold text-[var(--brand-ink)]">TestLab</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-6">
              {!collapsed && (
                <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2 px-3">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-[var(--r-ctl)] transition-all
                      ${item.active 
                        ? 'bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] text-white shadow-[0_8px_24px_rgba(41,94,236,0.25)]' 
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-[var(--brand-primary-500)]'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                  >
                    <item.icon className={`h-4 w-4 ${collapsed ? '' : 'shrink-0'}`} />
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[var(--border-subtle)]">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] flex items-center justify-center text-white text-xs font-medium">
              JD
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--brand-ink)] truncate">John Doe</p>
                <p className="text-xs text-[var(--text-muted)] truncate">john@testlab.io</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}