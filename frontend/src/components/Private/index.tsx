import { Navigate, useLocation } from "react-router-dom"
import Loader from "../Loading"

export default function PrivateComponent({ IsAuthenticated, user, IsLoading, children }: IAuthenticatedProps) {
    const location = useLocation()

    if (IsLoading) {
        return <Loader />
    }    // Allow access to verify page for authenticated users with Empty role
    if (IsAuthenticated && user.role === "Empty" && !location.pathname.includes("/check/verify")) {
        return <Navigate to="/check/verify" />
    }

    // Allow access to auth pages for unauthenticated users
    const isAuthRoute = location.pathname.includes("/auth/signin") || location.pathname.includes("/auth/signup") || location.pathname.includes("/auth/home");
    if (!IsAuthenticated && !isAuthRoute) {
        return <Navigate to="/auth/signin" />
    }

    // Prevent authenticated users with roles from accessing auth pages
    if (IsAuthenticated && user.role !== "Empty" && isAuthRoute) {
        switch (user.role) {
            case "Admin":
                return <Navigate to="/Admin/courses" />
            case "Instructor":
                return <Navigate to="/instructor/dashboard" />
            case "Lead":
                return <Navigate to="/lead/dashboard" />
            case "Student":
                return <Navigate to="/student/dashboard" />
        }
    }

    // Handle authenticated user role-based routing
    if (IsAuthenticated && (location.pathname.includes("/auth/signin") || location.pathname.includes("/auth/signup") || location.pathname.includes("/auth/home"))) {
        switch (user.role) {
            case "Admin":
                return <Navigate to="/Admin/courses" />
            case "Instructor":
                return <Navigate to="/instructor/dashboard" />
            case "Lead":
                return <Navigate to="/lead/dashboard" />
            case "Student":
                return <Navigate to="/student/dashboard" />
            case "Empty":
                return <Navigate to="/check/verify" />
            default:
                return <Navigate to="/check/verify" />
        }
    }

    // Prevent role-based access to wrong sections
    if (IsAuthenticated) {
        const currentPath = location.pathname
        const userRole = user.role.toLowerCase()

        if (user.role !== "Empty" && currentPath.includes("check/verify")) {
            switch (userRole) {
                case "admin":
                    return <Navigate to="/Admin/courses" />
                case "instructor":
                    return <Navigate to="/instructor/dashboard" />
                case "lead":
                    return <Navigate to="/lead/dashboard" />
                case "student":
                    return <Navigate to="/student/dashboard" />
            }
        }

        // Only allow access to sections matching user's role
        const validSections = {
            admin: "admin",
            instructor: "instructor",
            lead: "lead",
            student: "student",
        }

        for (const [role, path] of Object.entries(validSections)) {
            if (currentPath.toLowerCase().includes(path) && userRole !== role) {
                switch (userRole) {
                    case "admin":
                        return <Navigate to="/Admin/courses" />
                    case "instructor":
                        return <Navigate to="/instructor/dashboard" />
                    case "lead":
                        return <Navigate to="/lead/dashboard" />
                    case "student":
                        return <Navigate to="/student/dashboard" />
                }
            }
        }
    }

    return <>{children}</>
}
