import { Label } from "@radix-ui/react-label";
import { FileUpload } from "../ui/file-upload";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "./../../lib/firebase";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { UpdateInstructorProfileInfo } from "../store/slices/Instructor/profile";
import { toast } from "@/hooks/use-toast";

export default function InstructorProfileUpdate() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState<{
    linkedIn?: string;
    gitHub?: string;
    rollNumber?: string;
    gender?: string;
    college?: string;
    branch?: string;
    UPI?: string;
    profileImg?: string;
  }>({
    linkedIn: "",
    gitHub: "",
    rollNumber: "",
    gender: "",
    college: "",
    branch: "",
    UPI: "",
    profileImg: ""
  });

  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileUpload = (file: File[]) => {
    if (file && file[0]) {
      setProfileImg(file[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (profileImg) {
      const storage = getStorage(app);
      const storageRef = ref(storage, `Profiles/${Date.now()}_${profileImg.name}`);
      const uploadTask = uploadBytesResumable(storageRef, profileImg);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(prog);
        },
        (err) => {
          console.error("Upload failed:", err);
        },
        async () => {
          const imgUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prevData) => ({
            ...prevData,
            profileImg: imgUrl
          }));
          submitProfileData({ ...formData, profileImg: imgUrl });
        }
      );
    } else {
      submitProfileData(formData);
    }
  };

  const submitProfileData = (data: typeof formData) => {
    console.log("first")
    dispatch(UpdateInstructorProfileInfo(data as FORMDATA))
    .then((data)=>{
        if(data){
            navigate("/instructor/profile")
        }
        else {
            toast({
                title : "Something went wrong ! please try again" ,
                variant : "destructive"
            })
        }
    })
  }

  return (
    <div className="w-full h-full p-10 flex flex-col items-start">
      <Button onClick={() => navigate(-1)} variant="link" className="flex gap-2 ml-8">
        <i className="fa-solid fa-arrow-left"></i> Back
      </Button>

      <form
        className="w-full h-full px-10 py-5 flex flex-col items-center gap-3"
        onSubmit={handleSubmit}
      >
        <FileUpload onChange={handleFileUpload} />
        <div className="w-full flex gap-5 mt-6">
          <div className="gap-3 w-full">
            <Label htmlFor="linkedIn">LinkedIn Profile</Label>
            <Input
              name="linkedIn"
              id="linkedIn"
              className="bg-background"
              value={formData.linkedIn}
              onChange={handleInputChange}
            />
          </div>

          <div className="gap-3 w-full">
            <Label htmlFor="gitHub">GitHub Profile</Label>
            <Input
              name="gitHub"
              id="gitHub"
              className="bg-background"
              value={formData.gitHub}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="gap-5 w-full flex justify-between">
          <div className="w-[30%]">
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input
              name="rollNumber"
              minLength={10}
              maxLength={10}
              id="rollNumber"
              className="bg-background"
              value={formData.rollNumber}
              onChange={handleInputChange}
            />
          </div>

          <div className="w-[30%]">
            <Label htmlFor="gender">Gender</Label>
            <Select
              name="gender"
              onValueChange={(value) => handleSelectChange("gender", value)}
            >
              <SelectTrigger id="gender" className="w-full p-5 bg-background">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Transgender">Transgender</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[30%]">
            <Label htmlFor="college">College</Label>
            <Input
              name="college"
              id="college"
              className="bg-background"
              value={formData.college}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="w-[100%] flex gap-5">
          <div className="w-[50%]">
            <Label htmlFor="branch">Branch</Label>
            <Select
              name="branch"
              onValueChange={(value) => handleSelectChange("branch", value)}
            >
              <SelectTrigger id="branch" className="w-full p-5 bg-background">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CSD">CSD</SelectItem>
                <SelectItem value="AID">AID</SelectItem>
                <SelectItem value="CAI">CAI</SelectItem>
                <SelectItem value="Cyber">Cyber</SelectItem>
                <SelectItem value="CSM">CSM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[50%]">
            <Label htmlFor="UPI">UPI id</Label>
            <Input
              id="UPI"
              name="UPI"
              className="bg-background"
              value={formData.UPI}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <Button type="submit" className="w-full p-5 mt-1">
          {progress > 0 && progress < 100 ? `Uploading: ${progress}%` : "Update your profile"}
        </Button>
      </form>
    </div>
  );
}
