import { Icon } from "@iconify/react";
import { Avatar, AvatarGroup, Box, Card, Fab, Typography } from "@mui/material";

const TheDesignMeetings = () => {
  return (
    <Card sx={{ p: 0, bgcolor: "info.main" }}>
      <Box p="30px">
        <Typography variant="h4" fontSize="20px" color="white">
          Design Meetings
        </Typography>
        <Typography variant="subtitle1" mb={3} color="white">
          2 Hours Left
        </Typography>

        <Box display="flex" alignItems="center" mt='30px' justifyContent="space-between">
          <AvatarGroup
            max={3}
            sx={{
              "& .MuiAvatar-root": {
                border: `2px solid`,
                borderColor: "info.main",
              },
            }}
          >
            <Avatar
              alt="Remy Sharp"
              src="/images/profile/user-4.jpg"
              sx={{ width: 38, height: 38 }}
            />
            <Avatar
              alt="Travis Howard"
              src="/images/profile/user-2.jpg"
              sx={{ width: 38, height: 38 }}
            />
            <Avatar
              alt="Cindy Baker"
              src="/images/profile/user-3.jpg"
              sx={{ width: 38, height: 38 }}
            />
            <Avatar
              alt="Agnes Walker"
              src="/images/profile/user-4.jpg"
              sx={{ width: 38, height: 38 }}
            />
            <Avatar
              alt="Trevor Henderson"
              src="/images/profile/user-5.jpg"
              sx={{ width: 38, height: 38 }}
            />
          </AvatarGroup>

          <Fab color="warning" aria-label="add" size="small">
            <Icon icon="solar:arrow-right-up-linear" height={20} />
          </Fab>
        </Box>
      </Box>
    </Card>
  );
};

export default TheDesignMeetings;
