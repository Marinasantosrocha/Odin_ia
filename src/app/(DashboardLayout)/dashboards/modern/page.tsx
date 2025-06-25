"use client";
import React from "react";
import { useEffect, useState } from "react";

import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

// components
import ActivityTimeline from "@/app/components/dashboards/general/TheActivityTimeline";

import TheProgressCards from "@/app/components/dashboards/modern/TheProgressCards";
import TheSalesAmplePixel from "@/app/components/dashboards/modern/TheSalesAmplePixel";
import TheDownloadCount from "@/app/components/dashboards/modern/TheDownloadCount";
import TheProductAvailability from "@/app/components/dashboards/modern/TheProductAvailability";
import TheNotification from "@/app/components/dashboards/modern/TheNotification";
import TheReviews from "@/app/components/dashboards/modern/TheReviews";
import TheVisitSource from "@/app/components/dashboards/modern/TheVisitSource";
import TheExperiances from "@/app/components/dashboards/modern/TheExperiances";
import TheProfileText from "@/app/components/dashboards/modern/TheProfileText";
import TheProfileDetail from "@/app/components/dashboards/modern/TheProfileDetail";

const BCrumb = [
  {
    to: "/",
    title: "Dashboard",
  },
  {
    title: "Modern",
  },
];

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    (<PageContainer title="Modern Dashboard" description="this is Dashboard">
      {/* breadcrumb */}
      <Breadcrumb title="Modern" items={BCrumb} />
      <Box>
        <Grid container spacing={3}>
          {/* column */}
          <Grid size={12}>
            <TheProgressCards />
          </Grid>
          <Grid size={12}>
            <TheSalesAmplePixel />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 7
            }}>
            <TheDownloadCount isLoading={isLoading} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 5
            }}>
            <TheNotification />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 7
            }}>
            <TheProductAvailability />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 5
            }}>
            <TheNotification />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <TheReviews />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <TheVisitSource isLoading={isLoading} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <TheExperiances />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <TheProfileText />
          </Grid>

          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <ActivityTimeline />
          </Grid>

          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <TheProfileDetail />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>)
  );
}
