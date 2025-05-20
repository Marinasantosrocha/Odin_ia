"use client";
import React, { useState, useRef } from "react";
import {
  Avatar,
  Grid,
  Stack,
  Typography,
  Box,
  Container,
  Divider,
  Link,
  Tooltip,
  useTheme,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Image from "next/image";

function SampleNextArrow(props: any) {
  const { className, onClick } = props;
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      className={className}
      sx={{
        cursor: "pointer",
        position: "absolute",
        left: "125px",
        zIndex: 1,
        bottom: "45px",
        right: 0,
        backgroundColor: (theme) => theme.palette.grey[100],
        width: "32px",
        height: "32px",
        borderRadius: "50%",
      }}
      onClick={onClick}
    >
      <IconChevronRight strokeWidth={1.5} size={20} />
    </Box>
  );
}

function SamplePrevArrow(props: any) {
  const { className, onClick } = props;
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      className={className}
      sx={{
        cursor: "pointer",
        position: "absolute",
        left: "48px",
        zIndex: 1,
        bottom: "45px",
        right: "60px",
        backgroundColor: (theme) => theme.palette.grey[100],
        width: "32px",
        height: "32px",
        borderRadius: "50%",
      }}
      onClick={onClick}
    >
      <IconChevronLeft strokeWidth={1.5} size={20} />
    </Box>
  );
}

const ClientReviews = [
  {
    id: 1,
    img: "/images/profile/user-1.jpg",
    name: "Jenny Wilson",
    subtitle: "CEO & Head of Comp Inc.",
    text: "This template is great, UI-rich and up-to-date. Although it is pretty much complete, I suggest to improve a bit of documentation. Thanks & Highly recommended!",
  },
  {
    id: 2,
    img: "/images/profile/user-2.jpg",
    name: "Josh Cui",
    subtitle: "CEO & Head of Comp Inc.",
    text: "This template is great, UI-rich and up-to-date. Although it is pretty much complete, I suggest to improve a bit of documentation. Thanks & Highly recommended!",
  },
  {
    id: 3,
    img: "/images/profile/user-3.jpg",
    name: "Eminson Mendoza",
    subtitle: "CEO & Head of Comp Inc.",
    text: "This template is great, UI-rich and up-to-date. Although it is pretty much complete, I suggest to improve a bit of documentation. Thanks & Highly recommended!",
  },
];

// Custom next arrow component
const NextArrow = ({ onClick }: { onClick: () => void }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <IconChevronRight stroke={1.5} size="1.375rem" />
    </Box>
  );
};

// Custom previous arrow component
const PrevArrow = ({ onClick }: { onClick: () => void }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <IconChevronLeft stroke={1.5} size="1.375rem" />
    </Box>
  );
};

const Reviews = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = ClientReviews.length;

  const theme = useTheme();

  let sliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 500,
    arrows: false, // Disable default arrows to use custom ones
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    beforeChange: (oldIndex: any, newIndex: React.SetStateAction<number>) =>
      setCurrentSlide(newIndex),
  };

  return (<>
    <Box
      sx={{
        py: {
          xs: 5,
          lg: 10,
        },
        backgroundColor:
          theme.palette.mode == "light" ? "white" : "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
          mb="56px"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid
            pr={6}
            size={{
              xs: 12,
              lg: 4,
              sm: 8
            }}>
            <Typography
              variant="h4"
              lineHeight={1.4}
              mb={3}
              fontWeight={700}
              sx={{
                fontSize: {
                  lg: "40px",
                  xs: "35px",
                },
                mr: {
                  xs: 0,
                  lg: 4,
                },
              }}
            >
              Words from customers
            </Typography>
            <Typography variant="body1" lineHeight={1.8}>
              Pellentesque varius semper odio non pretium.
            </Typography>

            <Box display="flex" alignItems="center" mt={3}>
              <PrevArrow
                onClick={() =>
                  sliderRef.current && sliderRef.current.slickPrev()
                }
              />
              <Typography fontSize="14px" fontWeight={500} mx={2}>
                {currentSlide + 1} / {totalSlides}
              </Typography>
              <NextArrow
                onClick={() =>
                  sliderRef.current && sliderRef.current.slickNext()
                }
              />
            </Box>
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 7,
              sm: 12
            }}>
            <Grid container spacing={3} justifyContent="center">
              <Grid
                size={{
                  xs: 12,
                  lg: 10
                }}>
                <Slider
                  ref={(slider: Slider | null) => {
                    sliderRef.current = slider;
                  }}
                  {...settings}
                >
                  {ClientReviews.map((review, i) => (
                    <div key={i}>
                      <Typography
                        variant="body1"
                        fontSize="17px"
                        lineHeight={1.8}
                        mb={4}
                      >
                        {review.text}
                      </Typography>

                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={3}
                        mb={3}
                      >
                        <Avatar
                          src={review.img}
                          alt="user"
                          sx={{ width: 56, height: 56 }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            fontSize="17px"
                            fontWeight={600}
                          >
                            {review.name}
                          </Typography>
                          <Typography
                            variant="body1"
                            fontSize="14px"
                            mt="3px"
                          >
                            {review.subtitle}
                          </Typography>
                        </Box>
                        <Box ml="auto" mr="5px">
                          <Box
                            bgcolor="primary.main"
                            width="48px"
                            height="48px"
                            borderRadius="50%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Image
                              src="/images/frontend-pages/homepage/quote.svg"
                              alt="img"
                              width={28}
                              height={28}
                            />
                          </Box>
                        </Box>
                      </Stack>
                    </div>
                  ))}
                </Slider>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider />

        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          mt={4}
          gap="16px"
        >
          <Link href="#">
            <Tooltip title="Intel">
              <Image
                src="/images/frontend-pages/clients/icon-intel.svg"
                width={48}
                height={32}
                alt="payment"
              />
            </Tooltip>
          </Link>
          <Link href="#">
            <Tooltip title="Oracle">
              <Image
                src="/images/frontend-pages/clients/icon-oracle.svg"
                width={138}
                height={18}
                alt="payment"
              />
            </Tooltip>
          </Link>
          <Link href="#">
            <Tooltip title="Dell">
              <Image
                src="/images/frontend-pages/clients/icon-dell.svg"
                width={36}
                height={36}
                alt="payment"
              />
            </Tooltip>
          </Link>
          <Link href="#">
            <Tooltip title="Samsung">
              <Image
                src="/images/frontend-pages/clients/icon-samsung.svg"
                width={130}
                height={20}
                alt="payment"
              />
            </Tooltip>
          </Link>
          <Link href="#">
            <Tooltip title="Infosys">
              <Image
                src="/images/frontend-pages/clients/icon-infosys.svg"
                width={80}
                height={32}
                alt="payment"
              />
            </Tooltip>
          </Link>
          <Link href="#">
            <Tooltip title="Capgemini">
              <Image
                src="/images/frontend-pages/clients/icon-capgemini.svg"
                width={154}
                height={36}
                alt="payment"
              />
            </Tooltip>
          </Link>
        </Box>
      </Container>
    </Box>
  </>);
};

export default Reviews;
