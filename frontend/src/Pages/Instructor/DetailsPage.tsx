import Videoplayer from "@/components/Common/VideoPlayer/Videoplayer";
import Loader from "@/components/Loading";
import { AppDispatch, RootState } from "@/components/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { hourglass } from "ldrs";
import BookLoader from "@/components/Loading/BookLoader";
import { FetchAdminCourseView } from "@/components/store/slices/admin/course-view";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Student {
  id: string;
  name: string;
  email: string;
  profileImg: string;
  college: string;
  rollNumber: string;
  enrolledAt: string;
}

export default function InstructorCourseEnrollDetailesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, courseData } = useSelector(
    (state: RootState) => state.adminProgress
  );
  const [value, setValue] = useState<number | undefined>(1);
  const [videoLoad, setVideoLoad] = useState<boolean>(false);  const { id } = useParams();
  hourglass.register();

  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error("Course ID is required");
        }
        
        setLoading(true);
        const result = await dispatch(FetchAdminCourseView(id)).unwrap();
        setStudents(result.students || []);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch course data";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, toast]);

  if (isLoading) {
    return <Loader />;
  }

  function handleCourse(index: number) {
    setValue(index + 1);
    setVideoLoad(true);

    setTimeout(() => {
      setVideoLoad(false);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2 bg-white hover:bg-primary hover:text-white transition-colors duration-200"
          >
            <i className="fa-solid fa-arrow-left text-sm"></i>
            <span className="font-medium">Back</span>
          </Button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Total Students: {loading ? "..." : students.length}
            </span>
          </div>
        </div>

        {/* Course Title and Info */}
        {courseData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {courseData.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {courseData.category}
              </Badge>
              <span className="flex items-center gap-1">
                <i className="fa-solid fa-video"></i>
                {courseData.files?.length || 0} lessons
              </span>
              <span className="flex items-center gap-1">
                <i className="fa-solid fa-users"></i>
                {courseData.students?.length || 0} students
              </span>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <i className="fa-solid fa-users text-primary"></i>
              Enrolled Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <i className="fa-solid fa-user-graduate text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-500">No students enrolled yet</p>
              </div>
            ) : (
              <ScrollArea className="h-[600px] rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-white shadow-sm">
                    <TableRow>
                      <TableHead className="w-[50px]">Profile</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden lg:table-cell">College</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead className="hidden md:table-cell">Enrolled On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={student.profileImg} />
                            <AvatarFallback>
                              {student.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                        <TableCell className="hidden lg:table-cell">{student.college}</TableCell>
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(student.enrolledAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-240px)]">
          {/* Course Videos Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <i className="fa-solid fa-list-ul text-primary text-sm"></i>
                  Course Content
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {courseData?.files?.length || 0} videos
                </p>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2">
                  {courseData?.files?.map((data, index) => (
                    <div
                      onClick={() => handleCourse(index)}
                      key={index}
                      className={`
                        group relative flex items-center gap-3 p-3 m-1 rounded-lg cursor-pointer
                        transition-all duration-200 hover:bg-primary/5
                        ${value && value - 1 === index
                          ? "bg-primary/10 border border-primary/20 shadow-sm"
                          : "hover:shadow-sm"
                        }
                      `}
                    >
                      <div className={`
                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                        ${value && value - 1 === index
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-400 group-hover:bg-primary/20 group-hover:text-primary"
                        }
                      `}>
                        {value && value - 1 === index ? (
                          <i className="fa-solid fa-pause text-xs"></i>
                        ) : (
                          <i className="fa-solid fa-play text-xs"></i>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`
                          text-sm font-medium truncate
                          ${value && value - 1 === index
                            ? "text-primary"
                            : "text-gray-700 group-hover:text-gray-900"
                          }
                        `}>
                          {data.title}
                        </p>
                        {data.freePreview && (
                          <span className="text-xs text-green-600">Free Preview</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Video Player Section */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
              {courseData?.files
                ?.filter((_, index) => index + 1 === value)
                .map((data) => (
                  <div key={data.title} className="h-full flex flex-col">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {data.title}
                      </h3>
                      {data.freePreview && (
                        <Badge className="mt-2 bg-green-100 text-green-700">
                          Free Preview
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1 p-4">
                      {videoLoad ? (
                        <div className="h-full flex justify-center items-center">
                          <BookLoader />
                        </div>
                      ) : (
                        <div className="relative h-full rounded-lg overflow-hidden bg-black/5">
                          <Videoplayer
                            thumbnail={courseData.thumbnail}
                            width="100%"
                            height="100%"
                            videoUrl={data.videoUrl}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
