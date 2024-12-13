import AuthIcons from "@/components/Auth/AuthIcons";
import { LoginUser } from "@/components/store/slices/authSlice";
import { AppDispatch } from "@/components/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { FormEvent } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function SignIn() {
    const dispatch = useDispatch<AppDispatch>()
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const emailvarify = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailvarify.test(email)) {
            toast({
                title: "Invalid email format",
                variant: "destructive"
            })
            return;
        }
       
        const newData = {
            email: email,
            password: password
        }
        dispatch(LoginUser(newData)).then((data) => {
            if(data.payload.success){
                toast({
                    title : data.payload.message
                })
            }
            else {
                toast({
                    title : data.payload.message,
                    variant : "destructive"
                })
            }
        })
    }
    return (
        <>
        {/* <span className="w-0 flex justify-end pr-6  max-2xl:hidden max-md:bg-black"><img className="w-8 h-8 rounded-full " src="https://media.licdn.com/dms/image/v2/D560BAQEdNp5niau0Rw/company-logo_200_200/company-logo_200_200/0/1683745552013?e=1735171200&v=beta&t=5ykcq9A8xtYhhFFdbeRTpzs8JjbqEQL_P5dkkE70rOs" alt="" /></span> */}

        <div className="w-full sm:h-screen flex justify-center items-center max-sm:min-h-svh ">

            <div className="w-[50%] h-[90%] rounded-xl  flex pr-32 items-center max-sm:hidden max-md:hidden">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" alt="" />
            </div>

            <form onSubmit={handleSubmit} className="w-[30%] mt-3 h-[70%] rounded-xl p-6 border max-sm:w-full max-sm:h-fit max-md:w-[60%] max-sm:border-0">
                <p className="font-bold text-xl">Welcome to <span className="text-primary">CMS</span></p> 
                <div className="mt-10 flex flex-col gap-2">
                    <Label htmlFor="email">Mail ID</Label>
                    <Input name="email" id="email" type="email" className="bg-secondary" placeholder="Email ID" />
                </div>

                <div className="mt-7 flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" type="password" id="password" className="bg-secondary" placeholder="Password" />
                </div>

                <Button className="w-full mt-7   p-5">Signin</Button>
                <Separator className="bg-neutral-400 mt-5" />
                <p className="text-xs mt-2 font-bold text-end ">dont't have an account ? <Link to='/auth/signup'><span className="text-primary cursor-pointer"> signup</span></Link></p>
                <AuthIcons/>
                
            </form>
        </div>
        </>

    )
}
