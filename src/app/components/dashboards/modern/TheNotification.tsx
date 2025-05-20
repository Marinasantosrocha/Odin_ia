import React from "react";
import {
  Typography,
  Avatar,
  TableContainer,
  MenuItem,
  CardContent,
  Box,
  Stack,
} from "@mui/material";
import TheProductsData from "./TheProductsData";
import { Icon } from "@iconify/react";
import BlankCard from "../../shared/BlankCard";

interface notificationType {
  title: string;
  subtitle: string;
  icon: string;
  bgcolor: string;
  color: string;
  time: string;
}

const notifications: notificationType[] = [
  {
    icon: "solar:widget-3-line-duotone",
    bgcolor: `primary.light`,
    color: "primary.main",
    title: "Launch Admin",
    subtitle: "Just see the my new admin!",
    time: "9:30 AM",
  },
  {
    icon: "solar:calendar-mark-line-duotone",
    bgcolor: `secondary.light`,
    color: "secondary.main",
    title: "Event Today",
    subtitle: "Just a reminder that you have event",
    time: "9:10 AM",
  },
  {
    icon: "solar:settings-minimalistic-line-duotone",
    bgcolor: `error.light`,
    color: "error.main",
    title: "Event Today",
    subtitle: "Just a reminder that you have event",
    time: "9:08 AM",
  },
  {
    icon: "solar:link-circle-line-duotone",
    bgcolor: `warning.light`,
    color: "warning.main",
    title: "Launch Today",
    subtitle: "Just see the my new admin!",
    time: "9:20 AM",
  },
  {
    icon: "solar:calendar-mark-line-duotone",
    bgcolor: `success.light`,
    color: "success.main",
    title: "Event Today",
    subtitle: "Just a reminder that you have event",
    time: "9:30 AM",
  },
];

const TheNotification = () => {
  return (
    <BlankCard>
      <CardContent sx={{ pb: 2 }}>
        <Typography variant="h5" mb="4px">
          Notification
        </Typography>
      </CardContent>
      <Box>
        {notifications.map((notification, index) => {
          // const Icon = notification.icon;
          const bgvalue = notification.bgcolor;
          const colorvalue = notification.color;
          return (
            <Box
              key={index}
              sx={{
                py: 2,
                px: "30px",
                borderRadius: 0,
                borderBottom: (theme) =>
                  `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    minWidth="40px"
                    height="40px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor={`${bgvalue}`}
                    color={`${colorvalue}`}
                    borderRadius="50px"
                  >
                    <Icon icon={notification.icon} height={20} />
                  </Box>
                  <Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography
                        variant="subtitle2"
                        color="textPrimary"
                        fontWeight={500}
                        fontSize="14px"
                        width="fit-content"
                        noWrap
                        sx={{
                          width: "200px",
                        }}
                      >
                        {notification.title}
                      </Typography>
                    </Box>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      fontSize="12px"
                      lineHeight={1.25}
                    >
                      {notification.subtitle}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                  fontSize="12px"
                  lineHeight={1.25}
                  noWrap
                >
                  {notification.time}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </BlankCard>
  );
};

export default TheNotification;
