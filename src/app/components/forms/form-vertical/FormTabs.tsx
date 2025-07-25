'use client'
import React from 'react';
import { Box, Button, Grid, IconButton, InputAdornment, MenuItem, Stack, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

// components
import BlankCard from '../../shared/BlankCard';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import CustomSelect from '../theme-elements/CustomSelect';
import CustomTextField from '../theme-elements/CustomTextField';
import CustomOutlinedInput from '../theme-elements/CustomOutlinedInput';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

const countries = [
  {
    value: 'india',
    label: 'India',
  },
  {
    value: 'uk',
    label: 'United Kingdom',
  },
  {
    value: 'srilanka',
    label: 'Srilanka',
  },
];

const lang = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'fr',
    label: 'French',
  },
];

const FormTabs = () => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  //   country
  const [country, setCountry] = React.useState('');

  const handleChange2 = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setCountry(event.target.value);
  };

  //   language
  const [language, setLanguage] = React.useState('en');

  const handleChange3 = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setLanguage(event.target.value);
  };

  //   password
  //
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  //   confirm password
  //
  const [showPassword2, setShowPassword2] = React.useState(false);

  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

  const handleMouseDownPassword2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      {/* ------------------------------------------------------------------------------------------------ */}
      {/* Basic Layout */}
      {/* ------------------------------------------------------------------------------------------------ */}
      <BlankCard>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: (theme) => theme.palette.divider }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Personal Info" value="1" />
              <Tab label="Account Details" value="2" />
              <Tab label="Social Links" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Grid container spacing={3}>
              <Grid
                size={{
                  xs: 12,
                  lg: 6
                }}>
                <Grid container>
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-fname" sx={{ mt: 0 }}>
                      First Name
                    </CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomTextField id="ft-fname" placeholder="John" fullWidth />
                  </Grid>
                  {/* 4 */}
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-country">Country</CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomSelect
                      id="standard-select-currency"
                      value={country}
                      onChange={handleChange2}
                      fullWidth
                      variant="outlined"
                    >
                      {countries.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </Grid>
                  {/* 4 */}
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-date">Birth Date</CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomTextField type="date" id="ft-date" placeholder="John Deo" fullWidth />
                  </Grid>
                </Grid>
              </Grid>
              {/* 2 column */}
              <Grid
                size={{
                  xs: 12,
                  lg: 6
                }}>
                <Grid container>
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-fname" sx={{ mt: { sm: 0 } }}>
                      Last Name
                    </CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomTextField id="ft-fname" placeholder="Deo" fullWidth />
                  </Grid>
                  {/* 4 */}
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-lang">Language</CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomSelect
                      value={language}
                      onChange={handleChange3}
                      fullWidth
                      variant="outlined"
                    >
                      {lang.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </Grid>
                  {/* 4 */}
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-phone">Phone no</CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomTextField id="ft-phone" placeholder="123 4567 201" fullWidth />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={12}>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="primary">
                    Submit
                  </Button>
                  <Button variant="text" color="error">
                    Cancel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value="2">
            <Grid container spacing={3}>
              <Grid
                size={{
                  xs: 12,
                  lg: 6
                }}>
                <Grid container>
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-uname" sx={{ mt: 0 }}>
                      Username
                    </CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomTextField id="ft-uname" placeholder="John.Deo" fullWidth />
                  </Grid>
                  {/* 4 */}
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-pwd">Password</CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomOutlinedInput
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <IconEyeOff size="20" /> : <IconEye size="20" />}
                          </IconButton>
                        </InputAdornment>
                      }
                      id="fs-pwd"
                      placeholder="john.deo"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* 2 column */}
              <Grid
                size={{
                  xs: 12,
                  lg: 6
                }}>
                <Grid container>
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-email" sx={{ mt: { sm: 0 } }}>
                      Email
                    </CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomOutlinedInput
                      endAdornment={<InputAdornment position="end">@example.com</InputAdornment>}
                      id="fs-email"
                      placeholder="john.deo"
                      fullWidth
                    />
                  </Grid>
                  {/* 4 */}
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-lang">Confirm</CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomOutlinedInput
                      type={showPassword2 ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword2}
                            onMouseDown={handleMouseDownPassword2}
                            edge="end"
                          >
                            {showPassword2 ? <IconEyeOff size="20" /> : <IconEye size="20" />}
                          </IconButton>
                        </InputAdornment>
                      }
                      id="fs-pwd"
                      placeholder="john.deo"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={12}>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="primary">
                    Submit
                  </Button>
                  <Button variant="text" color="error">
                    Cancel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value="3">
            <Grid container spacing={3}>
              <Grid
                size={{
                  xs: 12,
                  lg: 6
                }}>
                <Grid container>
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-twitter" sx={{ mt: 0 }}>
                      Twitter
                    </CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomTextField
                      id="ft-twitter"
                      placeholder="https://twitter.com/abc"
                      fullWidth
                    />
                  </Grid>
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-google">Google</CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomTextField
                      id="ft-google"
                      placeholder="https://plus.google.com/abc"
                      fullWidth
                    />
                  </Grid>
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-insta">Instagram</CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomTextField
                      id="ft-insta"
                      placeholder="https://instagram.com/abc"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  lg: 6
                }}>
                <Grid container>
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-fb" sx={{ mt: { sm: 0 } }}>
                      Facebook
                    </CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomTextField id="ft-fb" placeholder="https://facebook.com/abc" fullWidth />
                  </Grid>
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-linkedin">Linkedin</CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomTextField
                      id="ft-linkedin"
                      placeholder="https://linkedin.com/abc"
                      fullWidth
                    />
                  </Grid>
                  <Grid size={12}>
                    <CustomFormLabel htmlFor="ft-quora">Quora</CustomFormLabel>
                  </Grid>
                  <Grid size={12}>
                    <CustomTextField id="ft-quora" placeholder="https://quora.com/abc" fullWidth />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={12}>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="primary">
                    Submit
                  </Button>
                  <Button variant="text" color="error">
                    Cancel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>
        </TabContext>
      </BlankCard>
    </div>
  );
};

export default FormTabs;
