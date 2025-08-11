import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { FindInstructorCourses } from "@/lib/admin-types";

const initialState : FindInstructorCourses = {
    isLoading: true,
    courses: [],
    error: null
}

export const FetchInstructorCourses = createAsyncThunk(
    "instructor/courses",
    async () => {
        const response = await fetch("https://course-management-system-2-2wm4.onrender.com/instructor/course/get", {
            method: "GET",
            credentials: "include"
        })
        const data = await response.json()
        if (!data.success && data.message) {
            throw new Error(data.message)
        }
        return data.courses || []
    }
)

const InstuctorSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(FetchInstructorCourses.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(FetchInstructorCourses.fulfilled, (state, action) => {
                state.isLoading = false
                state.courses = action.payload
                state.error = null
            })
            .addCase(FetchInstructorCourses.rejected, (state, action) => {
                state.isLoading = false
                state.courses = []
                state.error = action.error.message || "Failed to fetch courses"
            })
    }
})

export default InstuctorSlice.reducer