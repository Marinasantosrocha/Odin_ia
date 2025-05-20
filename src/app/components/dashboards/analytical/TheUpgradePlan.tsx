import { Icon } from "@iconify/react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useMediaQuery,
  Stack,
  Button,
  Avatar,
  Theme,
} from "@mui/material";
import Image from "next/image";

const TheUpgradePlan = () => {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  return (
    (<Card
      variant="outlined"
      sx={{
        p: 0,
        background: "linear-gradient(287deg,#1b84ff .54%,#1bcaff 100.84%)",
        position: "relative",
        overflow: "unset",
      }}
    >
      <Grid container spacing={3}>
        <Grid
          size={{
            xs: 12,
            lg: 8
          }}>
          <Box p="30px">
            <Typography
              variant="subtitle1"
              fontSize="15px"
              mb={1}
              color="white"
            >
              Grab the top deal.
            </Typography>
            <Typography variant="h3" fontWeight={600} color="white" mb={3}>
              Upgrade Plan
            </Typography>

            <Stack
              direction='row'
              spacing={2}
              mb={3}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="primary.main"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    width: "36px",
                    height: "36px",
                    borderRadius: "100%",
                    color: "white",
                  }}
                >
                  <Icon
                    icon="solar:user-rounded-linear"
                    width={18}
                    height={18}
                  />
                </Box>
                <Box>
                  <Typography
                    fontSize="12px"
                    color="white"
                    sx={{ opacity: "0.6" }}
                    lineHeight={1}
                  >
                    Team
                  </Typography>
                  <Typography fontSize="12px" color="white" fontWeight={600}>
                    Up to 240
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="primary.main"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    width: "36px",
                    height: "36px",
                    borderRadius: "100%",
                    color: "white",
                  }}
                >
                  <Icon
                    icon="solar:link-circle-linear"
                    width={18}
                    height={18}
                  />
                </Box>
                <Box>
                  <Typography
                    fontSize="12px"
                    color="white"
                    sx={{ opacity: "0.6" }}
                    lineHeight={1}
                  >
                    Progress
                  </Typography>
                  <Typography fontSize="12px" color="white" fontWeight={600}>
                    Almost 85%
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Button
              variant="contained"
              sx={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              Upgrade Plan
            </Button>
          </Box>
        </Grid>
        {lgUp ? (
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <Avatar
              src="/images/backgrounds/make-social-media.png"
              alt="social"
              sx={{
                borderRadius: 0,
                height: "auto",
                width: "auto",
                position: "absolute",
                right: "-20px",
                top: "10px",
                // right: `${activeDir === 'ltr' ? '-20px' : '20px'}`,
                // top: `${activeDir === 'ltr' ? '10px' : '0px'}`,
              }}
            />
          </Grid>
        ) : null}
      </Grid>
    </Card>)
  );
};

export default TheUpgradePlan;
