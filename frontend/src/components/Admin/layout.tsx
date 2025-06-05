import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { Logout } from "../store/slices/authSlice";

export function AdminLayout() {
    const dispatch = useDispatch<AppDispatch>();
    const links = [
        {
            label: "All Courses",
            href: "courses",
            icon: <i className="fa-solid fa-book-open-reader mt-2"></i>,
        },
        {
            label: "Instructors",
            href: "courseProviders",
            icon: <i className="fa-solid fa-users mt-1"></i>,
        },        {
            label: "Orders",
            href: "orders",
            icon: <i className="fa-solid fa-cart-shopping mt-1 mr-1"></i>,
        },
        {
            label: "Withdrawals",
            href: "withdrawals",
            icon: <i className="fa-solid fa-money-bill-transfer mt-1"></i>,
        }
    ];
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        dispatch(Logout());
    };

    const handleLinkClick = () => {
        if (window.innerWidth <= 768) {
            setOpen(false);
        }
    };

    return (
        <div className={cn("flex h-screen w-screen max-w-full flex-col md:flex-row overflow-hidden")}>
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo /> :
                            <img
                                className="rounded-full w-7 h-7"
                                src="/logo.png"
                                alt="Logo"
                            />}
                        <div className="mt-24 flex flex-col gap-3">
                            {links.map((link, idx) => (
                                <SidebarLink
                                    key={idx}
                                    link={link}
                                    onClick={() => handleLinkClick()}
                                />
                            ))}
                            <div className="flex gap-3 mt-3 cursor-pointer" onClick={handleLogout}>
                                <i className="fa-solid fa-reply-all"></i>
                                <p className="text-sm -mt-1">Logout</p>
                            </div>
                        </div>
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="flex-1 flex flex-col w-full h-full">
                <div className="p-2 overflow-y-scroll no-scrollbar md:p-10 flex-1 overflow-auto rounded-tl-2xl rounded-bl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export const Logo = () => {
    return (
        <Link to="#" className="flex gap-2">
            <img
                className="rounded-full w-7 h-7"
                src="/logo.png"
                alt="Logo"
            />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-lg text-black dark:text-white whitespace-pre w-6 h-6"
            >
                CMS
            </motion.span>
        </Link>
    );
};
