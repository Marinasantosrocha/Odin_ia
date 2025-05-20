import React from "react";
import {
  Box,
  Skeleton,
  Stack,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { IconArrowUpLeft } from "@tabler/icons-react";

const SktMonthlyEarnings = () => {
  return (
    <Card variant="outlined" sx={{ p: 0, bgcolor: "secondary.main" }}>
      <CardContent>
        <Typography color="white" variant="h5">
          <Skeleton variant="rounded" width={160} height={25} />
        </Typography>
        <Box mt={4}>
          <Skeleton variant="rounded" width="100%" height={45} />
        </Box>
        <Stack mt={4} direction="row" alignItems="center" spacing={1}>
          <Typography variant="h4" color="white">
            <Skeleton variant="rounded" width={60} height={25} />
          </Typography>

          <Typography variant="subtitle1" display="flex" color="white">
            <Box display="flex" alignItems="center">
              <IconArrowUpLeft width={18} height={18} />
            </Box>
            <Skeleton variant="rounded" width={90} height={25} />
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SktMonthlyEarnings;
