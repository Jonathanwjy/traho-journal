import { Home, ChartColumn, User, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate, useLocation } from "react-router";
import { logout } from "@/api/AuthApi";

// Menu items
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Statistic",
    url: "/stats",
    icon: ChartColumn,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Active checker (support nested route)
  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs md:text-base font-bold mb-2">
            Traho Journal
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.title === "Logout" ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <SidebarMenuButton className="h-auto py-2 md:py-3 hover:bg-muted font-bold">
                          <item.icon className="w-4 h-4 md:w-6 md:h-6" />
                          <span className="text-sm md:text-lg">Logout</span>
                        </SidebarMenuButton>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Apakah anda yakin untuk keluar?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleLogout}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Logout
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      className={`h-auto py-2 md:py-3 transition-all
                        ${
                          isActive(item.url)
                            ? "bg-muted text-foreground border-l-4 border-primary"
                            : "hover:bg-muted text-muted"
                        }
                      `}
                    >
                      <a
                        href={item.url}
                        className="flex items-center gap-2 w-full font-bold"
                      >
                        <item.icon
                          className={`w-4 h-4 md:w-6 md:h-6
                            ${
                              isActive(item.url)
                                ? "text-foreground"
                                : "text-muted"
                            }
                          `}
                        />
                        <span className="text-sm md:text-lg">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
