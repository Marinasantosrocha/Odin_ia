'use client';
import React from "react";
import { Box, Stack, Typography, Container, Grid, useTheme } from "@mui/material";

import Key from "./Key";

const KeyMetric = () => {

    const theme = useTheme();
    return (
        (<Box sx={{
            paddingTop: {
                xs: '40px',
                lg: '90px',
            },
            paddingBottom: {
                xs: '40px',
                lg: '90px',
            },
            backgroundColor: theme.palette.mode == 'light' ? 'white' : 'background.default'
        }}>
            <Container maxWidth="lg">
                <Grid container spacing={3} justifyContent="space-between">
                    <Grid
                        size={{
                            xs: 12,
                            lg: 3
                        }}>
                        <Typography fontSize="32px" mb={2} lineHeight={1.4} fontWeight={600}>A unique story in every number</Typography>
                    </Grid>
                    <Grid
                        size={{
                            xs: 12,
                            lg: 7
                        }}>
                        <Key />
                    </Grid>
                </Grid>
            </Container>
        </Box>)
    );
};

export default KeyMetric;
