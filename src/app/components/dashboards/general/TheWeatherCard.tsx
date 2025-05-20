import { Icon } from "@iconify/react";
import {
  Box,
  CardContent,
  Card,
  Typography,
  Stack,
} from "@mui/material";

const WeatherCard = () => {
  return (
    <Card variant="outlined" sx={{ p: "10px" }}>
      <Box
        sx={{
          backgroundColor: "primary.light",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px="20px"
          py="30px"
        >
          <Typography variant="h4" fontSize="18px">
            New Delhi
          </Typography>
          <Typography>Sunday 15 march</Typography>
        </Box>
      </Box>
      <CardContent sx={{ padding: '24px 20px 16px !important' }}>
        <Stack direction="row" spacing={3} gap="20px">
          <Stack direction="row" spacing={2}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="primary.main"
              sx={{
                backgroundColor: "primary.light",
                width: "48px",
                height: "48px",
                borderRadius: "100%",
              }}
            >
              <Icon icon="solar:cloud-sun-2-linear" width={24} height={24} />
            </Box>
            <Box>
              <Typography variant="h4" fontSize="24px" color="primary.main">
              32 °C
              </Typography>
              <Typography variant="subtitle2" fontSize='15px' color="textSecondary">
                Sunny Rainy
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            
            <Box>
              <Typography variant="h4" fontSize="24px">
              25 °C
              </Typography>
              <Typography variant="subtitle2"  fontSize='15px' color="textSecondary">Tonight</Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
