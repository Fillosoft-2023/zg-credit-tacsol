import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SearchIcon from '@material-ui/icons/Search';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider'
import {useHistory} from 'react-router-dom'
import {
    Paper,
    InputBase,
    makeStyles,
    Container,
    Grid,
    TextField
} from '@material-ui/core'

import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { props } from 'bluebird';
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    overflow : 'auto',
    
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function AddShareMem() {
  const history = useHistory()
  const [open, setOpen] = React.useState(false);
  const classes = useStyle();
  const [value, setValue] = React.useState({
      press : '',
      s_value : ''
  });
  const [userData, setUserData] = React.useState({})
  const [err, setErr] = React.useState(false)
  const [data, setData] = React.useState(null);
  const [formDisplay, setformDisplay] = React.useState(false)
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSearch = () => {
    setformDisplay(false)
    if(value.s_value == ''){
        alert('enter account number')
    }else {
        // sendAsync(value).then((res)=> {
        //     setData(res)
            
        // })
    }
      
  }
  const [sendAc, setSendAc] = React.useState(null)
  const createShare = (props)=> {
        setformDisplay(true)
        setSendAc(props)
  }

  const submitUser = ()=> {
      if(!userData.open_dt){
          setErr(true)
      }else {
        //sendAsync(userData).then((res)=>  alert('Member Added'))
      }
  }

  const chnageHandle = (event)=>{
    let name = event.target.name;
    let value = event.target.value;

    setUserData({
        ...userData,
        [name] : value,
        'ac_no' : sendAc,
        'press' : 'add_shareMem'
    })
  }
 
  return (
    <div>
      <Button
         variant="contained"
         color="primary"
         style={{margin: 10}}
         endIcon={<AddCircleIcon />}
         onClick={handleClickOpen}
        > Add new member
      </Button>
      
      <Dialog className={classes.container} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Add new share member
        </DialogTitle>
        <DialogContent dividers>
            <Paper component="form" className={classes.root}>
                <InputBase
                className={classes.input}
                placeholder="Search by account no or name"
                inputProps={{ 'aria-label': 'Search by account no or name' }}
                value={value.s_value}
                onChange={({target : {value}})=> setValue({ s_value : value, press : 'ac_search'})}
                />
                <IconButton  className={classes.iconButton} onClick={handleSearch} aria-label="search">
                <SearchIcon />
                </IconButton>
            
            
            </Paper>

        </DialogContent>
            <Container maxWidth={'lg'}>
                    {data == null ? (
                        <div>
                        </div>
                    ) : formDisplay == true ? (
                        <Container>
                            <Grid container spacing={2} style={{marginTop: 15}}>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                    id="outlined-basic" 
                                    helperText="Account No"
                                    variant="outlined"
                                    name="ac_no"
                                    value={sendAc}
                                    disabled 
                                    
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        id="outlined-basic" 
                                        helperText="Ac Open date" 
                                        variant="outlined" 
                                        type="date"
                                        name="open_dt"
                                        value={userData.open_dt}
                                        error={err}
                                        onChange={chnageHandle}
                                        
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        id="outlined-basic" 
                                        label="Addmisson fees" 
                                        variant="outlined" 
                                        name="adm_fees"
                                        value={userData.adm_fees}
                                        type="number"
                                        onChange={chnageHandle}
                                    />
                                </Grid>
                                
                            </Grid>
                            <DialogActions>
                            <Button autoFocus onClick={submitUser} variant="contained" color="primary">
                                Save user
                            </Button>
                            </DialogActions>
                        </Container>
                        
                    ) : (
                      <TableContainer component={Paper}>
                      <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                      <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Account No</TableCell>
                          <TableCell align="right">F/H Name</TableCell>
                          <TableCell align="right">Opening Date</TableCell>
                          <TableCell align="right">Create</TableCell>
                      </TableRow>
                      </TableHead>
                      <TableBody>{
                        data.map((item,index)=> {
                            return (
                                
                                <TableRow key={index.name}>
                                <TableCell component="th" scope="row">
                                    {item.name}
                                </TableCell>
                                <TableCell align="right">{item.acno}</TableCell>
                                <TableCell align="right">{item.f_name}</TableCell>
                                <TableCell align="right">{item.op_dte}</TableCell>
                                <TableCell align="right">
                                    <IconButton style={{margin: 0,padding: 0}} onClick={()=>createShare(item.acno)}>
                                        <PersonAddIcon style={{margin: 0}} />
                                    </IconButton>
                                </TableCell>
                                </TableRow>
                                
                            )
                           
                        })
                      }
                      </TableBody>
                      </Table>
                      </TableContainer>
                       
                    )}
                    
                    
            </Container>
        
      </Dialog>
    </div>
  );
}

const useStyle = makeStyles((theme)=>({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 300,
        marginLeft: 100,
        marginRight: 100,
       
      },
      container : {
        
      },
      input: {
        marginLeft: theme.spacing(1),
        flex: 1,
      },
}))