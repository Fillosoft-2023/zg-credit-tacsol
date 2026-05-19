import React,{useState,useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useHistory} from 'react-router-dom'
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

export default function MasterLogin() {
  const classes = useStyles();
  const history = useHistory();
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(false);
  const [original, setOriginal] = useState(null)
  const check = (event)=>{
      event.preventDefault();
      if(!pass){
        setErr(true)
      }else if(original === pass){
        history.push('./Share_reg')
      }
      
      
  }
   useEffect(()=>{
       if(pass != null){
        // send('master_pass').then((res) => {
        //     res.map((item)=>{
        //     setOriginal(item.m_pass)
        //     })
        // });
       }
        
  },[])



  return (
    <Container component="main" className={classes.Container} maxWidth={"lg"} >
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Enter Master password
        </Typography>
        <form className={classes.form} noValidate>
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
            Open Share Member
          </Button>
         
        </form>
      </div>
    </Container>
  );
}