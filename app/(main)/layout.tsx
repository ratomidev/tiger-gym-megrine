import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NavigationSidebar } from "@/components/navigation-sidebar";

import { ThemeProvider } from "@/components/theme-provider";

import { ModeToggle } from "@/components/mode-toggle";
import { CommandPalette } from "@/components/command-palette";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <NavigationSidebar />
            <div className="relative w-full h-full">
              <div className="fixed top-4 z-50 ">
                <SidebarTrigger />
              </div>
              <main className="w-full h-screen pt-30">{children}</main>
            </div>
          </SidebarProvider>
          <div className="fixed top-4 right-4 z-50">
            <div className="flex items-center gap-2">
              <CommandPalette />
              <ModeToggle />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
