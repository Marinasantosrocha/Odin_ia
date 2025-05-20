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
  Divider,
} from "@mui/material";
import TheProductsData from "./TheProductsData";
import { Icon } from "@iconify/react";
import BlankCard from "../../shared/BlankCard";
import Image from "next/image";

interface reviewType {
  total: string;
  icon: string;
  type: string;
  progress: number;
}

const reviews: reviewType[] = [
  {
    icon: "/images/browser/photoshop.jpg",
    type: "Photoshop",
    total: "This is a sample text",
    progress: 56,
  },
  {
    icon: "/images/browser/sketch.jpg",
    type: "Sketch ",
    total: "This is a sample text",
    progress: 78,
  },
];

const TheExperiances = () => {
  return (
    (<BlankCard>
      <CardContent sx={{ pb: 2 }}>
        <Typography variant="h5" mb={3}>
          Experiances
        </Typography>

        {reviews.map((review, i) => (
          <Grid container spacing={2} mt={2} mb={3} alignItems="center" key={i}>
            <Grid
              sx={{
                textAlign: {
                  sm: "center",
                },
              }}
              size={{
                xs: 12,
                lg: 2
              }}>
              <Image src={review.icon} height={54} width={54} alt="img" />
            </Grid>
            <Grid
              size={{
                xs: 12,
                lg: 4
              }}>
              <Typography variant="h5">{review.type}</Typography>
              <Typography
                variant="subtitle1"
                fontSize="15px"
                color="textSecondary"
              >
                {review.total}
              </Typography>
            </Grid>
            <Grid
              alignItems="center"
              size={{
                xs: 12,
                lg: 6
              }}>
              {review.progress > 70 ? (
                <LinearProgress
                  color="secondary"
                  variant="determinate"
                  value={review.progress}
                />
              ) : (
                <LinearProgress
                  color="primary"
                  variant="determinate"
                  value={review.progress}
                />
              )}
            </Grid>
          </Grid>
        ))}
      </CardContent>
      <Divider />
      <CardContent sx={{ pb: 2 }}>
        <Grid container spacing={2}>
          <Grid
            textAlign="center"
            size={{
              xs: 6,
              md: 4
            }}>
            <Typography variant="h3">5486</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Projects
            </Typography>
          </Grid>
          <Grid
            textAlign="center"
            size={{
              xs: 6,
              md: 4
            }}>
            <Typography variant="h3">987</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Winning Entries
            </Typography>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Button variant="contained" color="primary" fullWidth>
              Hire Me
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </BlankCard>)
  );
};

export default TheExperiances;
