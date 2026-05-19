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
    Paper,
    Switch,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,


} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import SnakBar from '../../consts/message'
import Api from '../../api/api';
import {useHistory} from 'react-router-dom'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }


const freq = [
    {
        name : 'Daily',
        value : 1
    },
    {
        name : 'Weekly',
        value : 7
    },
    {
        name : 'Fortnightly',
        value : 14
    },
    {
        name : 'Monthly',
        value : 30
    }
]
const period = ['Year',"Month","Day"]
export default function CreateSavMobile(props){
    const history = useHistory()
    const classes = useStyle();
    const [data, setData] = React.useState({})
    const [err, setErr] = React.useState({})
    const [massg,setMassg] = React.useState({})
    const [loading,setLoading] = React.useState(false)
    const [disabled, setDisabled] = useState(false)
    const [emi_cr,setEmiCr] = React.useState({})
    const [autoCalc, setAutoCalc] = React.useState(true)
    const [popup, setPopup] = React.useState(false)
    
    const handleSubmit = ()=> {
        setDisabled(true)
        handleMath()
        if(valid()){
            

        setLoading(true)
        fetch(Api+'sav_create',{
          method : 'POST',
          body : JSON.stringify(data)
        })
        .then(res=>res.json())
        .then(res=>{
          setLoading(false)
          if(res.code === 200){
            setMassg({
              open : true,
              severity : 'success',
              massg : res.massg
            })
            
          }else{
            setMassg({
              open : true,
              severity : 'error',
              massg : res.massg
            })
          }
        })
        .catch(err=>{
          setLoading(false)
          setMassg({
            open : true,
            severity : 'error',
            massg : 'Faild to connect to the server'
          })
        }) 

         
        }
    }

  
   
    const handleChange = (event)=> {
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
            "press" : "sav_create",
            "ac_no" : props.location.query.ac,
             "reffer_id" : reffer_id

        })
       

        
    }

    const valid = ()=>{
        let isValid = true
        let error = {}
        
        
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
        if(!data.frequency){
            isValid = false
            error['frequency'] = true
        }
        if(!data.dep_amt){
            isValid = false
            error['dep_amt'] = true
        }
        if(!data.tot_int){
            isValid = false
            error['tot_int'] = true
        }
        if(!data.mat_amt){
            isValid = false
            error['mat_amt'] = true
        }
        if(!data.period_type){
            isValid = false
            error['period_type'] = true
        }
        if(!data.tenure) {
            isValid = false
            error['tenure'] = true
        }
        
        


        setErr(error)

        return isValid
    }
 
    
    

    const [agent, setAgent] = React.useState([])
    React.useEffect(()=>{
        fetch(Api+'agentMobile')
        .then(res=>res.json())
        .then(res=>setAgent(res))
    },[])

    
    const handleCalc = ()=>{
        setAutoCalc(!autoCalc)
    }


    const handleMath = ()=>{

        let tot_dep_amt = 0
        let intererst = 0;
    
        if(data.period_type === "Year"){
            intererst = data.intrst;
            tot_dep_amt = (Number(data.dep_amt) * (data.frequency === 1 ? 365 : data.frequency === 7 ? 52 : data.frequency === 14 ? 26 : 12)) * data.tenure
        }else if(data.period_type === "Month"){
            intererst = data.intrst / 12
            tot_dep_amt = Number(data.dep_amt) * (data.frequency === 1 ? 30 * data.tenure  : data.frequency === 7 ? 4 * data.tenure : data.frequency === 14 ? 2 * data.tenure :  data.tenure)
        }else{
            intererst = data.intrst / 365
            tot_dep_amt = Number(data.dep_amt) * (data.frequency === 1 ?  data.tenure  : data.frequency === 7 ?  data.tenure / 7 : data.frequency === 14 ?  data.tenure / 14 :  data.tenure / 30)
        }



        const int = tot_dep_amt * intererst / 100
        const tot_int = int * data.tenure
        const mat_amt = Number(tot_int) + tot_dep_amt

        if(!isNaN(mat_amt)){
            Object.assign(data,{tot_int : tot_int.toFixed(2), mat_amt : mat_amt.toFixed(2), tot_dep_amt : tot_dep_amt    })
        }
              
    }

    const onPopupOpen = ()=>{
        if(autoCalc){
            handleMath()
        }
        if(valid()){
            setPopup(true)
        }
    }
    return ( 
        <Container className={classes.container} >
        <Toolbar style={{justifyContent : 'space-between'}}>
        <Typography variant='h6'>Enter RD Details</Typography>
        <Paper variant='outlined' style={{display: 'flex',padding: 5, alignItems : 'center'}}>
            <Typography>Auto calculation</Typography>
            <Switch
                checked={autoCalc}
                onChange={handleCalc}
            />
        </Paper>
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
                    />
                </Grid>
               
                <Grid item xs={12} sm={6}>
                    <TextField
                        helperText="Open Date"
                        variant="outlined"
                        fullWidth
                        name="opendate"
                        error={err.opendate}
                        value={data.opendate}
                        onChange={handleChange}
                        type="date"
                       
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        helperText="Matuirty Date"
                        variant="outlined"
                        fullWidth
                        name="mt_date"
                        error={err.mt_date}
                        value={data.mt_date}
                        onChange={handleChange}
                        type="date"
                       
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Deposite Amount"
                        variant="outlined"
                        fullWidth
                        name="dep_amt"
                        error={err.dep_amt}
                        value={data.dep_amt}
                        onChange={handleChange}
                        type="text"
                       
                    />
                </Grid>
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
                    <InputLabel id="demo-simple-select-outlined-label">Select frequency</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        error={err.frequency}
                        value={data.frequency}
                        onChange={handleChange}
                        label="Frequency"
                        name="frequency"
                    >
                    <MenuItem value={false}>
                        <em>None</em>
                    </MenuItem>
                    {
                        freq.map((item,index)=>{
                            return (
                                <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                            )
                        })
                    }
                    </Select>
                </FormControl>
                </Grid>
                {
                    autoCalc ? '' : (
                        <>
                            <Grid item xs={12} sm={6}>
                        
                            <TextField
                                    label="Total Amount"
                                    variant="outlined"
                                    fullWidth
                                    name="tot_dep_amt"
                                    error={err.tot_dep_amt}
                                    value={data.tot_dep_amt}
                                    onChange={handleChange}
                                    type="number"
                                
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Total Interest"
                                    variant="outlined"
                                    fullWidth
                                    name="tot_int"
                                    error={err.tot_int}
                                    value={data.tot_int}
                                    onChange={handleChange}
                                    type="number"
                                
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Maturity Amount"
                                    variant="outlined"
                                    fullWidth
                                    name="mat_amt"
                                    error={err.mat_amt}
                                    value={data.mat_amt}
                                    onChange={handleChange}
                                    type="number"
                                
                                />
                            </Grid>
                        </>
                    )
                }
                
               
               
               
               
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
                            <MenuItem key={index} value={item.id}>{item.ag_name}</MenuItem>
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
                <Button variant="contained" disabled={disabled} onClick={onPopupOpen} color="primary">
                    Create
                </Button>
                
                </Grid>
            
            
            
            </Grid>
        
            <SnakBar massg={massg} setMassg={setMassg} />
            <Dialog
                open={popup}
                onClose={()=>setPopup(false)}
            >
                <DialogTitle>
                    <Typography variant="h5">Confirm Calculation</Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                        
                        <TextField
                                label="Total Amount"
                                variant="outlined"
                                fullWidth
                                name="tot_dep_amt"
                                error={err.tot_dep_amt}
                                value={data.tot_dep_amt}
                                onChange={handleChange}
                                type="number"
                            
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        
                            <TextField
                                    label="Total Interest"
                                    variant="outlined"
                                    fullWidth
                                    name="tot_int"
                                    error={err.tot_int}
                                    value={data.tot_int}
                                    onChange={handleChange}
                                    type="number"
                                
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Maturity Amount"
                                    variant="outlined"
                                    fullWidth
                                    name="mat_amt"
                                    error={err.mat_amt}
                                    value={data.mat_amt}
                                    onChange={handleChange}
                                    type="number"
                                
                                />
                            </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                <Button variant="contained" disabled={disabled} onClick={handleSubmit} color="primary">
                    Create
                    {loading ? <CircularProgress /> : ''}
                </Button>
                </DialogActions>
            </Dialog>
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