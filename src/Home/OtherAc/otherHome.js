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
    Toolbar

} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom'
import DateHandler from '../../consts/date_format';
import Api from '../../api/api'
import SnakBar from '../../consts/message'
import TransDates from '../../consts/transDates';
import { Search } from '@material-ui/icons';

const category = [
    {
        name: "Deposit",
        value: "deposit"
    },
    {
        name: "Withdrwal",
        value: "withdrwal"
    }
]

export default function OtherAc() {
    const classes = style();
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
    const [expense, setExpense] = React.useState([])
    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSendData({
            ...sendData,
            [name]: value,
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
        setSendData({
            ...sendData,
            amount: '',
            detail: '',
            date: ''
        })
        if (validated()) {
            setLoading(true)
            fetch(Api + 'otherTrans', {
                method: 'POST',
                body: JSON.stringify(sendData)
            })
                .then(res => res.json())
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
    const [refresh, setRefresh] = React.useState(Math.random())
    React.useEffect(async () => {
        setLoading(true)
        const sesDate = JSON.parse(sessionStorage.getItem('cash_date'))
        if (!sesDate === false) {
            setDate(sesDate)
        }

        fetch(Api + 'otherAccountSearch', {
            method: 'POST',
            body: JSON.stringify(date)
        })
            .then(res => res.json())
            .then(res => { setExpense(res); setLoading(false) })
            .catch(err => {
                setLoading(false)
            })
    }, [refresh, massg])
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMssg(false);

    };
    let sum = 0
    return (
        <Container maxWidth="false" style={{ padding: 0, }}  >
            <Toolbar component={Paper} style={{ marginBottom: 5, display: 'flex', justifyContent: 'center' }}>
                <Typography style={{ fontWeight: 'bold' }} variant='h6'>
                    OTHER ACCOUNT
                </Typography>
            </Toolbar>
            <Grid container spacing={0}>
                <Grid item xs={12} sm={3} >
                    <div style={{ margin: 10, marginTop: 0 }}>
                        <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                Add New
                            </Typography>
                        </Toolbar>
                        {loading ? <LinearProgress /> : ''}
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
                            <FormControl variant="outlined" className={classes.input} fullWidth>
                                <InputLabel id="demo-simple-select-outlined-label">TransactionType</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    // error={err.rdfreq}
                                    // value={data.rdfreq}
                                    // onChange={handleChange}
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
                                // helperText="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
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
                                style={{ marginTop: 10 }}
                            />
                            <Button size='small' fullWidth variant="contained" onClick={() => send()} color="primary" >
                                Save
                            </Button>
                        </Paper>
                    </div>
                </Grid>
                <Grid item xs={12} sm={9} component={Paper} style={{ height: '81vh' }}>
                    <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                                All Other Accounts
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
                            <Button
                                onClick={() => setRefresh(Math.random())}
                                variant='contained'
                                color='primary'
                                style={{
                                    marginLeft: 5,
                                    marginRight: 5
                                }}>
                                <Search />
                            </Button>
                        </div>
                    </Toolbar>
                    <div className={classes.table}>
                        {loading ? <LinearProgress /> : ''}
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sl No.</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Details</TableCell>
                                        <TableCell>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        expense.map((item, index) => {
                                            sum += Number(item.amount)
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{DateHandler(item.date)}</TableCell>
                                                    <TableCell>{item.type}</TableCell>
                                                    <TableCell>{item.detail}</TableCell>
                                                    <TableCell>{item.amount}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell style={{ fontWeight: 'bold', color: 'green' }}>Total</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', color: 'green' }}>{sum}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
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