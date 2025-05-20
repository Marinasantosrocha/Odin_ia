import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Grid,
  Typography,
  CardContent,
  Divider,
  useMediaQuery,
  Theme,
} from "@mui/material";
import BlankCard from "../../shared/BlankCard";
import SktBarCards from "../skeleton/minimal/SktBarCards";
import { ApexOptions } from "apexcharts";

interface SktBarCards {
  isLoading: boolean;
}

const BarCards = ({ isLoading }: SktBarCards) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const error = theme.palette.error.main;
  const info = theme.palette.info.main;

  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  // chart 1
  const pie1Chart: ApexOptions = {
    labels: ["New", "Old"],
    chart: {
      toolbar: {
        show: false,
      },
      sparkline: { enabled: true },
    },
    colors: [secondary],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        horizontal: false,

        columnWidth: "65%",
        borderRadius: 3,
      },
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
      },
    },
    stroke: {
      width: 0,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      x: {
        show: false,
      },
    },
  };
  const pie1seriesChart = [
    {
      name: "",
      data: [4, 5, 2, 10, 9, 12, 4, 9],
    },
  ];

  // chart 2
  const pie2Chart: ApexOptions = {
    labels: ["New", "Old"],
    chart: {
      toolbar: {
        show: false,
      },
      sparkline: { enabled: true },
    },
    colors: [info],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        horizontal: false,

        columnWidth: "65%",
        borderRadius: 3,
      },
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
      },
    },
    stroke: {
      width: 0,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      x: {
        show: false,
      },
    },
  };
  const pie2seriesChart = [
    {
      name: "",
      data: [4, 5, 2, 10, 9, 12, 4, 9],
    },
  ];

  // chart 3
  const pie3Chart: ApexOptions = {
    labels: ["New", "Old"],
    chart: {
      toolbar: {
        show: false,
      },
      sparkline: { enabled: true },
    },
    colors: [primary],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        horizontal: false,

        columnWidth: "65%",
        borderRadius: 3,
      },
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
      },
    },
    stroke: {
      width: 0,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      x: {
        show: false,
      },
    },
  };
  const pie3seriesChart = [
    {
      name: "",
      data: [4, 5, 2, 10, 9, 12, 4, 9],
    },
  ];

  // chart 4
  const pie4Chart: ApexOptions = {
    labels: ["New", "Old"],
    chart: {
      toolbar: {
        show: false,
      },
      sparkline: { enabled: true },
    },
    colors: [error],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        horizontal: false,

        columnWidth: "65%",
        borderRadius: 3,
      },
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
      },
    },
    stroke: {
      width: 0,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      x: {
        show: false,
      },
    },
  };
  const pie4seriesChart = [
    {
      name: "",
      data: [4, 5, 2, 10, 9, 12, 4, 9],
    },
  ];

  return (<>
    {isLoading ? (
      <SktBarCards />
    ) : (
      <BlankCard>
        <Grid container>
          <Grid
            display="flex"
            size={{
              xs: 12,
              sm: 6,
              lg: 3
            }}>
            <Box
              sx={{
                flexShrink: 0,
                width: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h5" textAlign="center" mb={2}>
                  Unique Visit
                </Typography>

                <Box
                  height="70px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mt={1}
                >
                  <Chart
                    options={pie1Chart}
                    series={pie1seriesChart}
                    type="bar"
                    height={65}
                    width="90px"
                  />
                </Box>
              </CardContent>

              <Divider />
              <Box py={1} textAlign="center">
                <Typography variant="h6" textAlign="center">
                  12,456
                </Typography>
              </Box>
              {lgDown ? <Divider flexItem /> : null}
            </Box>

            <Divider orientation="vertical" />
          </Grid>
          {/* 2 */}

          <Grid
            display="flex"
            size={{
              xs: 12,
              sm: 6,
              lg: 3
            }}>
            <Box
              sx={{
                flexShrink: 0,
                width: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h5" textAlign="center" mb={2}>
                  Total Visit
                </Typography>

                <Box
                  height="70px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mt={1}
                >
                  <Chart
                    options={pie2Chart}
                    series={pie2seriesChart}
                    type="bar"
                    height={65}
                    width="90px"
                  />
                </Box>
              </CardContent>
              <Divider />
              <Box py={1} textAlign="center">
                <Typography variant="h6" textAlign="center">
                  6,450
                </Typography>
              </Box>
              {lgDown ? <Divider flexItem /> : null}
            </Box>
            <Divider orientation="vertical" />
          </Grid>
          {/* 3 */}
          <Grid
            display="flex"
            size={{
              xs: 12,
              sm: 6,
              lg: 3
            }}>
            <Box
              sx={{
                flexShrink: 0,
                width: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h5" textAlign="center" mb={2}>
                  Bounce rate
                </Typography>

                <Box
                  height="70px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mt={1}
                >
                  <Chart
                    options={pie3Chart}
                    series={pie3seriesChart}
                    type="bar"
                    height={65}
                    width="90px"
                  />
                </Box>
              </CardContent>
              <Divider />
              <Box py={1} textAlign="center">
                <Typography variant="h6" textAlign="center">
                  45,125
                </Typography>
              </Box>
              {lgDown ? <Divider flexItem /> : null}
            </Box>
            <Divider orientation="vertical" />
          </Grid>
          {/* 4 */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 3
            }}>
            <CardContent>
              <Typography variant="h5" textAlign="center" mb={2}>
                Unique Visit
              </Typography>

              <Box
                height="70px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mt={1}
              >
                <Chart
                  options={pie4Chart}
                  series={pie4seriesChart}
                  type="bar"
                  height={65}
                  width="90px"
                />
              </Box>
            </CardContent>
            <Divider />
            <Box py={1} textAlign="center">
              <Typography variant="h6" textAlign="center">
                1,520
              </Typography>
            </Box>
            {lgDown ? <Divider flexItem /> : null}
          </Grid>
        </Grid>
      </BlankCard>
    )}
  </>);
};

export default BarCards;
