import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import ComminSlice from "./slices/CommonSlice"
import  ProgressSlice from './slices/lead/courseprogress'
import ProfileSlice from "./slices/lead/profileSlice"
import teamSlice from "./slices/lead/teamSlice"
import StudentProfileInfo from './slices/student/profileSlice'
import  StudentProgressSlice  from './slices/student/courseprogress'
import  AdminSlice from './slices/admin/course-view'
import  InstuctorSlice from './slices/Instructor/courses'
import InstructorProfile from "./slices/Instructor/profile"

export const store = configureStore({
    reducer: {
        auth : authSlice,
        course : ComminSlice,
        profile : ProfileSlice,
        progress:ProgressSlice,
        team : teamSlice,
        studentProfile : StudentProfileInfo,
        studentProgress:StudentProgressSlice,
        adminProgress:AdminSlice ,
        Instuctor : InstuctorSlice,
        InstructorProfile : InstructorProfile
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


