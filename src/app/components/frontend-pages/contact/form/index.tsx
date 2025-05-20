"use client";
import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  MenuItem,
  Button,
} from "@mui/material";
import CustomFormLabel from "../../../forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../../forms/theme-elements/CustomTextField";
import CustomSelect from "../../../forms/theme-elements/CustomSelect";
import Address from "./Address";

const numbers = [
  {
    value: "one",
    label: "General Enquiry",
  },
  {
    value: "two",
    label: "General Enquiry 2",
  },
];

const Form = () => {
  const [number, setNumber] = React.useState("one");

  const handleChange3 = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNumber(event.target.value);
  };

  return (<>
    <Box mt={4}>
      <Container maxWidth="lg">
        <Box>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3388599.4592369436!2d6.920799949782969!3d33.96223431657389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x125595448316a4e1%3A0x3a84333aaa019bef!2sTunisia!5e0!3m2!1sen!2sin!4v1726146847742!5m2!1sen!2sin" width="100%" height="440" style={{ border: 0, borderRadius: '12px' }} allowFullScreen loading="lazy"></iframe>
        </Box>
        {/* <Image src="/images/frontend-pages/contact/map.jpg" alt="map" width={1218} height={440} style={{ borderRadius: '16px', width: '100%', height: 'auto' }} /> */}
      </Container>
    </Box>
    <Box
      sx={{
        paddingTop: {
          xs: "40px",
          lg: "60px",
        },
        paddingBottom: {
          xs: "40px",
          lg: "90px",
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="center">
          <Grid
            alignItems="center"
            size={{
              xs: 12,
              lg: 4
            }}>
            <Address />
          </Grid>
          <Grid
            alignItems="center"
            size={{
              xs: 12,
              lg: 8
            }}>
            <form>
              <Grid container spacing={3} justifyContent="center">
                <Grid
                  alignItems="center"
                  size={{
                    xs: 12,
                    lg: 6
                  }}>
                  <CustomFormLabel htmlFor="fname" sx={{ mt: 0 }}>
                    First Name *
                  </CustomFormLabel>
                  <CustomTextField id="fname" placeholder="Name" fullWidth />
                </Grid>
                <Grid
                  alignItems="center"
                  size={{
                    xs: 12,
                    lg: 6
                  }}>
                  <CustomFormLabel htmlFor="lname" sx={{ mt: 0 }}>
                    Last Name *
                  </CustomFormLabel>
                  <CustomTextField
                    id="lname"
                    placeholder="Last Name"
                    fullWidth
                  />
                </Grid>
                <Grid
                  alignItems="center"
                  size={{
                    xs: 12,
                    lg: 6
                  }}>
                  <CustomFormLabel htmlFor="phone" sx={{ mt: 0 }}>
                    Phone Number *
                  </CustomFormLabel>
                  <CustomTextField
                    id="phone"
                    placeholder="xxx xxx xxxx"
                    fullWidth
                  />
                </Grid>
                <Grid
                  alignItems="center"
                  size={{
                    xs: 12,
                    lg: 6
                  }}>
                  <CustomFormLabel htmlFor="txt-email" sx={{ mt: 0 }}>
                    Email *
                  </CustomFormLabel>
                  <CustomTextField
                    id="txt-email"
                    placeholder="Email address"
                    fullWidth
                  />
                </Grid>
                <Grid alignItems="center" size={12}>
                  <CustomFormLabel htmlFor="txt-enquire" sx={{ mt: 0 }}>
                    Enquire related to *
                  </CustomFormLabel>
                  <CustomSelect
                    fullWidth
                    id="txt-enquire"
                    variant="outlined"
                    value={number}
                    onChange={handleChange3}
                  >
                    {numbers.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid alignItems="center" size={12}>
                  <CustomFormLabel htmlFor="txt-message" sx={{ mt: 0 }}>
                    Message
                  </CustomFormLabel>
                  <CustomTextField
                    id="txt-message"
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Write your message here..."
                    fullWidth
                  />
                </Grid>
                <Grid alignItems="center" size={12}>
                  <Button variant="contained" size="large">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>

        </Grid>
      </Container>
    </Box>
  </>);
};

export default Form;
