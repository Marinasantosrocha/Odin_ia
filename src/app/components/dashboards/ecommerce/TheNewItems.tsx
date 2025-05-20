import React from "react";
import {
  Typography,
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import chairImg from '/public/images/gallery/chair.png'

const options = ["None", "Action 1", "Action 2"];

const TheNewItems = () => {
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
            <Typography variant="h5">New items</Typography>
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
        <Box pb={4} textAlign="center">
          <Image
            src={chairImg}
            alt="yser"
            height={310}
          />
          <Typography variant="h5">Brand New Chair</Typography>
        </Box>
      </Card>
    </>
  );
};

export default TheNewItems;
