import { Home } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "./ui/sidebar"
import { Link } from "react-router-dom"
import { cn } from "../lib/utils"

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
    return (
        <Sidebar collapsible='icon'>
            <SidebarContent>
                <SidebarGroup className="space-y-4">
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {
                            routes?.map(item => (
                                <SidebarMenuItem key={item.title} className="list-none">
                                    <SidebarMenuButton asChild className="text-lg" size='lg'>
                                        <Link to={item.url}>
                                            <item.icon className={cn("min-h-5 min-w-5 transition-all",
                                                state === 'collapsed' && 'mx-auto'
                                            )} />
                                            {state === 'expanded' && <span>{item.title}</span>}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))
                        }
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}