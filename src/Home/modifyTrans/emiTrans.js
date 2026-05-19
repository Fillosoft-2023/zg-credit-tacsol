import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Container,
  LinearProgress,
  Button,
  Snackbar,
  makeStyles,
  TablePagination,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Toolbar,
} from '@material-ui/core';
import DeleteEmi from './deleteEmi';
import Api from '../../api/api';
import SnakBar from '../../consts/message';

const useStyles = makeStyles(() => ({
  dateBar: {
    padding: 5,
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 15,
    marginBottom: 10,
  },
  list: {
    maxHeight: 'calc(100vh - 200px)',
    overflowY: 'auto',
  },
}));

export default function EmiTrans() {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(Math.random());
  const [date, setDate] = useState({
    to: new Date().toLocaleDateString('en-CA'),
    from: new Date().toLocaleDateString('en-CA'),
  });
  const [loading, setLoading] = useState(false);
  const [massg, setMassg] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false)
  const style = useStyles();

  useEffect(() => {
    setLoading(true);
    fetch(Api + 'emitrans', {
      method: 'POST',
      body: JSON.stringify(date),
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.map(item => ({ ...item, checked: false })))
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setMassg({
          open: true,
          severity: 'error',
          massg: 'Failed to connect to the server',
        });
      });
  }, [refresh, date]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setDate((prevDate) => ({
      ...prevDate,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    setRefresh(Math.random());
  };

  const onChecked = (item, index) => {
    console.log(item.checked);
    const modify = data.slice(); // Create a copy of the array
    modify[index] = {
      ...modify[index],
      checked: !item.checked
    };
    setData(modify);
  }
  const selectAll = () => {
    console.log('Select All Clicked');
    const updatedData = data.map((item) => ({ ...item, checked: true }));
    setData(updatedData);
  };

  const sendSms = ()=>{
    fetch(Api+'sendSMSemiTransaction',{
      method : 'POST',
      body : JSON.stringify(data)
    })
    .then(res=>res.json())
    .then(res=>{
      // console.log(res)
      // if(!res[0].Error){
        setMassg({
          open : true,
          severity : 'success',
          massg : "SMS SENT SUCCESSFULL"
        })
      // }else{
      //   setMassg({
      //     open : true,
      //     severity : 'error',
      //     massg : "SMS FAILED"
      //   })
      // }
    })
    .catch(err=>{
       console.log(err)
    })
  }
  return (
    <Container maxWidth="false" style={{padding:0}}>
      <Toolbar component={Paper} style={{display:'flex',justifyContent:'space-between'}}>
        <div>
        <Typography style={{ margin: 5, marginRight: 20, textAlign: 'center',fontWeight:'bold' }}>
          EMI transaction
        </Typography>
        </div>
        <div>
        
        <TextField
          size='small'
          name='ac_no'
          variant='outlined'
          label='Search by ac no'
          value={date.ac_no}
          onChange={handleDateChange}
        />
        <TextField
          type='date'
          variant='outlined'
          size='small'
          name='to'
          value={date.to}
          onChange={handleDateChange}
        />
        <TextField
          type='date'
          variant='outlined'
          size='small'
          name='from'
          style={{ marginLeft: 10 }}
          value={date.from}
          onChange={handleDateChange}
        />
        <Button
          variant='contained'
          style={{ marginLeft: 10 }}
          color='primary'
          onClick={handleSearch}
        >
          Search
        </Button>
        </div>
      </Toolbar>
      <TableContainer component={Paper} className={style.list}>
        {loading ? <LinearProgress /> : null}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Received Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Loan id</TableCell>
              <TableCell>Ac No</TableCell>
              <TableCell>EMI Amount</TableCell>
              <TableCell>Received Amount</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.recived_date}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.ac_no}</TableCell>
                  <TableCell>{item.emi_amnt}</TableCell>
                  <TableCell>{item.ttl}</TableCell>
                  <TableCell>
                    <DeleteEmi props={item} setRefresh={setRefresh} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>
      {/* <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={massg.open}
        autoHideDuration={6000}
        onClose={() => setMassg({})}
        message={massg.massg}

      /> */}
      <Dialog
        open={dialogOpen}
        onClose={()=>setDialogOpen(false)}
      >
        <DialogTitle>
          Conformation
        </DialogTitle>
        <DialogContent>
           You have selected {data.length} rows to send SMS. Are you sure you want to proceed?
        </DialogContent>
        <DialogActions>
        <Button onClick={selectAll} variant="contained" color="primary" style={{ marginRight: 5 }}>
          CONFIRM
        </Button>
        </DialogActions>
      </Dialog>
      

      <SnakBar massg={massg} setMassg={setMassg} />
    </Container>
  );
}
