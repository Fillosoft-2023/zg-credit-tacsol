import React from 'react'
import {
    Container,
    Paper,
    makeStyles,
    TextField,
    TableContainer,
    TableCell,
    TableBody,
    TableRow,
    TableHead,
    Table,
    Typography,
    Tooltip,
    IconButton,
    LinearProgress,
    Toolbar,
    Button,
    TableFooter,
    Divider
} from '@material-ui/core'
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';
import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer'
import MyDocument from './../../pdf/juornal/expenseColRecord'
import GetAppIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import DateHandler from '../../consts/date_format';
import Api from '../../api/api';
import FaildToConnect from '../../consts/faild';
import { Search } from '@material-ui/icons';
export default function Expence(props) {
    const classes = use_styles();
    const today = new Date()
    let Dataes = props.location.state.data
    const next = today.setDate(today.getDate() + 7);
    const [ready, setReady] = React.useState(false)
    const [send, setSendData] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [refresh, setRefresh] = React.useState(Math.random())

    const [date, setDate] = React.useState({
        to: new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
        press: "employeLadger",
        id: Dataes.id
    })
    const handleDate = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setDate({
            ...date,
            [name]: value,

        })
    }
    const [Data, setData] = React.useState([])
    React.useEffect(() => {
        setDate({
            ...date,
            id: Dataes.id
        })
    }, [Dataes])
    const [balance, setBalance] = React.useState([])


    React.useEffect(() => {
        fetch(Api + 'employeCommisionWith', {
            method: 'POST',
            body: JSON.stringify({ id: Dataes.id })
        })
            .then(res => res.json())
            .then(res => {
                setBalance(res[0]);
                console.log(res);
            })
            .catch(err => console.log(err));
    }, [refresh])


    React.useEffect(async () => {
        setLoading(true)
        const sesDate = JSON.parse(sessionStorage.getItem('cash_date'))
        if (!sesDate === false) {
            setDate(sesDate)
        }
        fetch(Api + 'employeLadger', {
            method: 'POST',
            body: JSON.stringify(date)
        })
            .then(res => res.json())
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err =>{setLoading(false)
            }
            )

    }, [refresh])
    const cumulativeSum = (sum => value => sum += value)(0);
    let sum = 0
    const filename = Math.floor(Math.random() * 10000000);
    const handleDownload = () => {
        setSendData(Data)
        setReady(true)
    }
    return (
        <Container component={Paper} style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Typography variant='h6' style={{ fontWeight: 'bold' }}>Employee Comission Record</Typography>
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
                    <Button onClick={() => setRefresh(Math.random())} variant='contained' color='primary' style={{ marginLeft: 5, marginRight: 5 }}>
                        <Search />
                    </Button>

                </div>
            </Toolbar>
            <Paper>
                {loading ? <LinearProgress /> : ''}
                <TableContainer style={{ height: '78vh' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Sl No.</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>A/C Type</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Balance</TableCell>


                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                Data.map((item, index) => {

                                    sum += Number(item.amount)
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{DateHandler(item.date)}</TableCell>
                                            <TableCell style={{ textTransform: 'uppercase' }}>{item.type}</TableCell>
                                            <TableCell>{item.com_from}</TableCell>
                                            <TableCell style={{ color: (item.type !== 'deposit') ? 'red' : 'green' }}>Rs.{Number(item.amount).toFixed(2)}</TableCell>
                                            <TableCell >Rs.{Number(sum).toFixed(2)}</TableCell>
                                        </TableRow>

                                    )
                                })
                            }

                        </TableBody>
                        <TableFooter>

                            <TableRow>
                                <TableCell >
                                    Total Commission Generated
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>

                                <TableCell style={{ color: 'red', fontWeight: 'bold' }}>Rs.{Number(balance.total_deposit).toFixed(2)}</TableCell>
                            </TableRow>
                           
                            <TableRow>
                                <TableCell>
                                    Available Balance
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell style={{ color: 'red', fontWeight: 'bold' }}>Rs. {Number(balance.tot_with).toFixed(2)}</TableCell>
                            </TableRow>
                        </TableFooter>

                    </Table>


                </TableContainer>
            </Paper>

        </Container>
    )
}

const use_styles = makeStyles(() => ({
    dateBar: {
        padding: 5,
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 15,
        marginBottom: 10,
    },
    table: {
        maxHeight: '75vh',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
            width: '0.4em',

            backgroundColor: 'rgba(0,0,0,0,0)'
        },

        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',

            borderRadius: 4,

        },
    }
}))