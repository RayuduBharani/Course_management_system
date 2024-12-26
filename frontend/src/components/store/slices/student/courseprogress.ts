import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";




interface ViewCourseinitialState {
    isLoading: boolean;
    courseData: ICompleateCourseInfo[];
  }


const initialState:ViewCourseinitialState = {
    isLoading:true,
    courseData:[],
}
export const FetchStudentCourse =  createAsyncThunk(
    '/student/mycourses/view-page',
    async (id:string) => {
        const response = await fetch(
            `https://cms-nij0.onrender.com/student/progress-page/viewcourse/${id}`,
            {
                credentials:'include',
            }
        );
        const data = await response.json();
        return data;

        
    }


);


export const StudentProgressSlice = createSlice({
    name:'stdprogress',
    initialState,
    reducers:{},
    extraReducers(builder){

        builder
        .addCase(FetchStudentCourse.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(FetchStudentCourse.fulfilled,(state,action)=>{
            state.isLoading=false,
            state.courseData=action.payload.studentCourses
        })
        .addCase(FetchStudentCourse.rejected,(state)=>{
            state.isLoading=false
        })

    },


});


export const {} = StudentProgressSlice.actions

export default StudentProgressSlice.reducer


