import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Grid, Box } from "@mui/material";
import DashboardCard from "../../shared/DashboardCard";
import SktSalesPrediction from "../skeleton/minimal/SktSalesPrediction";
import { ApexOptions } from "apexcharts";

interface SalesPredictionCardProps {
  isLoading: boolean;
}

const SalesPrediction = ({ isLoading }: SalesPredictionCardProps) => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  // chart 1
  const totalRevenueChart: ApexOptions = {
    colors: [primary],
    chart: {
      type: "radialBar",
      offsetY: -20,
      foreColor: "#adb0bb",
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        track: {
          background: "#f2f4f8",
          startAngle: -135,
          endAngle: 135,
        },
        hollow: {
          size: "30%",
          background: "transparent",
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
          },
          value: {
            show: false,
          },
          total: {
            show: true,
            fontSize: "20px",
            color: "#000",
            label: "91.4 %",
          },
        },
      },
    },
    grid: {
      padding: {
        top: 20,
      },
    },
    fill: {
      type: "solid",
    },
    stroke: {
      lineCap: "butt",
    },
    labels: ["Average Results"],
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      x: {
        show: false,
      },
    },
  };
  const totalRevenueseriesChart = [100];

  return (<>
    {isLoading ? (
      <SktSalesPrediction />
    ) : (
      <DashboardCard title="Sales Prediction">
        <>
          <Grid container spacing={3}>
            <Grid size={6}>
              <Typography variant="h2" color='primary.main'>$3,528</Typography>
              <Typography variant="subtitle2" color='textSecondary'>
                10% Increased
              </Typography>
              <Typography variant="subtitle1" fontWeight={500}>
                (150-165 Sales)
              </Typography>
            </Grid>
            <Grid size={6}>
              <Box height="90px" mt='-30px'>
                <Chart
                  options={totalRevenueChart}
                  series={totalRevenueseriesChart}
                  type="radialBar"
                  height={180}
                  width="180px"
                />
              </Box>
            </Grid>
          </Grid>
        </>
      </DashboardCard>
    )}
  </>);
};

export default SalesPrediction;
