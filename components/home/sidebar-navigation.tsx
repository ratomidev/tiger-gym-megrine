"use client";

import { ChevronUp, Home, LogOut, Moon, Sun, User2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Menu items with role-based access
const items = [
  {
    title: "Statistique",
    url: "/home",
    icon: Home,
    roles: ["OWNER"], // Only owner can see dashboard
  },
  {
    title: "Adherents",
    url: "/list-adherent",
    icon: UserPlus,
    roles: ["OWNER", "STAFF"], // Both owner and staff can see adherents
  },
  {
    title: "Utilisateurs",
    url: "/users",
    icon: User2,
    roles: ["OWNER"], // Only owner can manage users
  },
];

export function SidebarNavigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { setOpenMobile, isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

  // Handle logout click
  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    document.documentElement.classList.add("theme-transition");
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 300);
    }, 10);
  };

  // Handle menu item click
  const handleMenuItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Display name or fallback
  const displayName = user?.name || user?.email?.split("@")[0] || "Guest";

  // Filter items based on user role
  const filteredItems = items.filter(
    (item) => user?.role && item.roles.includes(user.role)
  );

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between font-bold">
        Dashboard
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} onClick={handleMenuItemClick}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {displayName}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Compte ({user?.role})</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleThemeToggle}>
                  <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span>Thème</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
