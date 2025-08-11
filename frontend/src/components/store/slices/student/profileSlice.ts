import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface InitialState {
    isLoading: boolean;
    profileInfo: IprofileInfo 
}

const initialState : InitialState = {
    isLoading: true,
    profileInfo: {
        _id: '',
        userId: '',
        name: '',
        teamNo: '',
        email: '',
        rollNumber: '',
        branch: '',
        profileImg: '',
        role: "" ,
        gender: '',
        college: '',
        teamNum: '',
    }
}

export const StudentProfileInfo = createAsyncThunk(
    "/student/profile",
    async () => {
        const response = await fetch("https://course-management-system-2-2wm4.onrender.com/student/profile/info" , {
            credentials : "include"
        })
        const data = await response.json()
        return data;
    }
)

export const StudentUpdateProfileInfo = createAsyncThunk(
    "/student/profile/edit",
    async (formData : IUpdateProfileData) => {
        const response = await fetch("https://course-management-system-2-2wm4.onrender.com/student/profile/update", {
            credentials: "include",
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json()
        console.log(data)
        return data
    }
)

const StudentProfileSlice = createSlice({
    name: "studentProfile",
    initialState: initialState,
    reducers: {
        GettingProfileInfo : (state , action)=>{
            state.profileInfo = action.payload.FindUserData
        }
    },
    extraReducers(builder) {
        builder
            .addCase(StudentProfileInfo.pending, (state) => {
                state.isLoading = true
            })
            .addCase(StudentProfileInfo.fulfilled, (state, action) => {
                state.profileInfo = action.payload.FindUserData
                state.isLoading = false
            })
            .addCase(StudentProfileInfo.rejected, (state) => {
                state.isLoading = false
            })


            .addCase(StudentUpdateProfileInfo.pending, (state) => {
                state.isLoading = true
            })
            .addCase(StudentUpdateProfileInfo.fulfilled, (state, action) => {
                state.isLoading = false
                state.profileInfo = action.payload.FindUserData
            })
            .addCase(StudentUpdateProfileInfo.rejected, (state) => {
                state.isLoading = false
            })
    },
})

export const {GettingProfileInfo } = StudentProfileSlice.actions
export default StudentProfileSlice.reducer