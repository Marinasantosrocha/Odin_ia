"use client"
import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Typography, Grid, Box, Divider, CardContent } from "@mui/material";
import BlankCard from "../../shared/BlankCard";
import { Icon } from "@iconify/react";
import { ApexOptions } from "apexcharts";

const TheSalesAmplePixel = () => {
  // chart color
  const theme = useTheme();
  const secondarylight = theme.palette.secondary.light;
  const secondary = theme.palette.secondary.main;

  // chart
  const optionscolumnchart: ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "inherit",
      foreColor: "#adb0bb",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: [secondary, secondarylight],

    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    markers: {
      size: 2,
      strokeColors: "transparent",
      colors: "#26c6da",
    },
    legend: {
      show: false,
    },
    fill: {
      type: "solid",
      colors: ["rgba(38, 198, 218, 0.7)", "rgba(38, 198, 218, 0.4)"],
      opacity: 1,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      categories: [
        "0",
        "4",
        "8",
        "12",
        "16",
        "20",
        "24",
        "30",
        "16",
        "20",
        "24",
        "30",
        "34",
        "38",
        "42",
        "46",
        "50",
        "54",
      ],
    },
    yaxis: {
      labels: { style: { fontSize: "12px", colors: "#a1aab2" } },
    },
    grid: {
      strokeDashArray: 3,
      borderColor: "rgba(0,0,0,0.2)",
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [
    {
      name: "Growth",
      data: [0, 1, 1, 10, 24, 6, 12, 4, 21, 15, 44, 24, 28, 4, 10, 21, 5, 47],
    },
    {
      name: "Loss",
      data: [0, 4, 3, 24, 9, 10, 18, 15, 44, 17, 19, 26, 31, 8, 37, 10, 24, 51],
    },
  ];

  return (<>
    <BlankCard>
      <Grid container justifyContent="space-between" sx={{
        pb: {
          xs: 3,
          sm: 0
        }
      }}>
        <Grid
          size={{
            xs: 12,
            lg: 5
          }}>
          <Box p="30px">
            <Typography variant="h5" mb="4px">
              Sales of Ample Vs Pixel
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Check the difference of Admin
            </Typography>
          </Box>
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6
          }}>
          <Grid
            container
            sx={{
              height: "100%",
              gap: {
                xs: 3,
                sm: 0
              },
            }}
          >
            <Grid
              display="flex"
              size={{
                xs: 12,
                lg: 6
              }}>
              <Box
                display="flex"
                alignItems="center"
                width="100%"
                px={4}
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h3">$31,568</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Growth
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  flexShrink="0"
                  sx={{
                    backgroundColor: "success.main",
                    width: "48px",
                    height: "48px",
                    borderRadius: "100%",
                  }}
                >
                  <Icon
                    icon="solar:diagram-up-linear"
                    width={24}
                    height={24}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid
              display="flex"
              size={{
                xs: 12,
                lg: 6
              }}>
              <Divider orientation="vertical" flexItem />
              <Box
                display="flex"
                alignItems="center"
                width="100%"
                px={4}
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h3">$15,478</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Loss
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  flexShrink="0"
                  sx={{
                    backgroundColor: "warning.main",
                    width: "48px",
                    height: "48px",
                    borderRadius: "100%",
                  }}
                >
                  <Icon
                    icon="solar:chart-2-line-duotone"
                    width={24}
                    height={24}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <CardContent>
        <Box height="350px" mx="-15px">
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="area"
            height={350}
            width={"100%"}
          />
        </Box>
      </CardContent>
    </BlankCard>
  </>);
};

export default TheSalesAmplePixel;
