import React from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Divider,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const options = ["None", "Action 1", "Action 2"];

const TheDiscount = () => {
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
            <Typography variant="h5">Discount</Typography>
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
        <Box bgcolor="secondary.main" p="30px" color="white" borderRadius={0}>
          <Icon icon="solar:cart-large-2-linear" height={24} />
          <Typography variant="subtitle1">25th Jan</Typography>

          <Typography variant="h3" fontWeight={400} mt={2}>
            Now Get 50% Off <br/> on buy
          </Typography>

          <Typography variant="subtitle1" fontStyle='italic' mt={2}>- Ecommerce site</Typography>
        </Box>
      </Card>
    </>
  );
};

export default TheDiscount;
