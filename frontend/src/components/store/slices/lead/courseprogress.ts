import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: ViewCourseinitialState = {
  isLoading: true,
  courseData: [],
};

export const FetchViewCourses = createAsyncThunk(
  "/mycourses/view-page",
  async (id:string) => {
    const response = await fetch(
      `https://course-management-system-il4f.onrender.com/lead/progress-page/viewcourse/${id}`,
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  }
);

export const ProgressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {},
  extraReducers(builder) {
      builder
      .addCase(FetchViewCourses.pending,(state)=>{
        state.isLoading=true

      })
      .addCase(FetchViewCourses.fulfilled,(state,action)=>{
        state.isLoading=false,
        state.courseData=action.payload.leadCourses//put the backend res name like {leaadCourse:leadCourse}
      })
      .addCase(FetchViewCourses.rejected,(state)=>{
        state.isLoading=false

      })
  },
});

export const { } = ProgressSlice.actions
export default ProgressSlice.reducer
