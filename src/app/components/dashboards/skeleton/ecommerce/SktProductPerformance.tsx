import React from "react";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import DashboardCard from "../../../shared/DashboardCard";

const SktProductPerformance = () => {
  return (
    (<DashboardCard
      title="Products Performance"
      action={
        <Stack spacing={3} mt={5} direction="row">
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="rounded" width={9} height={9} />
            <Typography
              variant="subtitle2"
              fontSize="12px"
              color="primary.main"
            >
              <Skeleton variant="rounded" width={60} height={20} />
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="rounded" width={9} height={9} />
            <Typography
              variant="subtitle2"
              fontSize="12px"
              color="secondary.main"
            >
              <Skeleton variant="rounded" width={60} height={20} />
            </Typography>
          </Stack>
        </Stack>
      }
    >
      <Grid container spacing={3}>
        <Grid
          size={{
            xs: 12,
            sm: 5
          }}>
          <Typography variant="h5">
            <Skeleton variant="rounded" width={90} height={20} />
          </Typography>
          <Typography variant="subtitle2" fontSize="12px">
            <Skeleton variant="rounded" width={60} height={20} />
          </Typography>

          <Typography variant="h5" mt={3}>
            <Skeleton variant="rounded" width={90} height={20} />
          </Typography>
          <Typography variant="subtitle2" fontSize="12px">
            <Skeleton variant="rounded" width={60} height={20} />
          </Typography>

          <Box my={4} height="30px">
            <Skeleton variant="rounded" width="100%" height={30} />
          </Box>

          <Skeleton variant="rounded" width={60} height={40} />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 7
          }}>
          <Box height="285px">
            <Skeleton variant="rounded" width="100%" height={285} />
          </Box>
        </Grid>
      </Grid>
    </DashboardCard>)
  );
};

export default SktProductPerformance;
