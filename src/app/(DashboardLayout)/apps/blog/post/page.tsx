import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import BlogListing from '@/app/components/apps/blog/BlogListing';
import { BlogProvider } from '@/app/context/BlogContext/index';


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Blogs",
  },
];

const Blog = () => {
  return (
    <BlogProvider>
      <PageContainer title="Blog" description="this is Blog">
        <Breadcrumb title="Blog app" items={BCrumb} />
        {/* ------------------------------------------- */}
        {/* Blog Listing */}
        {/* ------------------------------------------- */}
        <BlogListing />
      </PageContainer>
    </BlogProvider>
  );
};

export default Blog;
