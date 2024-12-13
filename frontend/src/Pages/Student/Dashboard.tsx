import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  return (
    <div className="w-full h-full grid grid-cols-2 grid-rows-4 gap-2">
      <div className="row-span-3 flex flex-col gap-2 justify-center items-center col-span-2">
        <p className="font-bold text-2xl max-sm:text-center">Unlock Your Potential with this Platform</p>
        <p className="w-[90%] text-center text-neutral-500 font-semibold mt-5 leading-7 tracking-wide max-sm:hidden max-md:hidden">Welcome to CMS, your gateway to boundless learning opportunities.
          We believe that education <br /> is the cornerstone of both personal and professional development,
          and we’re committed to providing <br /> you with the tools, resources, and support you need to excel.
          Whether you’re seeking <br /> to enhance your skills, explore new fields, or push the limits of your knowledge,
          CMS is here <br /> to empower you every step of the way. Together, let’s break barriers, achieve milestones,
          and <br /> create a future filled with success and endless possibilities. </p>

          <p className="w-[90%] text-center text-neutral-500 font-semibold mt-5 leading-7 tracking-wide md:hidden">Welcome to CMS, your gateway to boundless learning opportunities.
          We believe that education <br /> is the cornerstone of both personal and professional development,
          and we’re committed to providing <br /> you with the tools, resources, and support you need to excel.</p>
        <div className="w-full flex gap-3 justify-center mt-5">
          <Link to='/student/courses'><Button>Explore Courses</Button></Link>
          <Link to="/student/mycourses"><Button variant="outline">Your Courses</Button></Link>
        </div>
      </div>


      <div className="w-full bg-muted col-span-2 rounded-lg flex gap-3 overflow-hidden justify-center">
        <div className="w-[24%] h-full flex flex-col justify-center items-center">
          <p className="font-bold text-center">10+</p>
          <p className="text-sm text-center font-semibold text-neutral-500">Courses by our expert mentors</p>
        </div>

        <div className="w-[24%] h-full flex flex-col justify-center items-center">
          <p className="font-bold text-center">20+</p>
          <p className="text-sm text-center font-semibold text-neutral-500">Diverse courses available</p>
        </div>

        <div className="w-[24%] h-full flex flex-col justify-center items-center max-sm:hidden">
          <p className="font-bold">37+</p>
          <p className="text-sm font-semibold text-neutral-500 text-center">Courses enrolled by students</p>
        </div>

        <div className="w-[24%] h-full flex flex-col justify-center items-center">
          <p className="font-bold text-center">10+</p>
          <p className="text-sm font-semibold text-neutral-500 text-center">Courses led by top mentors</p>
        </div>
      </div>

    </div>
  )
}
