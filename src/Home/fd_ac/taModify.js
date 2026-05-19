import React, { useState } from 'react'
import {
    Container,
    Typography,
    makeStyles,
    Grid,
    TextField,
    Button,
    Snackbar,
    Toolbar,
    IconButton,
    MenuItem,
    Menu,
    FormControl,
    Select,
    InputLabel,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Paper
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import imageCompression from 'browser-image-compression'
import { useHistory } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Api from '../../api/api';
import SnakBar from '../../consts/message';
import { Close } from '@material-ui/icons';
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const pay_mode = [
    {
        name: 'Daily',
        value: 1
    },
    {
        name: 'Weekly',
        value: 7
    },
    {
        name: 'Fortnightly',
        value: 14
    },
    {
        name: 'Monthly',
        value: 30
    },
    {
        name: 'One time maturity',
        value: 'One time maturity'
    }
]
const period = ['Year', "Month", "Day"]
export default function ProfileModify(props) {
    const Style = styles();
    const history = useHistory()
    const [data, setData] = useState(props.location.state.data)
    const [err, setErr] = useState({})
    const [disabled, setDisabled] = useState(true)
    const [anchorE1, setAnchorE1] = useState(null)
    const [agent, setAgent] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [massg, setMassg] = React.useState({})
    const open = Boolean(anchorE1)
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



    const onCloseMenu = () => {
        setAnchorE1(null)
    }
    const onOpenMenu = (e) => {
        setAnchorE1(e.currentTarget)
    }
    const handlePayMode = (e) => {
        setAnchorE1(null)
        setData({
            ...data,
            pay_mode: e
        })
    }
    const onSubmit = () => {
        setLoading(true)
        fetch(Api + 'ta_info_edit', {
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
        let name = event.target.name;
        let value = event.target.value;
        setDisabled(false)
        setData({
            ...data,
            [name]: value,
        })


    }

    React.useEffect(() => {
        fetch(Api + 'agent')
            .then(res => res.json())
            .then(res => setAgent(res))
    }, [])


    return (
        <Container maxWidth='false'>
            <Toolbar component={Paper}>
                <IconButton onClick={() => history.push('/Home/FdHome/')}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography style={{ fontWeight: 'bold' }}>Edit TL Information</Typography>
            </Toolbar>
            <Paper style={{ padding: 15 }}>
                <Grid container spacing={2}>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="opn_dt"
                            error={err.opn_dt}
                            required
                            fullWidth
                            label="Opening Date"
                            autoFocus
                            type="date"
                            value={data.opn_dt}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="prc_chr"
                            error={err.prc_chr}
                            required
                            fullWidth
                            label="processing Fees"
                            autoFocus
                            type="text"
                            value={data.prc_chr}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="ta_amt"
                            error={err.ta_amt}
                            required
                            fullWidth
                            label="TL amount"
                            autoFocus
                            type="text"
                            value={data.ta_amt}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="int_rt"
                            error={err.ps}
                            required
                            fullWidth
                            label="Interest Rate"
                            autoFocus
                            type="text"
                            value={data.int_rt}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="int_amt"
                            error={err.int_amt}
                            required
                            fullWidth
                            label="Interest Amount"
                            autoFocus
                            type="text"
                            value={data.int_amt}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="mt_amt"
                            error={err.pin}
                            required
                            fullWidth
                            label="Maturity Amount"
                            autoFocus
                            type="number"
                            value={data.mt_amt}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="mt_dt"
                            error={err.dist}
                            required
                            fullWidth
                            label="Maturity Date"
                            autoFocus
                            type="date"
                            value={data.mt_dt}
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
                    {/* <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="tnre"
                    error={err.nmni}
                    required
                    fullWidth
                    label="Period"
                    autoFocus
                    type="text"
                    value={data.tnre}
                    onChange={handleChange}
                />
                </Grid> */}
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Period"
                            variant="outlined"
                            fullWidth
                            name="tnre"
                            error={err.tnre}
                            value={data.tnre}
                            onChange={handleChange}
                            type=""

                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="pay_mode"
                            error={err.pay_mode}
                            required
                            fullWidth
                            label="payment mode"

                            type="text"
                            onClick={onOpenMenu}
                            value={data.pay_mode}
                        />


                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button variant="contained" color="primary"
                            size="large"
                            onClick={onSubmit}
                            disabled={disabled}
                        >
                            Save Changes
                            {loading ? <CircularProgress color='#fff' size={25} /> : ''}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>


            <Dialog open={openModal} style={{ padding: 50, border: '2px solid #303F9F' }}>
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <DialogTitle>Enter Master Password</DialogTitle>
                    <Button onClick={() => history.push('/Home/FdHome/')}>
                        <Close />
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
            <SnakBar massg={massg} setMassg={setMassg} />

            <Menu
                anchorEl={anchorE1}
                open={open}
                onClose={onCloseMenu}
            >
                {
                    pay_mode.map((item) => <MenuItem key={item.value} onClick={() => handlePayMode(item.value)}>{item.name}</MenuItem>)
                }
            </Menu>
        </Container>
    )
}

const styles = makeStyles((theme) => ({
    container: {
        padding: 20

    },
    button: {
        alignSelf: 'right',
        marginTop: 20,

    }

}))