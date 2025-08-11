/* eslint-disable no-empty-pattern */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState: InitialState = {
    isLoading: true,
    profileInfo: null
}

export const LeadProfileInfo = createAsyncThunk(
    "/lead/dashboard",
    async () => {
        const response = await fetch("https://course-management-system-2-2wm4.onrender.com/lead/profile/info", {
            credentials: "include"
        })
        const data = await response.json()
        return data
    }
)

export const UpdateLeadProfileInfo = createAsyncThunk(
    "/lead/profile",
    async (formData: IUpdateProfileData) => {
        const response = await fetch("https://course-management-system-2-2wm4.onrender.com/lead/profile/update", {
            credentials: "include",
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json()
        return data
    }
)

const ProfileSlice = createSlice({
    name: "profile",
    initialState: initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(UpdateLeadProfileInfo.pending, (state) => {
                state.isLoading = true
            })
            .addCase(UpdateLeadProfileInfo.fulfilled, (state, action) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                state.isLoading = false,
                    state.profileInfo = action.payload
            })
            .addCase(UpdateLeadProfileInfo.rejected, (state) => {
                state.isLoading = false
            })



            .addCase(LeadProfileInfo.pending, (state) => {
                state.isLoading = true
            })
            .addCase(LeadProfileInfo.fulfilled, (state, action) => {
                state.profileInfo = action.payload
                state.isLoading = false
            })
            .addCase(LeadProfileInfo.rejected, (state) => {
                state.isLoading = false
            })
    },
})

export const { } = ProfileSlice.actions
export default ProfileSlice.reducer