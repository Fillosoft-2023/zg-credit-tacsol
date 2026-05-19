import React, { useState } from 'react';
import { Button, Typography, TextField } from '@material-ui/core';
import {
    Container,
    Grid,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Toolbar,
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Api from '../../api/api';
import SnakBar from '../../consts/message';

const TransactionDateChange = () => {
    const [selectedDates, setSelectedDates] = useState([]);
    const [reason, setReason] = useState('');
    const [error, setError] = useState(null);
    const [isCalendarOpen, setCalendarOpen] = useState(true);
    const [loading, setLoading] = useState(false)
    const [massg, setMassg] = useState({})



    const [allowedDates, setAllowedDates] = React.useState([])

    React.useEffect(() => {
        fetch(Api + 'transactionDates', {
            method: 'POST',
            body: JSON.stringify(),
        })
            .then(res => res.json())
            .then(res => setAllowedDates(res))
            .catch(err => {
                console.log(err);
            });
    }, [massg]);


    const handleDateChange = (date) => {
        setSelectedDates([date]);
    };

    const handleReasonChange = (event) => {
        setReason(event.target.value);
    };



    const handleAllowButtonClick = () => {
        setLoading(true);

        const new_Data = {
            date: selectedDates[0],
            reason: reason,
            status: 'allowed',
        };

        fetch(Api + 'addTransactionDate', {
            method: 'POST',
            body: JSON.stringify(new_Data),
        })
            .then(res => res.json())
            .then(res => {
                setLoading(false);
                if (res.code === 200) {
                    setAllowedDates([...allowedDates, new_Data]);
                    setSelectedDates([]);
                    setReason('');
                    setMassg({
                        open: true,
                        severity: 'success',
                        massg: 'Date Enabled Successfully',
                    });
                } else {
                    setMassg({
                        open: true,
                        severity: 'error',
                        massg: 'Something went wrong',
                    });
                }
            })
            .catch(err => {
                setLoading(false);
                setMassg({
                    open: true,
                    severity: 'error',
                    massg: 'Failed to connect to the server',
                });
            });
    };

    const handleDisable = (id) => {
        setLoading(true);

        fetch(Api + 'updateTransactionDate', {
            method: 'POST',
            body: JSON.stringify({ id: id }), // Pass the id in the request body
        })
            .then(res => res.json())
            .then(res => {
                setLoading(false);
                if (res.code === 200) {
                    setMassg({
                        open: true,
                        severity: 'success',
                        massg: 'Date Disabled Successfully',
                    });
                } else {
                    setMassg({
                        open: true,
                        severity: 'error',
                        massg: 'Something went wrong',
                    });
                }
            })
            .catch(err => {
                setLoading(false);
                setMassg({
                    open: true,
                    severity: 'error',
                    massg: 'Failed to connect to the server',
                });
            });
    };

    return (
        <Container maxWidth="false" component={Paper} style={{ padding: 0, minHeight: '84vh' }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <Typography variant="h5">Transaction Date</Typography>
            </Toolbar>
            <Grid container>
                <Grid item sm={6} md={6} lg={6} component={Paper} style={{ padding: 10 }}>
                    <Button onClick={() => setCalendarOpen(!isCalendarOpen)} fullWidth style={{ marginBottom: 10 }}>
                        Allow New Date
                    </Button>

                    {isCalendarOpen && (
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Calendar
                                onChange={(date) => {
                                    handleDateChange(date);
                                    setCalendarOpen(true);
                                }}
                                value={selectedDates[0] || null}
                                style={{ width: '100%' }}
                            />
                        </div>
                    )}

                    <TextField
                        fullWidth
                        label="Allowing Reason"
                        value={reason}
                        onChange={handleReasonChange}
                        style={{ marginBottom: 20, marginTop: 20 }}
                    />

                    <Button variant="contained" color="primary" fullWidth onClick={handleAllowButtonClick}>
                        Allow
                    </Button>

                    {error && <Typography variant="body1" style={{ color: 'red' }}>{error}</Typography>}
                </Grid>
                <Grid item sm={6} md={6} lg={6} component={Paper} style={{ padding: 0 }}>
                    <Button fullWidth style={{ marginBottom: 10 }}>
                        Allowed Dates
                    </Button>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Reason</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allowedDates.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{new Date(row.date).toDateString()}</TableCell>
                                        <TableCell>{row.reason}</TableCell>
                                        <TableCell>
                                            <Button color="error" variant='contained' size='small' onClick={() => handleDisable(row.id)}>
                                                Disable
                                            </Button>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <SnakBar massg={massg} setMassg={setMassg} />

        </Container>
    );
};

export default TransactionDateChange;
