import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

import { ThemeProvider } from "@/components/theme-provider"
 
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
            <main>
              {children}
            </main>
          </div>
        </SidebarProvider>
      </ThemeProvider>
      </body>
    </html>
  )
}