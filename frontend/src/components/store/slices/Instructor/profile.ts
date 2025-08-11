import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState : InstructorProfileInitialstate= {
    isLoading: true,
    profileInfo: {
        branch: "" ,
        courseId: [] ,
        email: "" ,
        gitHub: "",
        linkedIn: "" ,
        name: "" ,
        profileImg: "" ,
        role: "" ,
        rollNumber: "" ,
        userId: "" ,
        _id: "",
        UPI : "" ,
        college : "",
        gender : ""
    }
}

export const FetchProfileInfo = createAsyncThunk(
    "instructor/profile",
    async () => {
        const response = await fetch("https://course-management-system-2-2wm4.onrender.com/instructor/profile/view", {
            method: "GET",
            credentials: "include"
        })
        const data = await response.json()
        return data
    }
)


export const UpdateInstructorProfileInfo = createAsyncThunk(
    "instructor/profile/update",
    async (formData : FORMDATA) => {
        const response = await fetch("https://course-management-system-2-2wm4.onrender.com/instructor/profile/update", {
            method: "PUT",
            credentials: "include",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(formData)
        })
        const data = await response.json()
        return data
    }
)


const instructorProfileSlice = createSlice({
    name: "instructorProfile",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(FetchProfileInfo.pending, (state) => {
                state.isLoading = true
            })
            .addCase(FetchProfileInfo.fulfilled, (state, action) => {
                state.profileInfo = action.payload
                state.isLoading = false
            })
            .addCase(FetchProfileInfo.rejected, (state) => {
                state.isLoading = false
            })

            .addCase(UpdateInstructorProfileInfo.pending, (state) => {
                state.isLoading = true
            })
            .addCase(UpdateInstructorProfileInfo.fulfilled, (state, action) => {
                state.profileInfo = action.payload
                state.isLoading = false
            })
            .addCase(UpdateInstructorProfileInfo.rejected, (state) => {
                state.isLoading = false
            })
    }
})

export default instructorProfileSlice.reducer