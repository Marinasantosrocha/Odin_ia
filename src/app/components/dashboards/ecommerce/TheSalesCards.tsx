import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Box, Grid, Typography } from "@mui/material";
import DashboardCard from "../../shared/DashboardCard";
import SktSalesCard from "../skeleton/ecommerce/SktSalesCard";
import { ApexOptions } from "apexcharts";

interface SalesCardProps {
  isLoading: boolean;
}

const SalesCards = ({ isLoading }: SalesCardProps) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const error = theme.palette.error.main;

  // chart 1
  const pie1Chart: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      sparkline: { enabled: true },
      fontFamily: "inherit",
    },
    colors: [primary],
    fill: {
      type: "solid",
      opacity: 1,
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        horizontal: false,

        columnWidth: "65%",
        borderRadius: 3,
      },
    },
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0,
      },
    },
    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },
    tooltip: {
      x: {
        show: false,
      },
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
  };
  const pie1seriesChart = [
    {
      name: "A Sales",
      data: [4, 5, 2, 10, 9, 12, 4, 9, 4, 5, 3, 10],
    },
  ];

  // chart 2
  const pie2Chart: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      sparkline: { enabled: true },
      fontFamily: "inherit",
    },
    colors: [secondary],
    fill: {
      type: "solid",
      opacity: 1,
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        horizontal: false,

        columnWidth: "65%",
        borderRadius: 2,
      },
    },
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0,
      },
    },
    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },
    tooltip: {
      x: {
        show: false,
      },
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
  };
  const pie2seriesChart = [
    {
      name: "B Sales",
      data: [2, 4, 4, 6, 8, 5, 6, 4, 8, 6, 6, 2],
    },
  ];

  // chart 3
  const pie3Chart: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      sparkline: { enabled: true },
      fontFamily: "inherit",
    },
    colors: [error],
    fill: {
      type: "solid",
      opacity: 1,
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        horizontal: false,

        columnWidth: "65%",
        borderRadius: 2,
      },
    },
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0,
      },
    },
    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },
    tooltip: {
      x: {
        show: false,
      },
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
  };
  const pie3seriesChart = [
    {
      name: "C Sales",
      data: [2, 4, 4, 6, 8, 5, 6, 4, 8, 6, 6, 2],
    },
  ];

  return (<>
    {isLoading ? (
      <SktSalesCard />
    ) : (
      <Grid container spacing={3}>
        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 4
          }}>
          <DashboardCard title="Product A Sales">
            <Box mt="-15px">
              <Grid container>
                <Grid size={5}>
                  <Typography
                    variant="h6"
                    fontSize="15px"
                    color="textSecondary"
                    fontWeight="300"
                  >
                    Monthly
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="500">
                    80.40%
                  </Typography>
                </Grid>
                <Grid size={5}>
                  <Typography
                    variant="h6"
                    fontSize="15px"
                    color="textSecondary"
                    fontWeight="300"
                  >
                    Daily
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="500">
                    20.40%
                  </Typography>
                </Grid>
              </Grid>
              <Box height="50px" mx="-10px" mt={3}>
                <Chart
                  options={pie1Chart}
                  series={pie1seriesChart}
                  type="bar"
                  height={50}
                  width={"100%"}
                />
              </Box>
            </Box>
          </DashboardCard>
        </Grid>
        {/* 2 */}
        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 4
          }}>
          <DashboardCard title="Product B Sales">
            <Box mt="-15px">
              <Grid container>
                <Grid size={5}>
                  <Typography
                    variant="h6"
                    fontSize="15px"
                    color="textSecondary"
                    fontWeight="300"
                  >
                    Monthly
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="500">
                    80.40%
                  </Typography>
                </Grid>
                <Grid size={5}>
                  <Typography
                    variant="h6"
                    fontSize="15px"
                    color="textSecondary"
                    fontWeight="300"
                  >
                    Daily
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="500">
                    20.40%
                  </Typography>
                </Grid>
              </Grid>
              <Box height="50px" mx="-10px" mt={3}>
                <Chart
                  options={pie2Chart}
                  series={pie2seriesChart}
                  type="bar"
                  height={50}
                  width={"100%"}
                />
              </Box>
            </Box>
          </DashboardCard>
        </Grid>
        {/* 3 */}
        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 4
          }}>
          <DashboardCard title="Product C Sales">
            <Box mt="-15px">
              <Grid container>
                <Grid size={5}>
                  <Typography
                    variant="h6"
                    fontSize="15px"
                    color="textSecondary"
                    fontWeight="300"
                  >
                    Monthly
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="500">
                    80.40%
                  </Typography>
                </Grid>
                <Grid size={5}>
                  <Typography
                    variant="h6"
                    fontSize="15px"
                    color="textSecondary"
                    fontWeight="300"
                  >
                    Daily
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="500">
                    20.40%
                  </Typography>
                </Grid>
              </Grid>
              <Box height="50px" mx="-10px" mt={3}>
                <Chart
                  options={pie3Chart}
                  series={pie3seriesChart}
                  type="bar"
                  height={50}
                  width={"100%"}
                />
              </Box>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    )}
  </>);
};

export default SalesCards;
