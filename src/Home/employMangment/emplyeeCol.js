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
    IconButton,
    Toolbar,
    Button,
} from '@material-ui/core'
import Api from '../../api/api'
import { ArrowBack, MoreVert, Report } from '@material-ui/icons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
export default function AgentColl(props) {
    const classes = use_styles();
    const history = useHistory();

    const today = new Date()
    let Dataes = props.location.state.data
    const next = today.setDate(today.getDate() + 7);
    const [date, setDate] = React.useState({
        to: new Date().toLocaleDateString("en-CA"),
        form: new Date(next).toLocaleDateString("en-CA"),
        agent_id: Dataes.id
    })


    const handleDate = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setDate({
            ...date,
            [name]: value,

        })
    }


    const [Data, setData] = React.useState({
        from_sav: {
            deposit: 0
        },
        from_rd: {
            deposit: 0
        },
        from_emi: {
            deposit: 0
        }
    })


    React.useEffect(() => {
        setDate({
            ...date,
            agent_id: Dataes.id
        })
    }, [props.location.state.random])
    const [refresh, setRefresh] = React.useState(Math.random())
    const [loading, setLoading] = React.useState(false)

    React.useEffect(async () => {
        setLoading(true)
        const sesDate = JSON.parse(sessionStorage.getItem('cash_date'))
        if (!sesDate === false) {
            setDate(sesDate)
        }

        fetch(Api + 'employeCol', {
            method: 'POST',
            body: JSON.stringify(date)
        })
            .then(res => res.json())
            .then(res => setData(res))
            .catch(err => console.log(err))

    }, [refresh])

    const handleRedirectRd = () => {
        history.push('/Home/EmployHome/RdCollectionDetails', { agent_id: date.agent_id });
    }
    const handleRedirectSavings = () => {
        history.push('/Home/EmployHome/SavingsCollectionDetails', { agent_id: date.agent_id });
    }
    const handleRedirectLoan = () => {
        history.push('/Home/EmployHome/LoanCollectionDetails', { agent_id: date.agent_id });
    }
    return (
        <Container>
            <Toolbar component={Paper} className={classes.dateBar}>
                <IconButton onClick={() => history.push('/Home/EmployHome')}>
                    <ArrowBack />
                </IconButton>
                <h2>Employee Collection Record</h2>
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
                        name="form"
                        style={{ marginLeft: 10, }}
                        value={date.form}
                        onChange={handleDate}
                    />
                    <Button onClick={() => setRefresh(Math.random())} variant='contained' color='primary' style={{ marginLeft: 10, marginRight: 5 }}>
                        search
                    </Button>
                </div>
            </Toolbar>
            <Paper>
                <TableContainer className={classes.table}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Particulrs</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Savings Collected</TableCell>
                                <TableCell>Rs.{Number(Data.from_sav.deposit).toFixed(2)}</TableCell>
                                <TableCell>Rs.{Number(Data.from_sav.deposit).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button variant='contained' color='primary' size='small' onClick={handleRedirectSavings}>
                                        Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>RD Collected</TableCell>
                                <TableCell>Rs.{Number(Data.from_rd.deposit).toFixed(2)}</TableCell>
                                <TableCell>Rs.{Number(Data.from_rd.deposit).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button variant='contained' color='primary' size='small' onClick={handleRedirectRd}>
                                        Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Emi Collected</TableCell>
                                <TableCell>Rs.{Number(Data.from_emi.deposit).toFixed(2)}</TableCell>
                                <TableCell>Rs.{Number(Data.from_emi.deposit).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button variant='contained' color='primary' size='small' onClick={handleRedirectLoan}>
                                        details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
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
        justifyContent: 'space-between',
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