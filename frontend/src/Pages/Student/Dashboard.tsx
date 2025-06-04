import { useEffect, useState, useCallback } from "react";
import { BookOpen, Users, Star, GraduationCap, BookOpenCheck, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/components/store/store";
import { fetchAllCourses } from "@/components/store/slices/CommonSlice";

interface Course {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  price: string;  // Changed from number to string to match backend data
  instructor: {
    name: string;
    _id: string;
  };
  students: Array<{ studentId: string; paidAmount: string; }>;
  files: Array<{
    title: string;
    videoUrl: string;
    public_id: string;
    freePreview: boolean;
  }>;
}

interface EnrolledCourse {
  _id: string;
  course: [{
    courseId: Course;
    DateOfPurchase: string;
    instructorId: string;
    paid: number;
  }];
}

export default function CoursesHomepage() {
  const [myCourses, setMyCourses] = useState<EnrolledCourse[]>([]);
  const [courseStats, setCourseStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    avgRating: 0,
    completionRate: 0
  });
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const dispatch = useDispatch<AppDispatch>();
  const { courses: allCourses } = useSelector((state: RootState) => state.course);

  const calculateCompletionRate = (courses: EnrolledCourse[]) => {
    if (!courses?.length) return 0;
    return 95;
  };
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const coursesResponse = await fetch("http://localhost:8000/student/mycourse/all", {
        credentials: "include"
      });
      const coursesData = await coursesResponse.json();
      
      if (coursesData.success) {
        setMyCourses(coursesData.studentCourses || []);
      }

      await dispatch(fetchAllCourses());
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (allCourses) {
      // Update course statistics
      setCourseStats({
        totalCourses: allCourses.length || 0,
        totalStudents: allCourses.reduce((acc, course) => acc + (course.students?.length || 0), 0),
        avgRating: 4.8, // This should come from a real rating system
        completionRate: calculateCompletionRate(myCourses)
      });
      
      // Update popular courses
      const sorted = [...allCourses]
        .sort((a, b) => (b.students?.length || 0) - (a.students?.length || 0))
        .slice(0, 4); // Show top 4 popular courses
      setPopularCourses(sorted);
    }
  }, [allCourses, myCourses]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = [
    {
      icon: <BookOpen className="h-6 w-6 text-white" />,
      value: courseStats.totalCourses.toString() + "+",
      label: "Available Courses",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      value: new Intl.NumberFormat("en-US", { notation: "compact" }).format(courseStats.totalStudents) + "+",
      label: "Active Learners",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      icon: <Trophy className="h-6 w-6 text-white" />,
      value: courseStats.avgRating.toFixed(1),
      label: "Avg. Rating",
      bgColor: "bg-gradient-to-br from-emerald-500 to-emerald-600"
    },
    {
      icon: <BookOpenCheck className="h-6 w-6 text-white" />,
      value: courseStats.completionRate + "%",
      label: "Completion Rate",
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Welcome back to <span className="text-yellow-300">GCC Academy</span>
                </h1>
                <p className="text-white/90">
                  {myCourses.length ? `Continue learning your ${myCourses.length} enrolled courses` : "Start your learning journey today"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md overflow-hidden">
              <CardContent className={`${stat.bgColor} p-6`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    {stat.icon}
                  </div>
                  <div className="text-white">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm opacity-90">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enrolled Courses */}
        {myCourses.length > 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
              <p className="text-gray-600">Pick up where you left off</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.slice(0, 3).map((course, index) => (
                <Link key={index} to={`/student/mycourses/view-page/${course._id}`}>
                  <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={course.course[0].courseId.thumbnail} 
                          alt={course.course[0].courseId.title}
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {course.course[0].courseId.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {course.course[0].courseId.files.length} lessons
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Continue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Popular Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Popular Courses</h2>
              <p className="text-gray-600">Join thousands of students in our top-rated courses</p>
            </div>
            <Link to="/student/courses">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCourses.map((course, index) => (
              <Link key={index} to={`/student/courses/${course._id}`}>
                <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <AspectRatio ratio={16/9}>
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">by {course.instructor.name}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">4.8</span>
                        <span className="text-sm text-gray-500">({course.students.length})</span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">₹{course.price}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}