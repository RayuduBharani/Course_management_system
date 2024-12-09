import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const categories = [
  "Web Development",
  "Data Science & Machine Learning",
  "Cloud Computing",
  "CyberSecurity",
  "Mobile App Development",
  "Blockchain & Cryptography",
  "Project Management",
  "DevOps & Automation",
  "UI/UX Design",
];

export const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];
export const publishStatuses = ["Published", "Unpublished", "Drafted"];

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9]/g, "-") // Replace special characters with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start and end
};

export const courseSchemaFields = [
  { name: "title", label: "Course Title", type: "text", required: true },
  { name: "thumbnail", label: "Thumbnail", type: "file", required: true },
  { name: "subtitle", label: "Course Subtitle", type: "text", required: true },
  { name: "description", label: "Course Description", type: "textarea", required: true },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      "Web Development",
      "Data Science",
      "Artificial Intelligence",
      "Machine Learning",
      "Mobile Development",
      "Cloud Computing",
      "Cybersecurity",
      "DevOps",
      "UI/UX Design",
      "Digital Marketing",
      "Business",
      "Personal Development",
      "Other",
    ]
  },
  { name: "objectives", label: "Objectives", type: "textarea", required: true },
  { name: "requirements", label: "Requirements", type: "textarea", required: true },
  // { name: "keyPoints", label: "Key Points", type: "textarea", required: true },
  { name: "price", label: "Price", type: "number", required: true },
  {
    name: "Level",
    label: "level",
    type: "select",
    options: [
      "Beginner", "Intermediate", "Advanced", "All levels"
    ]
  },
];