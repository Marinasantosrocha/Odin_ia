import React from 'react';
import Container from '@mui/material/Container';
import { Grid } from '@mui/material';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import logoIcon from '/public/images/logos/logo-icon.svg';
import Image from 'next/image';

const Footer = () => {
  return (
    (<Container maxWidth="lg">
      <Grid container spacing={3} justifyContent="center" mt={4}>
        <Grid
          textAlign="center"
          size={{
            xs: 12,
            sm: 5,
            lg: 4
          }}>
          <Image src={logoIcon} alt="icon" />
          <Typography fontSize="16" color="textSecondary" mt={1} mb={4}>
            All rights reserved by MaterialPro. Designed & Developed by
            <Link target="_blank" href="https://wrappixel.com/">
              <Typography color="textSecondary" component="span" display="inline">
                {' '}
                Wrappixel
              </Typography>{' '}
            </Link>
            .
          </Typography>
        </Grid>
      </Grid>
    </Container>)
  );
};

export default Footer;
