import React from "react";
import DashboardCard from "../../shared/DashboardCard";
import {
  Typography,
  Box,
  Avatar,
  Chip,
  Stack,
  FormControlLabel,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import CustomTextField from "../../forms/theme-elements/CustomTextField";
import CustomCheckbox from "../../forms/theme-elements/CustomCheckbox";

const TodoList = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [value, setValue] = React.useState("");

  const [todos, setTodos] = React.useState([
    {
      isDone: false,
      title: "Schedule meeting with",
      subtext: "Phasellus quis rutrum leo quis vulputate tortor...",
      time: "Today",
      color: "primary",
      imgSrc: "/images/blog/blog-img1.jpg",
    },
    {
      isDone: false,
      title: "Give purchase report to",
      subtext: "Mauris cursus scelerisque felis et ultricies...",
      time: "Yesterday",
      color: "secondary",
      imgSrc: "/images/blog/blog-img2.jpg",
    },
    {
      isDone: false,
      title: "Book flight for holiday",
      subtext: "Vestibulum non aliquet mi vitae mollis lorem...",
      time: "Tomorrow",
      color: "error",
      imgSrc: "/images/blog/blog-img3.jpg",
    },
    {
      isDone: false,
      title: "Forward all tasks",
      subtext: "Aenean interdum auctor massa ut scelerisque...",
      time: "1 Week",
      color: "warning",
      imgSrc: "/images/blog/blog-img4.jpg",
    },
  ]);

  // add todos

  const addTodo = (title: string) => {
    const newTodos = [
      ...todos,
      {
        isDone: false,
        title,
        color: "primary",
        subtext: "interdum auctor massa ut scelerisque...",
        imgSrc: "/images/blog/blog-img7.jpg",
        time: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];
    setTodos(newTodos);
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
    setOpen(false);
  };

  const markTodo = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].isDone = true;
    setTodos(newTodos);
  };

  const count = todos.filter(function (item) {
    if (item.isDone) {
      return true;
    } else {
      return false;
    }
  }).length;

  const remaincount = todos.filter(function (item) {
    if (item!.isDone) {
      return false;
    } else {
      return true;
    }
  }).length;

  const totalCount = todos.length;

  return (
    <DashboardCard
      title="To do List"
      subtitle="Task to complete"
      action={
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add Task
        </Button>
      }
    >
      <>
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="lg"
        // PaperProps={{
        //   component: "form",
        // }}
        >
          <DialogTitle>Add new task</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <CustomTextField
                required
                id="default-value"
                variant="outlined"
                value={value}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setValue(e.target.value)}
                placeholder="Add new tasks"
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <>
          <Stack direction="row" spacing={3} mb={2} mt={3}>
            <Typography variant="h6">Remaining: {remaincount} </Typography>
            <Typography variant="h6">Completed: {count} </Typography>
          </Stack>

          {todos.map((todo, i) => (
            <Box key={i}>
              <Stack direction="row" alignItems="start" py={2}>
                <Box>
                  <FormControlLabel
                    control={
                      <CustomCheckbox
                        onChange={() => markTodo(i)}
                        color="primary"
                      />
                    }
                    label={todo.title}
                    slotProps={{
                      typography: {
                        style: {
                          fontSize: "16px",
                          fontWeight: 500,
                          textDecoration: todo.isDone ? "line-through" : "none",
                        },
                      },
                    }}
                  />
                  {todo.time ? (
                    <Chip
                      sx={{
                        bgcolor: todo.color
                          ? todo.color + ".light"
                          : "primary.light",
                        color: todo.color
                          ? todo.color + ".main"
                          : "primary.main",
                        ml: {
                          xs: "25px",
                          sm: "auto",
                        },
                        height: "25px",
                        fontSize: "13px",
                      }}
                      label={todo.time}
                      variant="filled"
                    />
                  ) : (
                    ""
                  )}
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    fontWeight={400}
                    ml={4}
                    sx={{
                      mt: {
                        xs: 1,
                        sm: 0,
                      },
                    }}
                  >
                    {todo.subtext}
                  </Typography>
                </Box>
                <Box
                  ml="auto"
                  mt={1}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Avatar
                    alt="Natacha"
                    src={todo.imgSrc}
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: (theme) => theme.shape,
                    }}
                  />
                </Box>
              </Stack>
              {i !== todos.length - 1 ? <Divider /> : null}
            </Box>
          ))}
        </>
      </>
    </DashboardCard>
  );
};

export default TodoList;
