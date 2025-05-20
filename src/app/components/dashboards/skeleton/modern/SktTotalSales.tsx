import React from "react";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import DashboardCard from "../../../shared/DashboardCard";

const SktTotalSales = () => {
  return (
    <DashboardCard title="Total Sales">
      <>
        <Box display="flex" alignItems="center" mt={4}>
          <Typography color="textSecondary" variant="body1">
            <Skeleton variant="rounded" width={90} height={28} />
          </Typography>
          <Box ml="auto">
            <Typography variant="h3">
              <Skeleton variant="rounded" width={90} height={28} />
            </Typography>
          </Box>
        </Box>
        {/* chart */}
        <Box mt={5} position="relative" height="280px">
          <Skeleton variant="rounded" width="100%" height={280} />
        </Box>
        <Box display="flex" justifyContent="space-between" mt={5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="rounded" width={9} height={9} />
            <Typography
              variant="subtitle2"
              fontSize="12px"
              color="secondary.main"
            >
              <Skeleton variant="rounded" width={60} height={28} />
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="rounded" width={9} height={9} />
            <Typography
              variant="subtitle2"
              fontSize="12px"
              color="secondary.main"
            >
              <Skeleton variant="rounded" width={60} height={28} />
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="rounded" width={9} height={9} />
            <Typography
              variant="subtitle2"
              fontSize="12px"
              color="secondary.main"
            >
              <Skeleton variant="rounded" width={60} height={28} />
            </Typography>
          </Stack>
        </Box>
      </>
    </DashboardCard>
  );
};

export default SktTotalSales;
