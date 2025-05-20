import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";
import DashboardCard from "../../../shared/DashboardCard";

const SktNewsletterCampaign = () => {
  return (
    <DashboardCard
      title="Newsletter Campaign"
      subtitle="Overview of Newsletter Campaign"
    >
      <>
        <Box height="322px">
          <Skeleton variant="rounded" width="100%" height={322} />
        </Box>
        <Stack spacing={3} mt={1} direction="row" justifyContent="center">
          <Skeleton variant="rounded" width={90} height={32} />
          <Skeleton variant="rounded" width={90} height={32} />
        </Stack>
      </>
    </DashboardCard>
  );
};

export default SktNewsletterCampaign;
