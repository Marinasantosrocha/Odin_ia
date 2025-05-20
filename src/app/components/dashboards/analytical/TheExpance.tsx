import { Box, Card, Typography } from "@mui/material";

const TheExpance = () => {
  return (
    <Card variant="outlined" sx={{ p: 0, bgcolor: "secondary.main" }}>
      <Box p="30px" textAlign="center">
        <Typography variant="subtitle1" mb={3} mt={1} color="white">
          Ad. Expense
        </Typography>
        <Typography variant="h4" fontSize="40px" color="white" mb={2}>
          12.5m
        </Typography>
      </Box>
    </Card>
  );
};

export default TheExpance;
