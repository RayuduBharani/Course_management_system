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

  const courses = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rawCourses.map((adminCourse: any) => ({
      ...adminCourse,
      students: adminCourse.students?.map((studentId: string) => ({ studentId }))
    })) as Course[];
  }, [rawCourses]);

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
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-10 pt-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            Instructor Portal
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Shape the Future of
            <span className="text-blue-600"> Learning</span>
          </h1>
          
          <p className="text-base text-slate-600 max-w-xl mx-auto mb-6">
            Empower students worldwide with your expertise. Create impactful courses, 
            track progress, and build a community of learners.
          </p>
          
          <Button 
            onClick={() => navigate('/instructor/new')}
            className="inline-flex items-center"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-50 rounded-md">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xl font-bold text-slate-900">{stats.activeCourses}</span>
            </div>
            <h3 className="font-medium text-slate-900 mb-0.5">Active Courses</h3>
            <p className="text-sm text-slate-500">Currently published</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-50 rounded-md">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                {new Intl.NumberFormat("en-US", { notation: "compact" }).format(stats.totalStudents)}
              </span>
            </div>
            <h3 className="font-medium text-slate-900 mb-0.5">Total Students</h3>
            <p className="text-sm text-slate-500">Across all courses</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-50 rounded-md">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-xl font-bold text-slate-900">{stats.completionRate}%</span>
            </div>
            <h3 className="font-medium text-slate-900 mb-0.5">Completion Rate</h3>
            <p className="text-sm text-slate-500">Student success</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="group cursor-pointer" 
              onClick={() => navigate('/instructor/new')}
            >
              <div className="p-4 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-slate-900 mb-0.5">Create New Course</h3>
                    <p className="text-sm text-slate-500">Start building your next course</p>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="group cursor-pointer"
              onClick={() => navigate('/instructor/courses')}
            >
              <div className="p-4 rounded-lg border border-slate-200 hover:border-green-200 hover:bg-green-50/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-md flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-slate-900 mb-0.5">Manage Students</h3>
                    <p className="text-sm text-slate-500">View and interact with learners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}