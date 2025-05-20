import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { CommandPalette } from "@/components/command-palette";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarNavigation } from "@/components/sidebar-navigation";
import { UserAuthButton } from "@/components/user-auth-button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SidebarProvider>
        <header className="fixed top-4 right-4 z-50">
          <div className="flex items-center gap-2">
            <CommandPalette />
            <ModeToggle />
            <UserAuthButton />
          </div>
        </header>

        <aside>
          <SidebarNavigation />
        </aside>

        <main className="flex-1 relative">
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger />
          </div>
          <div className="w-full h-screen pt-30">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
