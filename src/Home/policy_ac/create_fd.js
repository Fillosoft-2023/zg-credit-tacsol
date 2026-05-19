import React,{useEffect, useState} from 'react'
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
    Switch,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    IconButton,


} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import {useHistory} from 'react-router-dom'
import Api from '../../api/api';
import SnakBar from '../../consts/message';
import { ArrowBack } from '@material-ui/icons';
import TransDates from '../../consts/transDates';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }



const pay_mode = [
    {
        name : 'Daily',
        value : 'Daily'
    },
    {
        name : 'Weekly',
        value : 'Weekly'
    },
    {
        name : 'Fortnightly',
        value : 'Fortnightly'
    },
    {
        name : 'Monthly',
        value : 'Monthly'
    },
    {
        name : 'One time maturity',
        value : 'One time maturity'
    }
]
const period = ['Year',"Month","Day"]
const frequency = ["Daily","Weekly","Monthly","One time Investment"]
export default function CreateFd(props){
    const history = useHistory()
    const classes = useStyle();
    const [data, setData] = React.useState({})
    const [err, setErr] = React.useState({})
    const [massg, setMassg] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [emi_cr,setEmiCr] = React.useState({})
    const [loading, setLoading] = React.useState([])
    const [autoCalc, setAutoCalc] = React.useState(true)
    const [popup, setPopup] = React.useState(false)
    const handleSubmit = ()=> {
        setDisabled(true)
        if(valid()){
         
        //    sendAsync(data).then((res)=> {
        //     console.log(res)
            
        //     if(res === "inserted"){
        //         setMssg(true) 
        //         // history.replace('/Home/FdHome/')
        //         // setInterval(function(){history.go()},0)

        //         history.push({ pathname: "/Home/FdHome/" });

        //     }else {
        //         console.log(res)
        //         setMssg('error');
        //     }

        //    })
        setLoading(true)
        fetch(Api+'p_create',{
            method : 'POST',
            body : JSON.stringify(data)
        })
        .then(res=>res.json())
        .then(res=>{
            console.log(res)
            setLoading(false)
            if(res.code === 200){
                setMassg({
                    massg : res.massg,
                    open : true,
                    severity : 'success'
                })
                for (var key in data ) {
                    data[key] = null;
                }
                history.push({ pathname: "/Home/PolicyHome/" });
            }else{
                setMassg({
                    massg : res.massg,
                    open : true,
                    severity : 'error'
                })
            }
            
        })
        .catch(err=>{
            setLoading(false)
            setMassg({
                massg : 'Faild to connect to the server',
                open : true,
                severity : 'error'
            })
        })



        }
    }


    
    const handleChange = (event)=> {
        
        if(autoCalc){
            handleMths()
        }
        setDisabled(false)
        let name= event.target.name
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
            [name] : value,
            "press" : "ta_create",
            "ac_no" : props.location.query,
             "reffer_id" : reffer_id

        })
      


    }

    const valid = ()=>{
        let isValid = true
        let error = {}
        
        if(!data.p_amount){
            isValid = false
            error['p_amount'] = true
        }
        if(!data.tenure) {
            isValid = false
            error['tenure'] = true
        }
        if(!data.intrst){
            isValid = false
            error['intrst'] = true
        }
        if(!data.opendate){
            isValid = false
            error['opendate'] = true
        }
        if(!data.agentid){
            isValid = false
            error['agentid'] = true
        }
        if(!data.pay_mode){
            isValid = false
            error['pay_mode'] = true
        }

        // if(!data.mdate){
        //     isValid = false
        //     error['mdate'] = true
        // }
        if(!data.period_type){
            isValid = false
            error['period_type'] = true
        }
        

        // if(!data.pcharge){
        //     isValid = false
        //     error['pcharge'] = true
        // }
        // if(!data.insurence){
        //     isValid = false
        //     error['insurence'] = true
        // }



        setErr(error)

        return isValid
    }

    const handleMths = ()=> {
        let isCalculated = false

        let intererst = 0;
        let frequency = 0;

        if(data.frequency === 'Daily'){
            frequency = 365
        }
        else if(data.frequency === "Weekly"){
            frequency = 52
        }
        else if(data.frequency === "Monthly"){
            frequency = 12
        }else{
            frequency = 1
        }



        if(data.period_type === "Year"){
            intererst = data.intrst;
        }else if(data.period_type === "Month"){
            intererst = data.intrst / 12
        }else{
            intererst = data.intrst / 365
        }
 
        // let int = Math.pow(1 + (Number(data.intrst) / 100), Number(data.tenure))
        // let matAmt = (Number(data.fd_amount) * Number(int)).toFixed(2)
        // let intr = Number(matAmt) - Number(data.fd_amount)
        let int = (Number(data.p_amount) * frequency) * Number(intererst) / 100;
        let totInt = Number(int) * Number(data.tenure)
        let matAmt = (Number(data.p_amount) * (frequency * Number(data.tenure))) + Number(totInt)
        let dep_amount = Number(data.p_amount) * (frequency * Number(data.tenure))



        if(!isNaN(matAmt)){
            isCalculated = true

            Object.assign(data, {int_amt : totInt.toFixed(2), mt_amt : matAmt.toFixed(2),dep_amount : dep_amount});

        }
        return isCalculated;

    }

    const [agent, setAgent] = React.useState([])
    React.useEffect(()=>{
        fetch(Api+'agent')
        .then(res=>res.json())
        .then(res=>setAgent(res))
    },[])


    const handleChecked = (e)=>{
        setAutoCalc(e.target.value)
    }

    const onPopupOpen = ()=>{
        if(autoCalc){
            handleMths()
        }
        if(valid()){
            setPopup(true)
        }
    }

    return (
        <Container className={classes.container} >
        <Toolbar style={{justifyContent: 'space-between'}}>


                <IconButton onClick={() => history.push('/Home/PolicyHome')}>
                    <ArrowBack />
                </IconButton>
         <Typography variant='h6'>Enter Policy A/C Details</Typography>
         <Button
         size='small'
            variant="outlined"
            style={{display: 'flex',alignItems : 'center',padding: 5}}
         >
        <Typography>Automatic calculation</Typography>
         <Switch
            checked={autoCalc}
            onChange={handleChecked} 
         />
         </Button>
        </Toolbar>
        <Divider style={{marginBottom: 10,marginTop: 10}} />
            <Grid container spacing={2}  >
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Registration No"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        fullWidth
                        name="acno"
                        value={props.location.query}
                        disabled
                    />
                </Grid>
             


                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Policy Amount"
                        variant="outlined"
                        fullWidth
                        name="p_amount"
                        error={err.p_amount}
                        value={data.p_amount}
                        onChange={handleChange}
                        type="number"

                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Period"
                        variant="outlined"
                        fullWidth
                        name="tenure"
                        error={err.tenure}
                        value={data.tenure}
                        onChange={handleChange}
                        type="number"

                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                <FormControl variant="outlined"  fullWidth>
                    <InputLabel id="demo-simple-select-outlined-label">Period type</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        error={err.period_type}
                        value={data.period_type}
                        onChange={handleChange}
                        name="period_type"
                    >
                    <MenuItem value={false}>
                        <em>None</em>
                    </MenuItem>
                    {
                        period.map((item,index)=>{
                            return (
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            )
                        })
                    }
                    </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                <FormControl variant="outlined"  fullWidth>
                    <InputLabel id="demo-simple-select-outlined-label">Frequency</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        error={err.frequency}
                        value={data.frequency}
                        onChange={handleChange}
                        name="frequency"
                    
                    >
                    <MenuItem value={false}>
                        <em>None</em>
                    </MenuItem>
                    {
                        frequency.map((item,index)=>{
                            return (
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            )
                        })
                    }
                    </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Interest %(Yearly)"
                        variant="outlined"
                        fullWidth
                        name="intrst"
                        error={err.intrst}
                        value={data.intrst}
                        onChange={handleChange}
                        type="number"

                    />
                </Grid>
                {
                    autoCalc ? "" : (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Total Interest"
                                    variant="outlined"
                                    fullWidth
                                    name="int_amt"
                                    error={err.int_amt}
                                    value={data.int_amt}
                                    onChange={handleChange}
                                    type="number"

                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Maturity Amount"
                                    InputLabelProps={{ shrink: true }}

                                    variant="outlined"
                                    fullWidth
                                    name="mt_amt"
                                    error={err.mt_amt}
                                    value={data.mt_amt}
                                    onChange={handleChange}
                                    type="number"

                                />
                            </Grid>
                        </>
                    )
                }


                <Grid item xs={12} sm={6}>
                    <TransDates
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
                    <TextField
                        label="Maturity Date"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        fullWidth
                        name="mdate"
                        type="date"
                        error={err.mdate}
                        value={data.mdate}
                        onChange={handleChange}

                    />
                </Grid>



                <Grid item xs={12} sm={6}>
                <FormControl variant="outlined"  fullWidth>
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
                        agent.map((item,index)=>{
                            return (
                                <MenuItem key={index} value={item.ac_no}>{item.ag_name}</MenuItem>
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
                <FormControl variant="outlined"  fullWidth>
                    <InputLabel id="demo-simple-select-outlined-label">Mode</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        error={err.pay_mode}
                        value={data.pay_mode}
                        onChange={handleChange}
                        label="Mode"
                        name="pay_mode"
                    >
                    <MenuItem value={false}>
                        <em>None</em>
                    </MenuItem>
                    {
                        pay_mode.map((item,index)=>{
                            return (
                                <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                            )
                        })
                    }
                    </Select>
                </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                <Button variant="contained" onClick={onPopupOpen}  color="primary">
                    Create Policy A/C
                </Button>

                </Grid>



            </Grid>
        <Dialog
            open={popup}
            onClose={()=>setPopup(false)}
        >
            <DialogTitle>
                <Typography>Confirm Calculation</Typography>
                <Divider />
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Total Interest"
                                    variant="outlined"
                                    fullWidth
                                    name="int_amt"
                                    error={err.int_amt}
                                    value={data.int_amt}
                                    onChange={handleChange}
                                    type="number"

                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Maturity Amount"
                                    variant="outlined"
                                    fullWidth
                                    name="mt_amt"
                                    error={err.mt_amt}
                                    value={data.mt_amt}
                                    onChange={handleChange}
                                    type="number"

                                />
                            </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
            <Button variant="contained" onClick={handleSubmit} disabled={disabled} color="primary">
                    Create TL
                </Button>
            </DialogActions>
        </Dialog>
        <SnakBar massg={massg} setMassg={setMassg}  />
        </Container>
    )
}


const useStyle = makeStyles((theme)=> ({
    container : {
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
    },formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
}))
