import { Navigate, useLocation } from "react-router-dom"
import Loader from "../Loading"

export default function PrivateComponent({ IsAuthenticated, user, IsLoading, children }: IAuthenticatedProps) {
    const location = useLocation()
    if (IsLoading) {
        <Loader />
    }
    if (location.pathname === "/") {
        return <Navigate to='/auth/signin' />
    }
    if (!IsAuthenticated && !(location.pathname.includes("/auth/signin") || location.pathname.includes("/auth/signup") || location.pathname.includes("/auth/home"))) {
        return <Navigate to='/auth/signin' />
    }

    if (IsAuthenticated && (location.pathname.includes("/auth/signin") || location.pathname.includes("/auth/signup") || location.pathname.includes("/auth/home"))) {
        if (user.role === "Admin" && !(location.pathname.includes("admin"))) {
            return <Navigate to='/Admin/courses' />
        }
        else if (user.role === "Instructor" && !(location.pathname.includes("instuctor"))) {
            return <Navigate to='/instructor/dashboard' />
        }
        else if (user.role === "Lead" && !(location.pathname.includes("lead"))) {
            return <Navigate to='/lead/dashboard' />
        }
        else if (user.role === "Student" && !(location.pathname.includes("student"))) {
            return <Navigate to='/student/dashboard' />
        }
        else {
            return <Navigate to='/check/verify' />
        }
    }

    if (IsAuthenticated && user.role === "Empty" && (location.pathname.includes("student") || location.pathname.includes("lead") || location.pathname.includes("instructor") || location.pathname.includes("Admin"))) {
        return <Navigate to='/check/verify' />
    }

    if (IsAuthenticated && user.role === "Admin" && (location.pathname.includes("student") || location.pathname.includes("lead") || location.pathname.includes("instructor") || location.pathname.includes("check"))) {
        return <Navigate to='/Admin/courseProviders' />
    }

    if (IsAuthenticated && user.role === "Student" && (location.pathname.includes("Admin") || location.pathname.includes("lead") || location.pathname.includes("instructor") || location.pathname.includes("check"))) {
        return <Navigate to='/student/dashboard' />
    }

    if (IsAuthenticated && user.role === "Lead" && (location.pathname.includes("student") || location.pathname.includes("Admin") || location.pathname.includes("instructor") || location.pathname.includes("check"))) {
        return <Navigate to='/lead/dashboard' />
    }

    if (IsAuthenticated && user.role === "Instructor" && (location.pathname.includes("student") || location.pathname.includes("lead") || location.pathname.includes("Admin") || location.pathname.includes("check"))) {
        return <Navigate to='/instructor/dashboard' />
    }

    return (
        <>
            {children}
        </>
    )
}
