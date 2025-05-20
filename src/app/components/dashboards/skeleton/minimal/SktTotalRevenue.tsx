import React from "react";
import { Box, Skeleton } from "@mui/material";
import DashboardCard from "../../../shared/DashboardCard";

const SktTotalRevenue = () => {
  return (
    <DashboardCard
      title="Total Revenue"
      subtitle="Checkout Earnings"
    >
      <>
        <Box height="280px">
          <Skeleton variant="rounded" width="100%" height={280} />
        </Box>
      </>
    </DashboardCard>
  );
};

export default SktTotalRevenue;
