"use client";
import React from "react";
import { useEffect, useState } from "react";

import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

// components
import Welcome from "@/app/(DashboardLayout)/layout/shared/welcome/Welcome";

import SalesOverview from "@/app/components/dashboards/general/TheSalesOverview";
import OurVisitors from "@/app/components/dashboards/general/TheOurVisitors";
import NewsletterCampaign from "@/app/components/dashboards/general/TheNewsletterCampaign";
import BandwidthUsage from "@/app/components/dashboards/general/TheBandwidthUsage";
import DownloadCount from "@/app/components/dashboards/general/TheDownloadCount";
import WeatherCard from "@/app/components/dashboards/general/TheWeatherCard";
import ProfileCard from "@/app/components/dashboards/general/TheProfileCard";
import ActivityTimeline from "@/app/components/dashboards/general/TheActivityTimeline";
import MyContacts from "@/app/components/dashboards/general/GeneralMyContacts";
import BlogCard from "@/app/components/dashboards/general/TheBlogCard";

const BCrumb = [
  {
    to: "/",
    title: "Dashboard",
  },
  {
    title: "General",
  },
];

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    (<PageContainer title="General" description="this is Dashboard">
      {/* breadcrumb */}
      <Breadcrumb title="General" items={BCrumb} />
      <Box>
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <SalesOverview isLoading={isLoading} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <OurVisitors isLoading={isLoading} />
          </Grid>

          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <BlogCard />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <NewsletterCampaign isLoading={isLoading} />
          </Grid>

          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <BandwidthUsage isLoading={isLoading} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <DownloadCount isLoading={isLoading} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <WeatherCard />
          </Grid>

          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <ProfileCard />
              </Grid>
              <Grid size={12}>
                <MyContacts />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <ActivityTimeline />
          </Grid>
        </Grid>
        <Welcome />
      </Box>
    </PageContainer>)
  );
}
