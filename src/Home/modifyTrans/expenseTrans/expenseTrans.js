import React from 'react'
import {
    TableContainer,
    Table,
    TableRow,
    TableCell,
    TableBody,
    TableHead,
    Paper,
    makeStyles,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Button,
    Slide,
    DialogTitle,
    Typography,
    TextField,
    Container,
    CircularProgress
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import Api from '../../../api/api';
import SnakBar from '../../../consts/message';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
export default function ExpenseTrans(props){
    const [Data, setData] = React.useState([])
    const style = useStyle()
    const [isRefreshed, setIfRefresed] = React.useState()
    const [loading,setLoading] = React.useState(false)
    const [massg,setMassg] = React.useState({})
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [date, setDate]= React.useState({
        to : new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
    })
    const handleDate = (event)=>{
      let name = event.target.name;
      let value = event.target.value;

      setDate({
          ...date,
          [name] : value,
          
      })

      setIfRefresed(Math.random())
  }
    React.useEffect(()=>{
        fetch(Api+'expencetrans',{
          method : 'POST',
          body : JSON.stringify(date)
        })
        .then(res=>res.json())
        .then(res=>setData(res))
        .catch(err=>{
           console.log(err)
        })
    },[props.callback, isRefreshed])

    const [open, setOpen] = React.useState(false);
    
    const [sendData,setSendData] = React.useState({})
    const handleClickOpen = (item) => {
      setSendData({
        id : item.id,
      })
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    
   
    const handleSubmit = () => {
      // sendAsync(sendData).then((res)=>{
      //   setOpen(false)
      //   setIfRefresed(Math.random())
        
      // });

      setLoading(true)
              fetch(Api+'delete_Expense',{
                method : 'POST',
                body : JSON.stringify(sendData)
              })
              .then(res=>res.json())
              .then(res=>{
                setLoading(false)
                setIfRefresed(Math.random())
                setTimeout(()=>{setOpen(false)},1000)
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
    return (
      <Container>
        <Paper className={style.dateBar}>
        <Typography style={{margin: 5,marginRight: 20,textAlign: 'center'}}>Expence transaction</Typography>
            <TextField
                type="date"
                variant="outlined"
                size="small"
                name="to"
                value={date.to}
                onChange={handleDate}
                
            />
            <TextField
                type="date"
                variant="outlined"
                size="small"
                name="from"
                style={{marginLeft: 10,}}
                value={date.from}
                onChange={handleDate}
                
            />
        
        </Paper>
      
        <TableContainer component={Paper} className={style.list}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Details</TableCell>
                        <TableCell>Delete</TableCell>
                    </TableRow>
                </TableHead>
                    <TableBody>
                    {
                        Data.map((item,index)=> {
                            return (
                                <TableRow>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>{item.amount}</TableCell>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell>{item.detail}</TableCell>
                                    <TableCell>
                                        <IconButton edge="end" aria-label="delete" onClick={()=>handleClickOpen(item)}>
                                                <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                    </TableBody>
                
            </Table>
            <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">{"Are you sure to Delete this account"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Deleting an account can lost all your information and transaction history about this account, You can not recover
                informations once you delete this! 
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Disagree
              </Button>
              <Button onClick={handleSubmit} color="primary">
                Agree
                {loading ? <CircularProgress /> : ''}
              </Button>
            </DialogActions>
          </Dialog>
        </TableContainer>
        <SnakBar massg={massg} setMassg={setMassg} /> 
        </Container>
    )
}

const useStyle = makeStyles(()=>({
    list : {
        maxHeight : '85vh',
        
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          width: '0.4em',
          
          backgroundColor: 'rgba(0,0,0,0,0)'
        },
        
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          
          borderRadius: 4,
         
        },
    },
    dateBar : {
      padding: 5,
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 15,
      marginBottom: 10,
  },
}))