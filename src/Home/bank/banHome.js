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
    Snackbar,
    LinearProgress,
    Toolbar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom'
import DateHandler from '../../consts/date_format';
import SnakBar from '../../consts/message'
import Api from '../../api/api'
import { Add, Close, Edit, Print, Settings } from '@material-ui/icons';
import AllBanks from './allBanks';
import BankTransaction from './bankTransaction';
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import TransDates from '../../consts/transDates';

export default function Expent(props) {
    const classes = style();
    const history = useHistory()
    const [open, setOpen] = React.useState(false);
    const [openView, setOpenView] = React.useState(false);
    const [refresh, setRefresh] = React.useState(4)
    const [sendData, setSendData] = React.useState({});
    const [loading, setLoading] = React.useState(false)
    const [massg, setMassg] = React.useState({})
    const [err, setErr] = React.useState({})
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [dates, setDate] = React.useState({
        to: new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
        press: "bankSer"
    })
    const [expense, setExpense] = React.useState([])
    const [newBankName, setNewBankName] = React.useState('');
    const [sendBankData, setSendBankData] = React.useState({});
    const [bankNames, setBankNames] = React.useState([]);



    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setSendData({
            ...sendData,
            [name]: value,
        })
    }
    const handleBankChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setSendBankData({
            ...sendBankData,
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
        if (!sendData.remarks) {
            isValidate = false
            err['remarks'] = true
        }
        if (!sendData.bank_name) {
            isValidate = false
            err['bank_name'] = true
        }
        if (!sendData.date) {
            isValidate = false
            err['date'] = true
        } if (sum - minus < 0) {
            isValidate = false
            setMassg({
                open: true,
                severity: 'error',
                massg: 'Faild, Insuficiant fund'
            })
        }

        setErr(err)
        return isValidate;
    }
    const [mssgs, setMssg] = React.useState()
    const send = () => {
        setSendData({
            ...sendData,
            amount: '',
            remarks: '',
            date: '',
            bank_name: '',

        })
        if (validated()) {
            setLoading(true)
            fetch(Api + 'bankUp', {
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

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(Api + 'bankNames');
                const data = await response.json();
                setBankNames(data);
            } catch (err) {
                console.error("Failed to fetch bank names:", err);
            }
        };

        fetchData();

        return () => {
            // Cleanup function to cancel any pending requests, subscriptions, etc.
            // This will execute when the component unmounts or when `refresh` changes.
            // You can add any cleanup logic here.
        };
    }, [refresh]);

    const handleAddClick = () => {
        setOpen(true);
    };
    const handleViewClick = () => {
        history.push(props.match.path + '/AllBanks')
    };

    const handleDialogClose = () => {
        setOpen(false);
        setOpenView(false);

    };
    const handleDialogSave = () => {

        fetch(Api + "addBank", {
            method: "POST",
            body: JSON.stringify(
                sendBankData
            ),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res)
                setLoading(false);
                if (res) {
                    if (res.code === 200) {
                        setRefresh(Math.random())
                        setOpen(false)
                        setMassg({
                            open: true,
                            massg: "Bank Added Successfully",
                            severity: "success"
                        });
                        setNewBankName("");
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

    let sum = 0;
    let minus = 0;
    return (
        <Container maxWidth="false" style={{ minHeight: '90vh', padding: 0 }}  >
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <div>
                    <Typography variant='h5' style={{ fontWeight: 'bold' }}>
                        Bank Home
                    </Typography>
                </div>
                <div>
                    <Button variant='contained' color='primary' size='small' style={{ marginRight: 5 }} onClick={handleAddClick}>
                        Add Bank
                    </Button>
                    <Button variant='contained' color='primary' size='small' onClick={handleViewClick}>
                        All Banks
                    </Button>

                </div>

            </Toolbar>

            <Grid container spacing={0}>
                <Grid item xs={12} sm={3} >
                    {loading ? <LinearProgress /> : ''}
                    <div style={{margin:10,marginTop:0}}>
                        <Toolbar component={Paper} style={{display:'flex',justifyContent:'center'}}>
                            <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                                Add New
                            </Typography>
                        </Toolbar>
                        <Paper style={{padding:10}}>
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
                                <InputLabel id="demo-simple-select-outlined-label">Transaction Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    // error={err.rdfreq}
                                    // value={data.rdfreq}
                                    // onChange={handleChange}
                                    label="Type"

                                    name="type"
                                    error={err.type}
                                    value={sendData.type}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={false}>
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'Deposit'}>Deposit</MenuItem>
                                    <MenuItem value={'Withdrawal'}>Withdrawal</MenuItem>
                                    <MenuItem value={'Interst'}>Interest Deposit</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Date"
                                InputLabelProps={{shrink: true}}
                                fullWidth
                                variant='outlined'
                                rows="3"
                                type="date"
                                name="date"
                                error={err.date}
                                value={sendData.date}
                                onChange={handleChange}
                            />
                            <div style={{ display: 'flex',marginTop:10 }}>
                                <FormControl variant="outlined" className={classes.input} fullWidth>

                                    <InputLabel id="demo-simple-select-outlined-label"> Bank Name</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        name="bank_name"
                                        error={err.bank_name}
                                        value={sendData.bank_name}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={false}>
                                            <em>None</em>
                                        </MenuItem>

                                        {bankNames.map((item, index) => (
                                            <MenuItem key={index} value={item.reffer_id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <IconButton onClick={handleAddClick}>
                                    <Add />
                                </IconButton>
                            </div>
                            <TextField
                                label="Remarks"
                                fullWidth
                                variant='outlined'
                                className={classes.input}
                                rows="3"
                                name="remarks"
                                error={err.remarks}
                                value={sendData.remarks}
                                onChange={handleChange}
                            />
                            <Button size='small' fullWidth variant="contained" onClick={() => send()} color="primary" >
                                Save
                            </Button>
                        </Paper>
                    </div>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Switch>
                        <Route exact path={props.match.path} component={BankTransaction} />
                        <Route path={`${props.match.path}/AllBanks`} component={AllBanks} />
                    </Switch>

                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleDialogClose}>
                <Toolbar component={Paper}>
                    <Typography style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        Add New Bank
                    </Typography>
                </Toolbar>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Account Holder Name"
                                fullWidth
                                variant="outlined"
                                value={sendBankData.ac_holder_name}
                                onChange={handleBankChange}
                                style={{ marginTop: 10 }}
                                name='ac_holder_name'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                label="Bank Name"
                                fullWidth
                                value={sendBankData.name}
                                onChange={handleBankChange}
                                style={{ marginTop: 10 }}
                                name='name'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                label="Bank IFSC"
                                fullWidth
                                value={sendBankData.ifsc}
                                onChange={handleBankChange}
                                style={{ marginTop: 10 }}
                                name='ifsc'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"

                                label="Bank Branch"
                                fullWidth
                                value={sendBankData.branch}
                                onChange={handleBankChange}
                                style={{ marginTop: 10 }}
                                name='branch'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                label="Account Number"
                                fullWidth
                                value={sendBankData.ac_no}
                                onChange={handleBankChange}
                                style={{ marginTop: 10 }}
                                name='ac_no'
                            />
                        </Grid>


                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button variant='contained' size='small' onClick={handleDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button variant='contained' size='small' onClick={handleDialogSave} color="primary">
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