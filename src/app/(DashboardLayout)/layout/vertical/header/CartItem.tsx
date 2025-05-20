import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import Image from "next/image";



const CartItems = () => {
  return (
    <Box px={3}>
      <Box textAlign="center" mb={3}>
        <Image src='/images/products/empty-shopping-cart.svg' alt="cart" width={200} height={200} />
        <Typography variant="h5" mb={2}>
          Cart is Empty
        </Typography>
        <Button
          component={Link}
          href="/apps/ecommerce/shop"
          variant="contained"
        >
          Go back to Shopping
        </Button>
      </Box>
    </Box>
  );
};

export default CartItems;
