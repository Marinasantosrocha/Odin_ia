import React from "react";
import {
    Typography,
    Avatar,
    Box,
    Card,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemButton,
    Badge,
    CardContent,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SimpleBar from "simplebar-react";
import { Icon } from "@iconify/react";

const contacts = [
    {
        img: "/images/profile/user-9.jpg",
        title: "James Smith",
        subtext: "you were in video call",
        status: "primary.main",
    },
    {
        img: "/images/profile/user-2.jpg",
        title: "Joseph Garciar",
        subtext: "you were in video call",
        status: "secondary.main",
    },
    {
        img: "/images/profile/user-3.jpg",
        title: "Maria Rodriguez",
        subtext: "you missed john call",
        status: "error.main",
    },
    {
        img: "/images/profile/user-6.jpg",
        title: "John Rodriguez",
        subtext: "you missed john call",
        status: "error.main",
    },
    {
        img: "/images/profile/user-8.jpg",
        title: "James Smith",
        subtext: "you were in video call",
        status: "primary.main",
    },
];

const MyContacts = () => {
    return (
        <>
            <Card variant="outlined" sx={{ p: 0, maxHeight: 350 }} >
                <SimpleBar style={{ height: '350px' }} >
                    <CardContent sx={{ pb: 1 }}>
                        <Box>
                            <Typography variant="h5">My Contacts</Typography>
                            <Typography variant="subtitle1" color='textSecondary'>
                                Checkout my contacts here
                            </Typography>
                        </Box>
                    </CardContent>
                    <Box>
                        <List>
                            {contacts.map((contact, i) => (
                                <ListItem
                                    key={i}
                                    sx={{
                                        p: 0,
                                        '& .MuiListItemSecondaryAction-root': {
                                            right: '30px'
                                        }
                                    }}
                                    secondaryAction={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <IconButton edge="end" size="small" aria-label="delete" color="error">
                                                <Icon icon="solar:videocamera-linear" height={18} />
                                            </IconButton>
                                            <IconButton edge="end" size="small" aria-label="delete" color="primary">
                                                <Icon icon="solar:incoming-call-linear" height={18} />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemButton
                                        sx={{
                                            gap: "12px",
                                            padding: "15px  30px",
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Badge
                                                variant="dot"
                                                sx={{
                                                    ".MuiBadge-badge": {
                                                        backgroundColor: contact.status,
                                                        top: "5px",
                                                        right: "8px",
                                                        border: "1px solid",
                                                        borderColor: "background.paper",
                                                    },
                                                }}
                                            >
                                                <Avatar
                                                    src={contact.img}
                                                    alt="user-1"
                                                    sx={{ width: 48, height: 48 }}
                                                />
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={contact.title}
                                            secondary={contact.subtext}
                                            slotProps={{
                                                primary: {
                                                    fontSize: "16px",
                                                    fontWeight: 500,
                                                    mb: "4px",
                                                },

                                                secondary: {
                                                    fontSize: "14px",
                                                }
                                            }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </SimpleBar>
            </Card>
        </>
    );
};

export default MyContacts;
