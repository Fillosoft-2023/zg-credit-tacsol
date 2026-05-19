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
    Button,
    LinearProgress

} from '@material-ui/core'
import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer'
import MyDocument from './../../pdf/cashbook'
import GetAppIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import Api from '../../api/api'
import { ArrowForwardIos, More, Search } from '@material-ui/icons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
export default function CashBook() {
    const history = useHistory();
    const classes = style();
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [date, setDate] = React.useState({
        to: new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
        press: "cashRes",

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
    const [totRecipts, setTotRecipts] = React.useState({})
    const [totPayments, setTotPayments] = React.useState({})
    const [Recipts, setRecipts] = React.useState(0);
    const [Payments, setPayments] = React.useState(0)
    const [ready, setReady] = React.useState(false)
    const [send, setSendData] = React.useState({})
    const [closeRec, setCloseRec] = React.useState({})
    const [closePay, setClosePay] = React.useState({})
    const [bankAmt, setBankAmt] = React.useState(0)
    const [fetchTrigger, setFetchTrigger] = React.useState(0);
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const savedDate = JSON.parse(sessionStorage.getItem('cash_date'));
        if (savedDate) {
            setDate(savedDate);
        }
        setFetchTrigger(1); // This will trigger the initial data fetch
    }, []);

    React.useEffect(() => { // The async keyword on the hook itself is not needed
        if (fetchTrigger === 0) return;

        const fetchData = async () => {
            setLoading(true);
            sessionStorage.setItem('cash_date', JSON.stringify(date));
            try {
                // ✅ ADD THESE TWO LINES BACK IN
                const response = await fetch(Api + 'cashResTest', {
                    method: 'POST',
                    body: JSON.stringify(date)
                });
                const res = await response.json();

                // Now your existing code will work perfectly
                setData(res);
                setTotRecipts({
                    "By Principle A/C": res.from_emi.principle.toFixed(2),
                    "By Interest A/C": res.from_emi.intrest > 0 ? res.from_emi.intrest.toFixed(2) : res.from_emi.intrest,
                    "By Fine(Loan) A/C": res.from_emi.emi_fine,
                    "By Preclosed(Loan) A/C": res.from_emi.preclosed_amount,
                    "By Processing fees A/C": res.from_loan.loan_pros,
                    "By Insurance Fee": res.from_loan.loan_insur,
                    "By Membership Fee": res.membership_fees.member_fee,

                    // "By RD Collection A/C": res.from_rd.rd_ttl,
                    // "By RD fine collection A/C": res.from_rd.rd_fine,
                    // "RD insurence": res.from_rd_det.rd_insur,
                    // "By RD processing fees A/C": res.from_rd_det.rd_pros,
                    // "TA collection": res.from_ta.ta_amt,
                    "By TL processing fees A/C": res.from_ta.ta_pros,
                    // "FD insurence": res.from_ta.ta_insur,
                    "By Share A/C(A)": res.from_share.sh_ttl_a,
                    "By Share A/C(B)": res.from_share.sh_ttl_b,
                    "By Share member fees A/C": res.share_adm.adm_fee,
                    "By Share application fees A/C": res.share_app.app_fees,
                    "By RD A/C Processing Fees": res.savings_pros.pross,
                    "By RD A/C Deposit": res.savings_trans.deposit,
                    "By RD A/C Fine": res.savings_trans.fine,

                    "By Savings A/C Processing Fees": res.savings_pros.sav_pross,
                    "By Savings A/C Deposit": res.savings_trans.sav_deposit,
                    "By Savings A/C Fine": res.savings_trans.sav_fine,
                    "By TL A/C deposit": res.ta_trans.ta_dep,
                    "By Passbook Purchase A/C": res.from_passbook.pass_opn,



                })

                setTotPayments({

                    "To Loan A/C": res.from_loan.ln_amnt,
                    // "To Rd maturity A/C": res.from_rd_mat.rd_mat,
                    // "Ta maturity amount": res.from_ta_mat.ta_mat,
                    "To Share A/C": res.from_share.sh_with,
                    "To Share devidend A/C": res.from_share.dev_with,
                    "To Management expenditure A/C": res.from_expense.ex_amnt,
                    "To Asset purchased A/C": res.from_expense.property,
                    "To RD Withdrawal A/C": res.savings_trans.withdrawal,
                    "To Savings Withdrawal A/C": res.savings_trans.sav_withdrawal,

                    "To TL withdrawal A/C": res.ta_trans.ta_with,
                    // "To Passbook Purchase" : res.passbook_expense.pbook_exp,




                })

                setCloseRec({
                    "Emi collection": res.from_emi_close.emi_ttl,
                    "Emi fine collection": res.from_emi_close.emi_fine,
                    "Loan processing fess": res.from_loan_close.loan_pros,
                    "Welfare Fund": res.from_loan.loan_insur,
                    "Membership Fee": res.membership_fees.member_fee,
                    //"RD Collection": res.from_rd_close.rd_ttl,
                    //"Rd fine collection": res.from_rd_close.rd_fine,
                    // "RD insurence": res.from_rd_det.rd_insur,
                    //"RD_pros": res.from_rd_det_close.rd_pros,
                    "FD collection": res.ta_trans_close.ta_dep,
                    "FD pross collection": res.from_ta_close.ta_pros,
                    // "FD insurence": res.from_ta.ta_insur,
                    "Share total amount": res.from_share_close.sh_ttl,
                    "Share admission fee": res.share_adm_close.adm_fee,
                    "rd admission": res.savings_pros_close.pross,
                    "rd deposit": res.savings_trans_close.deposit,
                    "rd fine": res.savings_trans_close.fine,
                    //"To Fund A/C" : res.fund_trans_close.fund_dep
                })

                setClosePay({
                    "Loan amount": res.from_loan_close.ln_amnt,
                    //"Rd maturity amount": res.from_rd_mat_close.rd_mat,
                    // "Ta maturity amount": res.from_ta_mat_close.ta_mat,
                    "Share money withdrwal": res.from_share_close.sh_with,
                    "Share devidend withdrwal": res.from_share_close.dev_with,
                    "Management expenditure": res.from_expense_close.ex_amnt,
                    "RD Withdrawal": res.savings_trans_close.withdrawal,
                    "Ta withdrawal": res.ta_trans_close.ta_with,
                    //"By Fund A/C" : res.fund_trans_close.fund_with
                })
                setBankAmt((Number(res.bank_ac.dep_amount) + Number(res.bank_ac.intrst_amount)) - Number(res.bank_ac.with_amount))

            } catch (err) {
                console.error("Failed to fetch cashbook data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fetchTrigger])

    const handleSearchClick = () => {
        setFetchTrigger(prev => prev + 1); // Triggers the fetching useEffect
    };

    function sum(obj) {
        return Object.keys(obj).reduce((sum, key) => sum + parseFloat(obj[key] || 0), 0);
    }
    const [closeRecAmt, setCloseRecAmt] = React.useState(0)
    const [closePayAmt, setClosePayAmt] = React.useState(0)
    React.useEffect(() => {

        setRecipts(sum(totRecipts))
        setPayments(sum(totPayments))
        setCloseRecAmt(sum(closeRec))
        setClosePayAmt(sum(closePay))

    }, [totRecipts, totPayments, closeRec, closePay])
    const [openReal, setOpenReal] = React.useState(false)
    const [openInt, setOpenInt] = React.useState(false)
    const [openLoan, setOpenLoan] = React.useState(false)
    const handleMoreClick = (itemName) => {
        let fromValue, toValue;
        const ref = Math.random()
        sessionStorage.setItem('cash_date', JSON.stringify(date))

        switch (itemName) {
            // Receipts
            case "By Principle A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/principalDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By Interest A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/interestDetails/${fromValue}/${toValue}/${ref}`);
                break;

            case "By Fine(Loan) A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/fineDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By Preclosed(Loan) A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/PrecloseDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By Processing fees A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/processingFeesDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By Insurance Fee":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/InsuranceFeeDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By TL processing fees A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/tlProcFeesDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By Share A/C(A)":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/shareDetailsA/${fromValue}/${toValue}/${ref}`);
                break;
            case "By Share A/C(B)":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/shareDetailsB/${fromValue}/${toValue}/${ref}`);
                break;
            case "By Share member fees A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/ShareMemberFeeDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By Share application fees A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/ShareAdmissionFeeDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "Contribution Account(Member Contribution)":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/shareDetailsMC/${fromValue}/${toValue}/${ref}`);
                break;
            case "Admission Fees Account":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/shareAdmDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By Saving A/C Processing Fees":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/rdProcessingDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By RD A/C Deposit":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/rdDepositDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By RD A/C Processing Fees":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/RdProcessingFeeDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By Savings A/C Processing Fees":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/SavingProcessingFeeDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By RD A/C Fine":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/RdFineDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By Savings A/C Deposit":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/savDepositDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By TL A/C deposit":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/TlDepositDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By Savings A/C Fine":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/SavingFineDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "By Membership Fee":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/membershipFeeDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "Recurring Deposit Fine Account":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/rdFineDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "Temporary Loan Receipt Account":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/taDepositDetails/${fromValue}/${toValue}/${ref}`);
                break;

            // Disbursement

            case "To Loan A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/loanAcDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "Share Account(A)":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/shareDetailsAD/${fromValue}/${toValue}/${ref}`);
                break;
            case "Share Account(B)":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/shareDetailsBD/${fromValue}/${toValue}/${ref}`);
                break;
            case "Contribution Account(Member Contribution)":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/shareDetailsMCD/${fromValue}/${toValue}/${ref}`);
                break;
            case "Share Devidend A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/shareDividendDetailsD/${fromValue}/${toValue}/${ref}`);
                break;
            case "Management Expenditure A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/managementExpDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "Assets Purchased A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/assetsExpdetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "To RD Withdrawal A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/rdWithdrawlDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "To Savings Withdrawal A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/savWithdrawlDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "Recurring Deposits Interest A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/rdIntDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "Temporary Loan Withdrawal A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/tlWithDetails/${fromValue}/${toValue}/${ref}`);
                break;
            case "Temporary Loan Interest A/C":
                ({ from: fromValue, to: toValue } = date);
                history.push(`/Home/tlIntrDetails/${fromValue}/${toValue}/${ref}`);
                break;

            default:
                break;
        }
    };
    const ClosingBal = () => {


        return (
            <Table maxWidth="false">
                <TableBody>
                    <TableRow>
                        <TableCell>Opening Balance</TableCell>
                        <TableCell>Rs.{(Number(closeRecAmt) - Number(closePayAmt)).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Total Receipts</TableCell>
                        <TableCell>Rs.{Recipts.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Total Payments</TableCell>
                        <TableCell>Rs.{Payments.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Closing Balance</TableCell>
                        <TableCell>Rs.{((Number(closeRecAmt) - Number(closePayAmt) + Number(Recipts)).toFixed(2) - Number(Payments).toFixed(2)).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Cash in Bank</TableCell>
                        <TableCell>Rs.{Number(bankAmt).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Cash in Hand</TableCell>
                        <TableCell>
                            Rs.{
                                (
                                    (Number(closeRecAmt) - Number(closePayAmt) + Number(Recipts))
                                    - Number(Payments)
                                    - Number(bankAmt)
                                ).toFixed(2)
                            }
                        </TableCell>
                    </TableRow>
                </TableBody>



            </Table>
        )
    }



    const handleDownload = () => {
        setSendData({
            recipts: totRecipts,
            payments: totPayments,
            date: date,
            recAmount: Recipts,
            payAmount: Payments,
            recipts_close: closeRecAmt,
            payments_close: closePayAmt,
            bankAmount: bankAmt
        })
        setReady(true)
    }
    const filename = Math.floor(Math.random() * 10000000);


    return (
        <Container maxWidth="false" style={{ margin: 0, padding: 0, height: '84vh' }}>


            {
                Data != null ? (
                    <Container maxWidth="xxl" style={{ margin: 0, padding: 0 }}>

                        <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <div>
                                <Typography variant='h6' style={{ fontWeight: 'bold', color: 'black' }}>
                                    CASHBOOK
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
                                    style={{ marginLeft: 10, marginRight: 5 }}
                                    value={date.from}
                                    onChange={handleDate}

                                />
                                <Button onClick={handleSearchClick} variant='contained' color='primary' style={{ marginLeft: 5, marginRight: 5 }}>
                                    <Search />
                                </Button>
                                {
                                    ready ? (
                                        <PDFDownloadLink document={<MyDocument callback={send} />} fileName={filename + "cashbook.pdf"}>
                                            {({ blob, url, loading, error }) => (loading ? 'Loading document...' :
                                                <Tooltip title="download this sheet">
                                                    <Button variant='contained' color='primary' onClick={() => setReady(false)} >
                                                        <GetAppIcon />
                                                    </Button>
                                                </Tooltip>

                                            )}
                                        </PDFDownloadLink>

                                    ) : (

                                        <Tooltip title="Print list">
                                            <Button variant='contained' color='primary' onClick={() => handleDownload()}>
                                                <PrintIcon />
                                            </Button>
                                        </Tooltip>
                                    )
                                }
                            </div>
                        </Toolbar>
                        {
                            loading ? <LinearProgress style={{ backgroundColor: 'red' }} /> : ''
                        }
                        <Grid container >
                            <Grid item xs={12} sm={6} >
                                <TableContainer component={Paper} className={classes.leftBar}>
                                    <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Typography style={{ fontWeight: 'bold' }}>
                                            RECEIPTS
                                        </Typography>
                                    </Toolbar>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: 'bold' }}>Particulars</TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }}>Amount</TableCell>
                                                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>More</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                Object.keys(totRecipts).map((item, index) => {
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell>{item}</TableCell>
                                                            <TableCell style={{ textAlign: 'start' }}>Rs.{totRecipts[item]}</TableCell>
                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                <IconButton onClick={() => handleMoreClick(item)}>
                                                                    <ArrowForwardIos />
                                                                </IconButton>
                                                            </TableCell>

                                                        </TableRow>
                                                    )
                                                }
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <TableContainer component={Paper} className={classes.rightBar}>
                                    <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Typography style={{ fontWeight: 'bold' }}>
                                            DISBURSEMENT
                                        </Typography>
                                    </Toolbar>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: 'bold' }}>Particulars</TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }}>Amount</TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }}>More</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                Object.keys(totPayments).map((item, index) => {
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell>{item}</TableCell>
                                                            <TableCell style={{ textAlign: 'start' }}>Rs.{totPayments[item]}</TableCell>
                                                            <TableCell>
                                                                <IconButton onClick={() => handleMoreClick(item)}>
                                                                    <ArrowForwardIos />
                                                                </IconButton>
                                                            </TableCell>

                                                        </TableRow>
                                                    )
                                                }
                                                )
                                            }

                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <TableContainer component={Paper} className={classes.details}>
                                    <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Typography style={{ fontWeight: 'bold' }}>
                                            BALANCE
                                        </Typography>
                                    </Toolbar>
                                    {ClosingBal()}
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Container>
                ) : (
                    <div></div>
                )
            }
        </Container>



    )
}


const style = makeStyles(() => ({

    dateBar: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    leftBar: {
        maxHeight: '85vh',

        overflowX: 'auto',
        '&::-webkit-scrollbar': {
            width: '0.4em',

            backgroundColor: 'rgba(0,0,0,0,0)'
        },

        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',

            borderRadius: 4,

        },
    },
    rightBar: {
        height: '42vh',

        overflowX: 'auto',
        '&::-webkit-scrollbar': {
            width: '0.4em',

            backgroundColor: 'rgba(0,0,0,0,0)'
        },

        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',

            borderRadius: 4,

        },
    },
    details: {
        height: '42vh',
        marginTop: 10,
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