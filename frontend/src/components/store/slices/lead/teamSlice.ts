import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface initialStateInterfase {
    isLoading : boolean ,
    TeamInfo : UserProfile[]
}
const initialState : initialStateInterfase = {
    isLoading : true ,
    TeamInfo : [] 
}

export const FindTeamMembers = createAsyncThunk(
    "/lead/members",
    async()=>{
        const response = await fetch("https://cms-nij0.onrender.com/lead/team/members" , {
            credentials :"include"
        })
        const data = await response.json()
        return data
    }
)

const teamSlice = createSlice({
    name:"team" ,
    initialState ,
    reducers : {},
    extraReducers :(builder) => {
        builder
        .addCase(FindTeamMembers.pending , (state)=>{
            state.isLoading = true
        })
        .addCase(FindTeamMembers.fulfilled , (state , action)=>{
            state.isLoading = false
            state.TeamInfo = action.payload
        })
        .addCase(FindTeamMembers.rejected , (state)=>{
            state.isLoading = false
        })

    },
})

export default teamSlice.reducer;