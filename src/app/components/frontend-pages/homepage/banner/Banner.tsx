"use client";
import React from "react";
import {
  Box,
  Stack,
  Typography,
  AvatarGroup,
  Avatar,
  Container,
  Grid,
  Button,
  useTheme,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";

const Frameworks = [
  {
    name: "React",
    icon: "/images/frontend-pages/icons/icon-react.svg",
  },
  {
    name: "Material Ui",
    icon: "/images/frontend-pages/icons/icon-mui.svg",
  },
  {
    name: "Next.js",
    icon: "/images/frontend-pages/icons/icon-next.svg",
  },
  {
    name: "Typescript",
    icon: "/images/frontend-pages/icons/icon-ts.svg",
  },
  {
    name: "SWR",
    icon: "/images/frontend-pages/icons/logos_swr.svg",
  },
  {
    name: "Tabler Icon",
    icon: "/images/frontend-pages/icons/icon-tabler.svg",
  },
];
const Banner = () => {

  const theme = useTheme();
  //   sidebar
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  return (
    (<Box bgcolor="primary.light" pt={7} overflow='hidden' sx={{
      pb: {
        xs: 7, lg: 0
      }
    }}>
      <Container maxWidth='lg'
        sx={{

          position: "relative",
        }}
      >
        <Grid container spacing={3} justifyContent="space-between">
          <Grid
            display="flex"
            alignItems="center"
            size={{
              xs: 12,
              lg: 6
            }}>
            <Box sx={{
              textAlign: {
                xs: 'center', lg: 'left'
              }
            }}>
              <Typography
                variant="h1"
                lineHeight="1.2" fontWeight={600}
                sx={{
                  fontSize: {
                    xs: "40px",
                    sm: "56px",
                  },
                }}
              >
                A feature-packed dashboard
                <Box fontWeight={400} component="span"> built for developers needs.</Box>
              </Typography>
              <Stack
                my={3}
                direction={{ xs: "column", sm: "row" }}
                spacing="12px"
                alignItems="center" sx={{
                  justifyContent: {
                    sm: 'center', lg: 'start'
                  }
                }}
              >
                <AvatarGroup>
                  <Avatar
                    alt="Remy Sharp"
                    src="/images/profile/user-1.jpg"
                    sx={{ width: 40, height: 40, border: theme.palette.mode == 'light' ? '2px solid white !important' : '2px solid #1f2c4f !important' }}
                  />
                  <Avatar
                    alt="Travis Howard"
                    src="/images/profile/user-2.jpg"
                    sx={{ width: 40, height: 40, border: theme.palette.mode == 'light' ? '2px solid white !important' : '2px solid #1f2c4f !important' }}
                  />
                  <Avatar
                    alt="Cindy Baker"
                    src="/images/profile/user-3.jpg"
                    sx={{ width: 40, height: 40, border: theme.palette.mode == 'light' ? '2px solid white !important' : '2px solid #1f2c4f !important' }}
                  />
                </AvatarGroup>
                <Typography variant="h6" fontWeight={500} whiteSpace='nowrap'>
                  52,589+ developers & agencies using our templates
                </Typography>
              </Stack>

              <Stack
                direction="row"
                flexWrap="wrap"
                alignItems="center"
                spacing={3}
                mb={4} sx={{
                  justifyContent: {
                    xs: 'center',
                    lg: 'left'
                  }
                }}
              >
                {Frameworks.map((fw, i) => (
                  <Tooltip title={fw.name} key={i}>
                    <Box
                      width="54px"
                      height="54px"
                      display="flex"
                      sx={{
                        boxShadow: (theme) =>
                          theme.palette.mode === "dark"
                            ? null
                            : theme.shadows[10],
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark" ? "#1e2f42" : "white",
                      }}
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="16px"
                    >
                      <Image src={fw.icon} alt={fw.icon} width={26} height={26} />
                    </Box>
                  </Tooltip>
                ))}

              </Stack>
              <Button
                color="primary"
                size="large"
                variant="contained"
                href="/auth/auth1/login"
                sx={{ marginRight: "10px" }}
              >
                Log In
              </Button>

              <Button
                color="primary"
                size="large"
                variant="outlined"
                href="/auth/auth1/register"
              >
                Register
              </Button>
            </Box>
          </Grid>
          {lgUp ?
            <Grid
              size={{
                xs: 12,
                lg: 6
              }}>
              <Box minWidth="1300px" maxHeight='700px' overflow='hidden'>
                <Image
                  src="/images/frontend-pages/homepage/banner-right.png"
                  alt="banner"
                  width={2316}
                  height={1565}
                  style={{

                    height: "auto",
                    width: "auto",
                  }}
                />
              </Box>
            </Grid> : null}
        </Grid>

      </Container>
    </Box>)
  );
};

export default Banner;
