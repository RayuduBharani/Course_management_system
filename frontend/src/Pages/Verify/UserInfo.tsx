import InstructorForm from "@/components/Auth/RBAC forms/InstructorForm"
import LeadForm from "@/components/Auth/RBAC forms/LeadForm"
import StudentForm from "@/components/Auth/RBAC forms/StudentForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UserInfo() {
    return (
        <div className="w-full h-screen">
            <Tabs defaultValue="student" className="w-full h-screen flex p-10 gap-5">
                <div className="w-[20%] h-full bg-muted rounded-xl flex flex-col items-center">
                    <div className="w-full h-28 justify-center flex flex-col items-center mt-10">
                        <img className="rounded-full w-20 h-20" src="https://media.licdn.com/dms/image/v2/D560BAQEdNp5niau0Rw/company-logo_200_200/company-logo_200_200/0/1683745552013?e=2147483647&v=beta&t=_aZWsVKmdXjwuABqnHdc-DnHvLrZJxHfSQjtkJ_qzhM" alt="" />
                        <p className="font-bold mt-2">CMS</p>
                    </div>
                    <TabsList className="flex flex-col w-full h-fit mt-24 gap-4">
                        <TabsTrigger className="p-3 w-full bg-neutral-200" value="student">Student</TabsTrigger>
                        <TabsTrigger className="p-3 w-full bg-neutral-200" value="lead">Lead</TabsTrigger>
                        <TabsTrigger className="p-3 w-full bg-neutral-200" value="instructor">Instructor</TabsTrigger>
                    </TabsList>
                </div>
                <div className="w-[78%] h-full bg-muted rounded-xl">
                    <TabsContent className="w-full h-full" value="student">
                        <StudentForm />
                    </TabsContent>
                    <TabsContent value="lead">
                        <LeadForm />
                    </TabsContent>
                    <TabsContent value="instructor">
                        <InstructorForm />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
