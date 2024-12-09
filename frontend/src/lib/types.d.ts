interface Iuser {
    userId: string
    role: "Admin" | "Student" | "Lead" | "Instructor" | "Empty"
    email: string,
    image: string,
    name: string
}



interface IAuthenticatedProps {
    IsAuthenticated: boolean;
    user: Iuser;
    children?: React.ReactNode;
    IsLoading?: boolean
}

interface ICookieData {
    token: string
}

interface IuserInfo {
    _id: string,
    name: string,
    password: string,
    image: string,
    role: "Admin" | "Student" | "Lead" | "Instructor" | "Empty",
    __v?: number,
    createdAt?: Date,
    updatedAt?: Date
}

interface IloginInfo {
    success: boolean,
    message: string
}
interface IRegistrationCredentials {
    name?: string
    email: string,
    password: string
}

interface IAuthChecking {
    success: boolean,
    message: string,
    user?: IuserInfo
}

interface instructorFormData {
    userId?: string
    name?: string
    rollNumber: string
    branch: string
    email?: string
    profileImg: string
    role?: "Instructor",
    linkedIn: string
    gitHub: string,
    UPI : string,
    college : string,
    gender : string
}

interface LeadFormData {
    rollNumber: string,
    branch: string,
    teamNo: string,
    profileImg: string
}

interface StudentFormData {
    rollNumber: string,
    branch: string,
    teamNum: string,
    profileImg: string
}

interface File {
    freePreview: boolean;
    public_id: string;
    videoUrl: string;
    title: string
}

interface ICourse extends Document {
    _id: any;
    instructor: {
        branch: string;
        courseId: string[];
        email: string;
        gitHub: string;
        linkedIn: string;
        name: string;
        profileImg: string;
        role: string;
        rollNumber: string;
        userId: string;
        __v: number;
        _id: string;
    }
    thumbnail: string;
    title: string;
    subtitle: string;
    description: string;
    category: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All levels';
    leads: {
        leadId: string,
        paidAmount: string,
        _id: string
    }[];
    students: {
        studentId: string,
        paidAmount: string,
        _id: string
    }[];
    requirements: string;
    keyPoints: string;
    files: File[];
    createdAt?: Date;
    updatedAt?: Date;
    price: string,
    objectives: string
}

interface ViewCourseinitialState {
    isLoading: boolean;
    courseData: ICompleateCourseInfo[];
}
interface ICompleateCourseInfo {
    _id: string,
    leadId: {
        _id: string,
        userId: string,
        name: string,
        teamNo: string,
        email: string,
        rollNumber: string,
        branch: string,
        profileImg: string,
        role: string,
        createdAt: Date,
        updatedAt: Date,
        gender: string
        __v: number
    },
    course: [
        {
            courseId: ICourse
            courseTitle: string,
            instructorId: string,
            paid: number,
            _id: string,
            DateOfPurchase: Date
        }
    ],
    createdAt: Date,
    updatedAt: Date,
    __v: number
}


interface IprofileInfo {
    _id: string,
    userId: string,
    name: string,
    teamNo?: string,
    email: string,
    rollNumber: string,
    branch: string,
    profileImg: string,
    role: string,
    createdAt?: Date,
    updatedAt?: Date,
    gender?: string,
    college?: string
    teamNum?: string,
    __v?: number
}

interface ILeadProfileResponse {
    success: boolean;
    data: {
        _id: string,
        userId: string,
        name: string,
        teamNo: string,
        email: string,
        rollNumber: string,
        branch: string,
        profileImg: string,
        role: string,
        createdAt: Date,
        updatedAt: Date,
        gender: string
        __v: number
    }
}

interface ILeadProfileResponse {
    _id: string;
    data: {
        name: string;
        rollNumber: string;
        gender: string;
        branch: string;
        profileImg: string;
        _id: string
    };
}

interface InitialState {
    isLoading: boolean;
    profileInfo: ILeadProfileResponse | null;
}

interface IUpdateProfileData {
    _id: string | undefined;
    name: string | undefined;
    rollNumber: string | undefined;
    gender: string | undefined;
    branch: string | undefined;
    profileImg: string | undefined;
    teamNum?: string | undefined
    teamNo?: string | undefined
}

interface UserProfile {
    courses: [];
    _id: string;
    userId: string;
    name: string;
    email: string;
    rollNumber: string;
    branch: string;
    gender: string;
    teamNum: string;
    role: string;
    profileImg: string;
    enrolledCourses: string[]; // Assuming it's an array of course IDs
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
}

interface IGoogleLogin {
    name: string
    email: string
    image: string
    role: string
}


interface AdminCourse {
    _id: string;
    title: string;
    subtitle: string;
    description: string;
    instructor: {
        branch: string;
        courseId: string[];
        email: string;
        gitHub: string;
        linkedIn: string;
        name: string;
        profileImg: string;
        role: string;
        rollNumber: string;
        userId: string;
        __v: number;
        _id: string;
    }
    category: string;
    level: string;
    objectives: string;
    keyPoints: string;
    requirements: string;
    price: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    thumbnail: string;
    students: Array<string>;
    files: [{
        _id: string;
        title: string;
        videoUrl: string;
        public_id: string;
        freePreview: boolean;
    }]
}


interface FindInstructorCourses {
    isLoading: boolean,
    courses: [
        AdminCourse
    ] | []
}

interface InstructorProfileInitialstate {
    isLoading: boolean,
    profileInfo:
    {
        branch: string;
        courseId: string[];
        email: string;
        gitHub: string;
        linkedIn: string;
        name: string;
        profileImg: string;
        role: string;
        rollNumber: string;
        userId: string;
        __v?: number;
        _id: string;
        UPI : string ,
        college :string,
        gender : string
    }
}


interface FORMDATA {
    linkedIn: string;
    gitHub: string;
    rollNumber: string;
    gender: string;
    college: string;
    branch: string;
    UPI: string;
    profileImg?: string;
}