import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


  interface Admininitialstate {
    isLoading: boolean;
    courseData: AdminCourse | null
  }

const initialState:Admininitialstate={
    isLoading:true,
    courseData: null
}



export const FetchAdminCourseView = createAsyncThunk(
    'admin/mycourses/view-page',
    async(id:string)=>{
        const response = await fetch(`https://course-management-system-2-2wm4.onrender.com/admin/course/viewcourse/${id}`,{
            credentials:'include'
        })
        const data = await response.json();
        console.log(data)
        return data;

    }
)

export const AdminSlice = createSlice({
    name:'progress',
    initialState,
    reducers:{},
    extraReducers(builder){
        builder
        .addCase(FetchAdminCourseView.pending,(state)=>{
            state.isLoading=true;
        })
        .addCase(FetchAdminCourseView.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.courseData=action.payload.findAllCourses
        })
        .addCase(FetchAdminCourseView.rejected,(state)=>{
            state.isLoading=false
        })


    }
})


// eslint-disable-next-line no-empty-pattern
export const {} =AdminSlice.actions

export default AdminSlice.reducer