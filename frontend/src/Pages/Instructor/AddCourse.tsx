import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { courseSchemaFields } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import app from "@/lib/firebase";
import Videoplayer from "@/components/Common/VideoPlayer/Videoplayer";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
    const navigate = useNavigate()
    const [sections, setSections] = useState<
        { id: number; title: string; freePreview: boolean; videoUrl: string | null }[]
    >([{ id: 1, title: "", freePreview: false, videoUrl: null }]);

    const [formData, setFormData] = useState({
        title: "",
        thumbnail: "",
        subtitle: "",
        description: "",
        category: "",
        objectives: "",
        requirements: "",
        price: "",
        Level: "",
    });

    const addSection = () => {
        setSections((prev) => [
            ...prev,
            { id: prev.length + 1, title: "", freePreview: false, videoUrl: null },
        ]);
    };

    const deleteSection = (id: number) => {
        setSections((prev) => prev.filter((section) => section.id !== id));
    };

    const handleInputChange = (
        id: number,
        key: "title" | "freePreview" | "videoUrl",
        value: string | boolean | null
    ) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === id ? { ...section, [key]: value } : section
            )
        );
    };

    const handleFileChange = async (id: number, file: File | null) => {
        if (file) {
            try {
                const storage = getStorage(app);
                const storageRef = ref(storage, `CourseVideos/${Date.now()}_${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload is ${progress}% done`);
                    },
                    (error) => {
                        console.error("Error uploading video: ", error);
                        return;
                    },
                    async () => {
                        const videoUrl: string = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("Video uploaded and available at: ", videoUrl);
                        handleInputChange(id, "videoUrl", videoUrl);
                    }
                );
            } catch (error) {
                console.error("Error during file upload: ", error);
                return;
            }
        }
    };

    const handleThumbnailChange = async (file: File | null) => {
        if (file) {
            try {
                const storage = getStorage(app);
                const storageRef = ref(storage, `CourseThumbnails/${Date.now()}_${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Thumbnail upload is ${progress}% done`);
                    },
                    (error) => {
                        console.error("Error uploading thumbnail: ", error);
                        return;
                    },
                    async () => {
                        const thumbnailUrl: string = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("Thumbnail uploaded and available at: ", thumbnailUrl);
                        setFormData((prevData) => ({
                            ...prevData,
                            thumbnail: thumbnailUrl,
                        }));
                    }
                );
            } catch (error) {
                console.error("Error during thumbnail upload: ", error);
                return;
            }
        }
    };

    const handleInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((data) => ({
            ...data,
            [event.target.name]: event.target.value,
        }));
    };

    const isFormValid = () => {
        const requiredFields = [
            "title",
            "price",
            "requirements",
            "objectives",
            "thumbnail",
            "subtitle",
            "description",
            "category",
            "Level",
        ];
        const areFieldsValid = requiredFields.every((field) =>
            formData[field as keyof typeof formData]?.toString().trim() !== ""
        );
        const areSectionsValid = sections.every(
            (section) => section.title.trim() !== "" && section.videoUrl !== null
        );
        return areFieldsValid && areSectionsValid;
    };

    const handleFormSubmit = () => {
        const formSubmissionData = {
            ...formData,
            files: sections.map(({ id, title, freePreview, videoUrl }) => ({
                id,
                title,
                freePreview,
                videoUrl,
            })),
        };

        console.log("Submitting form data: ", formSubmissionData);
        fetch('https://course-management-system-il4f.onrender.com/instructor/course/add', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials : "include",
            body: JSON.stringify(formSubmissionData)
        }).then(response => response.json())
            .then((data) => {
                console.log(data)
                navigate("/instructor/courses")
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!isFormValid()) {
            console.error("Form is invalid");
            return;
        }
        handleFormSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="w-full h-full p-3 flex gap-1 max-sm:block">
            {/* Course Details */}
            <div className="w-1/2 h-fit flex flex-col items-center max-sm:w-full">
                <h1 className="text-lg font-bold text-center mb-2">Add Course</h1>
                {courseSchemaFields.map((field, index) => (
                    <div key={field.label + index} className="flex w-full flex-col px-5 py-2">
                        {field.type === "text" || field.type === "number" ? (
                            <Input
                                onChange={handleInput}
                                name={field.name}
                                type={field.type}
                                placeholder={field.label}
                            />
                        ) : null}

                        {field.type === "textarea" ? (
                            <Textarea
                                onChange={handleInput}
                                name={field.name}
                                placeholder={field.label}
                                rows={5}
                            />
                        ) : null}

                        {field.type === "file" && field.name === "thumbnail" ? (
                            <Input
                                type="file"
                                name={field.name}
                                placeholder={field.label}
                                onChange={(e) => handleThumbnailChange(e.target.files?.[0] ?? null)}
                            />
                        ) : null}

                        {field.type === "select" && field.options ? (
                            <Select
                                onValueChange={(value) =>
                                    setFormData((data) => ({ ...data, [field.name]: value }))
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={field.label} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options.map((option, idx) => (
                                        <SelectItem key={option + idx} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : null}
                    </div>
                ))}
                <Button type="submit" disabled={!isFormValid()} className="w-[94%] mb-5 mt-2">
                    Submit Course
                </Button>
            </div>

            {/* Video Modules */}
            <div className="w-1/2 h-fit flex items-center flex-col px-10 max-sm:w-full">
                <h1 className="font-bold text-lg text-center">Video Modules</h1>
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className="w-full h-fit px-5 rounded-lg py-4 flex flex-col gap-3 border relative mt-4"
                    >
                        <Input
                            placeholder="Title"
                            value={section.title}
                            onChange={(e) =>
                                handleInputChange(section.id, "title", e.target.value)
                            }
                        />

                        {section.videoUrl ? (
                            <div className="w-full h-[200px]">
                                <Videoplayer height="100%" width="100%" videoUrl={section.videoUrl} />
                            </div>
                        ) : (
                            <Input
                                type="file"
                                placeholder="Upload Video"
                                onChange={(e) =>
                                    handleFileChange(section.id, e.target.files?.[0] ?? null)
                                }
                            />
                        )}
                        <div className="flex gap-3 items-center pb-2">
                            <Checkbox
                                className="ml-2"
                                checked={section.freePreview}
                                onCheckedChange={(checked) =>
                                    handleInputChange(section.id, "freePreview", Boolean(checked))
                                }
                            />
                            <p>Free Preview</p>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute right-5 rounded-full"
                                onClick={() => deleteSection(section.id)}
                            >
                                X
                            </Button>
                        </div>
                    </div>
                ))}
                <Button className="w-[95%] mt-3 max-sm:mb-14" type="button" onClick={addSection}>
                    Add Section
                </Button>
            </div>
        </form>
    );
};

export default AddCourse;
