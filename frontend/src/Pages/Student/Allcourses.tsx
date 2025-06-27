import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  PlayCircle,
  BookOpen,
  GraduationCap,
  Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/components/store/store";
import { fetchAllCourses } from "@/components/store/slices/CommonSlice";

export default function StudentAllCourses() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, courses } = useSelector((state: RootState) => state.course);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  // Calculate course statistics
  const stats = useMemo(() => {
    if (!courses?.length) return [];

    const totalStudents = courses.reduce((acc, course) => acc + (course.students?.length || 0), 0);
    const avgRating = 4.8; // This should come from actual ratings
    const totalInstructors = new Set(
      courses
        .filter(course => course.instructor)
        .map(course => course.instructor._id)
    ).size;
    
    return [
      {
        icon: <Layers className="h-5 w-5 text-primary" />,
        value: courses.length + "+",
        label: "Total Courses"
      },
      {
        icon: <Users className="h-5 w-5 text-primary" />,
        value: new Intl.NumberFormat("en-US", { notation: "compact" }).format(totalStudents) + "+",
        label: "Active Students"
      },
      {
        icon: <Star className="h-5 w-5 text-primary" />,
        value: avgRating.toFixed(1),
        label: "Avg Rating"
      },
      {
        icon: <GraduationCap className="h-5 w-5 text-primary" />,
        value: totalInstructors + "+",
        label: "Instructors"
      }
    ];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    
    return courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const handleCourseClick = (courseId: string) => {
    navigate(`${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!courses?.length) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden border-0 bg-primary text-primary-foreground">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-foreground/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-semibold mb-1">
                  Welcome to <span className="text-primary-foreground">GCC Academy</span>
                </h1>
                <p className="text-primary-foreground/80">
                  No courses available at the moment. Please check back later.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <Card className="overflow-hidden border-0 bg-primary text-primary-foreground">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-foreground/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-semibold mb-1">
                Welcome to <span className="text-primary-foreground/90">GCC Academy</span>
              </h1>
              <p className="text-primary-foreground/80">
                Explore, Learn and Build All Real Life Projects
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">All Courses</h2>
            <p className="text-muted-foreground">Discover {courses.length}+ courses to advance your skills</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-muted border-0"
              />
            </div>
            <Button variant="secondary" size="icon" className="bg-muted border-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCourses.map((course) => (
            <Card 
              key={course._id} 
              className="group cursor-pointer border-0 bg-card hover:bg-muted transition-colors duration-200"
              onClick={() => handleCourseClick(course._id)}
            >
              <div className="relative">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full aspect-video object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                  <PlayCircle className="h-10 w-10 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <Badge 
                  variant="secondary"
                  className="absolute top-3 right-3 bg-primary-foreground/90 text-primary hover:bg-primary-foreground/90"
                >
                  {course.level || 'All Levels'}
                </Badge>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium text-base line-clamp-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-sm text-muted-foreground">
                  by {course.instructor?.name || 'Unknown Instructor'}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-primary fill-current" />
                    <span>4.8</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>{course.students?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{course.files?.length || 0} lessons</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-semibold text-primary">₹{course.price}</span>
                  <Button size="sm" variant="secondary" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredCourses.length === 0 && (
            <div className="col-span-full flex justify-center items-center py-12">
              <Card className="border-0 bg-muted p-6 text-center max-w-sm">
                <h3 className="text-lg font-medium mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search terms</p>
                <Button variant="secondary" className="w-full" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}