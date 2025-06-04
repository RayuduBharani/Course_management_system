import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Hash, 
  BookOpen,
  GraduationCap,
  Trophy,
  Star
} from "lucide-react";

interface EnrolledCourse {
  _id: string;
  course: [{
    courseId: {
      files: Array<{ title: string }>;
      _id: string;
      title: string;
      rating?: number;
    };
  }];
}

interface StatItem {
  icon: JSX.Element;
  label: string;
  value: string;
  color: string;
}
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/components/store/store";
import { StudentProfileInfo } from "@/components/store/slices/student/profileSlice";
import StudentEditProfile from "@/components/Student/Editprofile";
import Loader from "@/components/Loading";
import { useNavigate } from "react-router-dom";

export default function StudentProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, profileInfo } = useSelector((state: RootState) => state.studentProfile);

  useEffect(() => {
    dispatch(StudentProfileInfo());
  }, [dispatch]);  const [, setMyCourses] = useState<EnrolledCourse[]>([]);
  const [stats, setStats] = useState<StatItem[]>([
    { icon: <BookOpen className="h-5 w-5" />, label: "Enrolled Courses", value: "0", color: "from-blue-500 to-blue-600" },
    { icon: <GraduationCap className="h-5 w-5" />, label: "Total Lessons", value: "0", color: "from-green-500 to-green-600" },
    { icon: <Trophy className="h-5 w-5" />, label: "Completion Rate", value: "0%", color: "from-orange-500 to-orange-600" },
    { icon: <Star className="h-5 w-5" />, label: "Avg Rating", value: "0.0", color: "from-purple-500 to-purple-600" },
  ]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8000/student/mycourse/all", {
          credentials: "include"
        });
        const data = await response.json();
        if (data.success) {
          setMyCourses(data.studentCourses || []);
          updateStats(data.studentCourses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const updateStats = (courses: EnrolledCourse[]) => {
    if (!courses?.length) return;

    const totalCourses = courses.length;
    const totalLessons = courses.reduce((acc, course) => 
      acc + (course.course[0].courseId.files?.length || 0), 0);
    const completionRate = 75; // This would ideally come from progress tracking
    const avgRating = 4.8; // This would ideally come from course ratings

    setStats([
      { 
        icon: <BookOpen className="h-5 w-5" />,
        label: "Enrolled Courses", 
        value: totalCourses.toString(),
        color: "from-blue-500 to-blue-600"
      },
      { 
        icon: <GraduationCap className="h-5 w-5" />,
        label: "Total Lessons", 
        value: totalLessons.toString(),
        color: "from-green-500 to-green-600"
      },
      { 
        icon: <Trophy className="h-5 w-5" />,
        label: "Completion Rate", 
        value: completionRate + "%",
        color: "from-orange-500 to-orange-600"
      },
      { 
        icon: <Star className="h-5 w-5" />,
        label: "Avg Rating", 
        value: avgRating.toFixed(1),
        color: "from-purple-500 to-purple-600"
      }
    ]);
  };

  if (isLoading || !profileInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Card */}
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
          <CardContent className="p-0">
            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-black/10"></div>
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              
              <div className="relative p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Profile Image */}
                  <div className="relative group">
                    <Avatar className="w-32 h-32 border-4 border-white/20 shadow-2xl">
                      <AvatarImage src={profileInfo.profileImg} alt={profileInfo.name} />
                      <AvatarFallback className="text-2xl bg-white/10 text-white">
                        {profileInfo.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                      {profileInfo.name}
                    </h1>
                    <p className="text-xl text-white/80">{profileInfo.branch}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                        {profileInfo.rollNumber}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                        Team {profileInfo.teamNum || profileInfo.teamNo}
                      </Badge>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <StudentEditProfile />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <CardContent className={`p-6 bg-gradient-to-br ${stat.color}`}>
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="h-6 w-6 text-blue-600" />
                  Personal Information
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="font-medium text-gray-900">{profileInfo.name}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="font-medium text-gray-900">{profileInfo.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Roll Number
                    </Label>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="font-medium text-gray-900">{profileInfo.rollNumber}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Branch
                    </Label>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="font-medium text-gray-900">{profileInfo.branch}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Gender
                    </Label>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="font-medium text-gray-900">{profileInfo.gender}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Team Number
                    </Label>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="font-medium text-gray-900">Team {profileInfo.teamNum || profileInfo.teamNo}</p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate('/student/courses')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Courses
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}