import PageContainer from '@/app/components/container/PageContainer';
import HeaderAlert from '../../components/frontend-pages/shared/header/HeaderAlert';
import HpHeader from '../../components/frontend-pages/shared/header/HpHeader';
import C2a from '../../components/frontend-pages/shared/c2a';
import Footer from '../../components/frontend-pages/shared/footer';
import ScrollToTop from '../../components/frontend-pages/shared/scroll-to-top';
import GalleryCard from '@/app/components/apps/userprofile/gallery/GalleryCard';
import { Box, Container } from '@mui/material';
import BreadcrumbTwo from '@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbTwo';
import { UserDataProvider } from '@/app/context/UserDataContext/index'
const BCrumb = [
    {
        to: "/",
        title: "Materialpro",
    },
    {
        title: "Portfolio Page",
    },
];

const PricingPage = () => {
    return (
        <UserDataProvider>
            <PageContainer title="Portfolio" description="this is Portfolio">

                <HeaderAlert />
                <HpHeader />
                {/* breadcrumb */}
                <BreadcrumbTwo title="Explore Our Latest Works" items={BCrumb} />
                {/* end breadcrumb */}

                <Box my={3}>
                    <Container maxWidth="lg">
                        <GalleryCard />
                    </Container>
                </Box>
                <C2a />
                <Footer />
                <ScrollToTop />
            </PageContainer>
        </UserDataProvider>
    );
};

export default PricingPage;
