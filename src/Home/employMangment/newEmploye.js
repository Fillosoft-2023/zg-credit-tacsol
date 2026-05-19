import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton'
import CreateIcon from '@material-ui/icons/Create';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { Typography, Button, Dialog, DialogContent, LinearProgress, TextField, FormControl, FormControlLabel, MenuItem, Select, InputLabel, Container, Toolbar, Grid } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar'
import { InputBase } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import Api from '../../api/api';
import SnakBar from '../../consts/message';
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const columns = [
  { id: 'acno', label: 'Reg No', minWidth: 50 },
  { id: 'name', label: 'Name', minWidth: 100 },
  {
    id: 'f_name',
    label: 'C/O',
    minWidth: 100,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },

  {
    id: 'c_nmbr',
    label: 'Contact no',
    minWidth: 100,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}



const useStyles = makeStyles({
  root: {
    width: '100%',

  },
  container: {
    maxHeight: '83vh',
    maxWidth: '100%',


  },
  search: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    margin: 5

  },
  input: {

    flex: 1,
  },
});

export default function ResgisteredMem(props) {
  const classes = useStyles();
  const history = useHistory()
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setData] = React.useState(props.myProp)
  const [err, setErr] = useState({})
  const [mssg, setMssg] = useState({})
  const [loading, setLoading] = useState(false)
  const [employeePass, setEmployeePass] = React.useState('')
  const [comPercent, setComPercent] = React.useState({})

  const [role, setRole] = useState('')
  const [type, setType] = useState('')

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMssg({
      open: true,
      severity: 'error',
      massg: "Sorry!, Something went wrong"
    });

  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [conformation, setConformation] = React.useState(false)
  const [acNo, setAcNo] = React.useState()
  const [percentages, setPercentage] = React.useState({
    loan: {
      type: 'loan',
      percent: ''
    },
    rd: {
      type: 'rd',
      percent: ''
    },
    savings: {
      type: 'savings',
      percent: ''
    }
  })
  const handleChangePercent = (e) => {
    let name = e.target.name;
   
      setPercentage({
        ...percentages,
        [name]: {
          ...percentages[name],
          percent:e.target.value

        }
      }

      )

    
  }
  const handleCreate = (value) => {
    setConformation(true)
    setAcNo({
      ac_no: value.acno,
      name: value.name,
      press: "employeRes",
      pass: employeePass,
      role: role,
      type: type,
    })

  }
  const validate = () => {
    let valid = true
    let err = {}

    if (!percentages.loan.percent) {
      valid = false
      err['loan'] = true
    }
    if (!percentages.rd.percent) {
      valid = false
      err['rd'] = true
    }
    if (!percentages.savings.percent) {
      valid = false
      err['savings'] = true
    }
    setErr(err)
    return valid
  }

  const createEmploye = () => {
    if (validate()) {

      if (!employeePass && !role) {
        setMssg({
          open: true,
          severity: 'error',
          massg: "Please enter a password"
        });
      } else {
        setLoading(true)
        fetch(Api + 'employeRes', {
          method: 'POST',
          body: JSON.stringify({...acNo,com_percent:percentages})
        })
          .then(res => res.json())
          .then(res => {
            setConformation(false)
            setLoading(false)
            if (res.code === 200) {
              // history.go('/Home/EmployHome/')

              setMssg({
                open: true,
                severity: 'success',
                massg: res.massg
              });
            } else {
              setMssg({
                open: true,
                severity: 'error',
                massg: res.massg
              });
            }
          })
          .catch(err => {
            setLoading(false)
            setMssg({
              open: true,
              severity: 'error',
              massg: "Faild to connect to the server"
            });
          })
      }

    }
  }

  const handleChange = (event) => {

    let value = event.target.value;

    const form = new FormData
    form.append('search', value)
    setLoading(true)
    fetch(Api + 'search_rstrsn', {
      method: 'POST',
      body: form
    })
      .then(res => res.json())
      .then(res => {
        setData(res)
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        setMssg({
          open: true,
          severity: 'error',
          massg: "Faild to connect to the server"
        });
      })
  }


  return (
    <Container component={Paper} maxWidth="false" style={{ padding: 0 }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'center' }} component={Paper} >
        <Typography variant='h6' style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Registered Members
        </Typography>
      </Toolbar>

      {
        loading ? <LinearProgress /> : ''
      }
      <Paper variant='outlined' style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', padding: 5 }}>
        <InputBase
          onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
          placeholder="Search by Reg no or name"
          inputProps={{ 'aria-label': 'Search by Reg no or name' }}
          className={classes.input}
          onChange={handleChange}
        />
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <Dialog
        open={conformation}
        onClose={() => setConformation(false)}
      >
        <DialogContent>
          <div className="modal">
            {
              loading ? <LinearProgress /> : ''
            }
            <h2> Confirmation Massage </h2>
            <div className="content">
              {' '}
              <TextField
                variant='outlined'
                value={employeePass}
                onChange={({ target: { value } }) => setEmployeePass(value)}
                label="Enter Password"
                helperText="Using this password employe can login to his/her app"
                fullWidth


              />
              <TextField
                variant='outlined'
                value={percentages.loan.percent}
                name='loan'
                onChange={handleChangePercent}
                label="Loan  Percentage"
                fullWidth
                style={{ marginTop: 10 }}
                error={err.loan}


              />
              <TextField
                variant='outlined'
                name='rd'
                value={percentages.rd.percent}
                onChange={handleChangePercent}
                label="RD  Percentage"
                fullWidth
                style={{ marginTop: 10 }}
                error={err.rd}


              />
              <TextField
                variant='outlined'
                value={percentages.savings.percent}
                name='savings'
                onChange={handleChangePercent}
                label="Savings  Percentage"
                fullWidth
                style={{ marginTop: 10 }}
                error={err.savings}


              />

              <FormControl variant='outlined' fullWidth margin='normal' style={{ marginBottom: 20 }} >
                <InputLabel id="demo-simple-select-outlined-label">Agent Type</InputLabel>
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}

                >
                  <MenuItem value="Branch Admin" >Branch Admin</MenuItem>
                  <MenuItem value="Collector">Collector</MenuItem>
                  <MenuItem value="Oparator">Oparator</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="actions">


              <Button
                className="button"
                onClick={() => createEmploye()}
                variant="contained"
                color="primary"
                size='small'
              >
                Create Employee
              </Button>
              <Button
                className="button"
                onClick={() => setConformation(false)}
                variant="contained"
                color="secondary"
                size='small'
                style={{ marginLeft: 5 }}
              >
                cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <TableContainer style={{ height: '70vh', overflow: 'auto' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell>
                Create
              </TableCell>
              
            </TableRow>

          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.acno}>
                  {columns.map((column) => {
                    const value = row[column.id];

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>

                    );
                  })}
                  <TableCell style={{ padding: 0 }} >

                    <Button onClick={() => handleCreate(row)} variant='contained' size='small' style={{ backgroundColor: 'green', color: '#fff', marginLeft: 20 }}>
                      Create
                    </Button>

                  </TableCell>
                  
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>
      <SnakBar massg={mssg} setMassg={setMssg} />

    </Container>
  );
}
