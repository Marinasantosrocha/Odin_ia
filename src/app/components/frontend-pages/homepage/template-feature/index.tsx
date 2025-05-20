"use client";
import React from "react";
import { Box, Grid, Typography, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { IconBasket } from "@tabler/icons-react";

const StyledAnimationFeature = styled(Box)(() => ({
  width: "100%",
  overflowX: "hidden",
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  display: "flex",
  gap: "24px",
}));


const slide1 = [
  {
    color: "primary",
    icon: <IconBasket stroke={1.5} size="1.5rem" />,
    text: "6 Theme Colors",
  },
  {
    color: "secondary",
    icon: <IconBasket stroke={1.5} size="1.5rem" />,
    text: "NextAuth",
  },
  {
    color: "error",
    icon: <IconBasket stroke={1.5} size="1.5rem" />,
    text: "Firebase",
  },
  {
    color: "warning",
    icon: <IconBasket stroke={1.5} size="1.5rem" />,
    text: "90+ Page Templates",
  },
  {
    color: "success",
    icon: <IconBasket stroke={1.5} size="1.5rem" />,
    text: "45+ UI Components",
  },
  {
    color: "info",
    icon: <IconBasket stroke={1.5} size="1.5rem" />,
    text: "Matrial Ui",
  },
  {
    color: "primary",
    icon: <IconBasket stroke={1.5} size="1.5rem" />,
    text: "3400+ Font Icons",
  },
  {
    color: "secondary",
    icon: <IconBasket stroke={1.5} size="1.5rem" />,
    text: "50+ UI Components",
  },
];

const slide2 = [
  {
    icon: <IconBasket stroke={1.5} size="1.25rem" />,
    text: "SWR",
    color: "primary",
  },
  {
    icon: <IconBasket stroke={1.5} size="1.25rem" />,
    text: "i18 React",
    color: "error",
  },
  {
    icon: <IconBasket stroke={1.5} size="1.25rem" />,
    text: "Material Ui",
    color: "info",
  },
  {
    icon: <IconBasket stroke={1.5} size="1.25rem" />,
    text: "Easy to Customize",
    color: "success",
  },
];

const slide3 = [
  {
    icon: <IconBasket stroke={1.5} size="1.25rem" />,
    text: "Lots of Chart Options",
    color: "secondary",
  },
  {
    icon: <IconBasket stroke={1.5} size="1.25rem" />,
    text: "Lots of Table Examples",
    color: "warning",
  },
  {
    icon: <IconBasket stroke={1.5} size="1.25rem" />,
    text: "Regular Updates",
    color: "success",
  },
  {
    icon: <IconBasket stroke={1.5} size="1.25rem" />,
    text: "Detailed Documentation",
    color: "warning",
  },
  {
    icon: <IconBasket stroke={1.5} size="1.25rem" />,
    text: "Calendar Design",
    color: "info",
  },
  {
    icon: <IconBasket stroke={1.5} size="1.25rem" />,
    text: "Dedicated Support",
    color: "primary",
  },
];

const TemplateFeature = () => {
  const theme = useTheme();

  const StyledAnimationContent = styled(Box)(() => ({
    animation: theme.direction == 'ltr' ? 'marquee 25s linear infinite' : 'marqueeRtl 45s linear infinite'
  }));

  const StyledAnimationContent2 = styled(Box)(() => ({
    animation: theme.direction == 'ltr' ? 'marquee2 25s linear infinite' : 'marquee2Rtl 45s linear infinite'
  }));

  const StyledFeatureBox = styled(Box)(() => ({
    backgroundColor: theme.palette.background.default,
    height: "60px",
    padding: "10px 16px",
    borderRadius: "16px",
    marginTop: "15px",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    flexShrink: 0,
  }));



  return (
    <Box
      sx={{
        backgroundColor:
          theme.palette.mode == "light" ? "white" : "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Box
          borderRadius="24px"
          sx={{
            py: "40px",
          }}
        >
          <StyledAnimationFeature>
            {[0, 1, 2, 3].map((item, index) => {
              return (
                <StyledAnimationContent display="flex" gap="30px" key={index}>
                  {slide1.map((item, i) => (
                    <StyledFeatureBox
                      key={i}
                      sx={{
                        backgroundColor: `${item.color}.light`,
                        color: `${item.color}.main`,
                      }}
                    >
                      {item.icon}
                      <Typography fontSize="15px" fontWeight={600}>
                        {item.text}
                      </Typography>
                    </StyledFeatureBox>
                  ))}
                </StyledAnimationContent>
              );
            })}
          </StyledAnimationFeature>

          <StyledAnimationFeature>
            {[0, 1, 2, 3, 4, 5].map((item, index) => {
              return (
                <StyledAnimationContent2 display="flex" gap="30px" key={index}>
                  {slide2.map((item, i) => (
                    <StyledFeatureBox
                      key={i}
                      sx={{
                        backgroundColor: `${item.color}.light`,
                        color: `${item.color}.main`,
                      }}
                    >
                      {item.icon}
                      <Typography fontSize="15px" fontWeight={600}>
                        {item.text}
                      </Typography>
                    </StyledFeatureBox>
                  ))}
                </StyledAnimationContent2>
              );
            })}
          </StyledAnimationFeature>

          <StyledAnimationFeature>
            {[0, 1, 2, 3].map((item, index) => {
              return (
                <StyledAnimationContent display="flex" gap="30px" key={index}>
                  {slide3.map((item, i) => (
                    <StyledFeatureBox
                      key={i}
                      sx={{
                        backgroundColor: `${item.color}.light`,
                        color: `${item.color}.main`,
                      }}
                    >
                      {item.icon}
                      <Typography fontSize="15px" fontWeight={600}>
                        {item.text}
                      </Typography>
                    </StyledFeatureBox>
                  ))}
                </StyledAnimationContent>
              );
            })}
          </StyledAnimationFeature>
        </Box>
      </Container>
    </Box>
  );
};

export default TemplateFeature;
