import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";
import DashboardCard from "../../../shared/DashboardCard";

const SktOurVisitor = () => {
  return (
    <DashboardCard
      title="Our Visitors"
      subtitle="Different Devices Used to Visit"
    >
      <>
        <Box mt={4} height="265px">
          <Skeleton variant="rounded" width="100%" height={265} />
        </Box>
        {/* points */}
        <Stack
          spacing={3}
          mt={3}
          direction="row"
          justifyContent="space-between"
        >
          <Skeleton variant="rounded" width={80} height={32} />
          <Skeleton variant="rounded" width={80} height={32} />
          <Skeleton variant="rounded" width={80} height={32} />
        </Stack>
      </>
    </DashboardCard>
  );
};

export default SktOurVisitor;
