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
    Menu,
    CircularProgress,
    IconButton,
    Toolbar,
    Paper,


} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom'
import Api from '../../api/api';
import SnakBar from '../../consts/message';
import { ArrowBack } from '@material-ui/icons';
import TransDates from '../../consts/transDates';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function CreateShare(props) {
    const history = useHistory()
    const classes = useStyle();
    const [data, setData] = React.useState({})
    const [err, setErr] = React.useState({})
    const [mssg, setMssg] = useState(false)
    const [emi_cr, setEmiCr] = React.useState({})
    const [disabled, setDisabled] = useState(false)
    const [massg, setMassg] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    const [anchorE1, setAnchorE1] = useState(null)
    const menuOpen = Boolean(anchorE1)

    const handleMenuopen = (e) => {
        setAnchorE1(e.currentTarget)
    }
    const handleMenuClose = () => {
        setAnchorE1(null)
    }
    const handleSubmit = () => {
        setDisabled(true)
        if (valid()) {
            setLoading(true)
            fetch(Api + 'add_shareMem', {
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
                        setTimeout(() => { history.push({ pathname: "/Home/Share_reg/" }); }, 1000)
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



    const handleChange = (event) => {
        setDisabled(false)
        let name = event.target.name
        let value = event.target.value

        //creating reference id for loan and emi
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

        setData({
            ...data,
            [name]: value,
            "press": "add_shareMem",
            "ac_no": props.location.query,
            "reffer_id": reffer_id

        })



    }

    const handleMenu = (item) => {
        setAnchorE1(null)
        setData({
            ...data,
            'class': item
        })
    }

    const valid = () => {
        let isValid = true
        let error = {}

        if (!data.open_dt) {
            isValid = false
            error['open_dt'] = true
        }
        if (!data.adm_fees) {
            isValid = false
            error['adm_fees'] = true
        }
        if (!data.class) {
            isValid = false
            error['class'] = true
        }
        if (!data.app_fees) {
            isValid = false
            error['app_fees'] = true
        }




        setErr(error)

        return isValid
    }








    return (
        <Container component={Paper} variant='outlined' style={{padding:10}} >
            <Toolbar component={Paper} style={{marginBottom:10}}>
                <IconButton onClick={() => history.push('/Home/Share_reg')}>
                    <ArrowBack />
                </IconButton>
                <h2>Create New Share</h2>
            </Toolbar>   
            <Paper variant='outlined' style={{padding:10}}>
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
                    />
                </Grid>


                <Grid item xs={12} sm={6}>
                    <TransDates
                        label="Opening Date"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        fullWidth
                        name="open_dt"
                        type="date"
                        error={err.open_dt}
                        value={data.open_dt}
                        onChange={handleChange}

                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Admission Fees"
                        variant="outlined"
                        fullWidth
                        name="adm_fees"
                        type="number"
                        error={err.adm_fees}
                        value={data.adm_fees}
                        onChange={handleChange}
                    />

                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Application Fees"
                        variant="outlined"
                        fullWidth
                        name="app_fees"
                        type="number"
                        error={err.app_fees}
                        value={data.app_fees}
                        onChange={handleChange}
                    />

                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Select Account Type"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        fullWidth
                        onClick={handleMenuopen}
                        error={err.class}
                        value={data.class}
                    />
                    <Menu
                        anchorEl={anchorE1}
                        open={menuOpen}
                        onClose={handleMenuClose}

                    >
                        <MenuItem onClick={() => handleMenu('A')}>A class</MenuItem>
                        <MenuItem onClick={() => handleMenu('B')}>B Class</MenuItem>
                    </Menu>
                </Grid>

                <Grid item xs={12} sm={6}>

                    <Button variant="contained" disabled={disabled} onClick={handleSubmit} color="primary">
                        Create Share
                        {loading ? <CircularProgress size={25} color="#fff" /> : ''}
                    </Button>

                </Grid>



            </Grid>
            </Paper>

            <SnakBar massg={massg} setMassg={setMassg} />
        </Container>
    )
}


const useStyle = makeStyles((theme) => ({
    container: {
        backgroundColor: '#fff',
        overflowX: 'auto',
        padding: 15,
        boxShadow: '1px 1px 4px 1px rgba(0, 0, 0, .2)',
        height: '97%',
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