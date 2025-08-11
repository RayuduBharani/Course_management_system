import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TeamMember {
    _id: string;
    name: string;
    email: string;
    profileImg: string;
    teamNum: string;
    courses: {
        course: [{
            courseId: {
                title: string;
                status?: string;
            }
        }]
    }[];
    phone?: string;
    branch?: string;
    college?: string;
}

interface TeamState {
    isLoading: boolean;
    TeamInfo: TeamMember[];
    filteredTeamInfo: TeamMember[];
    searchTerm: string;
    sortBy: 'name' | 'team' | 'courses';
    sortOrder: 'asc' | 'desc';
}

const initialState: TeamState = {
    isLoading: true,
    TeamInfo: [],
    filteredTeamInfo: [],
    searchTerm: '',
    sortBy: 'name',
    sortOrder: 'asc'
};

export const FindTeamMembers = createAsyncThunk(
    "/lead/members",
    async () => {
        const response = await fetch("https://course-management-system-2-2wm4.onrender.com/lead/team/members", {
            credentials: "include"
        });
        const data = await response.json();
        return data;
    }
);

export const sendTeamMessage = createAsyncThunk(
    "/lead/members/message",
    async ({ memberId, message }: { memberId: string; message: string }) => {
        const response = await fetch(`https://course-management-system-2-2wm4.onrender.com/lead/team/message/${memberId}`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        return data;
    }
);

const teamSlice = createSlice({
    name: "team",
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
            state.filteredTeamInfo = state.TeamInfo.filter(member => 
                member.name.toLowerCase().includes(action.payload.toLowerCase()) ||
                member.teamNum.toLowerCase().includes(action.payload.toLowerCase()) ||
                member.email.toLowerCase().includes(action.payload.toLowerCase())
            );
        },
        setSortBy: (state, action: PayloadAction<'name' | 'team' | 'courses'>) => {
            state.sortBy = action.payload;
            const sortedTeam = [...state.filteredTeamInfo].sort((a, b) => {
                if (action.payload === 'name') {
                    return state.sortOrder === 'asc' ? 
                        a.name.localeCompare(b.name) : 
                        b.name.localeCompare(a.name);
                } else if (action.payload === 'team') {
                    return state.sortOrder === 'asc' ? 
                        a.teamNum.localeCompare(b.teamNum) : 
                        b.teamNum.localeCompare(a.teamNum);
                } else {
                    return state.sortOrder === 'asc' ? 
                        (a.courses?.length || 0) - (b.courses?.length || 0) : 
                        (b.courses?.length || 0) - (a.courses?.length || 0);
                }
            });
            state.filteredTeamInfo = sortedTeam;
        },
        toggleSortOrder: (state) => {
            state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
            state.filteredTeamInfo = [...state.filteredTeamInfo].reverse();
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(FindTeamMembers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(FindTeamMembers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.TeamInfo = action.payload;
                state.filteredTeamInfo = action.payload;
            })
            .addCase(FindTeamMembers.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(sendTeamMessage.fulfilled, () => {
                // Handle success message if needed

            });
    },
});

export const { setSearchTerm, setSortBy, toggleSortOrder } = teamSlice.actions;
export default teamSlice.reducer;