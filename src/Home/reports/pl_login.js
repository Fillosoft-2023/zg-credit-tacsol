import React,{useState,useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import {useHistory} from 'react-router-dom'
import Api from '../../api/api';
import { CircularProgress } from '@material-ui/core';
import SnakBar from '../../consts/message';
import LoaderComponent from '../../consts/loader';
const useStyles = makeStyles((theme) => ({
  Container : {
    backgroundColor: '#f7f7f7',
    display :'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e4e4e4',
    padding: 15,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
    width: 350,
    borderRadius: 5
    
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function PLlogin() {
  const classes = useStyles();
  const history = useHistory();
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(false);
  const [loading,setLoading] = React.useState(false)
  const [massg,setMassg] = React.useState({})
  const check = (event)=>{
      event.preventDefault();

      
    if(pass != ''){
      setLoading(true)
        fetch(Api+'master_pass',{
          method : 'POST',
          body : JSON.stringify({
            pass : pass
          })
        })
        .then(res=>res.json())
        .then(res=>{
          setLoading(false)
          if(res.code === 200){
            history.push('/Home/ProfitLoss',{authentication : true})
          }else{
            setMassg({
              open : true,
              severity : 'error',
              massg : res.status
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
       }else{
        setMassg({
          open : true,
          severity : 'error',
          massg : 'You need to enter a password'
        })
       }
      
      
  }
   



  return (
    <Container maxWidth="fasle" style={{padding:0}} >
      <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <div style={{padding: 45,marginTop:200,borderRadius: 10, boxShadow: '0 4px 8px 0 rgba(0, 33, 247, 0.3)' }}>
        <Typography component="h1" variant="h5" style={{textAlign:'center'}}>
          Enter Master password
        </Typography>
        <form  noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            error={err}
            value={pass}
            onChange={({target : {value}})=> setPass(value)}
            autoComplete="current-password"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={check}
          >
            Open p&l
            {
              loading ? <LoaderComponent/> :''
            }
          </Button>
         
        </form>
      </div>
      <SnakBar massg={massg} setMassg={setMassg} />
      </div>
    </Container>
  );
}