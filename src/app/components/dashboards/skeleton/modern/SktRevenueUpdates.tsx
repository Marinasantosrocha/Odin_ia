import React from "react";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import DashboardCard from "../../../shared/DashboardCard";

const SktRevenueUpdates = () => {
  return (
    <DashboardCard title="Revenue Updates">
      <>
        <Box height="283px">
          <Skeleton variant="rounded" width="100%" height={283} />
        </Box>
        <Stack spacing={3} mt={1} direction="row" justifyContent="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="rounded" width={9} height={9} />
            <Typography
              variant="subtitle2"
              fontSize="12px"
              color="primary.main"
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
        </Stack>
      </>
    </DashboardCard>
  );
};

export default SktRevenueUpdates;
