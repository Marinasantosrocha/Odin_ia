import React from "react";
import { Box, Skeleton } from "@mui/material";
import DashboardCard from "../../../shared/DashboardCard";

const SktNewsletterCampaign = () => {
  return (
    <DashboardCard
      title="Newsletter Campaign"
      subtitle="Overview of Newsletter Campaign"
    >
      <>
        <Box height="265px">
          <Skeleton variant="rounded" width="100%" height={265} />
        </Box>
      </>
    </DashboardCard>
  );
};

export default SktNewsletterCampaign;
