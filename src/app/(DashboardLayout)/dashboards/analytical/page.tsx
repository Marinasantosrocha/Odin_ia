"use client";
import React from "react";
import { useEffect, useState } from "react";

import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

// components

import ProfileCard from "@/app/components/dashboards/general/TheProfileCard";
import CurrentVisits from "@/app/components/dashboards/classic/TheCurrentVisits";
import ProjectsData from "@/app/components/dashboards/classic/TheProjectsData";
import MyContacts from "@/app/components/dashboards/analytical/TheMyContacts";

import TheOnlineRevenue from "@/app/components/dashboards/analytical/TheOnlineRevenue";
import TheExpance from "@/app/components/dashboards/analytical/TheExpance";
import TheUpgradePlan from "@/app/components/dashboards/analytical/TheUpgradePlan";
import TheRealStory from "@/app/components/dashboards/analytical/TheRealStory";
import TheHighlights from "@/app/components/dashboards/analytical/TheHighlights";
import TheDesignMeetings from "@/app/components/dashboards/analytical/TheDesignMeetings";

const BCrumb = [
  {
    to: "/",
    title: "Dashboard",
  },
  {
    title: "Analytical",
  },
];

export default function Analytical() {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    (<PageContainer
      title="Analytical Dashboard"
      description="this is Dashboard"
    >
      {/* breadcrumb */}
      <Breadcrumb title="Analytical" items={BCrumb} />
      <Box>
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              lg: 5
            }}>
            <Grid container spacing={3}>
              <Grid
                size={{
                  xs: 12,
                  lg: 6
                }}>
                <TheOnlineRevenue />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  lg: 6
                }}>
                <TheExpance />
              </Grid>
              <Grid size={12}>
                <TheUpgradePlan />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <TheRealStory />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 3
            }}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <TheHighlights />
              </Grid>
              <Grid size={12}>
                <TheDesignMeetings />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <MyContacts />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <CurrentVisits />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <ProjectsData />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <ProfileCard />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>)
  );
}
