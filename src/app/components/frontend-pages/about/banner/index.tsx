"use client";
import React from "react";
import { Box, Stack, Typography, Container, Grid, Button } from "@mui/material";
import Link from "next/link";

const Banner = () => {
  return (
    (<Box
      bgcolor="primary.light"
      sx={{
        paddingTop: {
          xs: "40px",
          lg: "100px",
        },
        paddingBottom: {
          xs: "40px",
          lg: "100px",
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="space-between">
          <Grid
            alignItems="center"
            size={{
              xs: 12,
              lg: 6
            }}>
            <Typography
              variant="h1"
              mb={3}
              lineHeight={1.4}
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "34px",
                  sm: "48px",
                },
              }}
            >
              Get to know MaterialPro Dashboard Template
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                href="/auth/auth1/register"
              >
                Create an account
              </Button>
              <Button variant="outlined" size="large">
                View Open Positions
              </Button>
            </Stack>
          </Grid>
          <Grid
            display="flex"
            alignItems="center"
            size={{
              xs: 12,
              lg: 5
            }}>
            <Typography lineHeight={1.9}>
              Do you need a highly customizable and developer friendly premium
              next.js admin template packed with numerous features?<Typography component="span" fontWeight={600}> MaterialPro
                Next.js Admin Template </Typography> has everything you need. This <Typography component="span" fontWeight={600}>Mui </Typography>
              based admin template is designed in accordance with industry
              standards and best practices to provide you.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>)
  );
};

export default Banner;
