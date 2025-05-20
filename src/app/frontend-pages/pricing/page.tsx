import PageContainer from '@/app/components/container/PageContainer';
import HeaderAlert from '../../components/frontend-pages/shared/header/HeaderAlert';
import HpHeader from '../../components/frontend-pages/shared/header/HpHeader';
import Pricing from '../../components/frontend-pages/shared/pricing';
import C2a from '../../components/frontend-pages/shared/c2a';
import Footer from '../../components/frontend-pages/shared/footer';
import ScrollToTop from '../../components/frontend-pages/shared/scroll-to-top';
import BreadcrumbTwo from '@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbTwo';

const BCrumb = [
    {
        to: "/",
        title: "Materialpro",
    },
    {
        title: "Pricing Page",
    },
];

const PricingPage = () => {
    return (
        <PageContainer title="Pricing" description="this is Pricing">

            <HeaderAlert />
            <HpHeader />
            {/* breadcrumb */}
            <BreadcrumbTwo title="Choose Your Plan" items={BCrumb} />
            {/* end breadcrumb */}

            <Pricing />
            <C2a />
            <Footer />
            <ScrollToTop />
        </PageContainer>
    );
};

export default PricingPage;
