import { Chance } from "chance";
import { random } from "lodash";
import { sub } from "date-fns";
import { uniqueId } from "lodash";
import {
  BlogPostType,
  BlogType,
} from "@/app/(DashboardLayout)/types/apps/blog";
import { NextResponse } from "next/server";

const chance = new Chance();

const BlogComment: BlogType[] = [
  {
    id: uniqueId("#comm_"),
    profile: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: "/images/profile/user-1.jpg",
      name: chance.name(),
    },
    time: chance.date(),
    comment: chance.paragraph({ sentences: 2 }),
    replies: [],
  },
  {
    id: uniqueId("#comm_"),
    profile: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: "/images/profile/user-3.jpg",
      name: chance.name(),
    },
    time: chance.date(),
    comment: chance.paragraph({ sentences: 2 }),
    replies: [
      {
        id: uniqueId("#comm_"),
        profile: {
          id: chance.integer({ min: 1, max: 2000 }),
          avatar: "/images/profile/user-3.jpg",
          name: chance.name(),
        },
        time: chance.date(),
        comment: chance.paragraph({ sentences: 2 }),
      },
    ],
  },
  {
    id: uniqueId("#comm_"),
    profile: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: "/images/profile/user-4.jpg",
      name: chance.name(),
    },
    time: chance.date(),
    comment: chance.paragraph({ sentences: 2 }),
    replies: [],
  },
];

const BlogPost: BlogPostType[] = [
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: "Garmins Instinct Crossover is a rugged hybrid smartwatch",
    content: chance.paragraph({ sentences: 2 }),
    coverImg: "/images/blog/blog-img2.jpg",
    createdAt: sub(new Date(), { days: 8, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: "Gadget",
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: "/images/profile/user-1.jpg",
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: "After Twitter Staff Cuts, Survivors Face Radio Silence",
    content: chance.paragraph({ sentences: 2 }),
    coverImg: "/images/blog/blog-img1.jpg",
    createdAt: sub(new Date(), { days: 7, hours: 3, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: "Lifestyle",
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: "/images/profile/user-2.jpg",
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title:
      "Apple is apparently working on a new streamlined accessibility for iOS",
    content: chance.paragraph({ sentences: 2 }),
    coverImg: "/images/blog/blog-img3.jpg",
    createdAt: sub(new Date(), { days: 5, hours: 2, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: "Design",
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: "/images/profile/user-3.jpg",
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: "Why Figma is selling to Adobe for $20 billion",
    content: chance.paragraph({ sentences: 2 }),
    coverImg: "/images/blog/blog-img4.jpg",
    createdAt: sub(new Date(), { days: 7, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: "Design",
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: "/images/profile/user-4.jpg",
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: "Streaming video way before it was cool, go dark tomorrow",
    content: chance.paragraph({ sentences: 2 }),
    coverImg: "/images/blog/blog-img5.jpg",
    createdAt: sub(new Date(), { days: 4, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: "Lifestyle",
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: "/images/profile/user-5.jpg",
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: "As yen tumbles, gadget-loving Japan goes for secondhand iPhones ",
    content: chance.paragraph({ sentences: 2 }),
    coverImg: "/images/blog/blog-img6.jpg",
    createdAt: sub(new Date(), { days: 2, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: "Gadget",
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: "/images/profile/user-6.jpg",
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title:
      "Intel loses bid to revive antitrust case against patent foe Fortress",
    content: chance.paragraph({ sentences: 2 }),
    coverImg: "/images/blog/blog-img11.jpg",
    createdAt: sub(new Date(), { days: 3, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: "Social",
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: "/images/profile/user-2.jpg",
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: "COVID outbreak deepens as more lockdowns loom in China",
    content: chance.paragraph({ sentences: 2 }),
    coverImg: "/images/blog/blog-img8.jpg",
    createdAt: sub(new Date(), { days: 4, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: "Health",
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: "/images/profile/user-3.jpg",
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: "Early Black Friday Amazon deals: cheap TVs, headphones, laptops",
    content: chance.paragraph({ sentences: 2 }),
    coverImg: "/images/blog/blog-img9.jpg",
    createdAt: sub(new Date(), { days: 5, hours: 3, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: "Gadget",
    featured: true,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: "/images/profile/user-4.jpg",
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: "Presented by Max Rushden with Barry Glendenning, Philippe Auclair",
    content: chance.paragraph({ sentences: 2 }),
    coverImg: "/images/blog/blog-img10.jpg",
    createdAt: sub(new Date(), { days: 0, hours: 1, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: "Health",
    featured: true,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: "/images/profile/user-5.jpg",
      name: chance.name(),
    },
    comments: BlogComment,
  },
];

export async function GET(req: Request) {
  try {
    return NextResponse.json({ status: 200, data: BlogPost, msg: "success" });
  } catch (error) {
    return NextResponse.json({ status: 400, msg: "something went wrong" });
  }
}

type PostRequestBody = {
  postId: number | string;
  comment: BlogType;
};

export async function POST(req: Request) {
  try {
    const body: PostRequestBody = await req.json();
    const { postId, comment } = body;

    const postIndex = BlogPost.findIndex((x) => x.id === postId);
    const post = BlogPost[postIndex];
    const cComments = post.comments || [];
    post.comments = [comment, ...cComments];
    return NextResponse.json({
      status: 200,
      data: { posts: [...BlogPost] },
      msg: "success",
    });
  } catch (error) {
    return NextResponse.json({
      status: 400,
      msg: "something went wrong",
      error,
    });
  }
}
