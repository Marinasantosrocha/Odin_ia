import Image from "next/image";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";

import {
  IconActivity,
  IconAnchor,
  IconDeviceDesktop,
  IconShoppingCart,
} from "@tabler/icons-react";
import { Icon } from "@iconify/react";

const topcards = [
  {
    icon: <Icon icon='solar:card-linear' height={22} />,
    title: "Total Revenue",
    digits: "3,249",
    bgcolor: "primary.main",
  },
  {
    icon: <Icon icon='solar:users-group-rounded-linear' height={22} />,
    title: "Online Revenue",
    digits: "2,376",
    bgcolor: "secondary.main",
  },
  {
    icon: <Icon icon='solar:calendar-date-outline' height={22} />,
    title: "Offline Revenue",
    digits: "1,795",
    bgcolor: "error.main",
  },
  {
    icon: <Icon icon='solar:settings-outline' height={22} />,
    title: "Ad. Expense",
    digits: "687",
    bgcolor: "warning.main",
  },
];

const TopCards = () => {
  return (
    (<Grid container spacing={3}>
      {topcards.map((topcard, i) => (
        <Grid
          key={i}
          size={{
            xs: 12,
            sm: 6,
            lg: 3
          }}>
          <Card variant="outlined" sx={{ p: 0 }}>
            <CardContent>
              <Stack direction="row" spacing={2}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: topcard.bgcolor,
                  }}
                >
                  {topcard.icon}
                </Avatar>
                <Box>
                  <Typography variant="h4">${topcard.digits}</Typography>
                  <Typography variant="subtitle1" color='textSecondary'>{topcard.title}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>)
  );
};

export default TopCards;
