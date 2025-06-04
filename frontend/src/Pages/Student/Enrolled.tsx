import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
    ArrowRight, 
    Search, 
    BookOpen, 
    Clock, 
    Users, 
    Layers,
    GraduationCap,
    BookCheck,
    Star
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

interface Course {
    _id: string;
    title: string;
    thumbnail: string;
    files: Array<{ title: string }>;
    instructor: {
        name: string;
    };
    students: Array<unknown>;
}

interface EnrolledCourse {
    _id: string;
    course: [{
        courseId: Course;
        DateOfPurchase: string;
    }];
}

export default function StudentEnrolledCourses() {
    const [myCourseInfo, setMyCourseInfo] = useState<EnrolledCourse[] | null>(null);
    const [search, setSearch] = useState<string>('');

    // Calculate course statistics
    const stats = useMemo(() => {
        if (!myCourseInfo) return [];

        const totalCourses = myCourseInfo.length;
        const totalLessons = myCourseInfo.reduce((acc, course) => 
            acc + course.course[0].courseId.files.length, 0);
        const completionRate = 75; // This should come from actual progress data
        const avgRating = 4.8; // This should come from actual ratings

        return [
            {
                icon: <Layers className="h-4 w-4" />,
                value: totalCourses + "+",
                label: "Enrolled Courses",
                color: "text-blue-600"
            },
            {
                icon: <BookCheck className="h-4 w-4" />,
                value: new Intl.NumberFormat("en-US", { notation: "compact" }).format(totalLessons),
                label: "Total Lessons",
                color: "text-green-600"
            },
            {
                icon: <Star className="h-4 w-4" />,
                value: avgRating.toFixed(1),
                label: "Avg Rating",
                color: "text-purple-600"
            },
            {
                icon: <GraduationCap className="h-4 w-4" />,
                value: completionRate + "%",
                label: "Completion Rate",
                color: "text-orange-600"
            }
        ];
    }, [myCourseInfo]);

    const FetchMyCourses = async () => {
        const url = search
            ? `http://localhost:8000/student/mycourse/search/${search}`
            : "http://localhost:8000/student/mycourse/all";

        const response = await fetch(url, {
            credentials: "include"
        });
        const data = await response.json();

        if (data.success) {
            setMyCourseInfo(data.studentCourses);
        } else {
            console.log(data.message);
            setMyCourseInfo([]);
        }
    };

    useEffect(() => {
        FetchMyCourses();
    }, [search]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        FetchMyCourses();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Welcome Banner */}
                <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600">
                    <CardContent className="p-8 flex items-center gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <div className="text-white">
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                My Learning Journey
                            </h1>
                            <p className="text-white/90 text-lg">
                                Track your progress and continue learning
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Search Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Enrolled Courses</h2>
                        <p className="text-gray-600">Continue your learning journey</p>
                    </div>
                    <form onSubmit={handleSearch} className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                                name="search"
                                className="pl-10 border-0 shadow-md"
                                placeholder="Search your courses..."
                            />
                        </div>
                        <Button type="submit" className="shadow-md">Search</Button>
                    </form>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="border-0 shadow-md p-4 flex items-center gap-4">
                            <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {myCourseInfo && myCourseInfo.length === 0 ? (
                        <div className="col-span-full flex justify-center items-center py-16">
                            <Card className="border-0 shadow-md p-8 text-center max-w-md">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
                                <p className="text-gray-600 mb-6">Start your learning journey today by enrolling in our courses.</p>
                                <Link to="/student/courses">
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        Browse Courses
                                    </Button>
                                </Link>
                            </Card>
                        </div>
                    ) : (
                        myCourseInfo && myCourseInfo.map((course, index) => (
                            <Card 
                                key={index} 
                                className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                            >
                                <div className="relative">
                                    <AspectRatio ratio={16 / 9}>
                                        <img 
                                            src={course.course[0].courseId.thumbnail} 
                                            alt={course.course[0].courseId.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </AspectRatio>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                </div>
                                
                                <CardContent className="p-5 space-y-3">
                                    <h3 className="font-bold text-lg leading-tight text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {course.course[0].courseId.title}
                                    </h3>
                                    
                                    <p className="text-gray-600 text-sm">by {course.course[0].courseId.instructor.name}</p>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span>{course.course[0].courseId.students.length} Students</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{course.course[0].courseId.files.length} Lessons</span>
                                        </div>
                                    </div>
                                    
                                    <Link to={`view-page/${course._id}`} className="block">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                            <span>Continue Learning</span>
                                            <ArrowRight size={16} className="ml-2" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
