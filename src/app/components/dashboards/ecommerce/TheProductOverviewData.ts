interface PerformerType {
  id: string;
  imgsrc: string;
  name: string;
  quantity: number;
  pname: string;
  status: string;
  date: string;
}

const TheProductOverviewData: PerformerType[] = [
  {
    id: "1",
    imgsrc: "/images/gallery/chair2.png",
    name: "House Cleaner",
    quantity: 23,
    pname: "Digital Agency",
    status: "Paid",
    date: "	10-7-2025",
  },
  {
    id: "2",
    imgsrc: "/images/gallery/chair3.png",
    name: "Gray Chair",
    quantity: 12,
    pname: "Real Homes",
    status: "Pending",
    date: "	10-7-2025",
  },
  {
    id: "3",
    imgsrc: "/images/gallery/chair4.png",
    name: "New Gold Chair",
    quantity: 30,
    pname: "MedicalPro Theme",
    status: "Failed",
    date: "	10-7-2025",
  },
  {
    id: "4",
    imgsrc: "/images/gallery/chair2.png",
    name: "House Cleaner",
    quantity: 23,
    pname: "Digital Agency",
    status: "Paid",
    date: "	10-7-2025",
  },
];

export default TheProductOverviewData;
