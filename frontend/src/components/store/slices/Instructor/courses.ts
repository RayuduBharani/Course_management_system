import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState : FindInstructorCourses = {
    isLoading: true,
    courses: []
}

export const FetchInstructorCourses = createAsyncThunk(
    "instructor/courses",
    async () => {
        const response = await fetch("https://cms-nij0.onrender.com/instructor/course/get" , {
            method : "GET" ,
            credentials : "include"
        })
        const data = await response.json()
        return data.reverse()
    }
)

const InstuctorSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(FetchInstructorCourses.pending , (state)=>{
            state.isLoading = true
        })
        .addCase(FetchInstructorCourses.fulfilled , (state , action)=>{
            state.isLoading = false ,
            state.courses = action.payload
        })
        .addCase(FetchInstructorCourses.rejected , (state)=>{
            state.isLoading = false
        })
    }
})

export const {} = InstuctorSlice.actions
export default InstuctorSlice.reducer