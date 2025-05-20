import React from "react";
import DashboardCard from "../../shared/DashboardCard";
import { Box, Divider, Typography } from "@mui/material";
import { Icon } from "@iconify/react";

const TheHighlights = () => {
  return (
    <DashboardCard title="Highlights">
      <>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={1}
        >
          <Typography variant="subtitle1" fontWeight={500}>
            Daily Sales
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight={500}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Box component="span" color="secondary.main">
              <Icon icon="solar:arrow-right-up-linear" height={20} />
            </Box>
            Daily Sales
          </Typography>
        </Box>
        <Divider />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          py={1}
        >
          <Typography variant="subtitle1" fontWeight={500}>
            Avg. Clients
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight={500}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Box component="span" color="error.main">
              <Icon icon="solar:arrow-left-down-linear" height={20} />
            </Box>
            400
          </Typography>
        </Box>
        <Divider />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pt={1}
        >
          <Typography variant="subtitle1" fontWeight={500}>
            Pending Tasks
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight={500}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Box component="span" color="secondary.main">
              <Icon icon="solar:arrow-right-up-linear" height={20} />
            </Box>
            4.3{" "}
            <Typography color="textSecondary" component="span">
              /37
            </Typography>
          </Typography>
        </Box>
      </>
    </DashboardCard>
  );
};

export default TheHighlights;
