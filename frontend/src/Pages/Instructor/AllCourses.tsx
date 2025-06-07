import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star, 
  Clock, 
  Users, 
  PlayCircle,
  GraduationCap,
  Layers,
  Plus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/components/store/store";
import { FetchInstructorCourses } from "@/components/store/slices/Instructor/courses";
import Loader from "@/components/Loading";
import type { AdminCourse } from "@/lib/admin-types";

export default function InstructorAllCourses() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { courses, isLoading, error } = useSelector((state: RootState) => state.Instructor);
    
    useEffect(() => {
        dispatch(FetchInstructorCourses())
    }, [dispatch]);

    // Calculate instructor stats
    const stats = useMemo(() => {
        const totalStudents = courses.reduce((acc: number, course: AdminCourse) => acc + (course.students?.length || 0), 0);
        const avgRating = 4.8; // This should come from actual ratings
        const totalLessons = courses.reduce((acc: number, course: AdminCourse) => acc + (course.files?.length || 0), 0);
        
        return [
            {
                icon: <Layers className="h-4 w-4" />,
                value: courses.length + "+",
                label: "Total Courses",
                color: "text-blue-600"
            },
            {
                icon: <Users className="h-4 w-4" />,
                value: totalStudents.toString() + "+",
                label: "Total Students",
                color: "text-green-600"
            },
            {
                icon: <Star className="h-4 w-4" />,
                value: avgRating.toFixed(1),
                label: "Avg Rating",
                color: "text-purple-600"
            },
            {
                icon: <PlayCircle className="h-4 w-4" />,
                value: totalLessons.toString() + "+",
                label: "Total Lessons",
                color: "text-orange-600"
            }
        ];
    }, [courses]);

    const filteredCourses = courses.filter((course: AdminCourse) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <Loader />
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
                <div className="text-center">
                    <p className="text-lg text-red-500 font-bold mb-4">{error}</p>
                    <Button onClick={() => dispatch(FetchInstructorCourses())}>Try Again</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Welcome Banner */}
                <Card className="bg-primary/5 border-none">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <GraduationCap className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Welcome to GCC Academy</h1>
                                <p className="text-muted-foreground">Create, Teach and Inspire Students</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Header & Search */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">My Courses</h2>
                        <p className="text-muted-foreground">Manage your {courses.length} published courses</p>
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search your courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button 
                            onClick={() => navigate("/instructor/new")}
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            New Course
                        </Button>
                    </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-primary/5 border-none">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Layers className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                                    <h3 className="text-2xl font-bold">{courses.length}+</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-none">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                                    <h3 className="text-2xl font-bold">{stats[1].value}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-50 border-none">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <Star className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                                    <h3 className="text-2xl font-bold">{stats[2].value}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-orange-50 border-none">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-orange-100 rounded-full">
                                    <PlayCircle className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Lessons</p>
                                    <h3 className="text-2xl font-bold">{stats[3].value}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredCourses.length === 0 ? (
                        <div className="col-span-full py-12 px-4">
                            <div className="max-w-sm mx-auto text-center space-y-4">
                                <div className="p-3 bg-primary/10 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                                    <Plus className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">No courses found</h3>
                                <p className="text-sm text-muted-foreground">Start by creating your first course</p>
                                <Button 
                                    onClick={() => navigate("/instructor/new")}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Course
                                </Button>
                            </div>
                        </div>
                    ) : (
                        filteredCourses.map((course) => (
                            <Card 
                                key={course._id} 
                                className="group overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow"
                            >
                                <div className="relative aspect-video">
                                    <img 
                                        src={course.thumbnail} 
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <Badge 
                                        variant={
                                            course.level === 'Beginner' ? 'default' :
                                            course.level === 'Intermediate' ? 'secondary' : 'destructive'
                                        }
                                        className={`absolute top-3 right-3 ${
                                            course.level === 'Beginner' 
                                                ? 'bg-primary/10 text-primary hover:bg-primary/20' :
                                            course.level === 'Intermediate'
                                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                                        }`}
                                    >
                                        {course.level || 'All Levels'}
                                    </Badge>
                                </div>
                                
                                <CardContent className="p-4 space-y-3">
                                    <Link to={`/instructor/courses/view/${course._id}`}>
                                        <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
                                            {course.title}
                                        </h3>
                                    </Link>
                                    
                                    <p className="text-muted-foreground text-sm">by {course.instructor.name}</p>
                                    
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="h-4 w-4" />
                                            <span>{course.students?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4" />
                                            <span>{course.files?.length || 0}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-lg font-bold">₹{course.price}</span>
                                        <Link to={`/instructor/courses/view/${course._id}`}>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="hover:bg-primary hover:text-white transition-colors"
                                            >
                                                Manage
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
