import React from "react";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import DashboardCard from "../../../shared/DashboardCard";

const SktWeeklyStats = () => {
  return (
    <DashboardCard
      title="Weekly Stats"
      footer={
        <Box mt={4} height="130px">
          <Skeleton variant="rounded" width="100%" height={130} />
        </Box>
      }
    >
      <>
        <Stack spacing={3} mt={3}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Skeleton variant="rounded" width={40} height={40} />
              <Box>
                <Typography variant="h6" mb="4px">
                  <Skeleton variant="rounded" width={90} height={28} />
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  <Skeleton variant="rounded" width={90} height={28} />
                </Typography>
              </Box>
            </Stack>
            <Skeleton variant="rounded" width={42} height={24} />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Skeleton variant="rounded" width={40} height={40} />
              <Box>
                <Typography variant="h6" mb="4px">
                  <Skeleton variant="rounded" width={90} height={28} />
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  <Skeleton variant="rounded" width={90} height={28} />
                </Typography>
              </Box>
            </Stack>
            <Skeleton variant="rounded" width={42} height={24} />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Skeleton variant="rounded" width={40} height={40} />
              <Box>
                <Typography variant="h6" mb="4px">
                  <Skeleton variant="rounded" width={90} height={28} />
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  <Skeleton variant="rounded" width={90} height={28} />
                </Typography>
              </Box>
            </Stack>
            <Skeleton variant="rounded" width={42} height={24} />
          </Stack>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default SktWeeklyStats;
