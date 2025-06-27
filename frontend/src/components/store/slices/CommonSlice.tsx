import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AllCoursesinitialState {
    isLoading: boolean,
    courses: ICourse[]
}

const initialState: AllCoursesinitialState = {
    isLoading: false,
    courses: []
};

export const fetchAllCourses = createAsyncThunk(
    "courses/fetchAll",
    async () => {
        const response = await fetch("http://13.233.183.222:8000/courses/Allcourses");
        const data = await response.json();
        return data;
    }
);

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCourses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses = action.payload
            })
            .addCase(fetchAllCourses.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export default courseSlice.reducer;