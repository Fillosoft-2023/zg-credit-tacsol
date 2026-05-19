import React from "react";
import {
    Button,
    Container, Divider, Grid, IconButton, LinearProgress, List, ListItem, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Tooltip, Typography
} from '@material-ui/core'
import Api from "../../api/api";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useHistory } from "react-router-dom";
import { ArrowBack, Delete, RefreshRounded } from "@material-ui/icons";
import SnakBar from "../../consts/message";
export default function CustomerPayments() {
    const [Data, setData] = React.useState([])
    const [sav, setSavings] = React.useState([])
    const [massg, setMassg] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    const navigate = useHistory()
    const [refresh, setRefresh] = React.useState(Math.random())
    const [rdData, setRdData] = React.useState([]);

    React.useEffect(() => {
        setLoading(true)
        fetch(Api + 'customerPayments')
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                setData(res.loan)
                setSavings(res.savings)
                setRdData(res.rd);

            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }, [refresh])
    return (
        <Container maxWidth="false" component={Paper} elevation={0} variant="none" style={{ padding: 0 }}>
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }} component={Paper} elevation={2}>
                <IconButton onClick={() => navigate.push('/Home/CustomerHome')}>
                    <ArrowBack />
                </IconButton>
                <h2 style={{ color: '#303F9F' }}>Customer Payments</h2>
                <Button variant="text" onClick={() => setRefresh(Math.random())} style={{ marginLeft: 5 }} >
                    <RefreshRounded style={{ fontSize: '25px', color: 'green' }} />
                </Button>
            </Toolbar>
            <Grid container spacing={1}>
                <Grid item sm={12} md={12} lg={12}>
                    <TableContainer style={{ height: '37vh', overflow: 'auto', marginTop: 5 }} component={Paper} elevation={5}>
                        <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography style={{ textAlign: 'center', fontWeight: 'bold', color: '#303F9F' }}>Loan A/C</Typography>
                        </Toolbar>

                        {
                            loading ? <LinearProgress /> : ''
                        }
                        <Table size="small">
                            <TableHead style={{ backgroundColor: '#888888' }}>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Sl No.</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Name</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Date</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Type</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Amount</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>More</TableCell>
                            </TableHead>
                            <TableBody>
                                {
                                    Data.map((item, index) =>
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.up_date}</TableCell>
                                            <TableCell>EMI</TableCell>
                                            <TableCell>Rs.{Number(item.amount).toFixed(2)}</TableCell>
                                            <TableCell style={{
                                                color:
                                                    item.status === 'pending'
                                                        ? '#F4A800'
                                                        : item.status === 'approved'
                                                            ? '#22B33A'
                                                            : item.status === 'rejected'
                                                                ? '#F60002'
                                                                : 'transparent',
                                                borderRadius: 20,

                                                textTransform: 'uppercase',
                                                fontWeight: 'bold'
                                            }}>{item.status}</TableCell>
                                            <TableCell>
                                                <IconButton size="small" onClick={() => navigate.push('/Home/CustomerHome/CustomerLoanPayments', item)} >
                                                    <NavigateNextIcon />
                                                </IconButton>

                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item sm={6} md={6} lg={6}>
                    <TableContainer style={{ height: '38vh', overflow: 'auto', marginTop: 5 }} component={Paper} elevation={5}>
                        <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography style={{ textAlign: 'center', fontWeight: 'bold', color: '#303F9F' }}>Savings A/C</Typography>
                        </Toolbar>
                        <Table size="small">
                            <TableHead style={{ backgroundColor: '#888888' }}>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Sl No.</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Name</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Date</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Type</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Amount</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>More</TableCell>
                            </TableHead>
                            <TableBody>
                                {
                                    sav.map((item, index) =>
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.up_date}</TableCell>
                                            <TableCell>{item.scheme}</TableCell>
                                            <TableCell>{item.amount}</TableCell>
                                            <TableCell style={{
                                                color:
                                                    item.status === 'pending'
                                                        ? '#F4A800'
                                                        : item.status === 'approved'
                                                            ? '#22B33A'
                                                            : item.status === 'rejected'
                                                                ? '#F60002'
                                                                : 'transparent',
                                                borderRadius: 20,

                                                textTransform: 'uppercase',
                                                fontWeight: 'bold'
                                            }}>{item.status}</TableCell>
                                            <TableCell>
                                                <IconButton size="small" onClick={() => navigate.push('/Home/CustomerHome/CustomerSavingsPayments', item)} >
                                                    <NavigateNextIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item sm={6} md={6} lg={6}>
                    <TableContainer style={{ height: '38vh', overflow: 'auto', marginTop: 5 }} component={Paper} elevation={5}>
                        <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography style={{ textAlign: 'center', fontWeight: 'bold', color: '#303F9F' }}>RD A/C</Typography>
                        </Toolbar>
                        <Table size="small">
                            <TableHead style={{ backgroundColor: '#888888' }}>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Sl No.</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Name</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Date</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Type</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Amount</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>More</TableCell>
                            </TableHead>
                            <TableBody>
                                {
                                    rdData.map((item, index) =>
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.up_date}</TableCell>
                                            <TableCell>{item.scheme}</TableCell>
                                            <TableCell>{item.amount}</TableCell>
                                            <TableCell style={{
                                                color:
                                                    item.status === 'pending'
                                                        ? '#F4A800'
                                                        : item.status === 'approved'
                                                            ? '#22B33A'
                                                            : item.status === 'rejected'
                                                                ? '#F60002'
                                                                : 'transparent',
                                                borderRadius: 20,

                                                textTransform: 'uppercase',
                                                fontWeight: 'bold'
                                            }}>{item.status}</TableCell>
                                            <TableCell>
                                                <IconButton size="small" onClick={() => navigate.push('/Home/CustomerHome/CustomerRdPayments', item)} >
                                                    <NavigateNextIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

            </Grid>
            <SnakBar massg={massg} setMassg={setMassg} />
        </Container>
    )
}