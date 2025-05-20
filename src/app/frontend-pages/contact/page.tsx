import PageContainer from '@/app/components/container/PageContainer';
import HeaderAlert from '../../components/frontend-pages/shared/header/HeaderAlert';
import HpHeader from '../../components/frontend-pages/shared/header/HpHeader';

import C2a from '../../components/frontend-pages/shared/c2a';
import Footer from '../../components/frontend-pages/shared/footer';
import Form from '../../components/frontend-pages/contact/form';
import ScrollToTop from '../../components/frontend-pages/shared/scroll-to-top';
import BreadcrumbTwo from '@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbTwo';

const BCrumb = [
    {
        to: "/",
        title: "Materialpro",
    },
    {
        title: "Contact Page",
    },
];


const Contact = () => {
    return (
        <PageContainer title="Contact" description="this is Contact">

            <HeaderAlert />
            <HpHeader />
            {/* breadcrumb */}
            <BreadcrumbTwo title="We'd love to hear from you" items={BCrumb} />
            {/* end breadcrumb */}
            
            <Form />
            <C2a />
            <Footer />
            <ScrollToTop />
        </PageContainer>
    );
};

export default Contact;
