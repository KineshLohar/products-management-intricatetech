import ProductsList from "../../components/products/ProductsList";
import { SidebarMenu } from "../../components/SidebarMenu";
import { SidebarTrigger, useSidebar } from "../../components/ui/sidebar";
import { cn } from "../../lib/utils";

export default function Home() {
    const { state } = useSidebar();
    return (
        <div className="w-full">
            <div className="">
                <SidebarMenu />
            </div>
            <main className={cn("transition-all ",
                state === 'expanded' && "md:ml-64",
                state === 'collapsed' && 'md:ml-12'
            )}>
                <div className="w-full p-3 border-b bg-sidebar">
                    <SidebarTrigger className='cursor-pointer' />
                </div>
                <ProductsList />
            </main>
        </div>
    )
}
