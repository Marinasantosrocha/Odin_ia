import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Grid, Box } from "@mui/material";
import DashboardCard from "../../shared/DashboardCard";
import SktSalesPrediction from "../skeleton/minimal/SktSalesPrediction";
import { ApexOptions } from "apexcharts";

interface SalesDifferencetwoCardProps {
  isLoading: boolean;
}

const SalesDifference = ({ isLoading }: SalesDifferencetwoCardProps) => {
  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;

  // chart 1
  const totalRevenueChart: ApexOptions = {
    chart: {
      type: "donut",
      offsetY: -20,
      foreColor: "#adb0bb",
    },
    labels: ["Increase", "Decrease"],
    dataLabels: {
      enabled: false,
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60px",
        },
      },
    },
    stroke: {
      width: 0,
    },
    legend: {
      show: false,
    },
    colors: [secondary, "rgb(242, 244, 248)"],
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      x: {
        show: false,
      },
    },
  };
  const totalRevenueseriesChart = [25, 10];

  return (<>
    {isLoading ? (
      <SktSalesPrediction />
    ) : (
      <DashboardCard title="Sales Difference">
        <>
          <Grid container spacing={3}>
            <Grid size={6}>
              <Typography variant="h2" color='success.main'>$4,316</Typography>
              <Typography variant="subtitle2" color='textSecondary'>
                10% Increased
              </Typography>
              <Typography variant="subtitle1" fontWeight={500}>
                (150-165 Sales)
              </Typography>
            </Grid>
            <Grid size={6}>
              <Box height="80px" display="flex" alignItems="center" mt={1} justifyContent="flex-end">
                <Chart
                  options={totalRevenueChart}
                  series={totalRevenueseriesChart}
                  type="donut"
                  height={100}
                  width="100px"
                />
              </Box>
            </Grid>
          </Grid>
        </>
      </DashboardCard>
    )}
  </>);
};

export default SalesDifference;
