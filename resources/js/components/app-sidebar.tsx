import { Link } from '@inertiajs/react';
import { BookOpen, Bot, FileText, Folder, LayoutGrid, List, Menu, Settings } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Sayfalar',
        href: '/admin/pages',
        icon: FileText,
    },
    {
        title: 'Yazilar',
        href: '/admin/posts',
        icon: List,
    },
    {
        title: 'Kategoriler',
        href: '/admin/categories',
        icon: Folder,
    },
    {
        title: 'Medya',
        href: '/admin/media',
        icon: FileText,
    },
    {
        title: 'Menuler',
        href: '/admin/menus',
        icon: Menu,
    },
    {
        title: 'Ayarlar',
        href: '/admin/settings',
        icon: Settings,
    },
    {
        title: 'AI Ceviri',
        href: '/admin/ai-translate',
        icon: Bot,
    },
    {
        title: 'AI Marka Rehberi',
        href: '/admin/ai/brand',
        icon: Bot,
    },
    {
        title: 'AI Fikir Uretici',
        href: '/admin/ai/ideas',
        icon: Bot,
    },
    {
        title: 'AI Icerik Uretici',
        href: '/admin/ai/content',
        icon: Bot,
    },
    {
        title: 'AI Prompt Sablonlari',
        href: '/admin/ai/templates',
        icon: Bot,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
