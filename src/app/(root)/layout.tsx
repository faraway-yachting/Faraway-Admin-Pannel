'use client'

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { AdminMenus } from "@/data/Sidebar/menu";

interface Props {
    children: ReactNode;
}

const IndexLayout: React.FC<Props> = ({ children }) => {

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (token) {
            setIsAuthenticated(true);
        } else {
            router.replace('/');
        }

        setLoading(false);
    }, [router]);

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex lg:bg-[#ecebeb]">
            <div className="hidden lg:block">
                <Sidebar menus={AdminMenus} />
            </div>
            <div className="lg:ml-[200px] xl:ml-[240px] 2xl:ml-[260px] w-full bg-[#F8F9FA] lg:rounded-tl-[31px] lg:rounded-bl-[31px]">
                <Header />
                <main className="mt-[3rem] sm:mt-[5.1rem] px-4 py-4">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default IndexLayout;