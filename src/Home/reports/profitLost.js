import React from 'react'
import {
    Grid,
    Container,
    Paper,
    TextField,
    Typography,
    makeStyles,
    Table,
    TableContainer,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    Toolbar,
    Button

} from '@material-ui/core'
import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer'
import MyDocument from './../../pdf/profitLoss'
import GetAppIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import Api from '../../api/api';
export default function ProfitLoss() {
    const classes = style();
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [date, setDate] = React.useState({
        to: new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
        press: "profitLoss"
    })
    const handleDate = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setDate({
            ...date,
            [name]: value,

        })
    }

    const [Data, setData] = React.useState(null)
    const [totRecipts, setTotRecipts] = React.useState(null)
    const [totPayments, setTotPayments] = React.useState(null)
    const [Recipts, setRecipts] = React.useState(0);
    const [Payments, setPayments] = React.useState(0)
    const [ready, setReady] = React.useState(false)
    const [send, setSendData] = React.useState({})
    const [refresh, setRefresh] = React.useState(Math.random())
    const [loading, setLoading] = React.useState(false)

    React.useEffect(async () => {
        setLoading(true)
        const sesDate = JSON.parse(sessionStorage.getItem('cash_date'))
        if (!sesDate === false) {
            setDate(sesDate)
        }

        console.log(sesDate)
        fetch(Api + 'profitLoss', {
            method: 'POST',
            body: JSON.stringify(date)
        })
            .then(res => res.json())
            .then(res => {
                setData(res)
                setTotRecipts({
                    "Total Expenditure": (Number(res.from_expense.ex_amnt) + Number(res.from_expense_prop.ex_prop_amnt)).toFixed(2),
                    // "Interest Against Rd" : Number(Number(res.from_rd_mat.rd_mat_amnt) - Number(res.from_rd_mat.rd_dep_amnt)).toFixed(2),
                    "Interest Against TL": Number(res.from_ta_mat.ta_intr_amnt).toFixed(2),
                    "Interest Against RD": Number(res.from_savings_intrest.savings_intr).toFixed(2),
                    "Interest Against Savings": Number(res.from_savings_main_intrest.savings_main_intr).toFixed(2),
                    "Share devidend": Number(res.from_share_trans.dev),
                    "Property depreciation": Number(res.from_property_depr.amount),
                    "Transfered to other account": Number(res.from_other_ac.dep_amount)

                })
                setTotPayments({
                    "Interest Against Loan": Number(res.from_emi.loan_int_rec).toFixed(2),
                    "Interest From Bank": Number(res.from_bank_int.amount).toFixed(2),
                    "Processing Charge Received": Number(Number(res.from_ln_pros.loan_pros) + Number(res.from_ta_pros.ta_pros)).toFixed(2),
                    "Fine collected": (Number(res.from_emi.loan_fine) + Number(res.from_savings_intrest.fine)).toFixed(2),
                    "Property Buy": Number(res.from_expense_prop.ex_prop_amnt).toFixed(2),
                    "Share Admission Fees": Number(res.from_share_adm.share_admisson).toFixed(2),
                    "RD Processing Fees": Number(res.from_savings_proc.savings_prc).toFixed(2),
                    "Savings Processing Fees": Number(res.from_savings_main_proc.savings_main_prc).toFixed(2),
                    "Withdrwan from other account": Number(res.from_other_ac.with_amount)
                })
            })
            .catch(err => {
                console.log(err)
            })
    }, [refresh])


    function sum(obj) {
        return Object.keys(obj).reduce((sum, key) => sum + parseFloat(obj[key] || 0), 0);
    }
    // React.useEffect( async()=> {
    //     if(totRecipts != undefined){
    //         console.log(setRecipts(sum(totRecipts)))
    //     }



    // },[date])


    const handleDownload = () => {
        setSendData({
            recipts: totRecipts,
            payments: totPayments,
            date: date,
            recAmount: Recipts,
            payAmount: Payments
        })
        setReady(true)
    }
    const filename = Math.floor(Math.random() * 10000000);


    return (
        <Container maxWidth="false" component={Paper} style={{ padding: 10, margin: 0, height: '93vh' }}>
            <Toolbar component={Paper} style={{ marginBottom: 5, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                        Profit And Loss
                    </Typography>
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
                        style={{ marginLeft: 10, marginRight: 10 }}
                        value={date.from}
                        onChange={handleDate}

                    />
                    <Button onClick={() => setRefresh(Math.random())} variant='contained' color='primary' style={{ marginLeft: 5, marginRight: 5 }}>
                        Search
                    </Button>
                    {
                        ready ? (
                            <PDFDownloadLink document={<MyDocument callback={send} />} fileName={"profitloss.pdf"}>
                                {({ blob, url, loading, error }) => (loading ? 'Loading document...' :
                                    <Tooltip title="download this sheet">
                                        <Button variant='contained' color='primary' style={{ marginLeft: 10 }} onClick={() => setReady(false)}>
                                            <GetAppIcon />
                                        </Button>
                                    </Tooltip>

                                )}
                            </PDFDownloadLink>

                        ) : (

                            <Tooltip title="Print list">
                                <Button variant='contained' color='primary' style={{ marginLeft: 10 }} onClick={() => handleDownload()}>
                                    <PrintIcon />
                                </Button>
                            </Tooltip>
                        )
                    }
                </div>
            </Toolbar>

            <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                    <TableContainer component={Paper} style={{ height: '83.5vh' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Loss</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Particulars</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Amount</TableCell>
                                </TableRow>
                            </TableHead>

                            {
                                totRecipts != null && totPayments != null ? (
                                    <TableBody>{
                                        Object.keys(totRecipts).map((item, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{item}</TableCell>
                                                    <TableCell>{totRecipts[item]}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }

                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            <TableCell>{Number(sum(totRecipts)).toFixed(2)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Net Loss</TableCell>
                                            <TableCell>{
                                                sum(totRecipts) - sum(totPayments) < 0 ? (
                                                    <Typography>Nill</Typography>
                                                ) : (
                                                    <Typography>{(sum(totRecipts) - sum(totPayments)).toFixed(2)}</Typography>
                                                )

                                            }</TableCell>
                                        </TableRow>
                                    </TableBody>
                                ) : (
                                    <div></div>
                                )
                            }

                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TableContainer component={Paper} style={{ height: '83.5vh' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Profit</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Particulars</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Amount</TableCell>
                                </TableRow>
                            </TableHead>

                            {
                                totRecipts != null && totPayments != null ? (
                                    <TableBody>{
                                        Object.keys(totPayments).map((item, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{item}</TableCell>
                                                    <TableCell>{totPayments[item]}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }

                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            <TableCell>{Number(sum(totPayments)).toFixed(2)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Net Profit</TableCell>
                                            <TableCell>{
                                                sum(totPayments) - sum(totRecipts) < 0 ? (
                                                    <Typography>Nill</Typography>
                                                ) : (
                                                    <Typography>{(sum(totPayments) - sum(totRecipts)).toFixed(2)}</Typography>
                                                )

                                            }</TableCell>
                                        </TableRow>
                                    </TableBody>
                                ) : (
                                    <div></div>
                                )
                            }

                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>


        </Container>



    )
}


const style = makeStyles(() => ({

    dateBar: {
        padding: 5,
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 15,
        marginBottom: 10,
    },
    leftBar: {
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