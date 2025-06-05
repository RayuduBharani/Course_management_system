export interface ICourse {
    _id: string;
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
    files: {
        freePreview: boolean;
        public_id: string;
        videoUrl: string;
        title: string;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
    price: string;
    objectives: string;
}
