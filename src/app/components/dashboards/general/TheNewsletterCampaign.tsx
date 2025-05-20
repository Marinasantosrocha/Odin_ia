import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Avatar, Box } from "@mui/material";
import DashboardCard from "../../shared/DashboardCard";
import SktNewsletterCampaign from "../skeleton/analytical/SktNewsletterCampaign";

interface NewsletterCampaigntwoCardProps {
  isLoading: boolean;
}

const NewsletterCampaign = ({ isLoading }: NewsletterCampaigntwoCardProps) => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "area",
      fontFamily: "inherit",
      foreColor: "#adb0bb",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    colors: [primary, secondary],

    dataLabels: {
      enabled: false,
    },
    stroke: { curve: "smooth", show: !0, width: 2, colors: [primary, secondary] },
    legend: {
      show: false,
    },
    fill: { type: "solid", opacity: 0.07, colors: [primary, secondary] },
    xaxis: {
      categories: ["", "8 AM", "81 AM", "9 AM", "10 AM", "11 AM", "12 PM", "13 PM", "14 PM", "15 PM", "16 PM", "17 PM", "18 PM", "18:20 PM", "18:20 PM", "19 PM", "20 PM", "21 PM", ""],
      axisBorder: { show: !1 },
      axisTicks: { show: !1 },
      tickAmount: 6,
      labels: { rotate: 0, rotateAlways: !0, style: { fontSize: "12px", colors: "#a1aab2" } },
      crosshairs: { position: "front", stroke: { color: [primary, secondary], width: 1, dashArray: 3 } },
    },
    yaxis: { max: 120, min: 30, tickAmount: 6, labels: { style: { fontSize: "12px", colors: "#a1aab2" } } },
    states: { normal: { filter: { type: "none", value: 0 } }, hover: { filter: { type: "none", value: 0 } }, active: { allowMultipleDataPointsSelection: !1, filter: { type: "none", value: 0 } } },
    grid: { borderColor: "var(--bs-border-color)", strokeDashArray: 4, yaxis: { lines: { show: !0 } } },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [
    {
      name: "Open Rate",
      data: [
        65, 80, 80, 60, 60, 45, 45, 80, 80, 70, 70, 90, 90, 80, 80, 80, 60, 60,
        50,
      ],
    },
    {
      name: "Recurring Payments",
      data: [
        90, 110, 110, 95, 95, 85, 85, 95, 95, 115, 115, 100, 100, 115, 115, 95,
        95, 85, 85,
      ],
    },
  ];

  return (
    <>
      {isLoading ? (
        <SktNewsletterCampaign />
      ) : (
        <DashboardCard
          title="Newsletter Campaign"
          subtitle="Overview of Newsletter Campaign"
          action={
            <Stack spacing={3} mt={5} direction="row">
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{
                    width: 9,
                    height: 9,
                    bgcolor: primary,
                    svg: { display: "none" },
                  }}
                ></Avatar>
                <Typography variant="subtitle2" color="primary.main">
                  Open Rate
                </Typography>
              </Stack>
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
                  Recurring Payments
                </Typography>
              </Stack>
            </Stack>
          }
        >
          <>
            <Box height="330px" mx="-15px">
              <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="area"
                height={330}
                width={"100%"}
              />
            </Box>
            <Stack spacing={3} mt={1} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
              <Box textAlign='center' px={8}>
                <Typography variant="h3" fontSize="30px">5098</Typography>
                <Typography variant="subtitle1" color="textSecondary">Total Sent</Typography>
              </Box>
              <Box textAlign='center' px={8}>
                <Typography variant="h3" fontSize="30px">4156</Typography>
                <Typography variant="subtitle1" color="textSecondary">Mail Open Rate</Typography>
              </Box>
              <Box textAlign='center' px={8}>
                <Typography variant="h3" fontSize="30px">5098</Typography>
                <Typography variant="subtitle1" color="textSecondary">Click Rate</Typography>
              </Box>
            </Stack>
          </>
        </DashboardCard>
      )}
    </>
  );
};

export default NewsletterCampaign;
