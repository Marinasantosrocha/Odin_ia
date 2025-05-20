import { Icon } from "@iconify/react";
import {
  Box,
  Card,
  Typography,
  Fab,
  IconButton,
  Avatar,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import BlankCard from "../../shared/BlankCard";
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TheProfileDetail = () => {
  return (
    (<BlankCard>
      <CardContent>
        <Box textAlign="center">
          <Avatar
            src="/images/profile/user-1.jpg"
            alt="user1"
            sx={{ height: 150, width: 150, margin: "0 auto" }}
          />

          <Typography variant="h4" mt={3}>
            Markarn Doe
          </Typography>
          <Typography variant="subtitle1" my={1} fontWeight={500}>
            Account Manager Amix corp
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid size={4}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
              >
                <Icon icon="solar:user-rounded-linear" height={18} />
                <Typography variant="subtitle1">254</Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
              >
                <Icon icon="solar:album-linear" height={18} />
                <Typography variant="subtitle1">54</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography variant="subtitle1" fontSize="13px" color="textSecondary">
          Email address
        </Typography>
        <Typography variant="subtitle1" fontWeight={500}>
          hannagover@gmail.com
        </Typography>

        <Typography
          variant="subtitle1"
          fontSize="13px"
          color="textSecondary"
          mt={3}
        >
          Phone
        </Typography>
        <Typography variant="subtitle1" fontWeight={500}>
          +91 654 784 547
        </Typography>

        <Typography
          variant="subtitle1"
          fontSize="13px"
          color="textSecondary"
          mt={3}
        >
          Address
        </Typography>
        <Typography variant="subtitle1" fontWeight={500} mb={2}>
          71 Pilgrim Avenue Chevy Chase, MD 20815
        </Typography>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d470029.1604841957!2d72.29955005258641!3d23.019996818380896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C+Gujarat!5e0!3m2!1sen!2sin!4v1493204785508"
          height="150"
          frameBorder={0}
          allowFullScreen
        ></iframe>

        <Typography
          variant="subtitle1"
          fontSize="13px"
          color="textSecondary"
          mt={3}
        >
          Social Profile
        </Typography>
        <Box display="flex" alignItems="center" gap={2} mt={1}>
          <Avatar sx={{ height: 35, width: 35, bgcolor: "primary.main" }}>
            <IconBrandFacebook height={22} />
          </Avatar>
          <Avatar sx={{ height: 35, width: 35, bgcolor: "primary.main" }}>
            <IconBrandTwitter height={22} />
          </Avatar>
          <Avatar sx={{ height: 35, width: 35, bgcolor: "primary.main" }}>
            <IconBrandYoutube height={22} />
          </Avatar>
        </Box>
      </CardContent>
    </BlankCard>)
  );
};

export default TheProfileDetail;
