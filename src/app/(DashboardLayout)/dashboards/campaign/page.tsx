"use client";
import React from "react";
import { useEffect, useState } from "react";

import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

// components
import BarCards from "@/app/components/dashboards/campaign/TheBarCards";
import CurrentVisits from "@/app/components/dashboards/campaign/TheCurrentVisits";
import BrowserStats from "@/app/components/dashboards/campaign/TheBrowserStats";
import TotalRevenue from "@/app/components/dashboards/campaign/TheTotalRevenue";
import SalesPrediction from "@/app/components/dashboards/campaign/TheSalesPrediction";
import SalesDifference from "@/app/components/dashboards/campaign/TheSalesDifference";
import TheRecentChats from "@/app/components/dashboards/campaign/TheRecentChats";

import Calendar from "@/app/components/apps/calendar/index";
import MyContacts from "@/app/components/dashboards/analytical/TheMyContacts";

const BCrumb = [
  {
    to: "/",
    title: "Dashboard",
  },
  {
    title: "Campaign",
  },
];

export default function Campaign() {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    (<PageContainer title="Campaign Dashboard" description="this is Dashboard">
      {/* breadcrumb */}
      <Breadcrumb title="Campaign" items={BCrumb} />
      <Box>
        <Grid container spacing={3}>
          <Grid size={12}>
            <BarCards isLoading={isLoading} />
          </Grid>

          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <CurrentVisits />
          </Grid>

          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <BrowserStats />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <TotalRevenue isLoading={isLoading} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <SalesPrediction isLoading={isLoading} />
              </Grid>
              <Grid size={12}>
                <SalesDifference isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
          <Grid size={12}>
            <Calendar />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}>
            <TheRecentChats />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}>
            <MyContacts />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>)
  );
}
