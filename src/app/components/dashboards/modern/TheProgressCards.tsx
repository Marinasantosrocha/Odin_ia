import React from "react";
import { Typography, Box, Divider, Grid, LinearProgress } from "@mui/material";
import BlankCard from "../../shared/BlankCard";

const TheProgressCards = () => {
  const products = [
    {
      title: "Total Product",

      progress: 86,
    },
    {
      title: "Pending Product",
      progress: 40,
    },
    {
      title: "Product A",
      progress: 56,
    },
    {
      title: "Product B",
      progress: 26,
    },
  ];

  return (
    (<BlankCard>
      <Grid container>
        {products.map((product, i) => (
          <Grid
            key={i}
            display="flex"
            size={{
              xs: 12,
              lg: 3,
              md: 6
            }}>
            <Box
              sx={{
                flexShrink: 0,
                width: "100%",
                padding: "30px",
              }}
            >
              <Typography variant="h4" mb={1}>
                {product.progress}%
              </Typography>
              <Typography color="textSecondary" mb={1}>
                {product.title}
              </Typography>

              {product.progress > 80 ? (
                <LinearProgress
                  color="primary"
                  variant="determinate"
                  value={product.progress}
                />
              ) : product.progress > 55 ? (
                <LinearProgress
                  color="success"
                  variant="determinate"
                  value={product.progress}
                />
              ) : product.progress > 35 ? (
                <LinearProgress
                  color="secondary"
                  variant="determinate"
                  value={product.progress}
                />
              ) : (
                <LinearProgress
                  color="error"
                  variant="determinate"
                  value={product.progress}
                />
              )}
            </Box>
            {i !== products.length - 1 ? (
              <Divider orientation="vertical" />
            ) : null}
          </Grid>
        ))}
      </Grid>
    </BlankCard>)
  );
};

export default TheProgressCards;
