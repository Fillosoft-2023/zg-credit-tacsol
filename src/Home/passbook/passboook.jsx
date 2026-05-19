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

} from '@material-ui/core'

import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom'
import DateHandler from '../../consts/date_format';
import Api from '../../api/api'
import SnakBar from '../../consts/message'
import { Add, Search } from '@material-ui/icons';
import TransDates from '../../consts/transDates';
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const category = [
    {
        name: "New",
        value: "New"
    },
    {
        name: "Renewal",
        value: "Renewal"
    },
]

export default function Passbook() {
    const classes = style();
    const history = useHistory()
    const [sendData, setSendData] = React.useState({});
    const [loading, setLoading] = React.useState(false)
    const [refresh, setRefresh] = React.useState(Math.random())
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
    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSendData({
            ...sendData,
            [name]: value,
            reffer_id: reffer_id,

        })

    }

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
        if (!sendData.ac_no) {
            isValidate = false
            err['ac_no'] = true
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
            fetch(Api + 'addPassbook', {
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
        }
        fetch(Api + 'passbook', {
            method: 'POST',
            body: JSON.stringify(date)
        })
            .then(res => res.json())
            .then(res => setExpense(res))
            .catch(err => {
                console.log(err)
            })
    }, [refresh])



    return (
        <Container maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
                <Typography variant='h5' style={{ fontWeight: 'bold' }}>
                    Passbook
                </Typography>
            </Toolbar>

            <Grid container spacing={2}>

                <Grid item xs={12} sm={3} >
                    {/* {loading ? <LinearProgress /> : ''} */}
                    <div >
                        <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                                Add New
                            </Typography>
                        </Toolbar>
                        <Paper style={{ padding: 10 }}>
                            <TextField
                                label="Registration Number"
                                fullWidth
                                variant='outlined'
                                className={classes.input}
                                rows="3"
                                name="ac_no"
                                error={err.ac_no}
                                value={sendData.ac_no}
                                onChange={handleChange}
                                type='text'
                            />
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
                            <FormControl variant="outlined" className={classes.input} fullWidth>
                                <InputLabel id="demo-simple-select-outlined-label">Passbook Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    label="type"
                                    name="type"
                                    error={err.type}
                                    value={sendData.type}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={false}>
                                        <em>None</em>
                                    </MenuItem>

                                    {
                                        category.map((item, index) => {
                                            return (
                                                <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <TextField
                                label="Date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                variant='outlined'
                                type="date"
                                name="date"
                                error={err.date}
                                value={sendData.date}
                                onChange={handleChange}
                            />

                            <Button variant="contained" onClick={send} fullWidth color="primary" style={{ marginTop: 10 }}>
                                Save
                            </Button>
                        </Paper>
                    </div>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                                All Passbooks
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
                                style={{ marginLeft: 10, }}
                                value={date.from}
                                onChange={handleDate}

                            />
                            <Button onClick={() => setRefresh(Math.random())} variant='contained' color='primary' style={{ marginLeft: 5, marginRight: 5 }}>
                                <Search />
                            </Button>
                        </div>
                    </Toolbar>
                    <Paper className={classes.table}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sl.No</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Reg No.</TableCell>
                                        <TableCell>Amount</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        expense.map((item, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{DateHandler(item.date)}</TableCell>
                                                    <TableCell>{item.type}</TableCell>
                                                    <TableCell>{item.ac_no}</TableCell>
                                                    <TableCell>Rs.{item.amount}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
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
        justifyContent: 'flex-end'
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