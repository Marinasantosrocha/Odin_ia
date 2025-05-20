"use client";
import {
  Box,
  Avatar,
  Typography,
  useMediaQuery,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { CustomizerContext } from "@/app/context/customizerContext";
import { styled, alpha } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { IconCaretDownFilled } from "@tabler/icons-react";
import Link from "next/link";
import { useState, useContext, SetStateAction } from "react";
import { Icon } from "@iconify/react";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 200,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenuItem-root": {
      gap: "6px",
      alignItems: "center",
      padding: "8px 16px",
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
      },
    },
  },
}));

export const Profile = () => {
  const { isSidebarHover, isCollapse } = useContext(CustomizerContext);

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));


  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: { currentTarget: SetStateAction<HTMLElement | null>; }) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url('/images/backgrounds/sidebar-profile-bg.jpg')`,
        borderRadius: "0 !important",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
      }}
    >
      <>
        <Box
          py="28px"
          pb={`${isCollapse == 'mini-sidebar' && !isSidebarHover ? '10px' : '28px'}`}
          borderRadius="0 !important"
          sx={{
            px: isCollapse == 'mini-sidebar' ? '14px' : '30px',
          }}
        >
          <Box className="profile-img" position="relative">
            <Avatar
              alt="Remy Sharp"
              src={"/images/profile/user-1.jpg"}
              sx={{ height: 50, width: 50 }}
            />
          </Box>
        </Box>
        <IconButton
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          size="small"
          aria-label="action"
          sx={{ p: 0, width: "100%" }}
        >
          {isCollapse == 'mini-sidebar' && !isSidebarHover ? null : <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              py: "4px",
              px: 2,
              bgcolor: "rgba(0,0,0,0.5)",
              borderRadius: "0 !important",
              width: "100%",
            }}
          >
            <Typography
              variant="h6"
              fontSize="15px"
              color="white"
              fontWeight="400"
              sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              Markarn Doe
            </Typography>
            <Box>
              <Tooltip title="User" placement="top">
                <Box color="white" sx={{ p: 0 }}>
                  <IconCaretDownFilled width={18} />
                </Box>
              </Tooltip>
            </Box>
          </Box>
          }
        </IconButton>

        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            "aria-labelledby": "demo-customized-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <Link href="/apps/user-profile/profile">
            <MenuItem onClick={handleClose} disableRipple>
              <IconButton color="primary" sx={{ p: 0 }}>
                <Icon icon="solar:user-circle-line-duotone" height={21} />
              </IconButton>
              <Typography fontSize="15px" ml={1} color="textPrimary">
                My Profile
              </Typography>
            </MenuItem>

          </Link>
          <Link href="/apps/notes">
            <MenuItem onClick={handleClose} disableRipple>
              <IconButton color="secondary" sx={{ p: 0 }}>
                <Icon icon="solar:notes-line-duotone" height={21} />
              </IconButton>
              <Typography fontSize="15px" ml={1} color="textPrimary">
                My Notes
              </Typography>
            </MenuItem>
          </Link>


          <Link href="/apps/email">
            <MenuItem onClick={handleClose} disableRipple>
              <IconButton color="success" sx={{ p: 0 }}>
                <Icon icon="solar:inbox-line-line-duotone" height={21} />
              </IconButton>
              <Typography fontSize="15px" ml={1} color="textPrimary">
                Inbox
              </Typography>
            </MenuItem>
          </Link>


          <Divider />

          <Link href="/theme-pages/account-settings">
            <MenuItem onClick={handleClose} disableRipple>
              <IconButton color="warning" sx={{ p: 0 }}>
                <Icon icon="solar:settings-line-duotone" height={21} />
              </IconButton>
              <Typography fontSize="15px" ml={1} color="textPrimary">
                Account Setting
              </Typography>
            </MenuItem>
          </Link>

          <Divider />

          <Link href="/auth/auth1/login">
            <MenuItem onClick={handleClose} disableRipple>
              <IconButton
                color="error"
                sx={{ p: 0 }}
              >
                <Icon icon="solar:logout-2-line-duotone" height={21} />
              </IconButton>
              <Typography fontSize="15px" ml={1} color="textPrimary">
                Logout
              </Typography>
            </MenuItem>
          </Link>
          <Divider />


          <Box sx={{ padding: "0 12px" }}>
            <Link href="/apps/user-profile/profile">
              <Button
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: "50px",
                  margin: "0 auto",
                  my: 1.5,
                  display: "grid",
                  width: "100%",
                }}
              >
                View Profile
              </Button>
            </Link>
          </Box>
        </StyledMenu>
      </>
    </Box>
  );
};
