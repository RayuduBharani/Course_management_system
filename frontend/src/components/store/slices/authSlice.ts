import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: IAuthenticatedProps = {
    IsAuthenticated: false,
    user: {
        userId: "",
        role: "Empty",
        name : "",
        email : "",
        image : ""
    },
    IsLoading: true
}

export const LoginUser = createAsyncThunk(
    "/auth/signin",
    async (formData: IRegistrationCredentials) => {
        const response = await fetch("https://cms-nij0.onrender.com/api/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        })
        const data = await response.json()
        return data
    }
)

export const CheckAuthentication = createAsyncThunk(
    "auth/check-auth",
    async () => {
        const response = await fetch("https://cms-nij0.onrender.com/api/auth/check-auth", {
            method: "GET",
            credentials: "include"
        });
        const data = await response.json();
        return data
    }
);

export const FetchInstructor = createAsyncThunk(
    "/check/verify-instructor",
    async (formData: instructorFormData) => {
        const response = await fetch("https://cms-nij0.onrender.com/api/check-verify/instructor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        })
        const data = await response.json()
        return data
    }
)

export const FetchLead = createAsyncThunk(
    "/check/verify-Lead",
    async (formData: LeadFormData) => {
        const response = await fetch("https://cms-nij0.onrender.com/api/check-verify/lead", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        })
        const data = await response.json()
        return data
    }
)

export const FetchStudent = createAsyncThunk(
    "/check/verify",
    async (formData: StudentFormData) => {
        const response = await fetch("https://cms-nij0.onrender.com/api/check-verify/student", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        })
        const data = await response.json()
        return data
    }
)

export const Logout = createAsyncThunk(
    "/" ,
    async () =>{
        const response = await fetch("https://cms-nij0.onrender.com/api/auth/logout" , {
            credentials : "include"
        })
        const data = await response.json()
        return data
    }
)

export const GoogleAuth = createAsyncThunk(
    "/check/google",
    async (formData : IGoogleLogin) => {
        const response = await fetch("https://cms-nij0.onrender.com/api/auth/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        })
        const data = await response.json()
        return data
    }
)


export const authSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(LoginUser.pending, (state) => {
                state.IsLoading = true
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.IsLoading = false,
                    state.IsAuthenticated = action.payload.success,
                    state.user = action.payload.user
            })
            .addCase(LoginUser.rejected, (state) => {
                state.IsLoading = false
            })

            .addCase(GoogleAuth.pending, (state) => {
                state.IsLoading = true
            })
            .addCase(GoogleAuth.fulfilled, (state, action) => {
                state.IsLoading = false,
                state.IsAuthenticated = action.payload.success,
                state.user = action.payload.user
            })
            .addCase(GoogleAuth.rejected, (state) => {
                state.IsLoading = false
            })


            .addCase(CheckAuthentication.pending, (state) => {
                state.IsLoading = true
            })
            .addCase(CheckAuthentication.fulfilled, (state, action) => {
                state.IsAuthenticated = action.payload.success ? true : false,
                state.IsLoading = false
                state.user = action.payload.user
            })
            .addCase(CheckAuthentication.rejected, (state) => {
                state.IsLoading = false
                state.IsAuthenticated = false ,
                state.user.role = "Empty",
                state.user.userId = "" 
            })


            .addCase(FetchInstructor.pending, (state) => {
                state.IsLoading = true
            })
            .addCase(FetchInstructor.fulfilled, (state, action) => {
                state.IsLoading = false,
                    state.IsAuthenticated = action.payload.success,
                    state.user.role = action.payload.success ? action.payload.role : "Instructor"
            })
            .addCase(FetchInstructor.rejected, (state) => {
                state.IsLoading = false
            })


            .addCase(FetchLead.pending, (state) => {
                state.IsLoading = true
            })
            .addCase(FetchLead.fulfilled, (state, action) => {
                state.IsLoading = false,
                    state.IsAuthenticated = action.payload.success,
                    state.user.role = action.payload.success ? action.payload.role : "Lead"
            })
            .addCase(FetchLead.rejected, (state) => {
                state.IsLoading = false
            })

            .addCase(FetchStudent.pending, (state) => {
                state.IsLoading = true
            })
            .addCase(FetchStudent.fulfilled, (state, action) => {
                state.IsLoading = false,
                    state.IsAuthenticated = action.payload.success,
                    state.user.role = action.payload.success ? action.payload.role : "Student"
            })
            .addCase(FetchStudent.rejected, (state) => {
                state.IsLoading = false
            })


            .addCase(Logout.pending, (state) => {
                state.IsLoading = true
            })
            .addCase(Logout.fulfilled, (state, action) => {
                state.IsLoading = false,
                    state.IsAuthenticated = action.payload.success ? false : true
            })
            .addCase(Logout.rejected, (state) => {
                state.IsLoading = false
            })
            
    },  
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
