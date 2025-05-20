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

const TheEarning = () => {
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
            <Typography variant="h5">Earning</Typography>
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
        <Box>
          <List>
            {contacts.map((contact, i) => (
              <ListItem
                key={i}
                sx={{
                  p: 0,
                  "& .MuiListItemSecondaryAction-root": {
                    right: "30px",
                  },
                }}
                secondaryAction={
                  <Chip
                    sx={{
                      bgcolor: contact.color + ".light",
                      color: contact.color + ".main",
                    }}
                    label={contact.earn}
                  />
                }
              >
                <ListItemButton
                  sx={{
                    gap: "12px",
                    padding: "15px  30px",
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      variant="dot"
                      sx={{
                        ".MuiBadge-badge": {
                          backgroundColor: contact.status,
                          top: "5px",
                          right: "8px",
                          border: "1px solid",
                          borderColor: "background.paper",
                        },
                      }}
                    >
                      <Avatar
                        src={contact.img}
                        alt="user-1"
                        sx={{ width: 48, height: 48 }}
                      />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={contact.title}
                    secondary={contact.subtext}
                    slotProps={{
                      primary: {
                        fontSize: "16px",
                        fontWeight: 500,
                        mb: "4px",
                      },

                      secondary: {
                        fontSize: "14px",
                      }
                    }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Card>
    </>
  );
};

export default TheEarning;
