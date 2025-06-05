interface Instructor {
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

interface CourseFile {
    _id: string;
    title: string;
    videoUrl: string;
    public_id: string;
    freePreview: boolean;
}

export interface AdminCourse {
    _id: string;
    title: string;
    subtitle: string;
    description: string;
    instructor: Instructor;
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
    students: string[];
    files: CourseFile[];
}

export interface FindInstructorCourses {
    isLoading: boolean;
    courses: AdminCourse[];
    error: string | null;
}
