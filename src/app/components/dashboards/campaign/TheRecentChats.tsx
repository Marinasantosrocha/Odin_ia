import React, { useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  Box,
  List,
  ListItem,
  CardContent,
  Grid,
  Divider,
  Fab,
  InputBase,
} from "@mui/material";
import { Icon } from "@iconify/react";
import BlankCard from "../../shared/BlankCard";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";

const TheRecentChats = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const getTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      setCurrentTime(formattedTime);
    };

    // Get current time when component mounts
    getTime();

    // Update time every minute
    const intervalId = setInterval(getTime, 60000); // Update every 60 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const [chats, setChats] = useState<Array<any>>([
    {
      username: "Kevin Hsu",
      content: "Hello World!",
      img: "/images/profile/user-1.jpg",
      time: "10:56 am",
      id: 1,
    },
    {
      username: "Alice Chen",
      content: "Love it! :heart:",
      img: "/images/profile/user-1.jpg",
      time: "10:57 am",
      id: 2,
    },
    {
      username: "Kevin Hsu",
      content: "Cum class sem inceptos incidunt sed sed.",
      img: "/images/profile/user-1.jpg",
      time: "10:58 am",
      id: 3,
    },
    {
      username: "KevHs",
      content:
        "Lorem ipsum dolor sit amet, nibh ipsum. Cum class sem inceptos incidunt sed sed. ",
      img: "/images/profile/user-2.jpg",
      time: "11:00 am",
      id: 4,
    },
  ]);

  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const message2 = e.target.value;
    setMessage(message2);
  };

  const submitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setChats([
      ...chats,
      {
        username: "Kevin Hsu",
        content: <span>{message}</span>,
        img: "/images/profile/user-1.jpg",
        id: chats.length + 1,
        time: currentTime,
      },
    ]);
    setMessage("");
  };
  const username = "Kevin Hsu";

  return (<>
    <BlankCard>
      <CardContent sx={{ pb: 1 }}>
        <Box>
          <Typography variant="h5">Recent Chats</Typography>
        </Box>
      </CardContent>
      <Scrollbar sx={{ height: "385px" }}>
        <CardContent sx={{ pt: 0 }}>
          <Box>
            <List sx={{ padding: 0 }}>
              {chats.map((chat) => (
                <ListItem
                  key={chat.id}
                  sx={{
                    display: "flex",
                    px: 0,
                    flexDirection:
                      username === chat.username ? "row-reverse" : "row",
                    alignItems: "flex-start",
                    gap: 2,
                    justifyContent:
                      username === chat.username ? "end" : "start",
                    mt: 2,
                    textAlign: username === chat.username ? "right" : "left",
                  }}
                >
                  {username !== chat.username && (
                    <Avatar
                      src={chat.img}
                      alt={`${chat.username}'s profile pic`}
                      sx={{ width: 45, height: 45 }}
                    />
                  )}
                  <Box width="100%">
                    <Typography variant="subtitle1" color="textSecondary">
                      {username === chat.username ? null : chat.username}
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{
                        justifyContent:
                          username === chat.username
                            ? "end"
                            : "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          mb: 1,
                          maxWidth: "calc(100% - 100px)",
                          borderRadius:
                            username === chat.username
                              ? "20px 0px 20px 20px"
                              : "0px 20px 20px 20px",
                          backgroundColor:
                            username === chat.username
                              ? "warning.light"
                              : "primary.light",
                        }}
                      >
                        {chat.content}
                      </Box>
                      <Typography
                        variant="subtitle2"
                        fontSize="12px"
                        width="70px"
                        textAlign="end"
                        color="textSecondary"
                      >
                        {chat.time}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </CardContent>
      </Scrollbar>
      <Divider />
      <Box sx={{ px: 3, py: 2 }}>
        <form onSubmit={(e) => submitMessage(e)}>
          <Grid container spacing={2}>
            <Grid size={10}>
              <InputBase
                fullWidth
                placeholder="Type your message here"
                value={message}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={2}>
              <Box textAlign="right">
                <Fab type="submit" color="primary" size="small">
                  <Icon icon="solar:map-arrow-right-linear" height={22} />
                </Fab>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </BlankCard>
  </>);
};

export default TheRecentChats;
