import React from "react";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import DashboardCard from "../../../shared/DashboardCard";

const SktSalesPrediction = () => {
  return (
    (<DashboardCard title="Sales Prediction">
      <>
        <Grid container spacing={3}>
          <Grid size={6}>
            <Typography variant="h3">
              <Skeleton variant="rounded" width="150" height={28} />
            </Typography>
            <Typography variant="subtitle2" fontSize="10px">
              <Skeleton variant="rounded" width="180" height={28} />
            </Typography>
            <Typography variant="subtitle1" fontWeight={500}>
              <Skeleton variant="rounded" width="180" height={28} />
            </Typography>
          </Grid>
          <Grid size={6}>
            <Box height="80px" mb={1}>
              <Skeleton variant="rounded" width="100%" height={80} />
            </Box>
          </Grid>
        </Grid>
      </>
    </DashboardCard>)
  );
};

export default SktSalesPrediction;
