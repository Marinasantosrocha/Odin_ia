import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import { IconRocket } from '@tabler/icons-react';
import Image from 'next/image';

import AllIcons from "/public/images/landingpage/icons.png";
// third party
import { motion } from 'framer-motion';

const StyledButton = styled(Button)(() => ({
  padding: '13px 48px',
  fontSize: '16px',
}));

const BannerContent = () => {

  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  return (
    <Box mt={lgDown ? 8 : 0}>
      <motion.div
        initial={{ opacity: 0, translateY: 550 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 30,
        }}
      >
        <Typography variant="h6" display={'flex'} gap={1} mb={2}>
          <Typography color={'secondary'}>
            <IconRocket size={'21'} />
          </Typography>{' '}
          Kick start your project with
        </Typography>

        <Typography
          variant="h1"
          fontWeight={600}
          sx={{
            fontSize: {
              md: '49px',
            },
            lineHeight: {
              md: '60px',
            },
          }}
        >
          <Typography component={'span'} variant="inherit" color={'primary'} mr="4px">
            2 in 1
          </Typography>
          React & Next.Js Admin Template

        </Typography>
      </motion.div>
      <Box pt={4} pb={3}>
        <motion.div
          initial={{ opacity: 0, translateY: 550 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 30,
            delay: 0.2,
          }}
        >
          <Typography variant="h5" fontWeight={300}>
            MaterialPro comes with React as well as Next.Js versions. it has light & dark colors skins, well designed dashboards, applications
            and pages.
          </Typography>
        </motion.div>
      </Box>

      <motion.div
        initial={{ opacity: 0, translateY: 550 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 30,
          delay: 0.4,
        }}
      >
        <Box mt={2}>
          <Image src={AllIcons} alt="all" width={400} />
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={3}>
          <StyledButton variant="contained" color="primary" href="/auth/auth1/login">
            Login
          </StyledButton>

          <StyledButton variant="outlined" href="#demos">
            Live Preview
          </StyledButton>
        </Stack>
      </motion.div>
    </Box>
  );
};

export default BannerContent;
