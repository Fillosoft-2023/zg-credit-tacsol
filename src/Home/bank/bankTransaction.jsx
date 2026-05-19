import { Button, Container, Dialog, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@material-ui/core'
import React from 'react'
import DateHandler from '../../consts/date_format';
import SnakBar from '../../consts/message'
import Api from '../../api/api'
import { SearchOutlined, SearchRounded } from '@material-ui/icons';

export default function BankTransaction() {
    const today = new Date()
    const [expense, setExpense] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const next = today.setDate(today.getDate() + 7);
    const [massg, setMassg] = React.useState({})
    const [refresh, setRefresh] = React.useState(Math.random())
    const [balance, setBalance] = React.useState(0)


    const [dates, setDate] = React.useState({
        to: new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
        press: "bankSer"
    })


    const handleDate = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setDate({
            ...dates,
            [name]: value,

        })
    }
    React.useEffect(() => {
        fetch(Api + 'bankSer', {
            method: 'POST',
            body: JSON.stringify(dates)
        })
            .then(res => res.json())
            .then(res => setExpense(res))
            .catch(err => {
                console.log(err)
            })
    }, [refresh])


    React.useEffect(() => {
        setLoading(true)
        fetch(Api + 'bankOpenBalance', {
            method: 'POST',
            body: JSON.stringify(dates)
        })
            .then(res => res.json())
            .then(res => {
                setBalance(Number(res[0].deposit_ttl) + Number(res[0].interest_ttl) - Number(res[0].withdrawal_ttl));
                setLoading(false)
                console.log(res)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }, [refresh])

    let sum = 0;
    let minus = 0;
    let deposit_ttl = 0;
    let interest_ttl = 0;
    let withdrawal_ttl = 0;
    return (
        <Container maxWidth="xxl" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Typography variant='h6' style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        Bank Transactions
                    </Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        name="to"
                        value={dates.to}
                        onChange={handleDate}

                    />
                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        name="from"
                        style={{ marginLeft: 10, }}
                        value={dates.from}
                        onChange={handleDate}

                    />
                    <Button onClick={() => setRefresh(Math.random())} variant='contained' color='primary' style={{ marginLeft: 5 }}>
                        <SearchRounded />
                    </Button >
                </div>

            </Toolbar>
            <TableContainer  component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sl No.</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Bank name</TableCell>
                            <TableCell>Remarks</TableCell>
                            <TableCell>User</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            expense.map((item, index) => {
                                if (item.trans_type === 'Withdrawal') {
                                    minus += Number(item.amount)
                                    withdrawal_ttl += Number(item.amount)
                                } else if (item.trans_type === 'Deposit') {
                                    sum += Number(item.amount)
                                    deposit_ttl += Number(item.amount)
                                } else {
                                    sum += Number(item.amount)
                                }
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{DateHandler(item.date)}</TableCell>
                                        <TableCell>{item.amount}</TableCell>
                                        <TableCell>{item.trans_type}</TableCell>
                                        <TableCell>{item.bank_name}</TableCell>
                                        <TableCell>{item.remarks}</TableCell>
                                        <TableCell>{item.user}</TableCell>
                                    </TableRow>
                                )
                            })

                        }
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>{sum - minus}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid item xs={12} sm={12}>
                <Paper style={{ backgroundColor: '#e8e6e6' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Opening Balance</TableCell>
                                    <TableCell>Deposit Total</TableCell>
                                    <TableCell>Interest Total</TableCell>
                                    <TableCell>Withdrawl Total</TableCell>
                                    <TableCell>Closing Balance</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>

                                <TableRow >
                                    <TableCell>{balance.toFixed(2)}</TableCell>
                                    <TableCell>{deposit_ttl.toFixed(2)}</TableCell>
                                    <TableCell>{interest_ttl.toFixed(2)}</TableCell>
                                    <TableCell>{withdrawal_ttl.toFixed(2)}</TableCell>
                                    <TableCell>{(Number(balance) + deposit_ttl + interest_ttl - withdrawal_ttl).toFixed(2)}</TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>

        </Container>
    )
}

