import React,{useEffect} from 'react';
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
import {Link} from 'react-router-dom'
import {InputBase,Button, LinearProgress} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { useHistory } from 'react-router';
import Api from '../../api/api';
const columns = [
  { id: 'acno', label: 'Ac no', minWidth: 50 },
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
    maxHeight: 470,
    maxWidth : '100%',
    
  
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

export default function ResgisteredMemMobile(props) {
  const classes = useStyles();
  const history = useHistory()
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setData] = React.useState([])
  const [loading,setLoading] = React.useState(false)
  const [massg,setMassg] = React.useState({})
  const [popup, setPopup] = React.useState(false)
  const queryParameters = new URLSearchParams(window.location.search)
  const id = queryParameters.get("id")
  const b_id = queryParameters.get("b_id")
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(()=>{
    const formData = new FormData()
    formData.append('agnt',id)
    formData.append('b_id',b_id)
    fetch(Api+'allLoanMobile',{
      method : 'POST',
      body : formData
    })
    .then(res=>res.json())
    .then(res=>setData(res))
    .catch(err=>{
       console.log(err)
    })
  },[])
 
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChange = (event)=>{
    event.preventDefault()
    let value = event.target.value;
    
    const form = new FormData
    form.append('search',value)
    form.append('agnt',id)
    setLoading(true)
    fetch(Api+'search_rstrsnMobile',{
      method : 'POST',
      body : form
    })
    .then(res=>res.json())
    .then(res=>{
      setData(res)
      setLoading(false)
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

const handleEdit = (item)=>{
  history.push('/Home/SavHome/ProfileModify',{data : item})
}

  return (
    <Paper className={classes.root}>
    <Paper component="form" className={classes.search}>
    <InputBase
    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
    placeholder="Search by account no or name"
    inputProps={{ 'aria-label': 'Search by account no or name' }}
    className={classes.input}
    onChange={handleChange}
    />
    <IconButton  aria-label="search">
    <SearchIcon />
    </IconButton>


</Paper>
{
      loading ? <LinearProgress /> : ''
    }
    <TableContainer className={classes.container}>
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
              <TableCell align="center" style={{padding: 0}} >
              
                <Link to={{ pathname: '/CreateSavMobile', query: {ac: row.acno, id : id }}} style={{ textDecoration: 'none' }}>
                <IconButton style={{margin: 0}}>
                    <CreateIcon />
                </IconButton>
                </Link>
              </TableCell>
             
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    </TableContainer>
    <TablePagination
        rowsPerPageOptions={[ 10 , 100]}
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
