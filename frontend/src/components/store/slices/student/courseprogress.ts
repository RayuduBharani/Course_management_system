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
            `https://course-management-system-2-2wm4.onrender.com/student/progress-page/viewcourse/${id}`,
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
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            state.isLoading=false,
            state.courseData=action.payload.studentCourses
        })
        .addCase(FetchStudentCourse.rejected,(state)=>{
            state.isLoading=false
        })

    },


});


// eslint-disable-next-line no-empty-pattern
export const {} = StudentProgressSlice.actions

export default StudentProgressSlice.reducer


