import PageContainer from '@/app/components/container/PageContainer';
import Banner from '../../components/frontend-pages/homepage/banner/Banner';
import HeaderAlert from '../../components/frontend-pages/shared/header/HeaderAlert';
import HpHeader from '../../components/frontend-pages/shared/header/HpHeader';
import Features from '../../components/frontend-pages/homepage/features/Features';
import ProtectFocus from '../../components/frontend-pages/homepage/protect-focus';
import Team from '../../components/frontend-pages/shared/team';
import Reviews from '../../components/frontend-pages/shared/reviews';
import TemplateFeature from '../../components/frontend-pages/homepage/template-feature';
import Pricing from '../../components/frontend-pages/shared/pricing';
import FAQ from '../../components/frontend-pages/homepage/faq';
import C2a from '../../components/frontend-pages/shared/c2a';
import Footer from '../../components/frontend-pages/shared/footer';
import ScrollToTop from '../../components/frontend-pages/shared/scroll-to-top';

const HomePage = () => {


  return (
    <PageContainer title="Homepage" description="this is Homepage">
      <HeaderAlert />
      <HpHeader />
      <Banner />

      <Features />
      <ProtectFocus />
      <Team />
      <Reviews />
      <TemplateFeature />
      <Pricing />
      <FAQ />
      <C2a />
      <Footer />

      <ScrollToTop />
    </PageContainer>
  );
};

export default HomePage;
