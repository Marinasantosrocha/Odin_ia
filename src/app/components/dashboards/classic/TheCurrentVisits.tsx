import React from "react";
import WorldMap from "react-svg-worldmap";
import type { CountryContext, Data } from "react-svg-worldmap";

import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Avatar, Box } from "@mui/material";
import DashboardCard from "../../shared/DashboardCard";

const CurrentVisits = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const info = theme.palette.info.main;

  const data: Data = [
    { country: "cn", value: 5 }, // China
    { country: "us", value: 10 }, // United States
    { country: "ru", value: 7 }, // Russia
    { country: "in", value: 11 }, // Russia
  ];

  const getStyle = ({ countryCode, color }: CountryContext) => ({
    fill:
      countryCode === "US"
        ? "#1B84FF"
        : countryCode === "IN"
        ? "#21c1d6"
        : countryCode === "RU"
        ? "#7460ee"
        : color,

    stroke: "transparent",
    strokeWidth: 1,
    strokeOpacity: 0.5,
    cursor: "pointer",
  });

  return (
    <>
      <DashboardCard title="Current Visits" subtitle="Visit from the countries">
        <>
          <Box mt={5}>
            <WorldMap
              color="#EAEFF4"
              size="sm"
              valueSuffix="points"
              data={data}
              styleFunction={getStyle}
            />
          </Box>
          {/* points */}
          <Stack spacing={3} p={3} direction="row" justifyContent="center" mt={3}>
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
                India
              </Typography>
            </Stack>

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
                USA
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: info,
                  svg: { display: "none" },
                }}
              ></Avatar>
              <Typography variant="subtitle2" color="info.main">
                Russia
              </Typography>
            </Stack>
          </Stack>
        </>
      </DashboardCard>
    </>
  );
};

export default CurrentVisits;
