"use client"

import React from 'react';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import Events, { EventType } from '@/app/(DashboardLayout)/EventData';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import dayjs, { Dayjs } from 'dayjs';
import PageContainer from '@/app/components/container/PageContainer';
import { IconCheck } from '@tabler/icons-react';
import BlankCard from '@/app/components/shared/BlankCard';
import Breadcrumb from '../../layout/shared/breadcrumb/Breadcrumb';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Calendar',
  },
];

const BigCalendar = () => {
  const [calevents, setCalEvents] = React.useState<EventType[]>(Events);
  const [open, setOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>("");
  const [slot, setSlot] = React.useState<EventType>();
  const [start, setStart] = React.useState<Dayjs | null>(dayjs());
  const [end, setEnd] = React.useState<Dayjs | null>(dayjs());
  const [color, setColor] = React.useState<string>("default");
  const [update, setUpdate] = React.useState<EventType | null>(null);

  const ColorVariation = [
    {
      id: 1,
      eColor: '#1a97f5',
      value: 'default',
    },
    {
      id: 2,
      eColor: '#39b69a',
      value: 'green',
    },
    {
      id: 3,
      eColor: '#fc4b6c',
      value: 'red',
    },
    {
      id: 4,
      eColor: '#615dff',
      value: 'azure',
    },
    {
      id: 5,
      eColor: '#fdd43f',
      value: 'warning',
    },
  ];
  const addNewEventAlert = (slotInfo: EventType) => {
    setOpen(true);
    setSlot(slotInfo);
    setStart(dayjs(slotInfo.start));
    setEnd(dayjs(slotInfo.end));
  };


  const editEvent = (event: EventType) => {
    const newEditEvent = calevents.find(
      (elem) => elem.title === event.title
    );
    if (!newEditEvent) {
      console.warn("Event not found:", event.title);
      return;
    }
    setTitle(newEditEvent.title ?? "");
    setColor(newEditEvent.color ?? "default");
    setStart(dayjs(newEditEvent.start));
    setEnd(dayjs(newEditEvent.end));
    setUpdate(event);
    setOpen(true);
  };




  const updateEvent = (e: { preventDefault: () => void; }) => {
    e.preventDefault();


    if (!update) return;

    setCalEvents(
      calevents.map((elem: EventType) => {
        if (elem.title === update.title) {
          return { ...elem, title, start: start?.toISOString(), end: end?.toISOString(), color };
        }
        return elem;
      })
    );
    setOpen(false);
    setTitle("");
    setStart(dayjs());
    setEnd(dayjs());
    setUpdate(null);
  };
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const selectinputChangeHandler = (id: string) => setColor(id);

  // When submitting or updating the event
  const submitHandler = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const newEvents = [...calevents];
    newEvents.push({
      title,
      start: start ? start.toISOString() : "",
      end: end ? end.toISOString() : "",
      color,
    });
    setCalEvents(newEvents);
    setOpen(false);
    setTitle("");
    setStart(dayjs());
    setEnd(dayjs());
  };



  const deleteHandler = (event: EventType) => {
    const updatecalEvents = calevents.filter(
      (ind: EventType) => ind.title !== event.title
    );
    setCalEvents(updatecalEvents);
  };

  const handleClose = () => {
    // eslint-disable-line newline-before-return
    setOpen(false);
    setTitle("");
    setStart(dayjs());
    setEnd(dayjs());
    setUpdate(null);
  };

  const eventColors = (event: EventType) => {
    if (event.color) {
      return { className: `event-${event.color}` };
    }

    return { className: `event-default` };
  };

  const handleStartChange = (newValue: Dayjs | null) => {
    setStart(newValue);
  };

  const handleEndChange = (newValue: Dayjs | null) => {
    setEnd(newValue);
  };


  return (
    <PageContainer title="Calendar" description="this is Calendar">
      <Breadcrumb title="Calendar" items={BCrumb} />
      <BlankCard>
        {/* ------------------------------------------- */}
        {/* Calendar */}
        {/* ------------------------------------------- */}
        <CardContent>
          <Calendar
            selectable
            events={calevents}
            defaultView="month"
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            localizer={localizer}
            style={{ height: 'calc(100vh - 350px' }}
            onSelectEvent={(event) => editEvent(event)}
            onSelectSlot={(slotInfo) => addNewEventAlert(slotInfo)}
            eventPropGetter={(event) => eventColors(event)}
          />
        </CardContent>
      </BlankCard>
      {/* ------------------------------------------- */}
      {/* Add Calendar Event Dialog */}
      {/* ------------------------------------------- */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <form onSubmit={update ? updateEvent : submitHandler}>
          <DialogContent>
            {/* ------------------------------------------- */}
            {/* Add Edit title */}
            {/* ------------------------------------------- */}
            <Typography variant="h4" sx={{ mb: 2 }}>
              {update ? 'Update Event' : 'Add Event'}
            </Typography>
            <Typography mb={3} variant="subtitle2">
              {!update
                ? 'To add Event kindly fillup the title and choose the event color and press the add button'
                : 'To Edit/Update Event kindly change the title and choose the event color and press the update button'}
              {slot?.title}
            </Typography>

            <TextField
              id="Event Title"
              placeholder="Enter Event Title"
              variant="outlined"
              fullWidth
              label="Event Title"
              value={title}
              sx={{ mb: 3 }}
              onChange={inputChangeHandler}
            />
            {/* ------------------------------------------- */}
            {/* Selection of Start and end date */}
            {/* ------------------------------------------- */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={start}
                onChange={handleStartChange}
                slotProps={{
                  textField: {
                    label: "Start Date",
                    fullWidth: true,
                    sx: { mb: 3 },
                  },
                }}
              />

              <DatePicker
                value={end}
                onChange={handleEndChange}
                slotProps={{
                  textField: {
                    label: "End Date",
                    fullWidth: true,
                    sx: { mb: 3 },
                    // error: start && end && start > end,
                    error: Boolean(start && end && start > end),
                    helperText: start && end && start > end ? "End date must be later than start date" : "",
                  },
                }}
              />
            </LocalizationProvider>

            {/* ------------------------------------------- */}
            {/* Calendar Event Color*/}
            {/* ------------------------------------------- */}
            <Typography variant="h6" fontWeight={600} my={2}>
              Select Event Color
            </Typography>
            {/* ------------------------------------------- */}
            {/* colors for event */}
            {/* ------------------------------------------- */}
            {ColorVariation.map((mcolor) => {
              return (
                <Fab
                  color="primary"
                  style={{ backgroundColor: mcolor.eColor }}
                  sx={{
                    marginRight: '3px',
                    transition: '0.1s ease-in',
                    scale: mcolor.value === color ? '0.9' : '0.7',
                  }}
                  size="small"
                  key={mcolor.id}
                  onClick={() => selectinputChangeHandler(mcolor.value)}
                >
                  {mcolor.value === color ? <IconCheck width={16} /> : ''}
                </Fab>
              );
            })}
          </DialogContent>
          {/* ------------------------------------------- */}
          {/* Action for dialog */}
          {/* ------------------------------------------- */}
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>

            {update ? (
              <Button
                type="submit"
                color="error"
                variant="contained"
                onClick={() => deleteHandler(update)}
              >
                Delete
              </Button>
            ) : (
              ''
            )}
            <Button type="submit" disabled={!title} variant="contained">
              {update ? 'Update Event' : 'Add Event'}
            </Button>
          </DialogActions>
          {/* ------------------------------------------- */}
          {/* End Calendar */}
          {/* ------------------------------------------- */}
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default BigCalendar;