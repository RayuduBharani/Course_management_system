import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: IAuthenticatedProps = {
    IsAuthenticated: false,
    user: {
        userId: "",
        role: "Empty",
        name: "",
        email: "",
        image: ""
    },
    IsLoading: true
}

export const LoginUser = createAsyncThunk(
    "/auth/signin",
    async (formData: IRegistrationCredentials) => {
        const response = await fetch("https://course-management-system-2-2wm4.onrender.com/api/auth/signin", {
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
        try {
            const response = await fetch("https://course-management-system-2-2wm4.onrender.com/api/auth/check-auth", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                }
            });
            
            if (!response.ok) {
                console.error('Auth check failed:', {
                    status: response.status,
                    statusText: response.statusText
                });
                
                const errorData = await response.json().catch(() => ({}));
                console.error('Error details:', errorData);
                
                throw new Error(`Auth check failed: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Auth check error:', error);
            throw error;
        }
    }
);

export const FetchInstructor = createAsyncThunk(
    "/check/verify-instructor",
    async (formData: instructorFormData) => {
        const response = await fetch("https://course-management-system-2-2wm4.onrender.com/api/check-verify/instructor", {
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
    async (formData: ILeadFormData) => {
        const response = await fetch("https://course-management-system-2-2wm4.onrender.com/api/check-verify/lead", {
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
    "/check/verify-student",
    async (formData: IStudentFormData) => {
        console.log(formData)
        const response = await fetch("https://course-management-system-2-2wm4.onrender.com/api/check-verify/student", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        })
        const data = await response.json()
        console.log(data)
        return data
    }
)

export const Logout = createAsyncThunk(
    "/" ,
    async () =>{
        const response = await fetch("https://course-management-system-2-2wm4.onrender.com/api/auth/logout" , {
            credentials : "include"
        })
        const data = await response.json()
        return data
    }
)

export const GoogleAuth = createAsyncThunk(
    "/check/google",
    async (formData : IGoogleLogin) => {
        const response = await fetch("https://course-management-system-2-2wm4.onrender.com/api/auth/google", {
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
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
                
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                state.IsAuthenticated = action.payload.success ? true : false,
                state.IsLoading = false
                state.user = action.payload.user
            })
            .addCase(CheckAuthentication.rejected, (state) => {
                state.IsLoading = false
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                state.IsAuthenticated = false ,
                state.user.role = "Empty",
                state.user.userId = "" 
            })


            .addCase(FetchInstructor.pending, (state) => {
                state.IsLoading = true
            })
            .addCase(FetchInstructor.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.IsLoading = false;
                    state.IsAuthenticated = true;
                    state.user.role = action.payload.role;
                    state.user = { ...state.user, ...action.payload.data };
                } else {
                    state.IsLoading = false;
                    state.user.role = "Empty";
                }
            })
            .addCase(FetchInstructor.rejected, (state) => {
                state.IsLoading = false;
                state.user.role = "Empty";
            })


            .addCase(FetchLead.pending, (state) => {
                state.IsLoading = true
            })
            .addCase(FetchLead.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.IsLoading = false;
                    state.IsAuthenticated = true;
                    state.user.role = action.payload.role;
                    state.user = { ...state.user, ...action.payload.data };
                } else {
                    state.IsLoading = false;
                    state.user.role = "Empty";
                }
            })
            .addCase(FetchLead.rejected, (state) => {
                state.IsLoading = false;
                state.user.role = "Empty";
            })

            .addCase(FetchStudent.pending, (state) => {
                state.IsLoading = true
            })
            .addCase(FetchStudent.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.IsLoading = false;
                    state.IsAuthenticated = true;
                    state.user.role = action.payload.role;
                    state.user = { ...state.user, ...action.payload.data };
                } else {
                    state.IsLoading = false;
                    state.user.role = "Empty";
                }
            })
            .addCase(FetchStudent.rejected, (state) => {
                state.IsLoading = false;
                state.user.role = "Empty";
            })


            .addCase(Logout.pending, (state) => {
                state.IsLoading = true
            })
            .addCase(Logout.fulfilled, (state, action) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
