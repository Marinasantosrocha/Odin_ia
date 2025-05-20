'use client';
import React from "react";
import { Grid, Typography } from "@mui/material";

const keys = [
    {
        title: '2019',
        subtext: 'When we founded Modernize',
    },

    {
        title: '300k+',
        subtext: 'Customers on Modernize',
    },
    {
        title: '25k+',
        subtext: 'Dashboards built using MaterialPro',
    },
]

const Key = () => {

    return (
        (<Grid container spacing={2}>
            {keys.map((key, i) => (
                <Grid
                    key={i}
                    size={{
                        xs: 6,
                        sm: 4
                    }}>
                    <Typography color='primary.main' variant="h4" sx={{
                        fontSize: {
                            xs: '34px', sm: '48px'
                        }
                    }} my={1} lineHeight={1} fontWeight={400} >{key.title}</Typography>
                    <Typography variant="body1">{key.subtext}</Typography>
                </Grid>
            ))}
        </Grid>)
    );
};

export default Key;
