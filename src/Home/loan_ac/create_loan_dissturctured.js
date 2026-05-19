import React, { useEffect, useState } from 'react'
import {
    Container,
    Grid,
    TextField,
    makeStyles,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Snackbar,
    Typography,
    Divider,
    Dialog,
    DialogContent,
    Toolbar,
    DialogTitle,
    DialogActions,
    IconButton,
    CircularProgress,
    Switch,
    Paper,
    Table,
    TableContainer,
    TableRow,
    TableCell,
    TableBody,


} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import { Link, useHistory } from 'react-router-dom'
import SettingsIcon from '@material-ui/icons/Settings';
import Api from '../../api/api';
import { ArrowBack } from '@material-ui/icons';
import TransDates from '../../consts/transDates';
import LoaderComponent from '../../consts/loader';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday-2", "Tuesday-2", "Wednesday-2", "Thursday-2", "Friday-2", "Saturday-2", "Sunday-2"]
export default function CreateLoanDisstructured(props) {
    const { query: acno } = props.location.state || {};
    const navigate = useHistory()
    const history = useHistory()
    const classes = useStyle();
    const [data, setData] = React.useState({})
    const [err, setErr] = React.useState({})
    const [mssg, setMssg] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = React.useState(false)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [loan_type, setLoanType] = React.useState([])
    const [massg, setMassg] = React.useState(false)
    const [autoCalc, setAutoCalc] = React.useState(true)
    const [account, setAccount] = React.useState([])
    const [loanint, setLoanint] = React.useState([])
    const [calculatedInterest, setCalculatedInterest] = React.useState(0) // Store calculated interest separately

    React.useEffect(() => {
        fetch(Api + 'govtLoanInt', {
            method: 'POST',
            body: JSON.stringify(),
        })
            .then(res => res.json())
            .then(res => setLoanint(...res))
            .catch(err => {
                console.log(err);
            });
    }, []);

    const handleDialog = () => {
        if (valid()) {
            if (autoCalc) {
                if (data.int_type === 'flat') {
                    handleMths()
                } else {
                    handleMathReducing()
                }

            }
            setDialogOpen(true)
        } else {
            alert('please fill all required filed')
        }
    }
    const handleDialogClose = () => {
        setDialogOpen(false)
    }
    const handleSubmit = () => {
        setDisabled(true)
        if (valid()) {
            setLoading(true)
            fetch(Api + 'loan_create', {
                method: 'POST',
                body: JSON.stringify({ loan_info: data, emi_dates: new_date_list() })
            })
                .then(res => res.json())
                .then(res => {
                    setLoading(false)
                    if (res.code === 200) {
                        setMassg({
                            massg: res.massg,
                            open: true,
                            severity: 'success'
                        })
                        for (var key in data) {
                            data[key] = null;
                        }
                        history.push({ pathname: "/Home/LoanHome/" });
                    } else {
                        setMassg({
                            massg: res.massg,
                            open: true,
                            severity: 'error'
                        })
                        alert(res.massg)
                    }

                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                    setMassg({
                        massg: 'Faild to connect to the server',
                        open: true,
                        severity: 'error'
                    })
                })




        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMssg(false);

    };
    const handleChange = (event) => {
        console.log(autoCalc)
        if (autoCalc) {
            handleMths()
        }
        setDisabled(false)
        let name = event.target.name
        let value = event.target.value
        var date = new Date();
        var components = [
            date.getYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        ];

        var reffer_id = components.join("");
        if (name === 'type') {
            setData({
                ...data,
                [name]: value.loan_type,
                intrestrate: value.interest
            })
        } else {
            setData({
                ...data,
                [name]: value,
                "press": "loan_create",
                "ac_no": props.location.query,
                "reffer_id": reffer_id

            })
        }
    }

    const valid = () => {
        let isValid = true
        let error = {}

        if (!props.location.query) {
            isValid = false
            error['acno'] = true
        }
        if (!data.type) {
            isValid = false
            error['type'] = true
        }
        if (!data.opendate) {
            isValid = false
            error['opendate'] = true
        }
        if (!data.agentid) {
            isValid = false
            error['agentid'] = true
        }
        if (!data.loanamount) {
            isValid = false
            error['loanamount'] = true
        }
        if (!data.intrestrate) {
            isValid = false
            error['intrestrate'] = true
        }
        if (!data.noofemi) {
            isValid = false
            error['noofemi'] = true
        }
        if (!data.emistartingdate) {
            isValid = false
            error['emistartingdate'] = true
        }
        if (!data.emifreq) {
            isValid = false
            error['emifreq'] = true
        }
        if (!data.emiamt) {
            isValid = false
            error['emiamt'] = true
        }
        // if (!data.int_per_emi) {
        //     isValid = false
        //     error['int_per_emi'] = true
        // }
        // if (!data.princ_per_emi) {
        //     isValid = false
        //     error['princ_per_emi'] = true
        // }
        if (!data.totint) {
            isValid = false
            error['totint'] = true
        }
        if (data.emifreq === 7) {
            if (!data.emi_day) {
                isValid = false
                error['emi_day'] = true
            }
        }
        if (!data.int_type) {
            isValid = false
            error['int_type'] = true
        }
        if (!data.noofmonth) {
            isValid = false
            error['noofmonth'] = true
        }
        if (!data.emi_type) {
            isValid = false
            error['emi_type'] = true
        }
        console.log(error)
        setErr(error)
        return isValid
    }
    const new_date_list = () => {
        const dateList = [];
        let frequency = Number(data.emifreq)
        for (let index = 0; index < data.noofemi; index++) {
            let d = new Date(data.emistartingdate);
            // Adjust date based on frequency
            if (frequency === 30) {
                d.setMonth(d.getMonth() + index + 1);
            } else if (frequency === 7) {
                d.setDate(d.getDate() + index * 7);
            } else if (frequency === 1) {
                d.setDate(d.getDate() + index);
            } else if (frequency === 14) {
                d.setDate(d.getDate() + index * 14);
            } else {
                console.error("Unsupported frequency!");
                break;
            }

            dateList.push(d);
        }
        return dateList;
    }
    const handleMths = () => {
        let isCalculated = false
        let freq = null;
        if (data.emifreq === 7) {
            freq = 52
        } else if (data.emifreq === 30) {
            freq = 12
        } else if (data.emifreq === 14) {
            freq = 26
        }
        else if (data.emifreq === 1) {
            freq = 365
        }
        let intForOneMonth = Number(data.loanamount) * (Number(data.intrestrate) / 100);
        let totInt = (Number(intForOneMonth) * Number(data.noofmonth))

        // Store calculated interest separately
        setCalculatedInterest(totInt);

        // Add additional interest to total interest
        let additionalInterest = Number(data.additional_interest) || 0;
        let totalInterestWithAdditional = totInt + additionalInterest;

        let emiAmount = ((Number(totalInterestWithAdditional) + Number(data.loanamount)) / Number(data.noofemi)).toFixed(2);
        let totAmt = Number(data.loanamount) + totalInterestWithAdditional;
        let princ_at_one_emi = Number(data.loanamount) / Number(data.noofemi)
        let actual_int_per_emi = totalInterestWithAdditional / Number(data.noofemi)
        let actual_princ_per_emi = Number(data.loanamount) / Number(data.noofemi)
        // govt
        let intForOneMonthGovt = Number(data.loanamount) * (Number(loanint.loan_int) / 100);
        let totIntGovt = (Number(intForOneMonthGovt) * Number(data.noofmonth))
        let emiAmountGovt = ((Number(totIntGovt) + Number(data.loanamount)) / Number(data.noofemi)).toFixed(2);
        let totAmtGovt = Number(data.loanamount) + totIntGovt;
        let actual_int_per_emi_govt = totIntGovt / Number(data.noofemi)
        if (!isNaN(totAmt)) {
            isCalculated = true

            Object.assign(data,
                {
                    emiamt: emiAmount,
                    totint: totalInterestWithAdditional.toFixed(2), // This saves total interest (calculated + additional)
                    totamount: totAmt.toFixed(2),
                    int_per_emi: actual_int_per_emi.toFixed(2),
                    princ_per_emi: actual_princ_per_emi.toFixed(2),
                    // govt
                    emiamtGovt: emiAmountGovt,
                    totintGovt: totIntGovt.toFixed(2),
                    totamountGovt: totAmtGovt.toFixed(2),
                    int_per_emi_govt: actual_int_per_emi_govt.toFixed(2),
                    princ_per_emi: actual_princ_per_emi.toFixed(2)
                });
        }
        return isCalculated;
    }

    const handleMathReducing = () => {
        let freq = null;
        let interest = null;

        if (data.emifreq === 30) {
            freq = 12
            interest = Number(data.intrestrate) / 100
        }
        else if (data.emifreq === 1) {
            freq = 365
            interest = (Number(data.intrestrate) * 12) / (365 * 100)
        }
        const no_of_emi = Number(data.noofemi)
        const loan_amount = Number(data.loanamount)
        const emi = (loan_amount * interest * ((1 + interest) ** no_of_emi)) / ((1 + interest) ** no_of_emi - 1)
        const total_interest = (emi * no_of_emi) - loan_amount

        // Store calculated interest separately
        setCalculatedInterest(total_interest);

        // Add additional interest to total interest for reducing balance method
        let additionalInterest = Number(data.additional_interest) || 0;
        let totalInterestWithAdditional = total_interest + additionalInterest;

        // Recalculate EMI with additional interest
        const total_amount_with_additional = loan_amount + totalInterestWithAdditional;
        const emi_with_additional = total_amount_with_additional / no_of_emi;

        Object.assign(data,
            {
                emiamt: emi_with_additional.toFixed(2),
                totint: totalInterestWithAdditional.toFixed(2), // This saves total interest (calculated + additional)
                totamount: total_amount_with_additional.toFixed(2),
                int_per_emi: 0,
                princ_per_emi: 0,

            });
    }

    const [agent, setAgent] = React.useState([])
    React.useEffect(() => {

        fetch(Api + 'agent')
            .then(res => res.json())
            .then(res => setAgent(res))

        fetch(Api + 'loan_type')
            .then(res => res.json())
            .then(res => setLoanType(res))

    }, [])

    const handleAutoCalcution = (e) => {
        setAutoCalc(e.target.checked)
    }
    React.useEffect(() => {
        fetch(Api + 'savingsReport', {
            method: 'POST',
            body: JSON.stringify({
                ac_no: props.location.query
            })
        })
            .then(res => res.json())
            .then(res => setAccount(res))
            .catch(err => {
                console.log(err)
            })
    }, [massg])
    return (
        <Container maxWidth="false" component={Paper} >
            <Toolbar style={{ margin: 0, justifyContent: 'space-between' }}>
                <Toolbar>
                    <IconButton onClick={() => navigate.push('/Home/LoanHome')}>
                        <ArrowBack />
                    </IconButton>
                    <h2>Loan Create</h2>
                </Toolbar>

                <Toolbar>
                    <Paper variant='outlined' style={{ display: 'flex', marginRight: 10, alignItems: 'center', paddingLeft: 10 }}>
                        <Typography>Auto calculation</Typography>
                        <Switch
                            defaultChecked
                            checked={autoCalc}
                            onChange={handleAutoCalcution}
                        />
                    </Paper>
                    <Link to='/Home/LoanHome/LoanType' style={{ textDecoration: 'none', color: '#fff' }}>
                        <Button variant="contained" color="primary">
                            Add Loan Scheme
                        </Button>
                    </Link>
                </Toolbar>

            </Toolbar>
            <Divider style={{ marginBottom: 10, marginTop: 10 }} />
            <Paper variant='outlined' style={{ marginRight: 10, alignItems: 'center', padding: 20, marginBottom: 10 }}>
                <Typography style={{ textAlign: 'center', fontWeight: 'bold' }}>Account Details</Typography>
                <hr />
                <TableContainer>
                    <Table>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Savings Account Number</TableCell>
                            <TableCell>Savings Account Balance</TableCell>
                        </TableRow>
                        <TableBody>
                            {
                                account.map((item, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>Rs.{item.dep_amount}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Grid container spacing={2}  >
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Registration Number"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        fullWidth
                        name="acno"
                        value={props.location.query}
                        disabled
                        error={err.acno}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Loan Id"
                        variant="outlined"
                        fullWidth
                        name="ln_id"
                        value={data.ln_id}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">Loan Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            error={err.type}
                            value={data.type}
                            onChange={handleChange}
                            label="Loan Type"
                            name="type"
                        >
                            <MenuItem value={false}>
                                <em>None</em>
                            </MenuItem>
                            {
                                loan_type.map((item, index) => <MenuItem key={index} value={item}>{item.loan_type}</MenuItem>)
                            }


                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Opening Date"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        fullWidth
                        name="opendate"
                        type="date"
                        error={err.opendate}
                        value={data.opendate}
                        onChange={handleChange}

                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">Select Agent</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            error={err.agentid}
                            value={data.agentid}
                            onChange={handleChange}
                            label="Agent ID"
                            name="agentid"
                        >
                            <MenuItem value={false}>
                                <em>None</em>
                            </MenuItem>
                            {
                                agent.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item.id}>{item.res_name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Loan amount"
                        variant="outlined"
                        fullWidth
                        name="loanamount"
                        type="number"
                        error={err.loanamount}
                        value={data.loanamount}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">Interest Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            error={err.int_type}
                            value={data.int_type}
                            onChange={handleChange}
                            label="Agent ID"
                            name="int_type"
                        >
                            <MenuItem value={false}>
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={'flat'}>Flat</MenuItem>
                            <MenuItem value={'Reducing'}>Reducing</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Interest Rate"
                        variant="outlined"
                        fullWidth
                        name="intrestrate"
                        type="number"
                        helperText="Don't add % symbol and Enter interest rate monthly "
                        error={err.intrestrate}
                        value={data.intrestrate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}

                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Additional Interest"
                        variant="outlined"
                        fullWidth
                        name="additional_interest"
                        type="number"
                        helperText="Extra interest amount to be added to total interest"
                        value={data.additional_interest}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">EMI Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            error={err.emi_type}
                            value={data.emi_type}
                            onChange={handleChange}
                            label="EMI Type"
                            name="emi_type"
                        >
                            <MenuItem value={false}>
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={'auto'}>Auto</MenuItem>
                            <MenuItem value={'manual'} disabled={data.int_type === 'flat' ? false : true}>Manual</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="No of EMI"
                        variant="outlined"
                        fullWidth
                        name="noofemi"
                        type="number"
                        error={err.noofemi}
                        value={data.noofemi}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="No of Month"
                        variant="outlined"
                        fullWidth
                        name="noofmonth"
                        type="number"
                        error={err.noofmonth}
                        value={data.noofmonth}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">Emi Frequency</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            error={err.emifreq}
                            value={data.emifreq}
                            onChange={handleChange}
                            label="EMI Frequency"
                            name="emifreq"
                        >
                            <MenuItem value={false}>
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={1}>DAILY</MenuItem>
                            <MenuItem value={7} disabled={data.int_type === 'flat' ? false : true}>WEEKLY</MenuItem>
                            <MenuItem value={14} disabled={data.int_type === 'flat' ? false : true}>FORTNIGHTLY</MenuItem>
                            <MenuItem value={30}>MONTHLY</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">Emi Day</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            error={err.emi_day}
                            value={data.emi_day}
                            onChange={handleChange}
                            label="EMI Day"
                            name="emi_day"
                        >
                            <MenuItem value={false}>
                                <em>None</em>
                            </MenuItem>
                            {
                                week.map((item, index) => <MenuItem key={index} value={item}>{item}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Grid>
                {
                    autoCalc ? (
                        <></>
                    ) : (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Total Interest"
                                    variant="outlined"
                                    fullWidth
                                    name="totint"
                                    type="number"
                                    error={err.totint}
                                    value={data.totint}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Emi Amount"
                                    variant="outlined"
                                    fullWidth
                                    name="emiamt"
                                    type="number"
                                    error={err.emiamt}
                                    value={data.emiamt}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Emi Principle"
                                    variant="outlined"
                                    fullWidth
                                    name="princ_per_emi"
                                    type="number"
                                    error={err.princ_per_emi}
                                    value={data.princ_per_emi}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Emi Interest"
                                    variant="outlined"
                                    fullWidth
                                    name="int_per_emi"
                                    type="number"
                                    error={err.int_per_emi}
                                    value={data.int_per_emi}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </>
                    )
                }
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="EMI starting date"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        fullWidth
                        name="emistartingdate"
                        type="date"
                        error={err.emistartingdate}
                        value={data.emistartingdate}
                        onChange={handleChange}

                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Processing Fees"
                        variant="outlined"
                        fullWidth
                        name="pcharge"
                        type="number"
                        value={data.pcharge}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Insurance Fee"
                        variant="outlined"
                        fullWidth
                        name="insurence"
                        type="number"
                        value={data.insurence}
                        onChange={handleChange}

                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Remarks"
                        variant="outlined"
                        fullWidth
                        name="remarks"
                        type="text"
                        value={data.remarks}
                        onChange={handleChange}

                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Button variant="contained" disabled={disabled} onClick={handleDialog} color="primary">
                        Create Loan

                    </Button>

                </Grid>

                <Dialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                >
                    <DialogTitle>

                        <Toolbar style={{ justifyContent: "space-between" }}>
                            <Typography>Verify calculation</Typography>
                            <Button variant="outlined" onClick={handleDialogClose}>
                                Close
                            </Button>
                        </Toolbar>
                        <Divider />
                    </DialogTitle>
                    <DialogContent >

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    label="Loan amount"
                                    value={data.loanamount}
                                    onChange={handleChange}
                                    name="loanamount"
                                    disabled={!autoCalc}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    label="Emi Amount"
                                    variant="outlined"
                                    fullWidth
                                    name="emiamt"
                                    type="number"
                                    error={err.emiamt}
                                    value={data.emiamt}
                                    onChange={handleChange}
                                    disabled={!autoCalc}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    label="Calculated Interest"
                                    value={calculatedInterest.toFixed(2)}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    label="Additional Interest"
                                    value={data.additional_interest}
                                    onChange={handleChange}
                                    name="additional_interest"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    label="Total Interest"
                                    value={data.totint}
                                    disabled
                                    style={{ fontWeight: 'bold' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    label="Emi principle"
                                    value={data.princ_per_emi}
                                    onChange={handleChange}
                                    name="princ_per_emi"
                                    disabled={!autoCalc}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    label="Emi Interest"
                                    value={data.int_per_emi}
                                    onChange={handleChange}
                                    name="int_per_emi"
                                    disabled={!autoCalc}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    label="No. of month"
                                    value={data.noofmonth}
                                    onChange={handleChange}
                                    name="noofmonth"
                                    disabled
                                />
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" disabled={disabled} onClick={handleSubmit} color="primary">
                            Create Loan
                            {
                                loading ? <LoaderComponent /> : ''
                            }
                        </Button>
                    </DialogActions>
                </Dialog>

            </Grid>

        </Container>
    )
}


const useStyle = makeStyles((theme) => ({
    container: {
        backgroundColor: '#fff',
        overflowX: 'auto',
        padding: 15,
        paddingTop: 0,
        boxShadow: '1px 1px 4px 1px rgba(0, 0, 0, .2)',
        height: '74vh',
        '&::-webkit-scrollbar': {
            width: '0.4em',

            backgroundColor: 'rgba(0,0,0,0,0)'
        },

        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',

            borderRadius: 4,

        },
    }, formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}))