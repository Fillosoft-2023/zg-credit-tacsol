import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { Button, InputBase, LinearProgress, Toolbar, Typography } from '@material-ui/core'
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Api from '../../api/api'
import IconButton from '@material-ui/core/IconButton'
import CreateIcon from '@material-ui/icons/Create';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom'

import { useHistory } from 'react-router';
import SearchIcon from '@material-ui/icons/Search'
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
 
  container: {
    height:'84vh',
    maxWidth: '100%',


  },
  search: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    margin: 1

  },
  input: {

    flex: 1,
  },
});

export default function ResgisteredFdMem(props) {
  const classes = useStyles();
  const history = useHistory()
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setData] = React.useState(props.myProp)
  const [loading, setLoading] = React.useState(false)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChange = (event) => {
    let value = event.target.value;
    let sendData = {
      search: value,
      prss: 'search_rstrsn'
    }


    // sendAsync(sendData).then((res)=>{
    //   setData(res)
    // })
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
        alert('Faild to connect to the server')
      })
  }
  const handleEdit = (item) => {
    history.push('/Home/FdHome/ProfileModify', { data: item })
  }
  return (
    <Paper className={classes.container}>
      <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography style={{ fontWeight: 'bold', textAlign: 'center',color:'#023E8A' }}>
          REGISTERED MEMBERS
        </Typography>
      </Toolbar>
      {
        loading ? <LinearProgress /> : ''
      }
      <Paper component="form" className={classes.search}>
        <InputBase
          onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
          placeholder="Search by account no or name"
          inputProps={{ 'aria-label': 'Search by account no or name' }}
          className={classes.input}
          onChange={handleChange}
        />
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>


      </Paper>
      <TableContainer >
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
              {/* <TableCell>
                More
              </TableCell> */}
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
                  <TableCell  style={{ padding: 0 }} >

                    <Link to={{ pathname: '/Home/FdHome/CreateFd', query: row.acno }} style={{ textDecoration: 'none' }}>
                    <Button variant='contained' size='small' style={{backgroundColor:'green',color:'#fff',marginLeft:20}}>
                       Create
                      </Button>
                    </Link>
                  </TableCell>
                  {/* <TableCell align="center" style={{ padding: 0 }}>
                    <IconButton style={{margin: 0}}>
                    <MoreVertIcon />
                </IconButton>
                    <Button color="primary" onClick={() => handleEdit(row)}>
                      Edit
                    </Button>
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
