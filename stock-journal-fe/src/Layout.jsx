import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-h-screen bg-background transition-all duration-300">
        <SidebarTrigger />
        <Outlet></Outlet>
      </main>
    </SidebarProvider>
  );
}
