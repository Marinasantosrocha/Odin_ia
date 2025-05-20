import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Grid, Menu, MenuItem, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { IconChevronDown } from '@tabler/icons-react';
import AppLinks from '@/app/(DashboardLayout)/layout/vertical/header/AppLinks';
import QuickLinks from '@/app/(DashboardLayout)/layout/vertical/header/QuickLinks';
import DemosDD from './DemosDD';
import Link from 'next/link';

const Navigations = () => {

    const StyledButton = styled(Button)(({ theme }) => ({
        fontSize: '16px',
        color: theme.palette.text.secondary
    }));

    // demos
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // pages

    const [open2, setOpen2] = useState(false);

    const handleOpen2 = () => {
        setOpen2(true);
    };

    const handleClose2 = () => {
        setOpen2(false);
    };


    // docs
    const [open3, setOpen3] = useState(false);

    const handleOpen3 = () => {
        setOpen3(true);
    };

    const handleClose3 = () => {
        setOpen3(false);
    };



    return (<>
        <StyledButton
            color="inherit"
            variant="text"
            aria-expanded={open ? 'true' : undefined}
            sx={{
                color: open ? 'primary.main' : (theme) => theme.palette.text.secondary,
            }}
            onMouseEnter={handleOpen} onMouseLeave={handleClose}
            endIcon={<IconChevronDown size="15" style={{ marginLeft: '-5px', marginTop: '2px' }} />}
        >
            Demos
        </StyledButton>
        {open && (
            <Paper
                onMouseEnter={handleOpen}
                onMouseLeave={handleClose}
                sx={{
                    position: 'absolute',
                    left: '0',
                    right: '0',
                    top: '55px',
                    maxWidth: '1200px',
                    width: '100%'
                }}
            >
                <DemosDD />
            </Paper>
        )}
        <Box>
            <StyledButton
                color="inherit"
                variant="text"
                onMouseEnter={handleOpen2} onMouseLeave={handleClose2}
                sx={{
                    color: open2 ? 'primary.main' : (theme) => theme.palette.text.secondary,
                }}
                endIcon={<IconChevronDown size="15" style={{ marginLeft: '-5px', marginTop: '2px' }} />}
            >
                Pages
            </StyledButton>
            {open2 && (
                <Paper
                    onMouseEnter={handleOpen2}
                    onMouseLeave={handleClose2}
                    sx={{
                        position: 'absolute',
                        left: '0',
                        right: '30%',
                        top: '55px',
                        width: '850px',
                        margin: '0 auto'
                    }}
                >
                    <Grid container>
                        <Grid
                            display="flex"
                            size={{
                                sm: 8
                            }}>
                            <Box p={4} pr={0} pb={3}>
                                <AppLinks />
                            </Box>
                            <Divider orientation="vertical" />
                        </Grid>
                        <Grid
                            size={{
                                sm: 4
                            }}>
                            <Box p={4}>
                                <QuickLinks />
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </Box>

        <Box>
            <StyledButton
                color="inherit"
                variant="text"
                onMouseEnter={handleOpen3} onMouseLeave={handleClose3}
                sx={{
                    color: open3 ? 'primary.main' : (theme) => theme.palette.text.secondary,
                }}
                endIcon={<IconChevronDown size="15" style={{ marginLeft: '-5px', marginTop: '2px' }} />}
            >
                Documentation
            </StyledButton>
            {open3 && (
                <Paper
                    onMouseEnter={handleOpen3}
                    onMouseLeave={handleClose3}
                    sx={{
                        position: 'absolute',
                        left: 'auto',
                        right: '12% !important',
                        top: '50px',
                        width: '200px',
                        margin: '0 auto',
                        p: 2
                    }}
                >
                    <Box>
                        <StyledButton fullWidth color="inherit" variant="text" href='https://wrappixel.github.io/premium-documentation-wp/nextjs/materialpro/index.html'>Next.Js</StyledButton>
                    </Box>
                    <Box mt={1}>
                        <StyledButton fullWidth color="inherit" variant="text" href='https://wrappixel.github.io/premium-documentation-wp/react/materialpro/index.html'>React.Js</StyledButton>
                    </Box>
                </Paper>
            )}
        </Box>

        <StyledButton color="inherit" variant="text" href="https://support.wrappixel.com">
            Support
        </StyledButton>
        <Button color="primary" variant="contained" href="/auth/auth1/login">
            Login
        </Button>
    </>);
};

export default Navigations;
