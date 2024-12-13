import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { Logout } from "../store/slices/authSlice";
import { LeadProfileInfo } from "../store/slices/lead/profileSlice";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { cn } from "@/lib/utils";

export function LeadLayout() {
    const dispatch = useDispatch<AppDispatch>();

    const { profileInfo } = useSelector((state: RootState) => state.profile);
    const links = [
        {
            label: "Home",
            href: "dashboard",
            icon: (
                <i className="fa-solid fa-house mt-1"></i>
            ),
        },
        {
            label: "Explore Courses",
            href: "courses",
            icon: (
                <i className="fa-solid fa-folder-minus mt-1"></i>
            ),
        },
        {
            label: "My Courses",
            href: "mycourses",
            icon: (
                <i className="fa-solid fa-folder mt-1"></i>
            ),
        },
        {
            label: "Team Members",
            href: "members",
            icon: (
                <i className="fa-solid fa-users mt-1"></i>
            ),
        }
    ];

    useEffect(() => {
        dispatch(LeadProfileInfo());
    }, [dispatch]);

    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        dispatch(Logout());
    };

    const handleLinkClick = () => {
        if (open) {
            setOpen(false); // Close the sidebar on link click (for mobile view)
        }
    };

    return (
        <div
            className={cn(
                "flex h-screen w-screen max-w-full flex-col md:flex-row overflow-hidden"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo /> :
                            <img
                                className="rounded-full w-7 h-7"
                                src="https://media.licdn.com/dms/image/v2/D560BAQEdNp5niau0Rw/company-logo_200_200/company-logo_200_200/0/1683745552013?e=1735171200&v=beta&t=5ykcq9A8xtYhhFFdbeRTpzs8JjbqEQL_P5dkkE70rOs"
                            />}
                        <div className="mt-24 flex flex-col gap-3">
                            {links.map((link, idx) => (
                                <SidebarLink 
                                    key={idx} 
                                    link={link} 
                                    onClick={handleLinkClick}  // Close sidebar on link click
                                />
                            ))}
                            <div className="flex gap-3 mt-3 cursor-pointer" onClick={handleLogout}>
                                <i className="fa-solid fa-reply-all"></i>
                                <p className="text-sm -mt-1">Logout</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Profile",
                                href: "profile",
                                icon: (
                                    <img
                                        src={profileInfo?.data.profileImg}
                                        className="h-7 w-7 flex-shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                            onClick={handleLinkClick}  // Close sidebar when profile link is clicked
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="flex-1 flex flex-col w-full h-full">
                <div className="p-5 overflow-y-scroll no-scrollbar md-10 flex-1 overflow-auto rounded-tl-2xl rounded-bl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export const Logo = () => {
    return (
        <Link to="auth/signin" className="flex gap-2">
            <img
                className="rounded-full w-7 h-7"
                src="https://media.licdn.com/dms/image/v2/D560BAQEdNp5niau0Rw/company-logo_200_200/company-logo_200_200/0/1683745552013?e=1735171200&v=beta&t=5ykcq9A8xtYhhFFdbeRTpzs8JjbqEQL_P5dkkE70rOs"
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
