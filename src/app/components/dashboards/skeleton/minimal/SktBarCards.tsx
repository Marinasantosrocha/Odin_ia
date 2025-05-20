import React from "react";
import { Box, CardContent, Grid, Skeleton, Typography } from "@mui/material";
import BlankCard from "../../../shared/BlankCard";

const SktBarCards = () => {
  return (
    (<Grid container spacing={3}>
      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 3
        }}>
        <BlankCard>
          <CardContent>
            <Typography variant="subtitle1" fontSize="16px" textAlign="center">
              <Skeleton variant="rounded" width={150} height={28} />
            </Typography>

            <Box
              height="70px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={1}
            >
              <Skeleton variant="rounded" width={150} height={65} />
            </Box>
            <Typography variant="h6" textAlign="center" mt={2}>
              <Skeleton variant="rounded" width={150} height={28} />
            </Typography>
          </CardContent>
        </BlankCard>
      </Grid>
      {/* 2 */}
      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 3
        }}>
        <BlankCard>
          <CardContent>
            <Typography variant="subtitle1" fontSize="16px" textAlign="center">
              <Skeleton variant="rounded" width={150} height={28} />
            </Typography>

            <Box
              height="70px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={1}
            >
              <Skeleton variant="rounded" width={150} height={65} />
            </Box>
            <Typography variant="h6" textAlign="center" mt={2}>
              <Skeleton variant="rounded" width={150} height={28} />
            </Typography>
          </CardContent>
        </BlankCard>
      </Grid>
      {/* 3 */}
      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 3
        }}>
        <BlankCard>
          <CardContent>
            <Typography variant="subtitle1" fontSize="16px" textAlign="center">
              <Skeleton variant="rounded" width={150} height={28} />
            </Typography>

            <Box
              height="70px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={1}
            >
              <Skeleton variant="rounded" width={150} height={65} />
            </Box>
            <Typography variant="h6" textAlign="center" mt={2}>
              <Skeleton variant="rounded" width={150} height={28} />
            </Typography>
          </CardContent>
        </BlankCard>
      </Grid>
      {/* 4 */}
      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 3
        }}>
        <BlankCard>
          <CardContent>
            <Typography variant="subtitle1" fontSize="16px" textAlign="center">
              <Skeleton variant="rounded" width={150} height={28} />
            </Typography>

            <Box
              height="70px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={1}
            >
              <Skeleton variant="rounded" width={150} height={65} />
            </Box>
            <Typography variant="h6" textAlign="center" mt={2}>
              <Skeleton variant="rounded" width={150} height={28} />
            </Typography>
          </CardContent>
        </BlankCard>
      </Grid>
    </Grid>)
  );
};

export default SktBarCards;
