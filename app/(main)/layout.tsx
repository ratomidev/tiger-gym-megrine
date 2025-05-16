import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

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
            <AppSidebar />
            <div className="relative">
              <div className="fixed top-4 z-50 ">
                <SidebarTrigger />
              </div>
              <main>{children}</main>
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
