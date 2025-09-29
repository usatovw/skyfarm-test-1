'use client'

import { cn } from "@/lib/utils";
import { NavigationItem } from "@/types";

// For now, using a placeholder for the avatar image
const avatarPlaceholder = "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23e5e7eb'/%3E%3Cpath d='M16 14a4 4 0 100-8 4 4 0 000 8zM16 18c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z' fill='%23374151'/%3E%3C/svg%3E";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const navigationItems: NavigationItem[] = [
    { id: 'home', title: 'Главная', icon: '🏠', href: '/', isActive: true },
    { id: 'notifications', title: 'Уведомления', icon: '🔔', href: '/notifications' },
    { id: 'analytics', title: 'Аналитика', icon: '📊', href: '/analytics' },
    { id: 'growing-zones', title: 'Зоны выращивания', icon: '🌱', href: '/farm' },
    { id: 'modes', title: 'Режимы', icon: '⚙️', href: '/modes' },
  ];

  const settingsItems: NavigationItem[] = [
    { id: 'settings', title: 'Настройки', icon: '⚙️', href: '/settings' },
    { id: 'support', title: 'Поддержка', icon: '❓', href: '/support' },
    { id: 'logout', title: 'Выход', icon: '🚪', href: '/logout' },
  ];

  return (
    <div className={cn("bg-card h-full w-72 border-r border-border flex flex-col", className)}>
      {/* Аватар пользователя */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full bg-cover bg-center bg-muted"
            style={{ backgroundImage: `url('${avatarPlaceholder}')` }}
          />
          <div>
            <p className="font-semibold text-foreground">Родион Раскольников</p>
            <p className="text-sm text-muted-foreground">Агроном</p>
          </div>
        </div>
      </div>

      {/* Меню навигации */}
      <div className="flex-1 p-4 space-y-2">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                item.isActive
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.title}
            </a>
          ))}
        </nav>
      </div>

      {/* Нижняя секция */}
      <div className="p-4 border-t border-border space-y-1">
        {settingsItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              item.id === 'logout'
                ? "text-destructive hover:bg-destructive/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <span className="text-base">{item.icon}</span>
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}