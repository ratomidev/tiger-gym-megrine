"use client";

import { ChevronUp, Home, LogOut, User2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

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
    title: "Dashboard",
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

  // Handle logout click
  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
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
        TigerGym Megrine
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
