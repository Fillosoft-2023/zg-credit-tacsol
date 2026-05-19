
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
    Dialog,
    DialogContent,
    Toolbar,
    DialogTitle,
    DialogActions,
    IconButton,
    CircularProgress,
    Switch,
    Paper,


} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import {Link, useHistory} from 'react-router-dom'
import SettingsIcon from '@material-ui/icons/Settings';
import Api from '../../api/api';
// import Api from '../../api/api';
// import SnakBar from '../../consts/message';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const week = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
export default function CreateLoanDisstructuredAndroid(props){
    const history = useHistory()
    const classes = useStyle();
    const [data, setData] = React.useState({agentid : props.location.query.id,b_id:props.location.query.b_id})
    const [err, setErr] = React.useState({})
    const [mssg, setMssg] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [loading,setLoading] = React.useState(false)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [loan_type, setLoanType] = React.useState([])
    const [massg, setMassg] = React.useState(false)
    const [autoCalc, setAutoCalc] = React.useState(true)
    const queryParameters = new URLSearchParams(window.location.search)
    const id = queryParameters.get("id")
    const b_id = queryParameters.get("b_id")
   
   
   
   
    console.log(props.location.query)
    const handleDialog = ()=>{
        
        if(valid()){
            if(autoCalc){
                handleMths()
            }
            setDialogOpen(true)
        }
    }

    const handleDialogClose = ()=>{
        setDialogOpen(false)
    }
   
    const handleSubmit = ()=> {
        setDisabled(true)
        if(valid()){
            setLoading(true)
            fetch(Api+'loan_create_temp',{
                method : 'POST',
                body : JSON.stringify({...data})
            })
            .then(res=>res.json())
            .then(res=>{
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
                   alert('Account created successfully')
                }else{
                    setMassg({
                        massg : res.massg,
                        open : true,
                        severity : 'error'
                    })
                }
                
            })
            .catch(err=>{
                console.log(err)
                setLoading(false)
                setMassg({
                    massg : 'Faild to connect to the server',
                    open : true,
                    severity : 'error'
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
    const handleChange = (event)=> {
        console.log(autoCalc)
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
            "press" : "loan_create",
            "ac_no" : props.location.query.ac,
             "reffer_id" : reffer_id,
             

        })
        
        
    }

    const valid = ()=>{
        let isValid = true
        let error = {}
        
        if(!props.location.query){
            isValid = false
            error['acno'] = true
        }
        if(!data.type){
            isValid = false
            error['type'] = true
        }
        // if(!data.groupid) {
        //     isValid = false
        //     error['groupid'] = true
        // }
        // if(!data.groupname){
        //     isValid = false
        //     error['groupname'] = true
        // }
        if(!data.opendate){
            isValid = false
            error['opendate'] = true
        }
        if(!data.agentid){
            isValid = false
            error['agentid'] = true
        }
        if(!data.loanamount){
            isValid = false
            error['loanamount'] = true
        }
        if(!data.intrestrate){
            isValid = false
            error['intrestrate'] = true
        }
        if(!data.noofemi){
            isValid = false
            error['noofemi'] = true
        }
        if(!data.emistartingdate){
            isValid = false
            error['emistartingdate'] = true
        }
        if(!data.pcharge){
            isValid = false
            error['pcharge'] = true
        }
        // if(!data.insurence){
        //     isValid = false
        //     error['insurence'] = true
        // }
        if(!data.emifreq){
            isValid = false
            error['emifreq'] = true
        }
        if(!data.emiamt){
            isValid = false
            error['emiamt'] = true
        }
        if(!data.int_per_emi){
            isValid = false
            error['int_per_emi'] = true
        }
        if(!data.princ_per_emi){
            isValid = false
            error['princ_per_emi'] = true
        }
        if(!data.totint){
            isValid = false
            error['totint'] = true
        }
        if(data.emifreq === 7){
            if(!data.emi_day){
                isValid = false
                error['emi_day'] = true
            }
        }
        
        if(!data.noofmonth){
            isValid = false
            error['noofmonth'] = true
        }



        setErr(error)

        return isValid
    }

    // code for handle automatic math
    const handleMths = ()=> {
        let isCalculated = false
        let freq = null;
        if(data.emifreq === 7){
            freq=52
        }else if(data.emifreq === 30){
            freq = 12
        }else if(data.emifreq === 14){
            freq = 26
        }
        else if(data.emifreq === 1){
            freq = 365
        }
        // let intForOneyr = Number(data.loanamount) * Number(data.intrestrate) / 100;
        // let intPerEmi = intForOneyr / Number(freq);
        // let totInt = intPerEmi * Number(data.noofemi);
        // let totAmt = Number(data.loanamount) + totInt;
        // let emiAmount = totAmt / Number(data.noofemi);
        let intForOneMonth = Number(data.loanamount) * (Number(data.intrestrate) / 100);
        let totInt = (Number(intForOneMonth) * Number(data.noofmonth))
        // console.log(Number(data.noofemi) / Number(data.emifreq))
        
       let  emiAmount = ((Number(totInt) + Number(data.loanamount)) / Number(data.noofemi)).toFixed(2);
        let totAmt = Number(data.loanamount) + totInt;
        let princ_at_one_emi = Number(data.loanamount) / Number(data.noofemi)

        let actual_int_per_emi = totInt / Number(data.noofemi)
        let actual_princ_per_emi = Number(data.loanamount) / Number(data.noofemi)
        // let actual_princ_per_emi = actual_princ_per_emi

       
       
        if(!isNaN(totAmt)){
            isCalculated = true

            Object.assign(data, {emiamt : emiAmount, totint : totInt.toFixed(2), totamount : totAmt.toFixed(2), int_per_emi : actual_int_per_emi.toFixed(2), princ_per_emi : actual_princ_per_emi.toFixed(2) });
           
        }
        return isCalculated;

    }
    
    const [agent, setAgent] = React.useState([])
    React.useEffect(()=>{
       
        fetch(Api+'agentMobile')
        .then(res=>res.json())
        .then(res=>setAgent(res))

        fetch(Api+'loan_type')
        .then(res=>res.json())
        .then(res=>setLoanType(res))
        
    },[])

    
    

    const handleAutoCalcution = (e)=>{
        
        setAutoCalc(e.target.checked)
       
        
       
    }

    
    
    

    return ( 
        <Container className={classes.container} >
        <Toolbar style={{margin: 0,justifyContent: 'space-between'}}>
        <Typography variant='h5'>Enter Loan Details</Typography>
        
        <Toolbar>
        <Paper variant='outlined' style={{display : 'flex', marginRight: 10,alignItems: 'center',paddingLeft: 10}}>
        <Typography>Auto calculation</Typography>
        <Switch
            defaultChecked
            checked={autoCalc}
            onChange={handleAutoCalcution}
        />
        </Paper>
        <Link to='/Home/LoanHome/LoanType' style={{textDecoration: 'none',color : '#fff'}}>
        {/* <Button variant="contained" color="primary">
            Add Loan Type
        </Button> */}
        </Link>
        </Toolbar>
        
        </Toolbar>
        <Divider style={{marginBottom: 10,marginTop: 10}} />
            <Grid container spacing={2}  >
                <Grid item xs={12} sm={6}>
                    <TextField
                        helperText="Ac no"
                        variant="outlined"
                        fullWidth
                        name="acno"
                        value={props.location.query.ac}
                        disabled
                        error={err.acno}
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined"  fullWidth>
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
                            loan_type.map((item,index)=><MenuItem key={index} value={item.loan_type}>{item.loan_type}</MenuItem>)
                        }
                        
                        
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Group Id"
                        variant="outlined"
                        fullWidth
                        name="groupid"
            
                        error={err.groupid}
                        value={data.groupid}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Group Name"
                        variant="outlined"
                        fullWidth
                        name="groupname"
                        error={err.groupname}
                        value={data.groupname}
                        onChange={handleChange}
                       
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        helperText="Opening Date"
                        variant="outlined"
                        fullWidth
                        name="opendate"
                        type="date"
                        error={err.opendate}
                        value={data.opendate}
                        onChange={handleChange}
                        
                    />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
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
                                    <MenuItem key={index} value={item.id}>{item.ag_name}</MenuItem>
                                )
                            })
                        }
                        </Select>
                    </FormControl>
                </Grid> */}
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
                       
                    />
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
                    <FormControl variant="outlined"  fullWidth>
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
                        <MenuItem value={7}>WEEKLY</MenuItem>
                        <MenuItem value={14}>FORTNIGHTLY</MenuItem>
                        <MenuItem value={30}>MONTHLY</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined"  fullWidth>
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
                            week.map((item,index)=><MenuItem key={index} value={item}>{item}</MenuItem>)
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
                        helperText="EMI starting date"
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
                        error={err.pcharge}
                        value={data.pcharge}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Insurencce Fees"
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
                    <TextField
                        label="Service Tax"
                        variant="outlined"
                        fullWidth
                        name="s_tax"
                        type="number"
                        error={err.s_tax}
                        value={data.s_tax}
                        onChange={handleChange}
                       
                    />
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

                    <Toolbar style={{justifyContent : "space-between"}}>
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
                                variant="outlined"
                                helperText="Loan amount"
                                value={data.loanamount}
                                onChange={handleChange}
                                name="loanamount"
                                disabled={!autoCalc}
                            />
                        </Grid>
                        {/* <Grid>
                        <TextField
                                label="Total "
                                variant="outlined"
                                fullWidth
                                name="totint"
                                type="number"
                                error={err.totint}
                                value={data.totint}
                                onChange={handleChange}
                                disabled={!autoCalc}
                            />
                        </Grid> */}
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
                                disabled={!autoCalc}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                helperText="Receivable interest"
                                value={data.totint}
                                onChange={handleChange}
                                name="totInt"
                                disabled={!autoCalc}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                helperText="Emi principle"
                                value={data.princ_per_emi}
                                onChange={handleChange}
                                name="princ_per_emi"
                                disabled={!autoCalc}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                helperText="Emi Interest"
                                value={data.int_per_emi}
                                onChange={handleChange}
                                name="int_per_emi"
                                disabled={!autoCalc}
                            />
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                <Button variant="contained" disabled={disabled} onClick={handleSubmit} color="primary">
                    Create Loan
                    {
                        loading ? <CircularProgress size={24} /> : ''
                    }
                </Button>
                </DialogActions>
            </Dialog>
            
            </Grid>

        </Container>
    )
}


const useStyle = makeStyles((theme)=> ({
    container : {
        backgroundColor: '#fff',
        overflowX: 'auto',
         padding: 15,
         paddingTop : 0,
         boxShadow: '1px 1px 4px 1px rgba(0, 0, 0, .2)',
         height: '100vh',
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