import { Icon } from "@iconify/react";
import { Box, Card, Typography, Fab, IconButton, Avatar } from "@mui/material";
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TheProfileText = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card
      sx={{
        p: 0,
        boxShadow: "none",
        background: "url(/images/backgrounds/socialbg.jpg) no-repeat",
        backgroundSize: "cover",
        height: "100%",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        height="100%"
        gap={2}
        p="30px"
        sx={{
          backgroundColor: "rgba(7,10,43,.8)",
        }}
      >
        <Box textAlign='center'>
          <Avatar
            src="/images/profile/user-1.jpg"
            alt="user 1"
            sx={{ height: 100, width: 100, margin: 'auto' }}
          />
          <Typography variant="h5" color="white" mt={2} fontWeight={500}>
            Markarn Doe
          </Typography>
          <Typography variant="subtitle1" color="white" mt={1}>
            @markarndoe
          </Typography>
          <Typography variant="subtitle1" color="white" mt={1}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt
          </Typography>
        </Box>
      </Box>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="lg"
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>The Real Story</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <Icon icon="solar:close-circle-linear" height={22} />
        </IconButton>
        <DialogContent>
          <iframe
            width="600"
            height="350"
            src="https://www.youtube.com/embed/VqMd-khMzy4?si=5ScByqdd-U86YOx1"
            title="YouTube video player"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TheProfileText;
