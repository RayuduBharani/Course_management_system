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
            `http://localhost:8000/student/progress-page/viewcourse/${id}`,
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


