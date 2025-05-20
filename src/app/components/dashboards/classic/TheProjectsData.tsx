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
} from "@mui/material";
import ProjectsTableData from "./ProjectsTableData";
import CustomSelect from "../../forms/theme-elements/CustomSelect";

const performers = ProjectsTableData;

const ProjectsData = () => {
  const [number, setNumber] = React.useState("1");

  const handleChange3 = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNumber(event.target.value);
  };

  return (
    <DashboardCard
      title="Projects of the Month"
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
              <TableCell sx={{ pl: 0, borderBottom: 0 }}>
                <Typography variant="subtitle2" fontWeight={400}>
                  Client
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: 0 }}>
                <Typography variant="subtitle2" fontWeight={400}>
                  Name
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: 0 }}>
                <Typography variant="subtitle2" fontWeight={400}>
                  Priority
                </Typography>
              </TableCell>
              <TableCell sx={{ pr: 0, textAlign: 'right', borderBottom: 0 }}>
                <Typography variant="subtitle2" fontWeight={400}>
                  Budget
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {performers.map((basic) => (
              <TableRow key={basic.id}>
                <TableCell sx={{ pl: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      src={basic.imgsrc}
                      alt={basic.imgsrc}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={500} mb={1}>
                        {basic.name}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                      >
                        {basic.post}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    fontWeight={400}
                  >
                    {basic.pname}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    sx={{
                      bgcolor:
                        basic.status === "High"
                          ? (theme) => theme.palette.success.light
                          : basic.status === "Medium"
                            ? (theme) => theme.palette.info.light
                            : basic.status === "Low"
                              ? (theme) => theme.palette.primary.light
                              : (theme) => theme.palette.error.light,
                      color:
                        basic.status === "High"
                          ? (theme) => theme.palette.success.main
                          : basic.status === "Medium"
                            ? (theme) => theme.palette.info.main
                            : basic.status === "Low"
                              ? (theme) => theme.palette.primary.main
                              : (theme) => theme.palette.error.main,
                    }}
                    label={basic.status}
                  />
                </TableCell>
                <TableCell sx={{ pr: 0, textAlign: 'right' }}>
                  <Typography variant="subtitle2">${basic.budget}k</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default ProjectsData;
