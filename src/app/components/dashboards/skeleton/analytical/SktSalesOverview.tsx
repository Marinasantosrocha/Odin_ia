import React from "react";
import { Box, Skeleton } from "@mui/material";
import DashboardCard from "../../../shared/DashboardCard";

const SktSalesOverview = () => {
  return (
    <DashboardCard title="Sales Overview" subtitle="Ample Admin Vs Pixel Admin">
      <>
        <Box height="305px">
          <Skeleton variant="rounded" width="100%" height={305} />
        </Box>
      </>
    </DashboardCard>
  );
};

export default SktSalesOverview;
