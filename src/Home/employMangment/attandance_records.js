import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Api from '../../api/api';
import './a.css'
import { format } from 'date-fns';
import { Box, Container, Divider, LinearProgress, Paper, TextField, Toolbar, Typography } from '@material-ui/core';
const AttendanceCalendar = (props) => {
  let Dataes = props.location.state.data
  const [selectedDates, setSelectedDates] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth())
  const [loading,setLoading] = React.useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  useEffect(() => {
    console.log(month)
    setLoading(true)
    fetch(Api+'attandance_records',{
        method : 'post',
        body : JSON.stringify({id: Dataes.id,month: month})
    })
      .then((response) => response.json())
      .then((data) => {
        
        setLoading(false)
        const attendDates = data.map((record) => new Date(record.date_time));
        console.log(attendDates)
        setSelectedDates(attendDates);
        setAttendanceData(data);
      })
      .catch((error) => {
        alert('Faild to connect to the server')
        setLoading(false)
      });
  }, [Dataes,month]);



const tileContent = ({ date }) => {
  const dateString = format(date, 'yyyy-MM-dd');
  const isDateSelected = attendanceData.some((record) => {
    const recordDate = format(new Date(record.date_time), 'yyyy-MM-dd');
    return recordDate === dateString;
  });

  return isDateSelected ? (
    <div style={{ position: 'relative' }}>
        <div
          style={{
            backgroundColor: 'green',
            width: 10,
            height: 10,
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        ></div>
      </div>
  ) : <div style={{ position: 'relative' }}>
  <div
    style={{
      backgroundColor: 'red',
      width: 5,
      height: 5,
      borderRadius: '50%',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}
  ></div>
</div>;
};

  
  
  
  
  

  return (
    <Container component={Paper}>
      <Toolbar style={{justifyContent : 'space-between'}}>
          <Typography variant='h5'>Attendance Calendar</Typography>
          <TextField
                type="month"
                variant="outlined"
                size="small"
                name="from"
                style={{marginLeft: 10,}}
                value={month}
                onChange={(event) => {
                  const dateParts = event.target.value.split('-');
                  const selectedDate = new Date(dateParts[0], dateParts[1] - 1, 1);
                  setSelectedMonth(selectedDate);
                  setMonth(event.target.value)
                }}
                
            />
      </Toolbar>
      <Divider />
      {
        loading ? <LinearProgress /> : ''
      }
      <Box style={{display : 'flex', flexDirection: 'column', justifyContent : 'center', marginTop : 20, width : '100%', alignItems : 'center'}}>
      <Calendar
         tileContent={tileContent}
         value={selectedMonth}
         onChange={setSelectedMonth}
      />
      <h3>Attendance Records:</h3>
      {attendanceData.length === 0 ? (
        <p>No attendance records found</p>
      ) : (
        <ul>
          {attendanceData.map((record) => (
            <li key={record.id}>
              Employee ID: {record.em_id}, Date: {record.date_time}, Status: {record.status}
            </li>
          ))}
        </ul>
      )}
      </Box>
    </Container>
  );
};

export default AttendanceCalendar;
