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
import { Typography, Button, Dialog, DialogContent, LinearProgress, TextField, FormControl, FormControlLabel, MenuItem, Select, InputLabel, Container, Toolbar, Grid, Divider } from '@material-ui/core'
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
        maxHeight: '73vh',
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
    const [customerPassword, setCustomerPassword] = React.useState('')
    const [customerEmail, setCustomerEmail] = React.useState('')
    const [customerMobile, setCustomerMobile] = React.useState('')
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

    const handleCreate = (value) => {
        setConformation(true)
        setAcNo({
            ac_no: value.acno,
            name: value.name,
            press: "custRes",
            pass: customerPassword,
            email: customerEmail,
            mobile: customerMobile
        })
    }
    const createCustomer = () => {
    if (!customerPassword) {
        setMssg({
            open: true,
            severity: 'error',
            massg: "Please enter a password"
        });
    } else {
        setLoading(true);
        // Use the current state values directly
        fetch(Api + 'custRes', {
            method: 'POST',
           
            body: JSON.stringify({
                ac_no: acNo.ac_no, // acNo will still hold the account number and name
                name: acNo.name,
                pass: customerPassword,
                email: customerEmail,
                mobile: customerMobile
            })
        })
        .then(res => res.json())
        .then(res => {
            setConformation(false);
            setLoading(false);
            if (res.code === 200) {
                setMssg({
                    open: true,
                    severity: 'success',
                    massg: res.massg
                });
                // Clear inputs after successful registration
                setCustomerEmail('');
                setCustomerMobile('');
                setCustomerPassword('');
            } else {
                setMssg({
                    open: true,
                    severity: 'error',
                    massg: res.massg
                });
            }
        })
        .catch(err => {
            setLoading(false);
            setMssg({
                open: true,
                severity: 'error',
                massg: "Failed to connect to the server"
            });
        });
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
                <Typography variant='h6' style={{ fontWeight: 'bold', textAlign: 'center', color: '#303F9F' }}>
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
                        <h2 style={{ textAlign: 'center' }}>Register Customer</h2>
                        <Divider style={{ marginBottom: 10 }} />
                        <div className="content">
                            {' '}
                            <TextField
                                variant='outlined'
                                value={customerEmail}
                                onChange={({ target: { value } }) => setCustomerEmail(value)}
                                label="Enter Email"
                                fullWidth
                                style={{ marginBottom: 10 }}
                            />
                            <TextField
                                variant='outlined'
                                value={customerMobile}
                                onChange={({ target: { value } }) => setCustomerMobile(value)}
                                label="Enter Mobile Number"
                                fullWidth
                                style={{ marginBottom: 10 }}
                            />
                            <TextField
                                variant='outlined'
                                value={customerPassword}
                                onChange={({ target: { value } }) => setCustomerPassword(value)}
                                label="Enter Password"
                                helperText="Using this password customer can login to his/her app."
                                fullWidth
                                style={{ marginBottom: 10 }}
                            />
                        </div>
                        <div className="actions" style={{ marginBottom: 20, display: 'flex', justifyContent: 'right' }}>
                            <Button
                                className="button"
                                onClick={() => setConformation(false)}
                                variant="contained"
                                color="secondary"
                                size='small'
                                style={{ marginRight: 10 }}
                            >
                                cancel
                            </Button>
                            <Button
                                className="button"
                                onClick={() => createCustomer()}
                                variant="contained"
                                color="primary"
                                size='small'
                            >
                                Register Customer
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <TableContainer style={{ height: '83vh', overflow: 'auto' }}>
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
                    rowsPerPageOptions={[5, 10, 100]}
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
