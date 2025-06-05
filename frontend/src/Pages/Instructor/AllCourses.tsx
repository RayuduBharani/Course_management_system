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

export default function InstructorAllCourses() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { courses, isLoading, error } = useSelector((state: RootState) => state.Instuctor);
    
    useEffect(() => {
        dispatch(FetchInstructorCourses())
    }, [dispatch]);

    // Calculate instructor stats
    const stats = useMemo(() => {
        const totalStudents = courses.reduce((acc, course) => acc + (course.students?.length || 0), 0);
        const avgRating = 4.8; // This should come from actual ratings
        const totalLessons = courses.reduce((acc, course) => acc + (course.files?.length || 0), 0);
        
        return [
            {
                icon: <Layers className="h-4 w-4" />,
                value: courses.length + "+",
                label: "Total Courses",
                color: "text-blue-600"
            },
            {
                icon: <Users className="h-4 w-4" />,
                value: new Intl.NumberFormat("en-US", { notation: "compact" }).format(totalStudents) + "+",
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
                value: totalLessons + "+",
                label: "Total Lessons",
                color: "text-orange-600"
            }
        ];
    }, [courses]);

    const filteredCourses = courses.filter(course =>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Welcome Banner */}
                <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600">
                    <CardContent className="p-8 flex items-center gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <GraduationCap className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <div className="text-white">
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                Welcome to <span className="text-yellow-300">GCC Academy</span>
                            </h1>
                            <p className="text-white/90 text-lg">
                                Create, Teach and Inspire Students
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Header & Search */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h2>
                        <p className="text-gray-600">Manage your {courses.length} published courses</p>
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search your courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-0 shadow-md"
                            />
                        </div>
                        <Button 
                            className="shadow-md" 
                            onClick={() => navigate("/instructor/new")}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            New Course
                        </Button>
                    </div>
                </div>

                {/* Course Stats */}
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

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-400 text-lg mb-2">No courses found</div>
                            <p className="text-gray-500 mb-4">Start by creating your first course</p>
                            <Button onClick={() => navigate("/instructor/new")}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Course
                            </Button>
                        </div>
                    ) : (
                        filteredCourses.map((course) => (
                            <Card 
                                key={course._id} 
                                className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                            >
                                <div className="relative">
                                    <img 
                                        src={course.thumbnail} 
                                        alt={course.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                        <PlayCircle className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <Badge 
                                        className={`absolute top-3 right-3 ${
                                            course.level === 'Beginner' ? 'bg-green-500' :
                                            course.level === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    >
                                        {course.level || 'All Levels'}
                                    </Badge>
                                </div>
                                
                                <CardContent className="p-5 space-y-3">
                                    <Link to={`/instructor/courses/view/${course._id}`}>
                                        <h3 className="font-bold text-lg leading-tight text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {course.title}
                                        </h3>
                                    </Link>
                                    
                                    <p className="text-gray-600 text-sm">by {course.instructor.name}</p>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span>{course.students?.length || 0} students</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{course.files?.length || 0} lessons</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-2xl font-bold text-blue-600">₹{course.price}</span>
                                        <Link to={`/instructor/courses/view/${course._id}`}>
                                            <Button variant="outline" size="sm">
                                                Manage Course
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
