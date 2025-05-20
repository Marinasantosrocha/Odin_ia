'use client'
import React from "react";
import {
  Grid,
  Typography,
  Box,
  Breadcrumbs,
  Theme,
  Stack,
} from "@mui/material";
import NextLink from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";


import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BreadCrumbItem {
  title: string;
  to?: string;
}

interface BreadCrumbType {
  subtitle?: string;
  items?: BreadCrumbItem[];
  title: string;
  children?: React.ReactNode;
}

const Breadcrumb = ({ subtitle, items, title, children }: BreadCrumbType) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // chart
  const optionscolumnchart: ApexOptions = {
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 2,
        columnWidth: "50%",
        barHeight: "100%",
      },
    },
    grid: {
      show: false,
    },
    colors: [primary],
    chart: {
      width: 70,
      height: 40,
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false
    },
  };
  const seriescolumnchart = [
    {
      name: "",
      data: [5, 8, 7, 12, 6, 7, 15, 20],
    },
  ];

  // chart 2
  const optionscolumnchart2: ApexOptions = {
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 2,
        columnWidth: "50%",
        barHeight: "100%",
      },
    },
    grid: {
      show: false,
    },
    colors: [secondary],
    chart: {
      width: 70,
      height: 40,
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false
    },
  };
  const seriescolumnchart2 = [
    {
      name: "",
      data: [5, 8, 7, 12, 6, 7, 15, 20],
    },
  ];
  return (
    (<Grid
      container
      sx={{
        my: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Grid
        alignItems="center"
        size={{
          xs: 12,
          sm: 6,
          lg: 8
        }}>
        <Typography variant="h5" mt={1} fontSize='18px'>{title}</Typography>

        <Breadcrumbs
          separator={<IconChevronRight size="16" />}
          sx={{ alignItems: "center", mt: items ? "5px" : "" }}
          aria-label="breadcrumb"
        >
          {items
            ? items.map((item) => (
              <div key={item.title}>
                {item.to ? (
                  <NextLink href={item.to} passHref>
                    <Typography color="textSecondary">
                      {item.title}
                    </Typography>
                  </NextLink>
                ) : (
                  <Typography color="textPrimary">{item.title}</Typography>
                )}
              </div>
            ))
            : ""}
        </Breadcrumbs>
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 4
        }}>
        <Stack direction="row" spacing={3} justifyContent="end">
          <Box display="flex" alignItems="center" gap="8px">
            <Box mt={1}>
              <Typography variant="subtitle2" fontSize='13px' color='textSecondary'>This Month</Typography>
              <Typography variant="h6" fontSize="18px" color="primary.main">
                $58,256
              </Typography>
            </Box>
            <Box height="70px" display="flex" alignItems="center">
              <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="bar"
                height={40}
                width='70px'
              />
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap="8px">
            <Box mt={1}>
              <Typography variant="subtitle2" fontSize='13px' color='textSecondary'>Last Month</Typography>
              <Typography variant="h6" fontSize="18px" color="secondary.main">
                $58,256
              </Typography>
            </Box>
            <Box height="70px" display="flex" alignItems="center">
              <Chart
                options={optionscolumnchart2}
                series={seriescolumnchart2}
                type="bar"
                height={40}
                width='70px'
              />
            </Box>
          </Box>
        </Stack>
      </Grid>
    </Grid>)
  );
};

export default Breadcrumb;

