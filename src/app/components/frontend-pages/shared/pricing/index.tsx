'use client';
import React from 'react';
import { Box, Grid, Typography, Container, useTheme } from '@mui/material';
import PricingCard from './PricingCard';
import PaymentMethods from './PaymentMethods';

const Pricing = () => {

    const theme = useTheme();
    return (<>
        <Box
            sx={{
                py: {
                    xs: 5,
                    lg: 11,
                }, backgroundColor: theme.palette.mode == 'light' ? 'white' : 'background.default'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={3} alignItems="center" justifyContent="center">
                    <Grid
                        size={{
                            xs: 12,
                            lg: 7
                        }}>
                        <Typography textAlign="center"
                            variant="h4" lineHeight={1.4}
                            mb={2} fontWeight={700}
                            sx={{
                                fontSize: {
                                    lg: '40px',
                                    xs: '35px',
                                },
                            }}
                        >
                            Fair pricing for everyone.
                        </Typography>
                        <Typography variant="body1" mb={6}>Our robust analytics offer rich insights into the  information buyers want, informing where teams</Typography>
                    </Grid>
                </Grid>

                <PricingCard />

                <PaymentMethods />
            </Container>
        </Box>
    </>);
};

export default Pricing;
