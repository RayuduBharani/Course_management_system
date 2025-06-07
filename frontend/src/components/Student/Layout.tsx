import { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { Logout } from "../store/slices/authSlice";
import { StudentProfileInfo } from "../store/slices/student/profileSlice"; // Assuming the profile slice is set up

export function StudentLayout() {
    const dispatch = useDispatch<AppDispatch>();
    const { profileInfo } = useSelector((state: RootState) => state.studentProfile); // Get the student profile from the Redux store

    const links = [
        {
            label: "Home",
            href: "dashboard",
            icon: <i className="mt-1 fa-solid fa-house"></i>,
        },
        {
            label: "Explore Courses",
            href: "courses",
            icon: <i className="fa-regular fa-folder-open mt-1"></i>,
        },
        {
            label: "My Courses",
            href: "mycourses",
            icon: <i className="fa-solid fa-folder-closed mt-1"></i>,
        }
    ];

    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Dispatch action to fetch profile info if not already available
        if (!profileInfo) {
            dispatch(StudentProfileInfo());
        }
    }, [dispatch, profileInfo]);

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
                            />
                        }
                        <div className="mt-24 flex flex-col gap-3">
                            {links.map((link, idx) => (
                                <SidebarLink
                                    key={idx}
                                    link={link}
                                    onClick={handleLinkClick}
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
                                        src={profileInfo?.profileImg || "/default-avatar.png"}
                                        className="h-7 w-7 flex-shrink-0 rounded-full object-cover bg-muted"
                                        width={28}
                                        height={28}
                                        alt="Profile"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "https://ui-avatars.com/api/?name=User&background=random";
                                        }}
                                    />
                                ),
                            }}
                            onClick={handleLinkClick}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="flex-1 flex flex-col w-full h-full">
                <div className="p-3 overflow-y-scroll no-scrollbar md:p-10 flex-1 overflow-auto rounded-tl-2xl rounded-bl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
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
