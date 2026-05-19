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
    Paper,
    Switch,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,


} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import SnakBar from '../../consts/message'
import Api from '../../api/api';
import { useHistory } from 'react-router-dom'
import { ArrowBack } from '@material-ui/icons';
import TransDates from '../../consts/transDates';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}



export default function CreateSavings(props) {
    const history = useHistory()
    const navigate = useHistory()
    const classes = useStyle();
    const [data, setData] = React.useState({})
    const [err, setErr] = React.useState({})
    const [massg, setMassg] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    const [disabled, setDisabled] = useState(false)
    const handleSubmit = () => {
        setDisabled(true)
        if (valid()) {

            setLoading(true)
            fetch(Api + 'savings_ac_create', {
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
                        setTimeout(() => {
                            history.push({ pathname: "/Home/SavMainHome/" });
                        }, 1000)
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
            "press": "sav_create",
            "ac_no": props.location.query,
            "reffer_id": reffer_id,
            "scheme":'Savings'
            //  "agentid" : !props.location.query.id

        })



    }

    const valid = () => {
        let isValid = true
        let error = {}


        if (!data.intrst) {
            isValid = false
            error['intrst'] = true
        }
        if (!data.opendate) {
            isValid = false
            error['opendate'] = true
        }
        if (!data.agentid) {
            isValid = false
            error['agentid'] = true
        }
       
        // if (!data.dep_amt) {
        //     isValid = false
        //     error['dep_amt'] = true
        // }
        if (!data.sav_no) {
            isValid = false
            error['sav_no'] = true
        }
        setErr(error)

        return isValid
    }




    const [agent, setAgent] = React.useState([])
    React.useEffect(() => {
        fetch(Api + 'agent')
            .then(res => res.json())
            .then(res => setAgent(res))
    }, [])




    return (
        <Container className={classes.container} >
            <Toolbar component={Paper}>
                <IconButton onClick={() => navigate.push('/Home/SavMainHome')}>
                    <ArrowBack />
                </IconButton>
                <h2>Create New Savings A/C</h2>
            </Toolbar>
            <Divider style={{ marginBottom: 10, marginTop: 10 }} />
            <Grid container spacing={2}  >
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Registration Number"
                        variant="outlined"
                        fullWidth
                        name="acno"
                        value={props.location.query}
                        disabled
                        InputLabelProps={{shrink:true}}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Savings A/C No"
                        variant="outlined"
                        fullWidth
                        required
                        name="sav_no"
                        value={data.sav_no}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Open Date"
                        variant="outlined"
                        fullWidth
                        name="opendate"
                        error={err.opendate}
                        value={data.opendate}
                        onChange={handleChange}
                        type="date"
                        InputLabelProps={{shrink:true}}


                    />
                </Grid>
               

                {/* <Grid item xs={12} sm={6}>
                    <TextField
                        label="Deposit Amount"
                        variant="outlined"
                        fullWidth
                        name="dep_amt"
                        error={err.dep_amt}
                        value={data.dep_amt}
                        onChange={handleChange}
                        type="text"

                    />
                </Grid> */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Interest %"
                        variant="outlined"
                        fullWidth
                        name="intrst"
                        error={err.intrst}
                        value={data.intrst}
                        onChange={handleChange}
                        type="number"

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
                        label="Processing Fees"
                        variant="outlined"
                        fullWidth
                        name="pcharge"
                        type="number"
                        error={err.pcharge}
                        value={data.pcharge}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Insurance Fees"
                        variant="outlined"
                        fullWidth
                        name="insurence"
                        type="number"
                        error={err.insurence}
                        value={data.insurence}
                        onChange={handleChange}

                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Button variant="contained" disabled={disabled} onClick={handleSubmit} color="primary">
                        Create
                    </Button>

                </Grid>



            </Grid>

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