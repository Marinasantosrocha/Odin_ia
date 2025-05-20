import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

import PageContainer from "@/app/components/container/PageContainer";
import AppCard from "@/app/components/shared/AppCard";
import Image from "next/image";
import EmailsApp from "@/app/components/apps/email";
import { EmailContextProvider } from '@/app/context/EmailContext/index'


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Inbox",
  },
];


const Email = () => {
  return (
    <EmailContextProvider>
      <PageContainer title="Email" description="this is Email">
        <Breadcrumb title="Email app" items={BCrumb}>
          <Image
            src="/images/breadcrumb/emailSv.png"
            alt={"emailIcon"}
            width={195}
            height={195}
          />
        </Breadcrumb>

        <AppCard>
          <EmailsApp />
        </AppCard>
      </PageContainer>
    </EmailContextProvider>
  );
};

export default Email;
