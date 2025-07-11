"use client"
import React, { useContext, useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { IconStar, IconAlertCircle, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import { EmailContext } from "@/app/context/EmailContext";

import dynamic from 'next/dynamic';

const TiptapEditor = dynamic(() => import('@/app/components/forms/form-tiptap/TiptapEditor'), {
  ssr: false,
});

const EmailContent = () => {


  const { selectedEmail, deleteEmail, toggleStar, toggleImportant, setSelectedEmail }: any =
    useContext(EmailContext);



  const handleDelete = () => {
    if (selectedEmail) {
      deleteEmail(selectedEmail.id);
    }
  };



  const [show, setShow] = useState(false);


  const toggleEditor = () => {
    setShow(!show);
  };


  const theme = useTheme();

  const warningColor = theme.palette.warning.main;
  const errorColor = theme.palette.error.light;



  return selectedEmail ? (
    <Box>
      <Stack p={2} gap={0} direction="row">
        <Tooltip title={selectedEmail.starred ? 'Unstar' : 'Star'}>
          <IconButton onClick={() => toggleStar(selectedEmail.id)}>
            <IconStar
              stroke={1.3}
              size="18"
              style={{
                fill: selectedEmail.starred ? warningColor : '',
                stroke: selectedEmail.starred ? warningColor : '',
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title={selectedEmail ? 'Important' : 'Not Important'}>
          <IconButton onClick={() => toggleImportant(selectedEmail.id)}>
            <IconAlertCircle
              size="18"
              stroke={1.3}
              style={{
                fill: selectedEmail.important ? errorColor : '',
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete} >
            <IconTrash size="18" stroke={1.3} />
          </IconButton>
        </Tooltip>
      </Stack>
      <Divider />
      <Box p={3}>
        {/* ------------------------------------------- */}
        {/* Email Detail page */}
        {/* ------------------------------------------- */}
        <Box display="flex" alignItems="center" sx={{ pb: 3 }}>
          <Avatar alt={selectedEmail.from} src={selectedEmail.thumbnail} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6">{selectedEmail.from}</Typography>
            <Typography variant="body2">{selectedEmail.To}</Typography>
          </Box>
          <Chip
            label={selectedEmail.label}
            sx={{ ml: 'auto', height: '21px' }}
            size="small"
            color={
              selectedEmail.label === 'Promotional'
                ? 'primary'
                : selectedEmail.label === 'Social'
                  ? 'error'
                  : 'success'
            }
          />
        </Box>
        {/* ------------------------------------------- */}
        {/* Email Detail page */}
        {/* ------------------------------------------- */}

        <Box sx={{ py: 2 }}>
          <Typography variant="h4">{selectedEmail.subject}</Typography>
        </Box>

        <Box sx={{ py: 2 }}>
          <div dangerouslySetInnerHTML={{ __html: selectedEmail.emailContent }} />
        </Box>
      </Box>
      {selectedEmail?.attchments?.length == 0 ? null : (
        <>
          <Divider />
          <Box p={3}>
            <Typography variant="h6">Attachments ({selectedEmail?.attchments?.length})</Typography>

            <Grid container spacing={3}>
              {selectedEmail.attchments?.map((attach: any) => {
                return (
                  (<Grid
                    key={attach.id}
                    size={{
                      lg: 4
                    }}>
                    <Stack direction="row" gap={2} mt={2}>
                      <Avatar
                        variant="rounded"
                        sx={{ width: '48px', height: '48px', bgcolor: (theme: any) => theme.palette.grey[100] }}
                      >
                        <Avatar
                          src={attach.image}
                          alt="av"
                          variant="rounded"
                          sx={{ width: '24px', height: '24px' }}
                        ></Avatar>
                      </Avatar>
                      <Box mr={'auto'}>
                        <Typography variant="subtitle2" fontWeight={600} mb={1}>
                          {attach.title}
                        </Typography>
                        <Typography variant="body2">{attach.fileSize}</Typography>
                      </Box>
                    </Stack>
                  </Grid>)
                );
              })}
            </Grid>
          </Box>
          <Divider />
        </>
      )}

      <Box p={3}>
        <Stack direction="row" gap={2}>
          <Button variant="outlined" size="small" color="primary" onClick={toggleEditor}>
            Reply
          </Button>
          <Button variant="outlined" size="small">
            Forward
          </Button>
        </Stack>

        {/* Editor */}
        {show ? (
          <Box mt={3}>
            <Paper variant="outlined">
              <TiptapEditor />
            </Paper>
          </Box>
        ) : null}
      </Box>
    </Box>
  ) : (
    <Box p={3} height="50vh" display={'flex'} justifyContent="center" alignItems={'center'}>
      {/* ------------------------------------------- */}
      {/* If no Email  */}
      {/* ------------------------------------------- */}
      <Box>
        <Typography variant="h4">Please Select a Mail</Typography>

        <br />
        <Image
          src="/images/breadcrumb/emailSv.png"
          alt={"emailIcon"}
          width={250}
          height={250}
        />
      </Box>
    </Box>
  );




}

export default EmailContent;

