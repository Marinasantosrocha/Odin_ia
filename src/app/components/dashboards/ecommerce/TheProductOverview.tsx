import React from "react";
import DashboardCard from "../../shared/DashboardCard";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  TableContainer,
  Stack,
  MenuItem,
  IconButton,
} from "@mui/material";
import TheProductOverviewData from "./TheProductOverviewData";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import { Icon } from "@iconify/react";

const performers = TheProductOverviewData;

const TheProductOverview = () => {
  const [number, setNumber] = React.useState("1");

  const handleChange3 = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNumber(event.target.value);
  };

  return (
    <DashboardCard
      title="Product Overview"
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
          <MenuItem value={1}>January</MenuItem>
          <MenuItem value={2}>February</MenuItem>
          <MenuItem value={3}>March</MenuItem>
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
                  Customer
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: 0 }}>
                <Typography variant="subtitle2" fontWeight={500}>
                  Photo
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: 0 }}>
                <Typography variant="subtitle2" fontWeight={500}>
                  Quantity
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: 0 }}>
                <Typography variant="subtitle2" fontWeight={500}>
                  Date
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: 0 }}>
                <Typography variant="subtitle2" fontWeight={500}>
                  Status
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: 0 }}>
                <Typography variant="subtitle2" fontWeight={500}>
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {performers.map((basic) => (
              <TableRow key={basic.id}>
                <TableCell>
                  <Typography variant="h6" fontWeight={500} mb={1}>
                    {basic.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Avatar
                    src={basic.imgsrc}
                    alt={basic.imgsrc}
                    sx={{ width: 80, height: 80 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    fontWeight={400}
                  >
                    {basic.quantity}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    fontWeight={400}
                  >
                    {basic.date}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    sx={{
                      bgcolor:
                        basic.status === "Paid"
                          ? (theme) => theme.palette.success.main
                          : basic.status === "Pending"
                            ? (theme) => theme.palette.warning.main
                            : basic.status === "Failed"
                              ? (theme) => theme.palette.error.main
                              : (theme) => theme.palette.primary.main,
                      color: 'white'
                    }}
                    label={basic.status}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      edge="end"
                      size="small"
                      aria-label="delete"
                      color="primary"
                    >
                      <Icon icon="solar:eye-linear" height={18} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      size="small"
                      aria-label="delete"
                      color="error"
                    >
                      <Icon icon="solar:trash-bin-minimalistic-linear" height={18} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default TheProductOverview;
