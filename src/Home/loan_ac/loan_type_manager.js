import React from 'react'
import {
    Button,
    Container, Divider, Grid, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Toolbar, Typography
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import Api from '../../api/api';
import FaildToConnect from '../../consts/faild'
import SnakBar from '../../consts/message';
import { ArrowBack } from '@material-ui/icons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
export default function LoanType() {
    const navigate = useHistory()
    const [allData, setData] = React.useState([])
    const [type, setType] = React.useState('')
    const [interest, setInterest] = React.useState('')
    const [error, setErr] = React.useState(false)
    const [refresh, setRefresh] = React.useState(Math.random())
    const [massg, setMassg] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    React.useEffect(() => {
        fetch(Api + 'loan_type')
            .then(res => res.json())
            .then(res => setData(res))
    }, [refresh])

    const onSubmit = () => {

        if (type === '') {
            setErr(true)
        } else {
            setErr(false)
            setLoading(true)
            fetch(Api + 'addLoanType', {
                method: 'POST',
                body: JSON.stringify({ ln_type: type,interest:interest })
            })
                .then(res => res.json())
                .then(res => {
                    setLoading(false)
                    setRefresh(Math.random())
                    if (res.code === 200) {

                        setMassg({
                            open: true,
                            severity: 'success',
                            massg: res.status
                        })
                    } else {
                        setMassg({
                            open: true,
                            severity: 'error',
                            massg: res.status
                        })
                    }
                })
                .catch(err => {
                    setLoading(false)
                    setMassg({
                        open: true,
                        massg: "Faild to connect to the server",
                        severity: 'error'
                    })
                })

        }
    }
    const handleDelete = (id) => {
        setLoading(true)
        fetch(Api + 'del_loan_type', {
            method: 'POST',
            body: JSON.stringify({
                id: id
            })
        })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                setRefresh(Math.random())
                if (res.code === 200) {
                    setMassg({
                        open: true,
                        massg: res.status,
                        severity: 'success'
                    })
                } else {
                    setMassg({
                        open: true,
                        massg: res.status,
                        severity: 'error'
                    })
                }
            })
            .catch(err => {
                setLoading(false)
                setMassg({
                    open: true,
                    massg: "Faild to connect to the server",
                    severity: 'error'
                })
            })
    }
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item sm={8}>
                    {
                        loading ? <LinearProgress /> : ''
                    }
                    <Paper style={{ padding: 10 }}>
                        <Toolbar>
                            <IconButton onClick={() => navigate.push('/Home/LoanHome/CreateLoanDisstructured')}>
                                <ArrowBack />
                            </IconButton>
                            <h2>Create New Loan Scheme</h2>
                        </Toolbar>
                        <Divider style={{ margin: 10 }} />
                        <TextField
                            variant="outlined"
                            label="Loan Type"
                            value={type}
                            onChange={({ target: { value } }) => setType(value)}
                            error={error}
                            fullWidth
                            style={{ marginBottom: 10 }}
                        />
                        <TextField
                            variant="outlined"
                            label="Interest Rate"
                            value={interest}
                            onChange={({ target: { value } }) => setInterest(value)}
                            error={error}
                            fullWidth
                        />
                        <Button style={{ marginTop: 10 }} variant='contained' onClick={onSubmit} color='primary'>
                            Add Type
                        </Button>
                    </Paper>
                </Grid>
                <Grid sm={4}>
                    <Paper>
                        <Toolbar>
                            <h2>
                                Delete Loan Scheme
                            </h2>
                        </Toolbar>
                        <Divider style={{ margin: 10 }} />
                        <Table>
                            <TableHead>
                                <TableCell>Name</TableCell>
                                <TableCell>Interest Rate</TableCell>
                                <TableCell>Delete</TableCell>
                            </TableHead>
                            <TableBody>
                                {
                                    allData.map((item, index) =>
                                        <TableRow key={index}>
                                            <TableCell>
                                                {item.loan_type}
                                            </TableCell>
                                            <TableCell>
                                                {item.interest}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleDelete(item.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
            <SnakBar massg={massg} setMassg={setMassg} />
        </Container>
    )
}