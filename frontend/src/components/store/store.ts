import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import CommonSlice from "./slices/CommonSlice"
import ProgressSlice from './slices/lead/courseprogress'
import ProfileSlice from "./slices/lead/profileSlice"
import teamSlice from "./slices/lead/teamSlice"
import StudentProfileInfo from './slices/student/profileSlice'
import StudentProgressSlice from './slices/student/courseprogress'
import AdminSlice from './slices/admin/course-view'
import InstructorSlice from './slices/Instructor/courses'
import InstructorProfile from "./slices/Instructor/profile"

export const store = configureStore({
    reducer: {
        auth: authSlice,
        course: CommonSlice,
        profile: ProfileSlice,
        progress: ProgressSlice,
        team: teamSlice,
        studentProfile: StudentProfileInfo,
        studentProgress: StudentProgressSlice,
        adminProgress: AdminSlice,
        Instructor: InstructorSlice,
        InstructorProfile: InstructorProfile
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


