"use client"
import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Avatar, Box } from "@mui/material";
import DashboardCard from "../../shared/DashboardCard";
import SktSalesOverview from "../skeleton/analytical/SktSalesOverview";
import { ApexOptions } from "apexcharts";

interface SktSalesOverviewtwoCardProps {
  isLoading: boolean;
}

const TheDownloadCount = ({ isLoading }: SktSalesOverviewtwoCardProps) => {
  // chart color
  const theme = useTheme();
  const info = theme.palette.info.main;
  const secondary = theme.palette.secondary.main;

  // chart
  const optionscolumnchart: ApexOptions = {
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: "35%",
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: "rgba(0,0,0,.1)",
    },
    colors: [info, secondary],
    chart: {
      width: 70,
      height: 40,
      foreColor: "#adb0bb",
      fontFamily: "inherit",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "category",
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "inherit",
      },
      x: {
        show: true,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
  const seriescolumnchart = [
    {
      name: "Premium",
      data: [5, 4, 3, 7, 5, 10, 3],
    },
    {
      name: "Free",
      data: [3, 2, 9, 5, 4, 6, 4],
    },
  ];

  return (
    <>
      {isLoading ? (
        <SktSalesOverview />
      ) : (
        <DashboardCard
          title="Download Count"
          subtitle="you can check the count"
          action={
            <Stack spacing={3} mt={5} direction="row">
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{
                    width: 9,
                    height: 9,
                    bgcolor: secondary,
                    svg: { display: "none" },
                  }}
                ></Avatar>
                <Typography variant="subtitle2" color="secondary.main">
                  Free
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{
                    width: 9,
                    height: 9,
                    bgcolor: info,
                    svg: { display: "none" },
                  }}
                ></Avatar>
                <Typography variant="subtitle2" color="info.main">
                  Premium
                </Typography>
              </Stack>
            </Stack>
          }
        >
          <Box height="295px">
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="bar"
              height={295}
              width={"100%"}
            />
          </Box>
        </DashboardCard>
      )}
    </>
  );
};

export default TheDownloadCount;
