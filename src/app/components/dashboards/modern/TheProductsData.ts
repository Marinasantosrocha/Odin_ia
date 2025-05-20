interface PerformerType {
  id: string;
  imgsrc: string;
  name: string;
  post: string;
  color: string;
  pname: string;
  status: number;
  budget: number;
}

const TheProductsData: PerformerType[] = [
  {
    id: "1",
    imgsrc: "/images/profile/user-7.jpg",
    name: "Apple iPhone 6 Space Grey, 16 GB",
    post: "Web Designer",
    pname: "MI5457",
    status: 252,
    budget: 124,
    color: "secondary.main",
  },
  {
    id: "2",
    imgsrc: "/images/profile/user-2.jpg",
    name: "Fossil Marshall For Men Black watch",
    post: "Web Developer",
    pname: "MI5457",
    status: 160,
    budget: 256,
    color: "success.main",
  },
  {
    id: "3",
    imgsrc: "/images/profile/user-6.jpg",
    name: "Sony Bravia 80cm - 32 HD Ready LED TV",
    post: "Web Manager",
    pname: "MI5457",
    status: 560,
    budget: 457,
    color: "error.main",
  },
  {
    id: "4",
    imgsrc: "/images/profile/user-4.jpg",
    name: "Panasonic P75 Champagne Gold, 8 GB",
    post: "Project Manager",
    pname: "MI5457",
    status: 350,
    budget: 650,
    color: "primary.main",
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

export default TheProductsData;
