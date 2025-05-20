import { Icon } from "@iconify/react";
import {
  Box,
  Card,
  Typography,
  Fab,
  IconButton,
  useTheme,
} from "@mui/material";
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

const TheRealStory = () => {
  const theme = useTheme();

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
        background: "url(/images/backgrounds/material-pro-bg.png) no-repeat",
        backgroundSize: "cover",
        height: "100%",
        minHeight: '300px'
      }}
    >
      <Box display="flex" alignItems="center" gap={2} p="30px">
        <Fab
          color="inherit"
          onClick={handleClickOpen}
          sx={{
            backgroundColor:
              theme.palette.mode == "light" ? "white" : "background.default",
          }}
        >
          <Icon icon="solar:play-bold" height={22} />
        </Fab>
        <Box>
          <Typography
            variant="h5"
            fontWeight={500}
            sx={{
              color:
                theme.palette.mode == "light" ? "white" : "background.default",
            }}
          >
            Material Pro
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color:
                theme.palette.mode == "light" ? "white" : "background.default",
            }}
          >
            The real story
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
            src="https://www.youtube.com/embed/zzBxZeOTuDw"
            title="YouTube video player"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TheRealStory;
