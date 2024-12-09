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

export default function InstructorCourseEnrollDetailesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, courseData } = useSelector(
    (state: RootState) => state.adminProgress
  );
  const [value, setValue] = useState<number | undefined>(1);
  const [videoLoad, setVideoLoad] = useState<boolean>(false);
  const { id } = useParams();
  hourglass.register();

  console.log(isLoading);

  useEffect(() => {
    if (id) {
      dispatch(FetchAdminCourseView(id));
    }
  }, [id]);

  console.log(courseData, "admin-course");

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
    <>
      <div className="w-full h-[100%] p-10 flex gap-4 max-sm:flex-col max-sm:h-fit">
        <div className="w-[25%] h-full max-sm:h-fit max-sm:w-full">
          <div className="w-full h-[8%] flex justify-start items-start">
            <Button
              onClick={() => navigate(-1)}
              variant="link"
              className="flex gap-2 shadow-md w-full border-2"
            >
              <i className="fa-solid fa-arrow-left"></i> Back
            </Button>
          </div>
          <div className="border-2 w-full h-[92%] rounded-xl shadow-md max-sm:mt-3">
            <ScrollArea className="h-full w-full rounded-md">
              <div className="p-4">
                <h4 className="mb-10 text-lg font-bold leading-none">
                  Course Videos List
                </h4>
                
                { courseData?.files &&
                courseData.files.map((data, index) => (
                  <div onClick={() => {
                    handleCourse(index);
                  }}
                    key={index}
                    className={`${value && value-1 == index ? "bg-gray-200 rounded-lg" : null} text-sm font-semibold text-neutral-500 mt-2 truncate cursor-pointer py-1.5 px-4 hover:bg-gray-200 hover:rounded-lg`}
                  >
                    {
                      value && value-1 == index ? <i className="fa-solid fa-circle-pause mr-4"></i>: <i className="fa-regular fa-circle-play mr-4"></i>
                      
                    }
                    {data.title}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="w-full shadow-md h-full border-2 border-gray-300 rounded-lg max-sm:mt-3 max-sm:h-fit">
          {courseData?.files && courseData.files
            .filter((_, index) => index + 1 === value)
            .map((data) => (
              <div key={data.title} className="w-full h-full">
                <div className="w-full h-fit pt-2 text-center max-sm:pb-3">
                  <h1 className="font-bold text-xl">{data.title}</h1>
                </div>
                <div className="w-full h-[90%] flex justify-center mt-5 max-sm:h-[200px] max-sm:py-2">
                  {videoLoad ? (
                    <div className="h-[90%] flex justify-center items-center ">
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
    </>
  );
}
