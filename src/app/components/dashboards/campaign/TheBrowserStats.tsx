import React from "react";
import { Stack, Typography, Avatar, Chip, Box } from "@mui/material";
import DashboardCard from "../../shared/DashboardCard";

const stats = [
  {
    imgSrc: "/images/browser/chrome-logo.png",
    title: "Google Chrome",
    color: "primary",
    percent: "25%",
  },
  {
    imgSrc: "/images/browser/firefox-logo.png",
    title: "Mozila Firefox",
    color: "secondary",
    percent: "45%",
  },
  {
    imgSrc: "/images/browser/safari-logo.png",
    title: "Apple Safari",
    color: "warning",
    percent: "18%",
  },
  {
    imgSrc: "/images/browser/internet-logo.png",
    title: "Internet Explorer",
    color: "error",
    percent: "40%",
  },
  {
    imgSrc: "/images/browser/opera-logo.png",
    title: "Opera mini",
    color: "primary",
    percent: "65%",
  },
  {
    imgSrc: "/images/browser/internet-logo.png",
    title: "Microsoft edge",
    color: "success",
    percent: "48%",
  },
  {
    imgSrc: "/images/browser/firefox-logo.png",
    title: "Mozila Firefox",
    color: "secondary",
    percent: "20%",
  },
];

const BrowserStats = () => {
  return (
    <DashboardCard title="Browser Stats">
      <>
        {stats.map((stat, i) => (
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} key={i} py={1}>
            <Box mr="auto" display="flex" alignItems="center" gap={2}>
              <Avatar src={stat.imgSrc} sx={{ width: 40, height: 40 }} />
              <Typography variant="subtitle2">{stat.title}</Typography>
            </Box>
            <Chip
              sx={{
                bgcolor: stat.color + ".light",
                color: stat.color + ".main",
                fontWeight: 400,
                ".MuiChip-label": {
                  fontSize: "14px",
                },
              }}
              label={stat.percent}
            />
          </Stack>
        ))}
      </>
    </DashboardCard>
  );
};

export default BrowserStats;
