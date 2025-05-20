"use client";
import Link from "next/link";
import { Grid, Box, Stack, Typography, Avatar } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import AuthLogo from "@/app/(DashboardLayout)/layout/shared/logo/AuthLogo";
import AuthLogin from "../../authForms/AuthLogin";
import { useContext } from 'react';
import { CustomizerContext } from "@/app/context/customizerContext";


export default function Login() {
  const { activeMode } = useContext(CustomizerContext);


  return (
    (<PageContainer title="Login Page" description="this is Sample page">
      <Grid
        container
        spacing={0}
        justifyContent="center"
        sx={{
          height: "100vh",
          backgroundColor:
            activeMode == "light" ? "white" : "background.default",
        }}
      >
        <Grid
          size={{
            xs: 12,
            sm: 12,
            lg: 5,
            xl: 4
          }}>
          <Box px={3}>
            <AuthLogo />
          </Box>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            height="calc(100% - 64px)"
          >
            <Grid>
              <Box display="flex" flexDirection="column">
                <Box p={4}>
                  <AuthLogin
                    title="Welcome to MaterialPro"
                    subtext={
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        mb={1}
                        textAlign="center"
                      >
                        Your Admin Dashboard
                      </Typography>
                    }
                    subtitle={
                      <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={1}
                        mt={3}
                      >
                        <Typography
                          color="textSecondary"
                          variant="h6"
                          fontWeight="500"
                        >
                          New to MaterialPro?
                        </Typography>
                        <Typography
                          component={Link}
                          href="/auth/auth1/register"
                          fontWeight="500"
                          sx={{
                            textDecoration: "none",
                            color: "primary.main",
                          }}
                        >
                          Create an account
                        </Typography>
                      </Stack>
                    }
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          sx={{
            position: "relative",
            "&:before": {
              content: '""',
              background: "radial-gradient(#d2f1df,#d3d7fa,#bad8f4)",
              backgroundSize: "400% 400%",
              animation: "gradient 15s ease infinite",
              position: "absolute",
              height: "100%",
              width: "100%",
              opacity: "0.3",
            },
          }}
          size={{
            xs: 12,
            sm: 12,
            lg: 7,
            xl: 8
          }}>
          <Box position="relative">
            <Box
              alignItems="center"
              justifyContent="center"
              height={"calc(100vh - 75px)"}
              sx={{
                display: {
                  xs: "none",
                  lg: "flex",
                },
              }}
            >
              <Avatar
                src={"/images/backgrounds/user-login.png"}
                alt="bg"
                sx={{
                  borderRadius: 0,
                  width: "100%",
                  height: "100%",
                  maxWidth: "676px",
                  maxHeight: "450px",
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </PageContainer>)
  );
}
