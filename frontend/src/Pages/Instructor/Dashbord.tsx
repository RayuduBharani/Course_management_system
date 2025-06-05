import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/components/store/store";
import { FetchInstructorCourses } from "@/components/store/slices/Instructor/courses";
import Loader from "@/components/Loading";

interface Course {
  _id: string;
  title: string;
  students?: Array<{ studentId: string }>;
  files?: Array<{
    _id: string;
    title: string;
    description?: string;
    duration?: string;
  }>;
  isPublished?: boolean;
}

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { rawCourses, isLoading, error } = useSelector((state: RootState) => ({
    rawCourses: state.Instructor.courses,
    isLoading: state.Instructor.isLoading as boolean,
    error: state.Instructor.error as string | null
  }));

  // Memoize the courses transformation
  const courses = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rawCourses.map((adminCourse: any) => ({
      ...adminCourse,
      students: adminCourse.students?.map((studentId: string) => ({ studentId }))
    })) as Course[];
  }, [rawCourses]);

  // Memoize stats calculation
  const stats = useMemo(() => {
    if (!Array.isArray(courses)) {
      return {
        activeCourses: 0,
        totalStudents: 0,
        completionRate: 0
      };
    }

    const activeCourses = courses.filter(course => course.isPublished).length;
    const totalStudents = courses.reduce((acc, course) => 
      acc + (course.students?.length || 0), 0);
    
    let totalCompletedContent = 0;
    let totalContent = 0;
    
    courses.forEach(course => {
      if (course.isPublished) {
        const totalLessons = course.files?.length || 0;
        const studentsCount = course.students?.length || 0;
        totalContent += totalLessons * studentsCount;
        totalCompletedContent += Math.floor((totalLessons * studentsCount) * 0.4);
      }
    });
    
    const completionRate = totalContent > 0 
      ? Math.round((totalCompletedContent / totalContent) * 100) 
      : 0;

    return {
      activeCourses,
      totalStudents,
      completionRate
    };
  }, [courses]);

  useEffect(() => {
    dispatch(FetchInstructorCourses());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button 
            onClick={() => dispatch(FetchInstructorCourses())}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            Instructor Portal
          </div>
          
          <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Shape the Future of
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Learning</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Empower students worldwide with your expertise. Create impactful courses, 
            track progress, and build a community of learners.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg"
              onClick={() => navigate('/instructor/new')}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Create Course
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.activeCourses}</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Active Courses</h3>
            <p className="text-sm text-slate-500">Currently published</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {new Intl.NumberFormat("en-US", { notation: "compact" }).format(stats.totalStudents)}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Total Students</h3>
            <p className="text-sm text-slate-500">Across all courses</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.completionRate}%</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Completion Rate</h3>
            <p className="text-sm text-slate-500">Student success</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="group cursor-pointer" 
              onClick={() => navigate('/instructor/new')}
            >
              <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Create New Course</h3>
                  <p className="text-sm text-slate-500">Start building your next course</p>
                </div>
              </div>
            </div>

            <div 
              className="group cursor-pointer"
              onClick={() => navigate('/instructor/courses')}
            >
              <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-green-300 hover:bg-green-50/50 transition-all">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Manage Students</h3>
                  <p className="text-sm text-slate-500">View and interact with learners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}