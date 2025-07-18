"use client";
import React from "react";
import { useEffect, useState } from "react";

import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';

// components

import ProfileCard from "@/app/components/dashboards/general/TheProfileCard";
import BlogCard from "@/app/components/dashboards/general/TheBlogCard";

import TopCards from "@/app/components/dashboards/classic/TheTopCards";
import CurrentVisits from "@/app/components/dashboards/classic/TheCurrentVisits";
import ProjectsData from "@/app/components/dashboards/classic/TheProjectsData";
import RecentComments from "@/app/components/dashboards/classic/TheRecentComments";
import TodoList from "@/app/components/dashboards/classic/TheTodoList";


const BCrumb = [
  {
    to: '/',
    title: 'Dashboard',
  },
  {
    title: 'Classic',
  },
];

export default function Classic() {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    (<PageContainer title="Classic Dashboard" description="this is Dashboard">
      {/* breadcrumb */}
      <Breadcrumb title="Classic" items={BCrumb} />
      <Box>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TopCards />
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
              lg: 4
            }}>
            <BlogCard />
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

          <Grid
            size={{
              xs: 12,
              lg: 6
            }}>
            <RecentComments />
          </Grid>

          <Grid
            size={{
              xs: 12,
              lg: 6
            }}>
            <TodoList />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>)
  );
}
