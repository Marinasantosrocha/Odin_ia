"use client";
import React from "react";
import {
  Box,
  Stack,
  Typography,
  Grid,
  Container,
  Divider,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import {
  IconActivityHeartbeat,
  IconBuildingStore,
  IconChartBubble,
  IconShape,
} from "@tabler/icons-react";

const Processes = [
  {
    icon: <IconChartBubble stroke={1.5} size="1.5rem" />,
    title: "Effective Support",
    subtitle: "Suspendisse vestibulum eu erat ac scelerisque.",
    color: "primary",
  },
  {
    icon: <IconBuildingStore stroke={1.5} size="1.5rem" />,
    title: "Expert Advisor",
    subtitle: "Suspendisse vestibulum eu erat ac scelerisque.",
    color: "error",
  },
  {
    icon: <IconShape stroke={1.5} size="1.5rem" />,
    title: "Low Fees",
    subtitle: "Suspendisse vestibulum eu erat ac scelerisque.",
    color: "success",
  },
  {
    icon: <IconActivityHeartbeat stroke={1.5} size="1.5rem" />,
    title: "Loan Facility",
    subtitle: "Suspendisse vestibulum eu erat ac scelerisque.",
    color: "warning",
  },
];

const Process = () => {
  const theme = useTheme();

  return (
    (<Box
      pt={10}
      sx={{
        backgroundColor:
          theme.palette.mode == "light" ? "white" : "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="center">
          <Grid
            textAlign="center"
            size={{
              xs: 12,
              lg: 7
            }}>
            <Typography
              variant="h4"
              sx={{
                fontSize: {
                  lg: "40px",
                  xs: "35px",
                },
              }}
              fontWeight="700"
              mt={5}
            >
              The hassle-free setup process
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={3}>
          {Processes.map((process, i) => (
            <Grid
              key={i}
              size={{
                xs: 12,
                sm: 6,
                lg: 3
              }}>
              <Box
                mb={3}
                borderRadius="24px"
                sx={{
                  backgroundColor: `${process.color}.light`,
                }}
              >
                <Box p="30px">
                  <Stack direction="column" spacing={2}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        height: "48px",
                        width: "48px",
                        borderRadius: "12px",
                        backgroundColor:
                          theme.palette.mode == "light"
                            ? "white"
                            : "background.default",
                        color: `${process.color}.main`,
                        boxShadow: theme.shadows[10],
                      }}
                    >
                      {process.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      {process.title}
                    </Typography>
                    <Typography variant="body1">{process.subtitle}</Typography>
                  </Stack>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Divider
        sx={{
          mt: "65px",
        }}
      />
    </Box>)
  );
};

export default Process;
