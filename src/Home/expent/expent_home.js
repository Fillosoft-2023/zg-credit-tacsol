import React from 'react'
import {
    Typography,
    Container,
    Grid,
    Paper,
    TextField,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    makeStyles,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    LinearProgress,
    IconButton,
    Toolbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

} from '@material-ui/core'

import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom'
import ReduceProperty from './propertyReducer'
import DateHandler from '../../consts/date_format';
import Api from '../../api/api'
import SnakBar from '../../consts/message'
import { Add, AddCircle, Search } from '@material-ui/icons';
import TransDates from '../../consts/transDates';
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function Expent() {
    const classes = style();
    const [open, setOpen] = React.useState(false);
    const [newExpenseReason, setNewExpenseReason] = React.useState('');
    const [expenseReasons, setExpenseReasons] = React.useState([]);
    const history = useHistory()
    const [sendData, setSendData] = React.useState({});
    const [loading, setLoading] = React.useState(false)
    const [massg, setMassg] = React.useState({})
    const [err, setErr] = React.useState({})
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [date, setDate] = React.useState({
        to: new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
    })
    var dates = new Date();
    var components = [
        dates.getYear(),
        dates.getMonth(),
        dates.getDate(),
        dates.getHours(),
        dates.getMinutes(),
        dates.getSeconds(),
        dates.getMilliseconds()
    ];

    var reffer_id = components.join("");

    const [expense, setExpense] = React.useState([])
    const [refresh, setRefresh] = React.useState(Math.random())
    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        let selectedExpenseReason = expenseReasons.find(reason => reason.name === value);

        setSendData(prevData => ({
            ...prevData,
            [name]: value,
            reffer_id: reffer_id,
            expenseReason: selectedExpenseReason || null,
        }));
    };

    const handleExpenseChange = (event) => {
        setNewExpenseReason(event.target.value);
    };
    const validated = () => {
        let isValidate = true
        let err = {}

        if (!sendData.amount) {
            isValidate = false
            err['amount'] = true
        }
        if (!sendData.type) {
            isValidate = false
            err['type'] = true
        }
        if (!sendData.detail) {
            isValidate = false
            err['detail'] = true
        }
        if (!sendData.date) {
            isValidate = false
            err['date'] = true
        }

        setErr(err)
        return isValidate;
    }
    const [mssg, setMssg] = React.useState()
    const send = () => {
        if (validated()) {
            setLoading(true)
            fetch(Api + 'expent', {
                method: 'POST',
                body: JSON.stringify(sendData)
            })
                .then(res => res.json(sendData))
                .then(res => {
                    setLoading(false)
                    if (res.code === 200) {
                        setMassg({
                            open: true,
                            severity: 'success',
                            massg: res.massg
                        })
                    } else {
                        setMassg({
                            open: true,
                            severity: 'error',
                            massg: res.massg
                        })
                    }
                })
                .catch(err => {
                    setLoading(false)
                    setMassg({
                        open: true,
                        severity: 'error',
                        massg: 'Faild to connect to the server'
                    })
                })
        } else {
            setMassg({
                open: true,
                severity: 'error',
                massg: 'Please fill all required filled'
            })
        }
    }

    const handleDate = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setDate({
            ...date,
            [name]: value,

        })
    }
    React.useEffect(async () => {
        setLoading(true)
        const sesDate = JSON.parse(sessionStorage.getItem('cash_date'))
        if (!sesDate === false) {
            setDate(sesDate)
        }        fetch(Api + 'expentSearch', {
            method: 'POST',
            body: JSON.stringify(date)
        })
            .then(res => res.json())
            .then(res => setExpense(res))
            .catch(err => {
                console.log(err)
            })
    }, [refresh])



    React.useEffect(async () => {
        setLoading(true)
        const sesDate = JSON.parse(sessionStorage.getItem('cash_date'))
        if (!sesDate === false) {
            setDate(sesDate)
        }
        fetch(Api + 'expenseReasons')
            .then(res => res.json())
            .then(res => {
                setExpenseReasons(res);
            })
            .catch(err => {
                console.error("Failed to fetch expense reasons:", err);
            });
    }, [refresh]);

    const handleSettingsClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleDialogSave = () => {
        const sendData = new FormData();
        sendData.append("name", newExpenseReason);
        fetch(Api + "addExpenseReason", {
            method: "POST",
            body: sendData,
        })
            .then((res) => res.json())
            .then((res) => {
                setLoading(false);
                if (res) {
                    if (res.code === 200) {
                        setRefresh(Math.random())
                        setOpen(false)
                        setMassg({
                            open: true,
                            massg: "Reason Add Successful",
                            severity: "success"
                        });
                        setNewExpenseReason("");
                    } else {
                        setMassg({
                            open: true,
                            massg: "Something Went Wrong",
                            severity: "error"
                        });
                    }
                } else {
                    setMassg({
                        open: true,
                        massg: "Failed To Connect to The Server",
                        severity: "error"
                    });
                }
            })
            .catch((err) => {
                setLoading(false);
                setMssg({
                    open: true,
                    massg: "Failed To Connect to The Server",
                    severity: "error"
                });
            });
    };
    let sum = 0
    return (
        <Container maxWidth="xxl" style={{ height: '90vh', padding: 0 }}  >
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
                <Typography variant='h5' style={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Expenses
                </Typography>
            </Toolbar>

            <Grid container spacing={2}>

                <Grid item xs={12} sm={3} >

                    <div style={{ padding: 0 }}>
                        <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                Add New Expense
                            </Typography>
                        </Toolbar>

                        <Paper style={{ padding: 10 }}>
                            <TextField
                                label="Amount"
                                fullWidth
                                variant='outlined'
                                className={classes.input}
                                type="number"
                                name="amount"
                                error={err.amount}
                                value={sendData.amount}
                                onChange={handleChange}
                            />
                            <div style={{ display: 'flex' }}>
                                <FormControl variant="outlined" className={classes.input} fullWidth>
                                    <InputLabel id="demo-simple-select-outlined-label">Expense reason</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        name="type"
                                        error={err.type}
                                        value={sendData.type}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={false}>
                                            <em>None</em>
                                        </MenuItem>

                                        {expenseReasons.map((item, index) => (
                                            <MenuItem key={index} value={item.name}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <IconButton color='primary' onClick={handleSettingsClick}>
                                    <AddCircle />
                                </IconButton>
                            </div>
                            <TransDates
                                label="Date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                variant='outlined'
                                className={classes.input}
                                rows="3"
                                type="date"
                                name="date"
                                error={err.date}
                                value={sendData.date}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Details"
                                fullWidth
                                variant='outlined'
                                className={classes.input}
                                rows="3"
                                name="detail"
                                error={err.detail}
                                value={sendData.detail}
                                onChange={handleChange}
                                style={{marginTop:10}}
                            />
                            <Button fullWidth size='small' variant="contained" onClick={send} color="primary" >
                                Save
                            </Button>
                            <ReduceProperty />
                        </Paper>
                    </div>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <Typography style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                Expenses
                            </Typography>
                        </div>

                        <div>
                            <TextField
                                type="date"
                                variant="outlined"
                                size="small"
                                name="to"
                                value={date.to}
                                onChange={handleDate}

                            />
                            <TextField
                                type="date"
                                variant="outlined"
                                size="small"
                                name="from"
                                style={{ marginLeft: 10, marginRight: 10 }}
                                value={date.from}
                                onChange={handleDate}

                            />
                            <Button onClick={() => setRefresh(Math.random())} variant='contained' color='primary' style={{ marginLeft: 5, marginRight: 5 }}>
                                <Search />
                            </Button>
                        </div>
                    </Toolbar>


                    <Paper component={Paper} variant='outlined'>


                        <div className={classes.table}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Details</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>User</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            expense.map((item, index) => {
                                                sum += Number(item.amount)
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell>{DateHandler(item.date)}</TableCell>
                                                        <TableCell>{item.type}</TableCell>
                                                        <TableCell>{item.detail}</TableCell>
                                                        <TableCell>{item.amount}</TableCell>
                                                        <TableCell>{item.user}</TableCell>


                                                    </TableRow>
                                                )
                                            })
                                        }
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>Total</TableCell>
                                            <TableCell>{sum}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Expense Reasons</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Expense Reason"
                        fullWidth
                        value={newExpenseReason}
                        onChange={handleExpenseChange}
                        style={{ marginTop: 10 }}
                        error={err.newExpenseReason}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDialogSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <SnakBar massg={massg} setMassg={setMassg} />
        </Container>
    )
}

const style = makeStyles(() => ({
    input: {
        marginBottom: 10,
    },
    leftContainer: {
        padding: 10,
    },
    dateBar: {
        padding: 5,
        display: 'flex',
        justifyContent: 'space-between'
    },
    table: {
        marginTop: 5,
        maxHeight: '77vh',

        overflowX: 'auto',
        '&::-webkit-scrollbar': {
            width: '0.4em',

            backgroundColor: 'rgba(0,0,0,0,0)'
        },

        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',

            borderRadius: 4,

        },
    }

}))