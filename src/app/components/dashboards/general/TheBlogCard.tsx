import { Icon } from "@iconify/react";
import {
  Box,
  CardContent,
  CardMedia,
  Card,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import { IconClock, IconMessageCircle2 } from "@tabler/icons-react";

const BlogCard = () => {
  return (
    <Card variant="outlined" sx={{ p: "10px" }}>
      <CardMedia
        sx={{ height: 250, borderRadius: "7px" }}
        image="/images/backgrounds/u5.jpg"
        title="green iguana"
      />
      <CardContent>
        <Box
          bgcolor="primary.light"
          color="primary.main"
          fontSize="12px"
          px={2}
          py="3px" borderRadius="30px" display="inline-block"
        >
          Technology
        </Box>
        <Typography variant="h5" mt={1} fontSize="18px">
          Business development new rules for 2025
        </Typography>
        <Typography variant="subtitle2" mt={1} color="textSecondary">Lorem ipsum dolor sit amet, this is a consectetur adipisicing elit, sed do...</Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center" mt={2}
        >
          <Button variant="contained">Read More</Button>
          <IconButton>
            <Icon icon="solar:share-linear" height={22} />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
