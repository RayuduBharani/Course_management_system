import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { CircleArrowRight, Code, Folder, FolderCheck, LogInIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/flip-words";

export function Home() {
    const links = [
        {
            label: "Dashboard",
            href: "auth/signin",
            icon: (
                <Code className="text-neutral-900 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "All Courses",
            href: "auth/signin",
            icon: (
                <Folder className="text-neutral-900 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Enrolled Courses",
            href: "auth/signin",
            icon: (
                <FolderCheck className="text-neutral-900 dark:text-neutral-200 h-54 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Register Now",
            href: "auth/signup",
            icon: (
                <LogInIcon className="text-neutral-900 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Login",
            href: "auth/signin",
            icon: (
                <CircleArrowRight className="text-neutral-900 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        }
    ];
    const [open, setOpen] = useState(false);
    return (
        <>
            <div
                className={cn(
                    "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                    "h-[100vh]"
                )}
            >
               
                <Sidebar open={open} setOpen={setOpen}>
                    <SidebarBody className="bg-muted font-bold rounded-tr-2xl rounded-br-2xl text-primary-foreground">
                        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                            {open ? (
                                <Logo />
                            ) : (
                                <img
                                    className="rounded-full w-6 h-6"
                                    src="https://media.licdn.com/dms/image/v2/D560BAQEdNp5niau0Rw/company-logo_200_200/company-logo_200_200/0/1683745552013?e=1735171200&v=beta&t=5ykcq9A8xtYhhFFdbeRTpzs8JjbqEQL_P5dkkE70rOs"
                                />
                            )}
                            <div className="mt-20 flex flex-col gap-4">
                                {links.map((link, idx) => (
                                    <SidebarLink key={idx} link={link} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <SidebarLink
                                link={{
                                    label: "Profile",
                                    href: "auth/signin",
                                    icon: (
                                        <img
                                            src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg"
                                            className="h-7 w-7 flex-shrink-0 rounded-full"
                                            width={50}
                                            height={50}
                                            alt="Avatar"
                                        />
                                    ),
                                }}
                            />
                        </div>
                    </SidebarBody>
                </Sidebar>
                <Dashboard />
            </div>
        </>
    );
}
export const Logo = () => {
    return (
        <Link to="auth/signin" className="flex gap-2 ">
            <img
                className="rounded-full w-6 h-6"
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
export const LogoIcon = () => {
    return (
        <Link
            to="auth/signin"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        </Link>
    );
};

const Dashboard = () => {
    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="p-2 md:p-20 justify-center items-center rounded-bl-2xl rounded-tl-2xl border bg-background flex flex-col gap-2 flex-1 w-full h-full max-sm:rounded-tr-2xl">
                <div className="text-4xl font-bold flex gap-4 mb-4 max-sm:text-3xl max-sm:flex-col max-sm:items-center max-sm:text-center max-sm:gap-2">
                    <p>Better Learning Future Starts With</p>
                    <FlipWords className="text-primary" words={["Knowledge", "Innovation", "Growth", "Success"]} />
                </div>
                <p className="text-lg text-center font-medium text-neutral-400 max-w-2xl mx-auto mb-8 max-sm:text-sm max-sm:w-[80%] max-sm:text-center">
                    Welcome to Byway, where learning knows no bounds. We believe that education is the key to personal and professional growth, and we're here to guide you on your journey to success.
                </p>
                <Button className="p-5" asChild><Link to='auth/signin'>Get Started</Link></Button>
            </div>
        </div>
    );
};
