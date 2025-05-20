import React from "react";
import DashboardCard from "../../shared/DashboardCard";
import {
  Typography,
  Box,
  Avatar,
  Chip,
  Stack,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import { Icon } from "@iconify/react";

const comments = [
  {
    imgSrc: "/images/profile/user-2.jpg",
    name: "James Anderson",
    color: "secondary",
    subtext:
      " Lorem Ipsum is simply dummy text of the printing and type setting industry.",
    date: "April 14, 2025",
    status: "Pending",
  },
  {
    imgSrc: "/images/profile/user-6.jpg",
    name: "Michael Jorden",
    color: "success",
    subtext:
      " Lorem Ipsum is simply dummy text of the printing and type setting industry.",
    date: "April 14, 2025",
    status: "Approved",
  },
  {
    imgSrc: "/images/profile/user-4.jpg",
    name: "Johnathan Doeting",
    color: "error",
    subtext:
      " Lorem Ipsum is simply dummy text of the printing and type setting industry.",
    date: "April 14, 2025",
    status: "Rejected",
  },
];

const RecentComments = () => {
  return (
    <DashboardCard
      title="Recent Comments"
      subtitle="Latest Comments on users from Material"
      action={
        <Button variant="contained" color="primary">View All</Button>
      }
    >
      <Stack spacing={3}>
        {comments.map((comment, i) => (
          <Box key={i}>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                pb: 2,
                "& .comment-action": {
                  opacity: 0,
                },
                "&:hover .comment-action": {
                  opacity: 1,
                },
              }}
            >
              <Avatar
                src={comment.imgSrc}
                alt="user"
                sx={{ width: 50, height: 50 }}
              />
              <Box>
                <Stack direction="row" spacing={1}>
                  <Typography variant="h6">{comment.name}</Typography>
                </Stack>
                <Typography variant="subtitle2" color="textSecondary" mt={1}>
                  {comment.subtext}
                </Typography>
                <Stack
                  direction="row" flexWrap='wrap'
                  alignItems="center"
                  justifyContent="space-between"
                  mt={1}
                >
                  <Box display="flex" alignItems="center" flexWrap='wrap' gap={2}>
                    <Chip
                      sx={{
                        bgcolor: comment.color + ".light",
                        color: comment.color + ".main",
                        height: "25px",
                        fontWeight: 400,
                        ".MuiChip-label": {
                          fontSize: "13px",
                        },
                      }}
                      label={comment.status}
                    />
                    <Box
                      display="flex"
                      alignItems="center"
                      className="comment-action"
                    >
                      <IconButton>
                        <Icon
                          icon="solar:clapperboard-edit-linear"
                          height={20}
                        />
                      </IconButton>
                      <IconButton>
                        <Icon icon="solar:check-circle-linear" height={20} />
                      </IconButton>
                      <IconButton>
                        <Icon icon="solar:heart-linear" height={20} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    {comment.date}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            {i !== comments.length - 1 ? <Divider /> : null}
          </Box>
        ))}
      </Stack>
    </DashboardCard>
  );
};

export default RecentComments;
