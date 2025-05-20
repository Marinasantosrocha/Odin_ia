'use client';
import React from "react";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Grid } from '@mui/material';
import { Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import NextLink from "next/link";

import { IconChevronRight, IconCircle } from "@tabler/icons-react";
import { Box, Container } from "@mui/material";


interface BreadCrumbItem {
    title: string;
    to?: string;
}

interface BreadCrumbType {
    subtitle?: string;
    items?: BreadCrumbItem[];
    title: string;
    children?: React.ReactNode;
}

const BreadcrumbTwo = ({ subtitle, items, title, children }: BreadCrumbType) => {

    return (
        (<Box pt={6} bgcolor="primary.light" pb={3}>
            <Container maxWidth="lg">
                <Grid
                    container
                    sx={{
                        p: "30px 0 20px",
                        marginBottom: "30px",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <Grid
                        mb={1}
                        size={{
                            xs: 12,
                            sm: 6,
                            lg: 8
                        }}>
                        <Typography variant="h4" fontSize="32px" mb={0}>{title}</Typography>
                    </Grid>
                    <Grid
                        mb={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                        size={{
                            xs: 12,
                            sm: 6,
                            lg: 4
                        }}>
                        <Typography color="textSecondary" variant="h6" fontWeight={400} mb={0}>
                            {subtitle}
                        </Typography>
                        <Breadcrumbs
                            separator={
                                <IconChevronRight
                                    size="20"
                                    style={{ margin: "0 5px" }}
                                />
                            }
                            sx={{ alignItems: "center" }}
                            aria-label="breadcrumb"
                        >
                            {items
                                ? items.map((item) => (
                                    <div key={item.title}>
                                        {item.to ? (
                                            <NextLink href={item.to} passHref>
                                                <Typography color="textSecondary" textTransform='uppercase' fontWeight={500}>
                                                    {item.title}
                                                </Typography>
                                            </NextLink>
                                        ) : (
                                            <Typography color="primary.main" textTransform='uppercase' fontWeight={500}>{item.title}</Typography>
                                        )}
                                    </div>
                                ))
                                : ""}
                        </Breadcrumbs>
                    </Grid>
                </Grid>
            </Container>
        </Box>)
    );
};

export default BreadcrumbTwo;
