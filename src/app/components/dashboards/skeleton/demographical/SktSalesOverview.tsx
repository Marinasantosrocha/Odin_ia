import React from "react";
import { Box, Skeleton } from "@mui/material";
import DashboardCard from "../../../shared/DashboardCard";

const SktSalesOverview = () => {
  return (
    <DashboardCard title="Sales Overview" subtitle="Ample Admin Vs Pixel Admin">
      <>
        <Box height="250px">
          <Skeleton variant="rounded" width="100%" height={250} />
        </Box>
      </>
    </DashboardCard>
  );
};

export default SktSalesOverview;
