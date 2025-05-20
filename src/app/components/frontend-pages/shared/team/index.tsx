'use client';
import React from "react";
import { Box, Grid, Typography, Container, useTheme } from "@mui/material";
import "slick-carousel/slick/slick.css";

import TeamMembers from "./TeamMembers";
import Contact from "./Contact";

const Team = () => {

    const theme = useTheme();

    return (<>
        <Box borderRadius='0' sx={{
            pt: {
                xs: 5,
                lg: 10
            },
            pb: {
                xs: 6,
                lg: 12
            },

            backgroundColor: theme.palette.mode == 'light' ? 'text.primary' : '#1e2f42'

        }}>
            <Container maxWidth="lg">
                <Grid container spacing={3} alignItems="center" justifyContent="space-between" mb={6}>
                    <Grid
                        size={{
                            xs: 12,
                            lg: 5,
                            sm: 8
                        }}>
                        <Typography variant="h4" color="white" mb={3} sx={{
                            fontSize: {
                                lg: '40px',
                                xs: '35px'
                            }
                        }}>Meet our team</Typography>

                    </Grid>
                    <Grid
                        size={{
                            xs: 12,
                            lg: 4,
                            sm: 4
                        }}>
                        <Typography variant="body1" color="white" sx={{ opacity: 0.8 }} lineHeight="32px">Our robust analytics offer rich insights into the information buyers want, informing where teams</Typography>
                    </Grid>
                </Grid>

                <TeamMembers />
            </Container>

        </Box>
        <Contact />
    </>);
};

export default Team;
