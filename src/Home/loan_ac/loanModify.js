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
    Toolbar,
    IconButton,
    CircularProgress,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,


} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SnakBar from '../../consts/message';
import Api from '../../api/api';
import { Close } from '@material-ui/icons';



const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function LoanModify(props) {
    const history = useHistory()
    const classes = useStyle();
    const [data, setData] = React.useState(props.location.state.data)
    const [err, setErr] = React.useState({})
    const [mssg, setMssg] = useState({})
    const [disabled, setDisabled] = useState(true)
    const [emi_cr, setEmiCr] = React.useState({})
    const [agent, setAgent] = React.useState([])
    const [loan_type, setLoanType] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [openModal, setOpenModal] = React.useState(true);
    const [password, setPassword] = React.useState('');
    const [dateList,setDateList] = React.useState([])
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleModalSubmit = () => {
        if (password.trim() !== '') {
            fetch(Api + 'master_pass', {
                method: 'POST',
                body: JSON.stringify({
                    pass: password
                })
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false);
                if (res.code === 200) {
                    setOpenModal(false);
                } else {
                    setMssg({
                        open: true,
                        severity: 'error',
                        massg: res.status
                    });
                }
            })
            .catch(err => {
                setLoading(false);
                setMssg({
                    open: true,
                    severity: 'error',
                    massg: 'Failed to connect to the server'
                });
            });
        } else {
            setMssg({
                open: true,
                severity: 'error',
                massg: 'You need to enter a password'
            });
        }
    };
    
    const new_date_list = ()=>{
        setDateList([])
      
        let frequency = Number(data.frequecy)
        
        for (let index = 0; index < data.no_emi; index++) {
            let d = new Date(data.emi_strt);
        
            // Adjust date based on frequency
            if (frequency === 30) {
                d.setMonth(d.getMonth() + index+1);
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

        
        
    }
    
    const handleSubmit = () => {
        setLoading(true)
         if(data.emi_date_change){
            new_date_list()
        }
       
        fetch(Api + 'loan_info_edit', {
            method: 'POST',
            body: JSON.stringify({loan_info :data,emi_dates : dateList})
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                setLoading(false)
                if (res.code === 200) {
                    setMssg({
                        open: true,
                        massg: res.massg,
                        severity: 'success'
                    })
                } else {
                    setMssg({
                        open: true,
                        massg: res.massg,
                        severity: 'error'
                    })
                }
            })
            .catch(err => {
                setLoading(false)
                setMssg({
                    open: true,
                    massg: "Faild to connect to the server",
                    severity: 'error'
                })
            })





    }

   
    const handleChange = (event) => {
        setDisabled(false)
        let name = event.target.name
        let value = event.target.value

        if(name === 'emi_strt'){
           
            setData({
                ...data,
                emi_date_change: true,
                [name] : value,
                "press": "loan_info_edit",
                "reffer_id": data.reffer_id
    
            })
        }else{
            setData({
                ...data,
                emi_date_change: true,
                [name] : value,
                "press": "loan_info_edit",
                "reffer_id": data.reffer_id
    
            })
        }
       

    }

    React.useEffect(() => {
        fetch(Api + 'agent')
            .then(res => res.json())
            .then(res => setAgent(res))

        fetch(Api + 'loan_type')
            .then(res => res.json())
            .then(res => setLoanType(res))
    }, [])







    return (
        <Container maxWidth="false">
            <Toolbar component={Paper}>
                <IconButton onClick={() => history.push('/Home/LoanHome/')}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant='h6' style={{ fontWeight: 'bold' }}>Modify Loan Details</Typography>
            </Toolbar>
            <Paper style={{ padding: 20 }}>
                <Grid container spacing={2}  >
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Registration No"
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            fullWidth
                            name="acno"
                            value={data.acno}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">Loan Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                error={err.ln_tpe}
                                value={data.ln_tpe}
                                onChange={handleChange}
                                label="Loan Type"
                                name="ln_tpe"
                            >
                                {
                                    loan_type.map((item, index) => <MenuItem key={index} value={item.loan_type}>{item.loan_type}</MenuItem>)
                                }

                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Opening Date"
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            fullWidth
                            name="opn_dte"
                            type="date"
                            error={err.opn_dte}
                            value={data.opn_dte}
                            onChange={handleChange}

                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="EMI starting date"
                            InputLabelProps={{ shrink: true }}

                            variant="outlined"
                            fullWidth
                            name="emi_strt"
                            type="date"
                            error={err.emi_strt}
                            value={data.emi_strt}
                            onChange={handleChange}

                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Principle Amount"
                            InputLabelProps={{ shrink: true }}

                            variant="outlined"
                            fullWidth
                            name="ln_amnt"
                            type="number"
                            error={err.ln_amnt}
                            value={data.ln_amnt}
                            onChange={handleChange}

                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Interest Amount"
                            InputLabelProps={{ shrink: true }}

                            variant="outlined"
                            fullWidth
                            name="intrst_amnt"
                            type="number"
                            error={err.intrst_amnt}
                            value={data.intrst_amnt}
                            onChange={handleChange}

                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Interest"
                            InputLabelProps={{ shrink: true }}

                            variant="outlined"
                            fullWidth
                            name="intrst"
                            type="number"
                            error={err.intrst}
                            value={data.intrst}
                            onChange={handleChange}

                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="No of EMI"
                            variant="outlined"
                            fullWidth
                            name="no_emi"
                            type="number"
                            error={err.no_emi}
                            value={data.no_emi}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">Emi Frequency</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                error={err.frequecy}
                                value={data.frequecy}
                                onChange={handleChange}
                                label="EMI Frequency"
                                name="frequecy"
                            >
                                <MenuItem value={false}>
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={1}>DAILY</MenuItem>
                                <MenuItem value={7}>WEEKLY</MenuItem>
                                <MenuItem value={14}>FORTNIGHTLY</MenuItem>
                                <MenuItem value={30}>MONTHLY</MenuItem>


                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="EMI Amount"
                            InputLabelProps={{ shrink: true }}

                            variant="outlined"
                            fullWidth
                            name="emi_amnt"
                            type="number"
                            error={err.emi_amnt}
                            value={data.emi_amnt}
                            onChange={handleChange}

                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="EMI Principle"
                            InputLabelProps={{ shrink: true }}

                            variant="outlined"
                            fullWidth
                            name="emi_princ"
                            type="number"
                            error={err.emi_princ}
                            value={data.emi_princ}
                            onChange={handleChange}

                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="EMI Interest"
                            InputLabelProps={{ shrink: true }}

                            variant="outlined"
                            fullWidth
                            name="emi_intr"
                            type="number"
                            error={err.emi_intr}
                            value={data.emi_intr}
                            onChange={handleChange}

                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">Select Agent</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                error={err.agnt_id}
                                value={data.agnt_id}
                                onChange={handleChange}
                                label="Agent ID"
                                name="agnt_id"
                            >
                                <MenuItem value={false}>
                                    <em>None</em>
                                </MenuItem>
                                {
                                    agent.map((item, index) => {
                                        return (
                                            <MenuItem key={index} value={item.id}>{item.ag_name}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Processing Charge"
                            variant="outlined"
                            fullWidth
                            name="pros_chrg"
                            type="number"
                            error={err.pros_chrg}
                            value={data.pros_chrg}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="insurance"
                            variant="outlined"
                            fullWidth
                            name="insrnce"
                            type="number"
                            error={err.insrnce}
                            value={data.insrnce}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="insurance"
                            variant="outlined"
                            fullWidth
                            name="s_tax"
                            type="number"
                            error={err.s_tax}
                            value={data.s_tax}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">Emi Day</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                error={err.collection_day}
                                value={data.collection_day}
                                onChange={handleChange}
                                label="EMI Day"
                                name="collection_day"
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

                    <Grid item xs={12} sm={4}>

                        <Button fullWidth variant="contained" disabled={disabled} onClick={handleSubmit} color="primary">
                            Save Changes
                            {
                                loading ? <CircularProgress size={30} /> : ''
                            }
                        </Button>

                    </Grid>



                </Grid>
            </Paper>

            <SnakBar massg={mssg} setMassg={setMssg} />
            <Dialog open={openModal} style={{padding:50,border:'2px solid #303F9F'}}>
                <Divider/>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                <DialogTitle>Enter Master Password</DialogTitle>
                <Button onClick={() => history.push('/Home/LoanHome/')}>
                    <Close/>
                </Button>

                </div>
                <DialogContent >
                    <TextField
                        autoFocus
                        variant='outlined'
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalSubmit} variant='contained' fullWidth size='small' color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}


const useStyle = makeStyles((theme) => ({
    container: {
        overflowX: 'auto',
        padding: 15,
        height: '78vh',
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