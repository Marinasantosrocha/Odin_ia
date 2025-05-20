import React from "react";
import {
  Typography,
  Avatar,
  TableContainer,
  MenuItem,
  CardContent,
  Box,
  Stack,
  Grid,
  Button,
  LinearProgress,
} from "@mui/material";
import TheProductsData from "./TheProductsData";
import { Icon } from "@iconify/react";
import BlankCard from "../../shared/BlankCard";

interface reviewType {
  total: string;
  icon: string;
  color: string;
  type: string;
  progress: number;
}

const reviews: reviewType[] = [
  {
    icon: "solar:smile-circle-linear",
    color: "success",
    type: "Positive",
    total: "25547",
    progress: 60,
  },
  {
    icon: "solar:sad-circle-outline",
    color: "error",
    type: "Negative ",
    total: "5478",
    progress: 25,
  },
  {
    icon: "solar:expressionless-circle-linear",
    color: "primary",
    type: "Neutral ",
    total: "457",
    progress: 45,
  },
];

const TheReviews = () => {
  return (
    (<BlankCard>
      <CardContent sx={{ pb: 2 }}>
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}>
            <Typography variant="h5" mb={3}>
              Reviews
            </Typography>

            <Typography variant="h2" mb="4px">
              31,560
            </Typography>
            <Typography variant="subtitle1" mb="4px" color="textSecondary">
              April the product got 234 reviews
            </Typography>

            <Box display="flex" alignItems="center" gap={2} my={3}>
              <Avatar
                src="/images/profile/user-2.jpg"
                alt="user"
                sx={{ height: 50, width: 50 }}
              />
              <Avatar
                src="/images/profile/user-3.jpg"
                alt="user"
                sx={{ height: 50, width: 50 }}
              />
              <Avatar
                src="/images/profile/user-4.jpg"
                alt="user"
                sx={{ height: 50, width: 50 }}
              />
              <Avatar
                src="/images/profile/user-5.jpg"
                alt="user"
                sx={{ height: 50, width: 50 }}
              />
            </Box>

            <Button variant="contained" color="success">
              Read Reviews
            </Button>
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}>
            <Stack spacing={2} mt={2} mb={3}>
              {reviews.map((review, i) => (
                <Box key={i} width="100%" pb={2}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Icon icon={review.icon} height={40} />
                    <Box>
                      <Typography variant="h5">
                        {review.type} Reviews
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        fontSize="15px"
                        color="textSecondary"
                      >
                        {review.total} Reviews
                      </Typography>
                    </Box>
                  </Box>
                  {review.progress > 50 ? (
                    <LinearProgress
                      color="success"
                      variant="determinate"
                      value={review.progress}
                    />
                  ) : review.progress > 40 ? (
                    <LinearProgress
                      color="primary"
                      variant="determinate"
                      value={review.progress}
                    />
                  ) : (
                    <LinearProgress
                      color="error"
                      variant="determinate"
                      value={review.progress}
                    />
                  )}
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </BlankCard>)
  );
};

export default TheReviews;
