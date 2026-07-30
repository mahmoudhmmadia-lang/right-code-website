import { Outlet } from "react-router-dom"
import AdminNavbar from "./AdminNavbar"
import Sidebar from "./Sidebar"

function DashboardLayout() {
  useSignals()
  return (
    <div className="min-h-screen w-full bg-[#f2f6f5] text-alt transition-colors dark:bg-[#081514] dark:text-foreground">
      <Sidebar />
      <div className={cn("min-h-screen transition-[margin] duration-300", sidebarCollapsed.value ? "lg:ml-[84px] rtl:lg:mr-[84px] rtl:lg:ml-0" : "lg:ml-[272px] rtl:lg:mr-[272px] rtl:lg:ml-0")}>
        <AdminNavbar />
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
import { sidebarCollapsed } from "@/context/global"
import { useSignals } from "@preact/signals-react/runtime"
import { cn } from "@/lib/utils"
