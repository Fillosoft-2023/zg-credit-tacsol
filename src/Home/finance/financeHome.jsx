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
import { Add, More, Payment, ReportSharp, Search } from '@material-ui/icons';
import PaymentDialog from './paymentDialog';
import PaymentReport from './paymentReport';
import TransDates from '../../consts/transDates';
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const category = [
    {
        name: "Personal",
        value: "Personal"
    },
    {
        name: "Business",
        value: "Business"
    },
    {
        name: "Mortgage",
        value: "Mortgage"
    },
]

export default function FinanceHome() {
    const classes = style();
    const history = useHistory()
    const [sendData, setSendData] = React.useState({});
    const [loading, setLoading] = React.useState(false)
    const [loading2, setLoading2] = React.useState(false)

    const [massg, setMassg] = React.useState({})
    const [err, setErr] = React.useState({})
    const today = new Date()
    const [data, setData] = React.useState([]);
    const [menu, setMenu] = React.useState(null);
    const [selected, setSelected] = React.useState({});
    const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
    const [paymentReportOpen, setPaymentReportOpen] = React.useState(false);
    const [paymentReports, setPaymentReports] = React.useState([]);
    const [selectedPaymentReport, setSelectedPaymentReport] = React.useState({});
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

        if (!sendData.name) {
            isValidate = false
            err['name'] = true
        }
        if (!sendData.type) {
            isValidate = false
            err['type'] = true
        }
        if (!sendData.amount) {
            isValidate = false
            err['amount'] = true
        }
        if (!sendData.date) {
            isValidate = false
            err['date'] = true
        }

        if (!sendData.ph_no) {
            isValidate = false
            err['ph_no'] = true
        }
        if (!sendData.interest) {
            isValidate = false
            err['interest'] = true
        }
        if (!sendData.other_charges) {
            isValidate = false
            err['other_charges'] = true
        }
        if (!sendData.total) {
            isValidate = false
            err['total'] = true
        }

        setErr(err)
        return isValidate;
    }
    const [mssg, setMssg] = React.useState()
    const send = () => {
        if (validated()) {
            setLoading(true)
            fetch(Api + 'createFinance', {
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
                massg: 'Please Fill  All Required Fields'
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
        const sesDate = JSON.parse(sessionStorage.getItem('cash_date'))
        if (!sesDate === false) {
            setDate(sesDate)
        }

        console.log(sesDate)
        setLoading2(true)

        fetch(Api + 'finances', {
            method: 'POST',
            body: JSON.stringify(date)
        })
            .then(res => res.json())
            .then(res => {
                setExpense(res)
                setLoading2(false)

            })
            .catch(err => {
                console.log(err)
            })
    }, [refresh, massg])


    const handlePaymentDialogOpen = (item) => {
        setPaymentDialogOpen(true);
        setSelected(item);
        setMenu(null);
    };
    const handlePaymentReportOpen = (item) => {
        const calculatedReports = item.paymentReports || [];

        const paymentReports = calculatedReports.map((report) => ({
            ...report,
            dueAmount: (report.paymentAmount),
        }));

        setPaymentReports(paymentReports);
        setSelectedPaymentReport(item);
        setPaymentReportOpen(true);
    };


    return (
        <Container maxWidth="xxl" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
                <Typography variant='h5' style={{ fontWeight: 'bold' }}>
                    Finance Home
                </Typography>
            </Toolbar>
            <Grid container spacing={0}>
                <Grid item xs={12} sm={3} >
                    <div style={{ margin: 10, marginTop: 0 }}>
                        <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                                Add New Finance
                            </Typography>
                        </Toolbar>
                        {loading ? <LinearProgress /> : ''}


                        <Paper style={{ padding: 10 }}>
                            <TextField
                                label="Name"
                                fullWidth
                                variant='outlined'
                                className={classes.input}
                                rows="3"
                                name="name"
                                error={err.name}
                                value={sendData.name}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Phone Number"
                                fullWidth
                                variant='outlined'
                                className={classes.input}
                                type="number"
                                name="ph_no"
                                error={err.ph_no}
                                value={sendData.ph_no}
                                onChange={handleChange}
                            />
                            <FormControl variant="outlined" className={classes.input} fullWidth>
                                <InputLabel id="demo-simple-select-outlined-label">Finance Type</InputLabel>
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
                            <TransDates
                                label="Issue Date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                variant='outlined'
                                rows="3"
                                type="date"
                                name="date"
                                error={err.date}
                                value={sendData.date}
                                onChange={handleChange}
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
                                style={{ marginTop: 10 }}
                            />
                            <TextField
                                label="Interest"
                                fullWidth
                                variant='outlined'
                                className={classes.input}
                                type="number"
                                name="interest"
                                error={err.interest}
                                value={sendData.interest}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Other Charges"
                                fullWidth
                                variant='outlined'
                                className={classes.input}
                                type="number"
                                name="other_charges"
                                error={err.other_charges}
                                value={sendData.other_charges}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Total"
                                fullWidth
                                variant='outlined'
                                className={classes.input}
                                type="number"
                                name="total"
                                error={err.total}
                                value={sendData.total}
                                onChange={handleChange}
                            />

                            <Button variant="contained" fullWidth size='small' onClick={send} color="primary" >
                                Save
                            </Button>
                        </Paper>
                    </div>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Paper >
                        <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                                    My Finances
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
                                <Button onClick={() => setRefresh(Math.random())} variant='contained' color='primary' style={{ marginRight: 5 }}>
                                    <Search />
                                </Button>
                            </div>
                        </Toolbar>
                        {loading2 ? <LinearProgress /> : ''}



                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sl.No</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Issue Date</TableCell>
                                        <TableCell>Interest</TableCell>
                                        <TableCell>Other Charges</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>Payment</TableCell>
                                        <TableCell>Report</TableCell>
                                        <TableCell>More</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        expense.map((item, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>{item.type}</TableCell>
                                                    <TableCell>Rs.{item.amount}</TableCell>
                                                    <TableCell>{DateHandler(item.date)}</TableCell>
                                                    <TableCell>Rs.{item.interest}</TableCell>
                                                    <TableCell>Rs.{item.other_charges}</TableCell>
                                                    <TableCell>Rs.{item.total}</TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={() => handlePaymentDialogOpen(item)}>
                                                            <Payment />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant='contained' color='primary' size='small' onClick={() => handlePaymentReportOpen(item)}>
                                                            Report
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant='contained' color='secondary' size='small'>
                                                            More
                                                        </Button>
                                                    </TableCell>

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
            <PaymentDialog
                open={paymentDialogOpen}

                // onSubmit={handlePaymentSubmit}
                selectedFinance={selected}
                data={data} // Pass the data array
                setData={setData} // Pass the setData function
                setMenu={setPaymentDialogOpen}
                setMssg={setMassg}
            />
            <PaymentReport
                open={paymentReportOpen}
                onClose={() => setPaymentReportOpen(false)}
                paymentReports={paymentReports}
                selectedPaymentReport={selectedPaymentReport} // Pass selectedPaymentReport as prop
            />
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