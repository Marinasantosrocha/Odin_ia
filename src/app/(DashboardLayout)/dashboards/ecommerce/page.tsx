"use client";
import React from "react";
import { useEffect, useState } from "react";

import { Box, Grid } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

import SalesOverview from "@/app/components/dashboards/general/TheSalesOverview";
import WeatherCard from "@/app/components/dashboards/general/TheWeatherCard";

import TheProductSales from "@/app/components/dashboards/ecommerce/TheProductSales";
import SalesCards from "@/app/components/dashboards/ecommerce/TheSalesCards";
import TheDownloadCount from "@/app/components/dashboards/ecommerce/TheDownloadCount";
import TheProductOverview from "@/app/components/dashboards/ecommerce/TheProductOverview";
import TheEarning from "@/app/components/dashboards/ecommerce/TheEarning";
import TheDiscount from "@/app/components/dashboards/ecommerce/TheDiscount";
import TheMonthlyWinner from "@/app/components/dashboards/ecommerce/TheMonthlyWinner";
import TheNewItems from "@/app/components/dashboards/ecommerce/TheNewItems";

const BCrumb = [
  {
    to: "/",
    title: "Dashboard",
  },
  {
    title: "eCommerce",
  },
];

const Ecommerce = () => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <PageContainer
      title="eCommerce Dashboard"
      description="this is eCommerce Dashboard"
    >
      {/* breadcrumb */}
      <Breadcrumb title="eCommerce" items={BCrumb} />
      <Box>
        <Grid container spacing={3}>
          {/* column */}
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <SalesCards isLoading={isLoading} />
              </Grid>
              <Grid size={12}>
                <SalesOverview isLoading={isLoading} />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  lg: 6
                }}>
                <TheProductSales isLoading={isLoading} />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  lg: 6
                }}>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <TheDownloadCount isLoading={isLoading} />
                  </Grid>
                  <Grid size={12}>
                    <WeatherCard />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={12}>
                <TheProductOverview />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <Grid container spacing={3}>

              <Grid size={12}>
                <TheEarning />
              </Grid>
              <Grid size={12}>
                <TheDiscount />
              </Grid>
              <Grid size={12}>
                <TheMonthlyWinner />
              </Grid>
              <Grid size={12}>
                <TheNewItems />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Ecommerce;

