



import { useState, useContext, SetStateAction } from 'react';
import Link from "next/link";
import { Box, Menu, Avatar, Typography, Divider, IconButton } from '@mui/material';
import * as dropdownData from './data';
import { CustomizerContext } from '@/app/context/customizerContext'
import { Stack } from '@mui/system';
import { Icon } from '@iconify/react';

const Profile = () => {

  const { activeMode, setActiveMode } = useContext(CustomizerContext);

  const [anchorEl2, setAnchorEl2] = useState<HTMLElement | null>(null);
  const handleClick2 = (event: { currentTarget: SetStateAction<HTMLElement | null>; }) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={"/images/profile/user-1.jpg"}
          alt={'ProfileImg'}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
            p: 0,
          },
        }}
      >
        <Stack direction="row" p={2} spacing={2} alignItems="center">
          <Avatar src={"/images/profile/user-1.jpg"} alt={'ProfileImg'} sx={{ width: 50, height: 50 }} />
          <Box>
            <Typography variant="h6" color="textPrimary" fontWeight={600}>
              Markarn Doe
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              info@materialpro.com
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Box p={2}>
          {dropdownData.profile.map((profile) => (
            <Box key={profile.title}>
              <Box
                sx={{
                  px: 2,
                  py: '10px',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                }}
                className="hover-text-primary"
              >
                <Link href={profile.href}>
                  <Stack direction="row" spacing={2}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={500}
                        color="textPrimary"
                        className="text-hover"
                        noWrap
                        sx={{
                          width: '240px',
                        }}
                      >
                        {profile.title}
                      </Typography>
                    </Box>
                  </Stack>
                </Link>
              </Box>
            </Box>
          ))}
        </Box>
        <Divider />
        <Box p={2}>
          <Box
            sx={{
              px: 2,
              py: '10px',
              '&:hover': {
                backgroundColor: 'primary.light',
              },
            }}
            className="hover-text-primary"
          >
            <Link href="/">
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Box onClick={() => {
                  setActiveMode(activeMode === 'light' ? 'dark' : 'light');
                }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={500}
                    color="textPrimary"
                    className="text-hover"
                    noWrap
                    sx={{
                      width: '240px',
                    }}
                  >
                    Mode
                  </Typography>
                </Box>
                <IconButton color="primary" size="small">
                  {activeMode === 'light' ? (
                    <Icon
                      icon="solar:moon-line-duotone"
                      height={18}
                      onClick={() => setActiveMode('dark')}
                    />
                  ) : (
                    <Icon
                      icon="solar:sun-2-line-duotone"
                      height={18}
                      onClick={() => setActiveMode('light')}
                    />
                  )}
                </IconButton>
              </Stack>
            </Link>
          </Box>
          <Box
            sx={{
              px: 2,
              py: '10px',
              '&:hover': {
                backgroundColor: 'primary.light',
              },
            }}
            className="hover-text-primary"
          >
            <Link href="/theme-pages/account-settings">
              <Stack direction="row" spacing={2}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={500}
                    color="textPrimary"
                    className="text-hover"
                    noWrap
                    sx={{
                      width: '240px',
                    }}
                  >
                    Account Settings
                  </Typography>
                </Box>
              </Stack>
            </Link>
          </Box>
          <Box
            sx={{
              px: 2,
              py: '10px',
              '&:hover': {
                backgroundColor: 'primary.light',
              },
            }}
            className="hover-text-primary"
          >
            <Link href="/auth/auth1/login">
              <Stack direction="row" spacing={2}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={500}
                    color="textPrimary"
                    className="text-hover"
                    noWrap
                    sx={{
                      width: '240px',
                    }}
                  >
                    Sign Out
                  </Typography>
                </Box>
              </Stack>
            </Link>
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
