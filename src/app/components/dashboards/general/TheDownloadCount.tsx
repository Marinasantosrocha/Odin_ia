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

const DownloadCount = ({ isLoading }: SktBandwidthUsagetwoCardProps) => {
  const theme = useTheme();
  // chart
  const optionscolumnchart: ApexOptions = {
    plotOptions: {
      bar: {
        horizontal: false,

        columnWidth: "30%",
        barHeight: "100%",
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

    colors: ["rgba(255, 255, 255, 0.7)"],
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
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [
    {
      name: "",
      data: [4, 5, 2, 10, 9, 12, 4, 9, 4, 5, 3, 10],
    },
  ];

  return (<>
    {isLoading ? (
      <SktBandwidthUsage />
    ) : (
      <Card variant="outlined" sx={{ p: 0, bgcolor: "secondary.main" }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                width: "48px",
                height: "48px",
                borderRadius: "100%",
              }}
            >
              <Icon
                icon="solar:chart-2-linear"
                width={24}
                height={24}
                color="white"
              />
            </Box>
            <Box>
              <Typography color="white" variant="h5">
                Download Count
              </Typography>
              <Typography color="white" variant="subtitle1">
                March 2025
              </Typography>
            </Box>
          </Stack>
          <Grid container spacing={3}>
            <Grid display="flex" alignItems="center" size={5}>
              <Typography variant="h5" fontWeight="400" fontSize="30px" color="white">
                3,487
              </Typography>
            </Grid>
            <Grid size={7}>
              <Box height="70px">
                <Chart
                  options={optionscolumnchart}
                  series={seriescolumnchart}
                  type="bar"
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

export default DownloadCount;
