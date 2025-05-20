import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

const SktYearlySales = () => {
  return (
    (<Card variant="outlined" sx={{ p: 0 }}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={6}>
            <Box mb={3}>
              <Typography variant="h5">43,246</Typography>
              <Typography variant="subtitle1">Yearly Sales</Typography>
            </Box>
            <Grid container spacing={1}>
              <Grid size={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Skeleton variant="rounded" width={9} height={9} />
                  <Typography variant="subtitle2" fontSize="12px">
                    <Skeleton variant="rounded" width={40} height={28} />
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Skeleton variant="rounded" width={9} height={9} />
                  <Typography variant="subtitle2" fontSize="12px">
                    <Skeleton variant="rounded" width={40} height={28} />
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Skeleton variant="rounded" width={9} height={9} />
                  <Typography variant="subtitle2" fontSize="12px">
                    <Skeleton variant="rounded" width={40} height={28} />
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Skeleton variant="rounded" width={9} height={9} />
                  <Typography variant="subtitle2" fontSize="12px">
                    <Skeleton variant="rounded" width={40} height={28} />
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={6}>
            <Box position="relative" display="flex" alignItems="center" mt={1}>
              <Skeleton variant="rounded" width="100%" height={145} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>)
  );
};

export default SktYearlySales;
