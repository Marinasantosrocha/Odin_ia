"use client"
import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Avatar, Box, MenuItem } from "@mui/material";
import DashboardCard from "../../shared/DashboardCard";
import SktOurVisitor from "../skeleton/classic/SktOurVisitor";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import { ApexOptions } from "apexcharts";

interface OurVisitortwoCardProps {
  isLoading: boolean;
}

const TheVisitSource = ({ isLoading }: OurVisitortwoCardProps) => {
  // chart color
  const theme = useTheme();
  const error = theme.palette.error.main;
  const secondary = theme.palette.secondary.main;
  const info = theme.palette.info.main;
  const grey = theme.palette.grey[100];

  // chart
  const optionscolumnchart: ApexOptions = {
    labels: ["Desktop", "Tablet", "Mobile", "Other"],
    chart: {
      height: 215,
      type: "donut",
      foreColor: "#adb0bb",
      fontFamily: `inherit`,
    },
    colors: [info, error, secondary, grey],
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { colors: ["transparent"] },
    plotOptions: {
      pie: {
        donut: {
          size: "85%",
          background: "transparent",
          labels: {
            show: false,
            name: {
              show: true,
              fontSize: "18px",
              color: undefined,
              offsetY: -10,
            },
            value: { show: false, color: "#98aab4" },
            total: { show: false, label: "Our Visitors", color: "#98aab4" },
          },
        },
      },
    },
    responsive: [{ breakpoint: 480, options: { chart: { height: 230 } } }],
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [100, 40, 80, 90];

  const [number, setNumber] = React.useState("1");

  const handleChange3 = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNumber(event.target.value);
  };

  return (
    <>
      {isLoading ? (
        <SktOurVisitor />
      ) : (
        <DashboardCard
          title="Visit source"
          action={
            <CustomSelect
              id="standard-select-number"
              variant="outlined"
              value={number}
              onChange={handleChange3}
              sx={{
                mb: 2,
              }}
            >
              <MenuItem value={1}>January</MenuItem>
              <MenuItem value={2}>February</MenuItem>
              <MenuItem value={3}>March</MenuItem>
              <MenuItem value={4}>April</MenuItem>
            </CustomSelect>
          }
        >
          <>
            <Box mt={4} height="195px">
              <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="donut"
                height={215}
                width={"100%"}
              />
            </Box>
            {/* points */}
            <Stack spacing={3} mt={3} direction="row" justifyContent="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{
                    width: 9,
                    height: 9,
                    bgcolor: info,
                    svg: { display: "none" },
                  }}
                ></Avatar>
                <Typography
                  variant="subtitle2"
                  fontSize="12px"
                  color="info.main"
                >
                  Desktop
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{
                    width: 9,
                    height: 9,
                    bgcolor: error,
                    svg: { display: "none" },
                  }}
                ></Avatar>
                <Typography
                  variant="subtitle2"
                  fontSize="12px"
                  color="error.main"
                >
                  Tablet
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
                <Typography
                  variant="subtitle2"
                  fontSize="12px"
                  color="secondary.main"
                >
                  Mobile
                </Typography>
              </Stack>
            </Stack>
          </>
        </DashboardCard>
      )}
    </>
  );
};

export default TheVisitSource;
