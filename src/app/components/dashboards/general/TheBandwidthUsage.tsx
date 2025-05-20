import { Box, CardContent, Card, Typography, Stack, Grid } from "@mui/material";
import { IconChartDonutFilled } from "@tabler/icons-react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import SktBandwidthUsage from "../skeleton/analytical/SktBandwidthUsage";
import { Icon } from "@iconify/react";
import { ApexOptions } from "apexcharts";

interface SktBandwidthUsagetwoCardProps {
  isLoading: boolean;
}

const BandwidthUsage = ({ isLoading }: SktBandwidthUsagetwoCardProps) => {
  const theme = useTheme();
  // chart
  const optionscolumnchart: ApexOptions = {
    colors: ["#fff"],
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0,
      },
    },
    chart: {
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,

      colors: ["rgba(255, 255, 255)"]
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [
    {
      name: "",
      data: [0, 8, 12, 10, 6, 8, 15, 23],
    },
  ];

  return (<>
    {isLoading ? (
      <SktBandwidthUsage />
    ) : (
      <Card variant="outlined" sx={{ p: 0, bgcolor: "info.main" }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              sx={{
                backgroundColor: "rgba(0,0,0,0.1)",
                width: "48px",
                height: "48px",
                borderRadius: "100%",
              }}
            >
              <Icon
                icon="solar:server-square-linear"
                width={24}
                height={24}
              />
            </Box>
            <Box>
              <Typography color="white" variant="h5">
                Bandwidth usage
              </Typography>
              <Typography
                color="white"
                variant="subtitle1"
                sx={{
                  opacity: 0.8,
                }}
              >
                March 2025
              </Typography>
            </Box>
          </Stack>
          <Grid container spacing={3}>
            <Grid display="flex" alignItems="center" size={5}>
              <Typography variant="h5" fontWeight="400" fontSize="30px" color="white">
                50 GB
              </Typography>
            </Grid>
            <Grid size={7}>
              <Box height="70px">
                <Chart
                  options={optionscolumnchart}
                  series={seriescolumnchart}
                  type="line"
                  height={70}
                  width={"100%"}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )}
  </>);
};

export default BandwidthUsage;
