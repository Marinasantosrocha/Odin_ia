'use client';
import React from "react";
import { Box, Grid, Typography, Container, Stack, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import useMediaQuery from '@mui/material/useMediaQuery';

const C2a = () => {

    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const smUp = useMediaQuery((theme) => theme.breakpoints.only('sm'));

    return (<>
        <Box bgcolor="primary.main" borderRadius="0" overflow="hidden" position="relative" sx={{
            py: {
                xs: '40px',
                lg: '100px'
            }
        }}>
            <Container maxWidth="lg">
                <Grid container spacing={3} alignItems="center" justifyContent='center'>
                    <Grid
                        textAlign='center'
                        size={{
                            xs: 12,
                            lg: 10,
                            sm: 10
                        }}>
                        <Box height="56px" width="56px" borderRadius='12px' margin='0 auto' display='flex' alignItems='center' justifyContent='center' bgcolor='white'>
                            <Image src='/images/logos/logo-icon.svg' alt='logo' width={40} height={40} />
                        </Box>
                        <Typography variant="h4" my={3} fontWeight={600} fontSize="40px" lineHeight="1.4" color='white' sx={{
                            fontSize: {
                                lg: '40px',
                                xs: '30px'
                            }, mx: {
                                sm: 0,
                                lg: 4
                            }
                        }}>Focus on what truly matters—creating stunning, functional designs.</Typography>
                        <Typography variant="body1" mb={3} color='white'>Designed for ease of use and customization, this template help you build professional <br /> dashboards faster.</Typography>

                        <Button variant="outlined" size="large" href="/auth/auth1/register" sx={{
                            color: 'white', borderColor: 'white',
                            '&:hover': {
                                borderColor: 'white'
                            }
                        }}>Register as Member</Button>

                    </Grid>
                </Grid>
            </Container>

            {lgUp ?
                <Image src='/images/frontend-pages/homepage/right-side.png' alt="design" width={900} height={365} style={{
                    position: 'absolute', right: 0,
                    top: '10%', width: 'auto', height: 'auto',
                }} /> : null

            }

            {lgUp ?
                <Image src='/images/frontend-pages/homepage/left-side.png' alt="design" width={900} height={365} style={{
                    position: 'absolute', left: 0,
                    top: '10%', width: 'auto', height: 'auto',
                }} /> : null

            }


        </Box>
    </>);
};

export default C2a;
