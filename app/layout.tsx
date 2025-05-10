import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "./globals.css"
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  )
}