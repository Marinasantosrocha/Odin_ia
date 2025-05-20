import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Box, Card, CardContent, Grid, Typography, Stack } from "@mui/material";
import { ApexOptions } from "apexcharts";

const TheOnlineRevenue = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const error = theme.palette.error.main;
  const warning = theme.palette.warning.main;

  // chart 1
  const pie1Chart: ApexOptions = {
    labels: ["New", "Old"],
    chart: {
      fontFamily: "inherit",
      sparkline: {
        enabled: true,
      },
    },
    colors: [secondary, "rgba(0, 0, 0, 0.1)"],
    dataLabels: { enabled: false },
    plotOptions: {},
    stroke: {
      curve: "straight",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.15,
        opacityTo: 0,
        stops: [0, 200],
      },
    },
    markers: {
      size: 0,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };
  const pie1seriesChart = [
    {
      name: "Revenue",
      data: [0, 150, 110, 240, 200, 200, 300, 200],
    },
  ];

  return (
    <Card variant="outlined" sx={{ p: 0 }}>
      <Box py={3} pl={3}>
        <Typography variant="subtitle1">Online Revenue</Typography>
        <Typography variant="h4">$2376</Typography>
      </Box>

      <Box
        height="64px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px="30px"
        pb="30px"
      >
        <Chart
          options={pie1Chart}
          series={pie1seriesChart}
          type="area"
          height={64}
          width="100%"
        />
      </Box>
    </Card>
  );
};

export default TheOnlineRevenue;
