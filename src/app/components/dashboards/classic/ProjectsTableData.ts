interface PerformerType {
  id: string;
  imgsrc: string;
  name: string;
  post: string;
  pname: string;
  status: string;
  budget: string;
}

const ProjectsTableData: PerformerType[] = [
  {
    id: "1",
    imgsrc: "/images/profile/user-7.jpg",
    name: "Sunil Joshi",
    post: "Web Designer",
    pname: "Digital Agency",
    status: "Low",
    budget: "3.9",
  },
  {
    id: "2",
    imgsrc: "/images/profile/user-2.jpg",
    name: "John Deo",
    post: "Web Developer",
    pname: "Real Homes",
    status: "Medium",
    budget: "23.9",
  },
  {
    id: "3",
    imgsrc: "/images/profile/user-6.jpg",
    name: "Nirav Joshi",
    post: "Web Manager",
    pname: "MedicalPro Theme",
    status: "High",
    budget: "12.9",
  },
  {
    id: "4",
    imgsrc: "/images/profile/user-4.jpg",
    name: "Yuvraj Sheth",
    post: "Project Manager",
    pname: "Elite Admin",
    status: "Very High",
    budget: "10.9",
  },
  // {
  //   id: "5",
  //   imgsrc: "/images/profile/user-5.jpg",
  //   name: "Micheal Doe",
  //   post: "Content Writer",
  //   pname: "Helping Hands",
  //   status: "High",
  //   budget: "12.9",
  // },
];

export default ProjectsTableData;
