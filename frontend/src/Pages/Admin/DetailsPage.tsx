import Videoplayer from "@/components/Common/VideoPlayer/Videoplayer";
import Loader from "@/components/Loading";
import { AppDispatch, RootState } from "@/components/store/store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { hourglass } from "ldrs";
import BookLoader from "@/components/Loading/BookLoader";
import { FetchAdminCourseView } from "@/components/store/slices/admin/course-view";

export default function StudentCourseEnrollDetailesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, courseData } = useSelector(
    (state: RootState) => state.adminProgress
  );
  const [value, setValue] = useState<number | undefined>(1);
  const [videoLoad, setVideoLoad] = useState<boolean>(false);
  const { id } = useParams();
  hourglass.register();

  useEffect(() => {
    if (id) {
      dispatch(FetchAdminCourseView(id));
    }
  }, [id]);

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
    <div className="w-full h-full flex flex-col lg:flex-row gap-4 p-4">
      {/* Left Sidebar */}
      <div className="lg:w-1/4 w-full lg:h-auto h-fit bg-white rounded-lg shadow-md mb-4 lg:mb-0">
        <div className="p-4 flex items-center">
          <Button
            onClick={() => navigate(-1)}
            variant="link"
            className="flex gap-2 shadow-md w-full border-2"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </Button>
        </div>
        <div className="border-t-2 mt-4">
          <ScrollArea className="h-full w-full rounded-md">
            <div className="p-4">
              <h4 className="mb-6 text-lg font-semibold">Course Videos List</h4>
              {courseData?.files &&
                courseData.files.map((data, index) => (
                  <div
                    onClick={() => handleCourse(index)}
                    key={index}
                    className={`${
                      value && value - 1 === index ? "bg-gray-200 rounded-lg" : ""
                    } text-sm font-semibold text-neutral-500 mt-2 truncate cursor-pointer py-1.5 px-4 hover:bg-gray-200 hover:rounded-lg`}
                  >
                    {value && value - 1 === index ? (
                      <i className="fa-solid fa-circle-pause mr-4"></i>
                    ) : (
                      <i className="fa-regular fa-circle-play mr-4"></i>
                    )}
                    {data.title}
                  </div>
                ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Right Video Player */}
      <div className="lg:w-3/4 w-full shadow-md h-full border-2 border-gray-300 rounded-lg">
        {courseData?.files &&
          courseData.files
            .filter((_, index) => index + 1 === value)
            .map((data) => (
              <div key={data.title} className="w-full h-full p-4">
                <div className="text-center mb-4">
                  <h1 className="font-bold text-2xl sm:text-xl">{data.title}</h1>
                </div>
                <div className="w-full flex justify-center items-center h-[400px] sm:h-[300px] lg:h-[500px] mb-4">
                  {videoLoad ? (
                    <div className="h-full flex justify-center items-center ">
                      <BookLoader />
                    </div>
                  ) : (
                    <Videoplayer
                      thumbnail={courseData.thumbnail}
                      width="95%"
                      height="95%"
                      videoUrl={data.videoUrl}
                    />
                  )}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
