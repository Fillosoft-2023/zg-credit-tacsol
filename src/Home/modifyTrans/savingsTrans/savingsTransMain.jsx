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
  Container,
  Typography,
  TextField,
  CircularProgress,
  LinearProgress,
  Toolbar
} from '@material-ui/core'
// import sendAsync from '../../../backend/renderer'
import DeleteIcon from '@material-ui/icons/Delete';
import Api from '../../../api/api';
import SnakBar from '../../../consts/message';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function SavingsTransMain(props) {
  const [Data, setData] = React.useState([])
  const style = useStyle()
  const [isRefreshed, setIfRefresed] = React.useState(Math.random())
  const today = new Date()
  const next = today.setDate(today.getDate() + 7);
  const [massg, setMassg] = React.useState({})
  const [loading, setLoading] = React.useState(false)
  const [dataLoading, setDataLoading] = React.useState(false)
  const [date, setDate] = React.useState({
    to: new Date().toLocaleDateString("en-CA"),
    from: new Date(next).toLocaleDateString("en-CA"),
    press: "savtrans",
  })
  const handleDate = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    setDate({
      ...date,
      [name]: value,

    })


  }
  React.useEffect(() => {
    setDataLoading(true);
    fetch(Api + 'savtrans', {
      method: 'POST',
      body: JSON.stringify(date)
    })
      .then(res => res.json())
      .then(res => {
        setData(res);
        setDataLoading(false);
      })
      .catch(err => {
        setDataLoading(false)
        setMassg({
          open: true,
          severity: 'error',
          massg: 'Faild to connect to the server'
        })
      })
  }, [isRefreshed])

  const [open, setOpen] = React.useState(false);

  const [sendData, setSendData] = React.useState({})
  const handleClickOpen = (item) => {
    setSendData({
      id: item.id,
      "press": "delete_Sav"
    })
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  const handleSearch = () => {
    setIfRefresed(Math.random())
  }

  const handleSubmit = () => {
    setLoading(true)
    fetch(Api + 'delete_Sav', {
      method: 'POST',
      body: JSON.stringify(sendData)
    })
      .then(res => res.json())
      .then(res => {
        setLoading(false)
        setIfRefresed(Math.random())
        setTimeout(() => { setOpen(false) }, 1000)
        if (res.code === 200) {
          setMassg({
            open: true,
            severity: 'success',
            massg: res.massg
          })
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
  return (
    <Container component={Paper} style={{ padding: 0, margin: 0,height:'81vh' }}>
      <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between',marginBottom:5 }}>
        <div>
          <Typography variant='h6' style={{fontWeight:'bold'}}>Savings A/C Transaction</Typography>
        </div>
        <div>
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
            style={{ marginLeft: 10, }}
            value={date.from}
            onChange={handleDate}

          />
          <Button variant='contained' style={{ marginLeft: 10 }} color='primary' onClick={() => handleSearch()}>
            Search
          </Button>
        </div>

      </Toolbar>
      <TableContainer component={Paper} className={style.list} elevation={0}>
        {dataLoading ? <LinearProgress /> : ''}
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Account No</TableCell>
              <TableCell>RD Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              Data.map((item, index) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.ac_no}</TableCell>
                    {
                      item.dep != 0 ? (

                        <TableCell>{item.dep}</TableCell>

                      ) : item.int != 0 ? (
                        <TableCell>{item.int}</TableCell>
                      ) : item.fine != 0 ? (
                        <TableCell>{item.fine}</TableCell>
                      ) : (
                        <TableCell>{item.with}</TableCell>
                      )
                    }
                    {
                      item.dep != 0 ? (

                        <TableCell>Deposit</TableCell>

                      ) : item.int != 0 ? (
                        <TableCell>Interest</TableCell>
                      ) : item.fine != 0 ? (
                        <TableCell>fine</TableCell>
                      ) : (
                        <TableCell>withdrawal</TableCell>
                      )
                    }
                    <TableCell>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleClickOpen(item)}>
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
              Deleting this transaction can lost your information permanently!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Disagree
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Agree
              {loading ? <CircularProgress size={25} /> : ''}
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
      <SnakBar massg={massg} setMassg={setMassg} />
    </Container>
  )
}

const useStyle = makeStyles(() => ({
  list: {
    maxHeight: '73vh',

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
  dateBar: {
    padding: 5,
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 15,
    marginBottom: 10,
  },
}))