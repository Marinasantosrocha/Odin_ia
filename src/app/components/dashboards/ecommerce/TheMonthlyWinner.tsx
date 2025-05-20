import React from "react";
import {
  Typography,
  Avatar,
  Box,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Badge,
  CardContent,
  IconButton,
  Divider,
  Chip,
  CardMedia,
  Button,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Icon } from "@iconify/react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const contacts = [
  {
    img: "/images/profile/user-9.jpg",
    title: "James Smith",
    subtext: "Web Designer",
    status: "primary.main",
    earn: "$2300",
    color: "primary",
  },
  {
    img: "/images/profile/user-2.jpg",
    title: "Maria Garciar",
    subtext: "Web Developer",
    status: "secondary.main",
    earn: "$2300",
    color: "secondary",
  },
  {
    img: "/images/profile/user-3.jpg",
    title: "Joshph Rodriguez",
    subtext: "Web Manager",
    status: "error.main",
    earn: "$2300",
    color: "error",
  },
  {
    img: "/images/profile/user-6.jpg",
    title: "Christiana Roz",
    subtext: "Project Manager",
    status: "error.main",
    earn: "$2300",
    color: "success",
  },
];

const options = ["None", "Action 1", "Action 2"];

const TheMonthlyWinner = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Card variant="outlined" sx={{ p: 0 }}>
        <CardContent sx={{ py: 1, px: "30px" }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">Monthly Winner</Typography>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <Icon icon="solar:menu-dots-outline" height={22} />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                list: {
                  "aria-labelledby": "long-button",
                }
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option}
                  selected={option === "None"}
                  onClick={handleClose}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </CardContent>
        <Divider />
        <Box p='10px'>
          <CardMedia
            sx={{ height: 111, borderRadius: (theme) => theme.shape }}
            image="/images/backgrounds/profile-bg.jpg"
            title="green iguana"
          />
          <CardContent>
            <Box textAlign="center" mt="-80px" mb={3}>
              <Avatar
                src="/images/profile/user-1.jpg"
                sx={{ width: 100, height: 100, m: "0 auto" }}
              />
              <Typography variant="h5" fontSize="24px" mt={4} mb={1}>
                Angela Dominic
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" mb={2}>
                Web Designer & Developer
              </Typography>
              <Button variant="contained" color="primary">
                Follow
              </Button>
            </Box>
            <Divider />
            <Stack
              direction="row"
              spacing={1}
              mt={4}
              justifyContent="space-between"
            >
              <Box textAlign="center">
                <Typography variant="h3">1,099</Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  fontSize="12px"
                >
                  Articles
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h3">23,469</Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  fontSize="12px"
                >
                  Followers
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h3">6,035</Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  fontSize="12px"
                >
                  Following
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Box>
      </Card>
    </>
  );
};

export default TheMonthlyWinner;
