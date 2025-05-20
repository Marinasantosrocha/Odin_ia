"use client";
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { textAlign } from "@mui/system";

const teams = [
  {
    img: '/images/frontend-pages/homepage/user1.jpg',
    name: "Alex Martinez",
    position: "CEO & Co-Founder",
  },
  {
    img: '/images/frontend-pages/homepage/user2.jpg',
    name: "Jordan Nguyen",
    position: "CTO & Co-Founder",
  },
  {
    img: '/images/frontend-pages/homepage/user3.jpg',
    name: "Taylor Roberts",
    position: "Product Manager",
  },
  {
    img: '/images/frontend-pages/homepage/user4.jpg',
    name: "Morgan Patel",
    position: "Lead Developer",
  },
];


const LeaderShipCarousel = () => {
  const theme = useTheme();
  const UserBox = styled(Box)(() => ({
    opacity: 0,
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.background.default
        : "white",

    borderRadius: "8px",
    marginTop: "-30px !important",
    boxShadow: "0px 6px 12px rgba(127, 145, 156, 0.12)",
    width: '100%',
    transition: '0.5s'
  }));

  const cardEffect = {
    textAlign: 'center',
    '&:hover .hover-name': {
      opacity: 1
    }
  }

  return (
    (<Grid container spacing={3} mb={3}>
      {teams.map((team, i) => (
        <Grid
          key={i}
          size={{
            xs: 12,
            lg: 3,
            sm: 6
          }}>
          <Box sx={cardEffect}>
            <Image
              src={team.img}
              alt="user-img"
              width={270}
              height={290}
              style={{ borderRadius: "16px" }}
            />
            <Box p='12px' mt='-90px'>
              <UserBox className="hover-name"
                bgcolor="white"
                px="10px"
                py="16px"
                textAlign="center"
                position="relative"
                zIndex="1"
              >
                <Typography variant="h5" mb={1}>
                  {team.name}
                </Typography>
                <Typography variant="body1">{team.position}</Typography>
              </UserBox>
            </Box>

          </Box>
        </Grid>
      ))}
    </Grid>)
  );
};

export default LeaderShipCarousel;
