"use client";
import { styled, Container, Box, useTheme } from "@mui/material";
import React, { useContext, useState } from "react";
import Header from "./layout/vertical/header/Header";
import Sidebar from "./layout/vertical/sidebar/Sidebar";
import Customizer from "./layout/shared/customizer/Customizer";
import Navigation from "./layout/horizontal/navbar/Navigation";
import HorizontalHeader from "./layout/horizontal/header/Header";
import { CustomizerContext } from "@/app/context/customizerContext";


const MainWrapper = styled("div")(() => ({
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { activeLayout, isLayout, isCollapse } = useContext(CustomizerContext);

  const theme = useTheme();

  return (
    <MainWrapper>
      <title>MaterialPro NextJs 15.0.2 Admin Dashboard</title>
      {/* ------------------------------------------- */}
      {/* Header */}
      {/* ------------------------------------------- */}
      {activeLayout === 'horizontal' ? "" : <Header />}

      {/* ------------------------------------------- */}
      {/* Sidebar */}
      {/* ------------------------------------------- */}
      {activeLayout === 'horizontal' ? "" : <Sidebar />}

      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper
        className="page-wrapper"
        sx={{
          ...(activeLayout === 'vertical' && {
            [theme.breakpoints.up("lg")]: {
              ml: `256px`,
            },
          }),

          ...(isCollapse === "mini-sidebar" && {
            [theme.breakpoints.up("lg")]: {
              ml: `75px`,
            },
          }),
        }}

      >
        {/* PageContent */}
        {activeLayout === 'horizontal' ? <HorizontalHeader /> : ""}
        {activeLayout === 'horizontal' ? <Navigation /> : ""}
        <Container
          sx={{
            maxWidth: isLayout === 'boxed' ? 'lg' : '100%!important',
          }}
        >
          {/* ------------------------------------------- */}
          {/* PageContent */}
          {/* ------------------------------------------- */}
          <Box sx={{ minHeight: 'calc(100vh - 170px)' }}>
            {children}
          </Box>

          {/* ------------------------------------------- */}
          {/* End Page */}
          {/* ------------------------------------------- */}
        </Container>
        <Customizer />
      </PageWrapper>
    </MainWrapper>
  );
}
