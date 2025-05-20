import React from "react";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import DashboardCard from "../../../shared/DashboardCard";

const SktSalesCard = () => {
  return (
    (<Grid container spacing={3}>
      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 4
        }}>
        <DashboardCard
          title="Product A Sales"
          footer={
            <Box height="50px" mt={1}>
              <Skeleton variant="rounded" width="100%" height={50} />
            </Box>
          }
        >
          <Grid container spacing={3}>
            <Grid size={3}>
              <Typography variant="subtitle2" fontSize="12px" mb={1}>
                <Skeleton variant="rounded" width={60} height={28} />
              </Typography>
              <Typography variant="h6">
                <Skeleton variant="rounded" width={70} height={28} />
              </Typography>
            </Grid>
            <Grid size={3}>
              <Typography variant="subtitle2" fontSize="12px">
                <Skeleton variant="rounded" width={60} height={28} />
              </Typography>
              <Typography variant="h6">
                <Skeleton variant="rounded" width={70} height={28} />
              </Typography>
            </Grid>
          </Grid>
        </DashboardCard>
      </Grid>
      {/* 2 */}
      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 4
        }}>
        <DashboardCard
          title="Product B Sales"
          footer={
            <Box height="50px" mt={1}>
              <Skeleton variant="rounded" width="100%" height={50} />
            </Box>
          }
        >
          <Grid container spacing={3}>
            <Grid size={3}>
              <Typography variant="subtitle2" fontSize="12px" mb={1}>
                <Skeleton variant="rounded" width={60} height={28} />
              </Typography>
              <Typography variant="h6">
                <Skeleton variant="rounded" width={70} height={28} />
              </Typography>
            </Grid>
            <Grid size={3}>
              <Typography variant="subtitle2" fontSize="12px">
                <Skeleton variant="rounded" width={60} height={28} />
              </Typography>
              <Typography variant="h6">
                <Skeleton variant="rounded" width={70} height={28} />
              </Typography>
            </Grid>
          </Grid>
        </DashboardCard>
      </Grid>
      {/* 3 */}
      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 4
        }}>
        <DashboardCard
          title="Product C Sales"
          footer={
            <Box height="50px" mt={1}>
              <Skeleton variant="rounded" width="100%" height={50} />
            </Box>
          }
        >
          <Grid container spacing={3}>
            <Grid size={3}>
              <Typography variant="subtitle2" fontSize="12px" mb={1}>
                <Skeleton variant="rounded" width={60} height={28} />
              </Typography>
              <Typography variant="h6">
                <Skeleton variant="rounded" width={70} height={28} />
              </Typography>
            </Grid>
            <Grid size={3}>
              <Typography variant="subtitle2" fontSize="12px">
                <Skeleton variant="rounded" width={60} height={28} />
              </Typography>
              <Typography variant="h6">
                <Skeleton variant="rounded" width={70} height={28} />
              </Typography>
            </Grid>
          </Grid>
        </DashboardCard>
      </Grid>
    </Grid>)
  );
};

export default SktSalesCard;
