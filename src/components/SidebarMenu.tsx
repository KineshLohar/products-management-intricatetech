import { Home } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../lib/utils"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar"

const routes = [
    {
        id: 1,
        title: "Products",
        url: "/",
        icon: Home
    }
]

export const SidebarMenu = () => {
    const { state } = useSidebar();
    const location = useLocation();
    const currentPath = location.pathname;
    return (
        <Sidebar collapsible='icon'>
            <SidebarContent>
                <SidebarGroup className="space-y-4">
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {
                            routes?.map(item => (
                                <SidebarMenuItem key={item.title} className={cn("list-none", currentPath === item.url && 'border-r-2 bg-sidebar-accent')}>
                                    <SidebarMenuButton asChild className={cn("text-lg")} size='lg'>
                                        <Link to={item.url}>
                                            <item.icon className={cn("min-h-5 min-w-5 transition-all",
                                                state === 'collapsed' && 'mx-auto'
                                            )} />
                                            {state === 'expanded' && <span>{item.title}</span>}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                            )
                        }
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}