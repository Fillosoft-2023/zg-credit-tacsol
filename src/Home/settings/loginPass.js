import React from 'react'
import {
    TextField,
    Typography,
    Button,
    Container,
    Paper,
    makeStyles,
    Snackbar,
    CircularProgress,
    Toolbar,

} from '@material-ui/core'

import MuiAlert from '@material-ui/lab/Alert';
import Api from '../../api/api';
import SnakBar from '../../consts/message';
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

export default function MasterPass(){
    const classes = style()
    const [pass, setPass] = React.useState([])
    const [typed, setTyped] = React.useState();
    const [err, setErr] = React.useState(false)
    const [render, setrender] = React.useState(true)
    const [newPass, setNewPass] = React.useState({
        pass : '',
        press : 'upadtePass'
    })
    // const [mssg, setMssg] = React.useState()
    const [massg,setMassg] = React.useState({})
    const [loading,setLoading] = React.useState(false)
   
    React.useEffect(()=>{
       // sendAsync('login_pass').then((res)=> setPass(res))
       
    },[])

    const authVerify = ()=>{
      let authState = false
      

      return authState
    }

    const updateP = ()=>{
        const formData = new FormData
        formData.append('pass_post',typed)
        formData.append('branc_code',localStorage.getItem('branch_code'))
        setLoading(true)
        fetch(Api+'login',{
            method : 'POST',
            body : formData
        })
        .then(res=>res.json())
        .then(res=>{
            setLoading(false)
            if(res.code === 200){
                
                setErr(false)
                setrender(false)
             
            }else {
                setMassg({
                    open : true,
                    severity : 'error',
                    massg : 'Entered wrong password'
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
    const updatePass = ()=>{
      
       setLoading(true)
               fetch(Api+'update_l_pass',{
                 method : 'POST',
                 body : JSON.stringify(newPass)
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

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        
        
      };
    return (
        <Container maxWidth="false" component={Paper} style={{height:'84vh',padding:0}}>
            <Toolbar component={Paper} style={{display:'flex',justifyContent:'center'}}>
            <Typography variant='h6' style={{textAlign:'center',fontWeight:'bold'}}>Update Login Password</Typography>

            </Toolbar>
            {
                render ? (
                    <div className={classes.container}>
                        <TextField
                            label="Enter old password"
                            variant="outlined"
                            type="password"
                            size="small"
                            error={err}
                            value={typed}
                            onChange={({target : {value}})=>setTyped(value)}
                        />
                        <Button style={{marginLeft: 5}} variant="contained" color="primary" onClick={()=>updateP()}>
                            Check 
                            {
                                loading ? <CircularProgress size={'small'} /> : ''
                            }
                        </Button>
                        
                    </div>
                ) : (
                    <Paper className={classes.container}>
                        <TextField
                            label="Enter new password"
                            variant="outlined"
                            type="password"
                            size="small"
                           
                            value={newPass.pass}
                            onChange={({target : {value}})=>setNewPass({...newPass,pass : value})}
                        />
                        <Button style={{marginLeft: 5}} variant="contained" color="primary" onClick={()=>updatePass()}>
                            Upate 
                        </Button>
                        
                    </Paper>
                )
            }
            <SnakBar massg={massg} setMassg={setMassg} />

            
        </Container>
    )
}

const style = makeStyles(()=> ({
    container : {
        display: 'flex',
        height: 400,
        justifyContent: 'center',
        alignItems: 'center'
    }
}))