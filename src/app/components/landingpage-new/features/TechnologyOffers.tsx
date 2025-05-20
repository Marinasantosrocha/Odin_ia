import React from 'react';
import { Grid, Box, Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Image from 'next/image';

import AngularIcon from "/public/images/landingpage/f-angular.png";
import VueIcon from "/public/images/landingpage/f-vue.png";
import BootstrapIcon from "/public/images/landingpage/f-bootstrap.png";
import NuxtIcon from "/public/images/landingpage/f-nuxt.png";

const frameworks = [
    {
        bgcolor: '#FFEEF9',
        color: '#F50D51',
        name: 'Angular',
        img: AngularIcon,
        link: "https://www.wrappixel.com/templates/materialpro-angular-dashboard/?ref=232"
    },
    {
        bgcolor: '#E8F6F0',
        color: '#2D9566',
        name: 'VueJs',
        img: VueIcon,
        link: "https://www.wrappixel.com/templates/materialpro-vuetify-admin/?ref=232"
    },
    {
        bgcolor: '#F1E7FB',
        color: '#7811F5',
        name: 'Bootstrap',
        img: BootstrapIcon,
        link: "https://www.wrappixel.com/templates/materialpro/?ref=232"
    },
    {
        bgcolor: '#EAFBF8',
        color: '#2D9566',
        name: 'Nuxt.js',
        img: NuxtIcon,
        link: "https://www.wrappixel.com/templates/materialpro-nuxtjs/?ref=232"
    },
];

const TechnologyOffers = () => {

    return (
        (
            <Box pt={10} pb={12} sx={{ backgroundColor: (theme) => theme.palette.background.paper }}>
                <Container maxWidth="lg">
                    <Grid container spacing={3} justifyContent="center">
                        <Grid
                            size={{
                                xs: 12,
                                sm: 10,
                                lg: 7
                            }}>
                            <Typography variant='h2' fontWeight={600} textAlign="center" sx={{
                                fontSize: {
                                    lg: '36px',
                                    xs: '25px'
                                },
                                lineHeight: {
                                    lg: '43px',
                                    xs: '30px'
                                }
                            }}>Technology Offerings</Typography>
                            <Typography variant='body1' textAlign='center' color='textSecondary' mt={2}>MaterialPro across a variety of technologies. Simply select to drive in and find the ideal solution tailored to your requirements. <Typography color='primary.main' component="span">Note that each option is sold seprately.</Typography></Typography>
                        </Grid>
                    </Grid>

                    <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3} mt={11}>
                        {frameworks.map((framework, i) => (
                            <Link href={framework.link} target='_blank' key={i}>
                                <Box p={3} display="flex" alignItems="center" justifyContent="center" flexDirection="column" bgcolor={framework.bgcolor} width={180} height={180} sx={{
                                    transition: ".1s ease-in",
                                    "&:hover": {
                                        transform: "scale(1.1)"
                                    }
                                }}>
                                    <Box height="50px">
                                        <Image src={framework.img} alt="angular" width={50} />
                                    </Box>
                                    <Typography variant="body1" mt="12px" color={framework.color}>{framework.name} Version</Typography>
                                </Box>
                            </Link>
                        ))}


                    </Box>
                </Container>
            </Box>
        )
    );
};

export default TechnologyOffers;
