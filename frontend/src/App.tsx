import { Route, Routes } from 'react-router-dom'
import './App.css'
import AuthLayout from './components/Auth/Layout'
import SignIn from './Pages/Auth/SignIn'
import { Home } from './Pages/Auth/Home'
import Signup from './Pages/Auth/Signup'
import UserInfo from './Pages/Verify/UserInfo'
import { StudentLayout } from './components/Student/Layout'
import StudentDashboard from './Pages/Student/Dashboard'
import StudentProfile from './Pages/Student/Profile'
import LeadDashboard from './Pages/Lead/Dashboard'
import LeadProfile from './Pages/Lead/Profile'
import PrivateComponent from './components/Private'
import Privatelayout from './components/Private/layout'
import { AdminLayout } from './components/Admin/layout'
import AdminAllCourses from './Pages/Admin/AllCourses'
import AdminInstructors from './Pages/Admin/Instructors'
import AdminStudents from './Pages/Admin/Students'
import EnrollCourseView from './components/Lead/CourseViewPage'
import { LeadLayout } from './components/Lead/layout'
import { InstructorLayout } from './components/Instructor/Layout'
import InstructorAllCourses from './Pages/Instructor/AllCourses'
import InstructorProfile from './Pages/Instructor/Profile'
import LeadAllCourses from './Pages/Lead/AllCourses'
import StudentAllcourses from './Pages/Student/Allcourses'
import Notfound from './components/404/Notfound'
import { LeadTeamMembers } from './Pages/Lead/TeamMembers'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { AppDispatch, RootState } from './components/store/store'
import { CheckAuthentication } from './components/store/slices/authSlice'
import Loader from './components/Loading'
import PaymentReturn from './components/Payments/lead/payment-return'
import LeadMyCourses from './Pages/Lead/Mycourses'
import LeadCourseEnrollDetailesPage from './Pages/Lead/DetailesPage'
import AddCourse from './Pages/Instructor/AddCourse'
import LeadCourseDetailesView from './components/Lead/CourseViewPage'
import StudentEnrolledCourses from './Pages/Student/Enrolled'
import StudentCourseDetailesView from './components/Student/CourseViewPage'
import StudentPaymentReturn from './components/Payments/student/payment-return'
import StudentCourseEnrollDetailesPage from './Pages/Student/DetailesPage'
import AdminCourseDetailesView from './components/Admin/CourseViewPage'
import AdminCourseDetailesPage from './Pages/Admin/DetailsPage'
import Orders from './Pages/Admin/Orders'
import AdminLeads from './Pages/Admin/Leads'
import InstructorDashbord from './Pages/Instructor/Dashbord'
import ViewCourse from './components/Instructor/View-course'
import InstructorCourseEnrollDetailesPage from './Pages/Instructor/DetailsPage'
import InstructorProfileUpdate from './components/Instructor/ProfileUpdate'
import EarningPage from './Pages/Instructor/EarningPage'
import InstructorDetails from './components/Admin/instructorDetails'
import Payment from './Pages/Admin/pay'

function App() {
    const dispatch = useDispatch<AppDispatch>()
    const { IsAuthenticated, user, IsLoading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(CheckAuthentication());
    }, [dispatch]);

    if (IsLoading) {
        return <div className='w-full h-screen'>
            <Loader />;
        </div>
    }

    return (
        <>
            <Routes>
                <Route path="/" element={
                    <PrivateComponent IsAuthenticated={IsAuthenticated} user={user} IsLoading={IsLoading}>
                        <SignIn />
                    </PrivateComponent>} />

                <Route path='/auth' element={
                    <PrivateComponent IsAuthenticated={IsAuthenticated} IsLoading={IsLoading} user={user}>
                        <AuthLayout />
                    </PrivateComponent>}>
                    <Route path='home' element={<Home />} />
                    <Route path='signin' element={<SignIn />} />
                    <Route path='signup' element={<Signup />} />
                </Route>
                <Route path='/check' element={
                    <PrivateComponent IsLoading={IsLoading} IsAuthenticated={IsAuthenticated} user={user}>
                        <Privatelayout />
                    </PrivateComponent>} >
                    <Route path='verify' element={<UserInfo />} />
                </Route>
                <Route path='/Admin' element={
                    <PrivateComponent IsLoading={IsLoading} IsAuthenticated={IsAuthenticated} user={user}>
                        <AdminLayout />
                    </PrivateComponent>}>
                    <Route path='courses' element={<AdminAllCourses />} />
                    <Route path='pay/:id' element={<Payment />} />
                    <Route path='courseProviders' element={<AdminInstructors />} />
                    <Route path='courseProviders/:id' element={<InstructorDetails />} />
                    <Route path='users' element={<AdminStudents />} />
                    <Route path='orders' element={<Orders />} />
                    <Route path='leads' element={<AdminLeads />} />
                    <Route path='courses/:id' element={<AdminCourseDetailesView />} />
                    <Route path='courses/coureview/:id' element={<AdminCourseDetailesPage />} />
                </Route>
                <Route path='/student' element={
                    <PrivateComponent IsLoading={IsLoading} IsAuthenticated={IsAuthenticated} user={user}>
                        <StudentLayout />
                    </PrivateComponent>}>
                    <Route path='dashboard' element={<StudentDashboard />} />
                    <Route path='courses' element={<StudentAllcourses />} />
                    <Route path='courses/:id' element={<StudentCourseDetailesView />} />
                    <Route path='mycourses/view-page/:id' element={<StudentCourseEnrollDetailesPage />} />
                    <Route path='mycourses' element={<StudentEnrolledCourses />} />
                    <Route path='profile' element={<StudentProfile />} />
                    <Route path='enrollcourseview' element={<EnrollCourseView />} />
                    <Route path='payment-return' element={<StudentPaymentReturn />} />
                </Route>
                <Route path='/lead' element={
                    <PrivateComponent IsLoading={IsLoading} IsAuthenticated={IsAuthenticated} user={user}>
                        <LeadLayout />
                    </PrivateComponent>}>
                    <Route path='dashboard' element={<LeadDashboard />} />
                    <Route path='courses' element={<LeadAllCourses />} />
                    <Route path='profile' element={<LeadProfile />} />
                    <Route path='mycourses' element={<LeadMyCourses />} />
                    <Route path='members' element={<LeadTeamMembers />} />
                    <Route path='courses/:id' element={<LeadCourseDetailesView />} />
                    <Route path='payment-return' element={<PaymentReturn />} />
                    <Route path='mycourses/view-page/:id' element={<LeadCourseEnrollDetailesPage />} />
                </Route>
                <Route path='/instructor' element={
                    <PrivateComponent IsLoading={IsLoading} IsAuthenticated={IsAuthenticated} user={user}>
                        <InstructorLayout />
                    </PrivateComponent>}>
                    <Route path='dashboard' element={<InstructorDashbord />} />
                    <Route path='courses' element={<InstructorAllCourses />} />
                    <Route path='profile' element={<InstructorProfile />} />
                    <Route path='new' element={<AddCourse />} />
                    <Route path='earnings' element={<EarningPage />} />
                    <Route path='courses/view/:id' element={<ViewCourse />} />
                    <Route path='courses/coureview/:id' element={<InstructorCourseEnrollDetailesPage />} />
                    <Route path='profile/update' element={<InstructorProfileUpdate />} />
                </Route>
                <Route path='*' element={<Notfound />} />
            </Routes>
        </>
    )
}

export default App
