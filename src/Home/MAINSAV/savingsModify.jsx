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
    IconButton,
    Toolbar,
    CircularProgress,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions

} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Api from '../../api/api';
import SnakBar from '../../consts/message';
import { Close } from '@material-ui/icons';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}



export default function SavingsModify(props) {
    const history = useHistory()
    const classes = useStyle();
    const [data, setData] = React.useState(props.location.state.data)
    const [err, setErr] = React.useState({})
    const [massg, setMassg] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    const [disabled, setDisabled] = useState(true)
    const [emi_cr, setEmiCr] = React.useState({})
    const [agent, setAgent] = React.useState([])
    const [openModal, setOpenModal] = React.useState(true);
    const [password, setPassword] = React.useState('');
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
                        setMassg({
                            open: true,
                            severity: 'error',
                            massg: res.status
                        });
                    }
                })
                .catch(err => {
                    setLoading(false);
                    setMassg({
                        open: true,
                        severity: 'error',
                        massg: 'Failed to connect to the server'
                    });
                });
        } else {
            setMassg({
                open: true,
                severity: 'error',
                massg: 'You need to enter a password'
            });
        }
    };



    const handleSubmit = () => {
        setLoading(true)
        fetch(Api + 'sav_info_edit', {
            method: 'POST',
            body: JSON.stringify(data)
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

    const handleChange = (event) => {
        setDisabled(false)
        let name = event.target.name
        let value = event.target.value
        setData({
            ...data,
            [name]: value,
            reffer_id: data.reffer_id
        })


    }



    React.useEffect(() => {
        console.log(data)
        fetch(Api + 'agent')
            .then(res => res.json())
            .then(res => setAgent(res))
    }, [])





    return (
        <Container style={{ padding: 0 }} >
            <Toolbar component={Paper} style={{ marginBottom: 5 }}>
                <IconButton onClick={() => history.push('/Home/SavMainHome/')}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography style={{fontWeight:'bold'}} >Modify Savings A/C Details</Typography>
            </Toolbar>
            <Paper style={{ padding: 10 }}>
                <Grid container spacing={2}>

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
                        <TextField
                            label="Opening Date"
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            fullWidth
                            name="date"
                            type="date"

                            value={data.date}
                            onChange={handleChange}

                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">Select Agent</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                error={err.agent_id}
                                value={data.agent_id}
                                onChange={handleChange}
                                label="Agent ID"
                                name="agent_id"
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
                            name="proc_chrg"
                            type="number"
                            value={data.proc_chrg}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Insurance"
                            variant="outlined"
                            fullWidth
                            name="insur"
                            type="number"
                            value={data.insur}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Maturity Date"
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            fullWidth
                            name="mt_date"
                            type="date"
                            value={data.mt_date}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Deposite amount"
                            variant="outlined"
                            fullWidth
                            name="dep_amount"
                            type="number"
                            value={data.dep_amount}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Total Deposite amount"
                            variant="outlined"
                            fullWidth
                            name="tot_dep_amt"
                            type="number"
                            value={data.tot_dep_amt}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Total Interest amount"
                            variant="outlined"
                            fullWidth
                            name="tot_int"
                            type="number"
                            value={data.tot_int}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Maturity amount"
                            variant="outlined"
                            fullWidth
                            name="mt_amt"
                            type="number"
                            value={data.mt_amt}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Tenure"
                            variant="outlined"
                            fullWidth
                            name="tenure"
                            type="number"
                            value={data.tenure}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Interest rate"
                            variant="outlined"
                            fullWidth
                            name="intrest"
                            type="number"
                            value={data.intrest}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">Select frequency</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                error={err.frquency}
                                value={data.frquency}
                                onChange={handleChange}
                                label="Frequency"
                                name="frquency"
                            >
                                <MenuItem value={1}>DAILY</MenuItem>
                                <MenuItem value={7}>WEEKLY</MenuItem>
                                <MenuItem value={14}>FORTNIGHTLY</MenuItem>
                                <MenuItem value={30}>MONTHLY</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>


                    <Grid item xs={12} sm={4}>

                        <Button variant="contained" disabled={disabled} onClick={handleSubmit} color="primary">
                            Save Changes
                            {
                                loading ? <CircularProgress color='#fff' size={25} /> : ''
                            }
                        </Button>

                    </Grid>



                </Grid>
            </Paper>


            <SnakBar massg={massg} setMassg={setMassg} />

            <Dialog open={openModal} style={{ padding: 50, border: '2px solid #303F9F' }}>
                <Divider />
                <div style={{display:'flex',justifyContent:'space-between'}}>
                <DialogTitle>Enter Master Password</DialogTitle>
<Button  onClick={() => history.push('/Home/SavMainHome/')}>
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
        padding: 15,
        height: '88%',
        '&::-webkit-scrollbar': {
            width: '0.em',

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