import React from "react";
import DashboardCard from "../../shared/DashboardCard";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  TableContainer,
  MenuItem,
} from "@mui/material";
import TheProductsData from "./TheProductsData";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import { Icon } from "@iconify/react";

const performers = TheProductsData;

const TheProductAvailability = () => {
  const [number, setNumber] = React.useState("1");

  const handleChange3 = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNumber(event.target.value);
  };

  return (
    <DashboardCard
      title="Products Availability"
      subtitle="March 2025"
      action={
        <CustomSelect
          id="standard-select-number"
          variant="outlined"
          value={number}
          onChange={handleChange3}
          sx={{
            mb: 2,
          }}
        >
          <MenuItem value={1}>Electronics</MenuItem>
          <MenuItem value={2}>Kitchen</MenuItem>
          <MenuItem value={3}>Crocory</MenuItem>
          <MenuItem value={4}>Wooden</MenuItem>
        </CustomSelect>
      }
    >
      <TableContainer>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: "nowrap",
            mt: -2,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderBottom: 0 }}>
                <Typography variant="subtitle2" fontWeight={500}>
                  Product
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: 0 }}>
                <Typography variant="subtitle2" fontWeight={500}>
                  Description
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: 0 }}>
                <Typography variant="subtitle2" fontWeight={500}>
                  Quantity
                </Typography>
              </TableCell>
              <TableCell sx={{ textAlign: "right", borderBottom: 0 }}>
                <Typography variant="subtitle2" fontWeight={500}>
                  Price
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {performers.map((basic) => (
              <TableRow key={basic.id}>
                <TableCell>
                  <Avatar sx={{ width: 45, height: 45, bgcolor: basic.color }}>
                    <Icon
                      icon="solar:cart-large-minimalistic-linear"
                      height={22}
                    />
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {basic.name}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    fontWeight={400}
                  >
                    Product id : {basic.pname}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{basic.status}</Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <Typography variant="h6">${basic.budget}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default TheProductAvailability;
