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
    Button,
    Toolbar
} from '@material-ui/core'
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';
import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer'
import MyDocument from './../../pdf/juornal/insurenceColRecord'
import GetAppIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import DateHandler from '../../consts/date_format';
import Api from '../../api/api';
export default function FineCollection() {
    const classes = use_styles();
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [ready, setReady] = React.useState(false)
    const [send, setSendData] = React.useState(null)
    const [date, setDate] = React.useState({
        to: new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
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
    const [AllData, setAllData] = React.useState([])
    const [modifyData, setModifyData] = React.useState({})
    React.useEffect(async () => {

        fetch(Api + 'ladgerBookFine', {
            method: 'POST',
            body: JSON.stringify(date)
        })
            .then(res => res.json())
            .then(res => {
                // setData([res.from_emi,res.from_sav]) 
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])


    const onSearch = () => {
        fetch(Api + 'ladgerBookFine', {
            method: 'POST',
            body: JSON.stringify(date)
        })
            .then(res => res.json())
            .then(res => {
                setData(res); // res will now be an array of records
            })
            .catch(err => console.log(err));
    };

    React.useEffect(() => {
        const mergeDedupe = (arr) => {
            return [...new Set([].concat(...arr))];
        }

        setData(mergeDedupe(AllData))
        console.log(Data)
    }, [AllData])


    let sum = 0
    const filename = Math.floor(Math.random() * 10000000);
    const handleDownload = () => {
        setSendData(Data)
        setReady(true)
    }
    return (
        <Container>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Typography style={{ fontWeight:'bold',color:'#303F9F'}}>Fine Collection Records</Typography>
                </div>
                {/* <TextField
                type="date"
                variant="outlined"
                size="small"
                name="to"
                value={date.to}
                onChange={handleDate}
                
            /> */}
                <div>
                    <TextField
                        type="month"
                        variant="outlined"
                        size="small"
                        name="from"
                        style={{ marginLeft: 10, }}
                        value={date.from}
                        onChange={handleDate}

                    />
                    <Button onClick={onSearch} style={{ marginLeft: 10 }}  color='primary' variant='contained'>
                        Search
                    </Button>
                    {
                        ready ? (
                            <PDFDownloadLink document={<MyDocument callback={send} DateDiffer={date} />} fileName={filename + "FineCollectionRecord.pdf"}>
                                {({ blob, url, loading, error }) => (loading ? 'Loading document...' :
                                    <Tooltip title="download this sheet">
                                        <IconButton onClick={() => setReady(false)}>
                                            <GetAppIcon />
                                        </IconButton>
                                    </Tooltip>

                                )}
                            </PDFDownloadLink>

                        ) : (

                            <Tooltip title="Print list">
                                <Button variant='outlined' color='primary' style={{ marginLeft: 10 }} onClick={() => handleDownload()}>
                                    <PrintIcon />
                                </Button>
                            </Tooltip>
                        )
                    }
                </div>
            </Toolbar>
            <Paper>
                <TableContainer className={classes.table}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Sl No.</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Detail</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Type</TableCell>
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
                                            <TableCell>Fine collection from {item.ac_no}</TableCell>
                                            <TableCell style={{ color: '#ff0000ff' }}>{item.amount}</TableCell>
                                            <TableCell style={{ color: '#ff0000ff' }}>Fine</TableCell>
                                            <TableCell style={{ color: '#ff0000ff' }}>{sum}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
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