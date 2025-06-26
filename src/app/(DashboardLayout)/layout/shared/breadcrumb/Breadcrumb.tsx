'use client'
import React from "react";
import {
  Grid,
  Typography,
  Box,
  Breadcrumbs,
} from "@mui/material";
import NextLink from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

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

const Breadcrumb = ({ subtitle, items, title, children }: BreadCrumbType) => {
  return (
    (<Grid
      container
      sx={{
        my: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Grid
        alignItems="center"
        size={{
          xs: 12,
          sm: 6,
          lg: 8
        }}>
        <Typography variant="h5" mt={1} fontSize='18px'>{title}</Typography>

        <Breadcrumbs
          separator={<IconChevronRight size="16" />}
          sx={{ alignItems: "center", mt: items ? "5px" : "" }}
          aria-label="breadcrumb"
        >
          {items
            ? items.map((item) => (
              <div key={item.title}>
                {item.to ? (
                  <NextLink href={item.to} passHref>
                    <Typography color="textSecondary">
                      {item.title}
                    </Typography>
                  </NextLink>
                ) : (
                  <Typography color="textPrimary">{item.title}</Typography>
                )}
              </div>
            ))
            : ""}
        </Breadcrumbs>
      </Grid>
    </Grid>)
  );
};

export default Breadcrumb;

