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
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import MyDocument from './../../pdf/balanchsheet'
import GetAppIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer'
import Api from '../../api/api';
export default function BalSheet() {
    const classes = style();
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [date, setDate] = React.useState({
        to: new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
        press: "Balncsheet"
    })
    const handleDate = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setDate({
            ...date,
            [name]: value,

        })
    }
    const [shareCap, setShareCap] = React.useState(0)
    const [profit, setProfit] = React.useState(0)
    const [loss, setLoss] = React.useState(0)
    const [cashnd, setCasHnd] = React.useState(0)
    const [lnIssued, setLnissued] = React.useState(0)
    const [realised, setRealised] = React.useState(0)
    const [propertyExpent, setPropertyExpent] = React.useState(0)
    const [bankAmt, setBankAmount] = React.useState(0)
    const [devdnd, setDevdnd] = React.useState(0)
    const [svingsrfnd, setSvingsRfnd] = React.useState(0)
    const [tarfnd, setTaRfnd] = React.useState(0)
    const [rdrfnd, setRdRfnd] = React.useState(0)
    const [bnkint, setBnkInt] = React.useState(0)
    const [ip, setIp] = React.useState(0)
    const [rp, setRp] = React.useState(0)
    const [svingsadm, setSvingsAdm] = React.useState(0)
    const [otherAc, setOtherAc] = React.useState(0)
    const [openprop, setOpenprop] = React.useState(false)
    const [savingsrefund, setSavingsRefund] = React.useState(0)

    const [refresh, setRefresh] = React.useState(Math.random())
    const [loading, setLoading] = React.useState(false)

    React.useEffect(async () => {
        setLoading(true)
        const sesDate = JSON.parse(sessionStorage.getItem('cash_date'))
        if (!sesDate === false) {
            setDate(sesDate)
        }

        console.log(sesDate)


        fetch(Api + 'balancSheet', {
            method: 'POST',
            body: JSON.stringify(date)
        })
            .then(res => res.json())
            .then(res => {
                setShareCap(
                    Number(res.from_share_close.sh_ttl) - Number(res.from_share_close.sh_with)
                )
                setDevdnd(
                    Number(res.from_share_close.dev_dep) - Number(res.from_share_close.dev_with)
                )
                setPropertyExpent(
                    Number(res.from_expense_prop.ex_prop_amnt) - Number(res.from_property_depr.amount)
                )
                setSvingsRfnd(
                    Number(res.savings_trans_close.deposit) - Number(res.savings_trans_close.withdrawal) + Number(res.savings_trans_close.interest)
                )
                setSavingsRefund(
                    Number(res.savings_trans_close.sav_deposit) - Number(res.savings_trans_close.sav_withdrawal) + Number(res.savings_trans_close.sav_interest)
                )
                setIp(
                    Number(res.from_expense_prop.ex_prop_amnt)
                )
                setRp(
                    - Number(res.from_property_depr.amount)
                )
                setLnissued(
                    Number(res.from_ln_pros.loan_issued)
                )
                setRealised(
                    Number(res.from_emi_cash.loan_prncpl)


                )
                setLoss(
                    Number(res.from_expense.ex_amnt) + Number(res.from_expense_prop.ex_prop_amnt) + (Number(res.from_ta_mat.ta_intr_amnt)) + Number(res.from_savings_intrest.intr) + Number(res.from_share_trans.dev)
                )
                setProfit(
                    Number(res.passbook_create.passbook_amount) + Number(res.from_emi.loan_int_rec) + Number(res.from_ln_pros.loan_pros) + Number(res.from_ta_close.ta_pros) + Number(res.from_emi.loan_fine) + Number(res.from_savings_intrest.fine) + (Number(res.from_expense_prop.ex_prop_amnt) - Number(res.from_property_depr.amount)) + Number(res.bank_ac_close.bank_inerest) - (Number(res.from_other_ac.dep_amount) - Number(res.from_other_ac.with_amount)) + Number(res.from_savings_proc.savings_prc) + Number(res.from_share_adm.share_admisson)
                )
                setOtherAc((Number(res.from_other_ac.dep_amount) - Number(res.from_other_ac.with_amount)))
                setBankAmount(
                    Number(res.bank_ac_close.dep_amount) - Number(res.bank_ac_close.with_amount) + Number(res.bank_ac_close.bank_inerest)
                )
                setBnkInt(
                    Number(res.bank_ac_close.bank_inerest)
                )
                setCasHnd(
                    (Number(res.from_emi_close.emi_ttl) + Number(res.from_emi_close.emi_fine) + Number(res.from_loan_close.loan_pros) + Number(res.from_ta_mat.ta_dep_amnt) + Number(res.from_ta_close.ta_pros) + Number(res.from_share_close.sh_ttl) + Number(res.share_adm_close.adm_fee) + Number(res.from_savings_proc.savings_prc) + Number(res.savings_trans_close.deposit) + Number(res.savings_trans_close.fine))
                    - (Number(res.from_loan_close.ln_amnt) + Number(res.from_ta_mat.ta_mat_amnt) + Number(res.from_share_close.sh_with) + Number(res.from_share_close.dev_with) + Number(res.from_expense.ex_amnt) + Number(res.from_expense_prop.ex_prop_amnt) + Number(res.savings_trans_close.withdrawal))
                )
            })
            .catch(err => {
                console.log(err)
            })


    }, [refresh])



    function sum(obj) {
        return Object.keys(obj).reduce((sum, key) => sum + parseFloat(obj[key] || 0), 0);
    }



    const [send, setSend] = React.useState(null)
    const [sends, setSends] = React.useState(null)
    const filename = Math.floor(Math.random() * 10000000);
    const [ready, setReady] = React.useState(false)
    const handleDownload = () => {

        setSend(
            {
                liablity: {
                    "Share Capital": Number(shareCap),
                    "Rd Refundable": Number(svingsrfnd),
                    "Savings Refundable": Number(savingsrefund),
                    "TA Refundable": Number(tarfnd),
                    "Devidend Refundable": Number(devdnd),
                    "Net Profit": (Number(profit) - Number(loss) < 0 ? 0 : Number(profit) - Number(loss)).toFixed(2),
                    "Other ac refundable": Number(otherAc),
                    "Total": (Number(profit) - Number(loss) < 0 ? (Number(shareCap) + Number(svingsrfnd) + Number(savingsrefund) + Number(tarfnd) + Number(devdnd) + Number(otherAc)).toFixed(2) : (Number(shareCap) + Number(svingsrfnd) + Number(tarfnd) + Number(devdnd) + (Number(profit) - Number(loss))).toFixed(2)),

                },
                assets: {
                    total: {
                        "Asset": propertyExpent,
                        ip: ip,
                        rp: rp
                    },

                    "Loan Realizable": (Number(lnIssued) - Number(realised)).toFixed(2),
                    "Cash in hand": (Number(cashnd) - Number(bankAmt) + Number(bnkint)).toFixed(2),
                    "Cash in Bank": Number(bankAmt),
                    "Net Loss": (Number(loss) - Number(profit) < 0 ? 0 : Number(loss) - Number(profit)).toFixed(2),
                    "Total": (Number(loss) - Number(profit) < 0 ? (Number(propertyExpent) + Number(bankAmt) + (Number(cashnd) - Number(bankAmt) + Number(bnkint)) + Number(lnIssued) - Number(realised)).toFixed(2) : (Number(propertyExpent) + Number(bankAmt) + (Number(cashnd) - Number(bankAmt) + Number(bnkint)) + Number(lnIssued) - Number(realised) + (Number(loss) - Number(profit))).toFixed(2))

                },
                date: date

            }
        )

        setReady(true)
    }


    return (




        <Container maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: "space-between", marginBottom: 5 }}>
                <div>
                    <Typography variant='h5' style={{ fontWeight: 'bold' }}>Balance Sheet</Typography>
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
                        style={{ marginLeft: 10,marginRight:10 }}
                        value={date.from}
                        onChange={handleDate}

                    />
                    <Button onClick={() => setRefresh(Math.random())} variant='contained' color='primary' style={{ marginRight: 10 }}>
                        Search
                    </Button>
                    {
                        ready ? (
                            <PDFDownloadLink document={<MyDocument callback={send} />} fileName={"balanchsheet.pdf"}>
                                {({ blob, url, loading, error }) => (loading ? 'Loading document...' :
                                    <Tooltip title="download this sheet">
                                        <Button variant='contained' color='primary' onClick={() => setReady(false)}>
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

            <Grid container spacing={1}>
                <Grid item xs={12} sm={6} style={{ height: '83vh' }}>
                    <Table component={Paper} style={{ height: '83vh' }}>


                        <TableBody>

                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>Liabilities</TableCell>
                                <TableCell></TableCell>

                            </TableRow>
                            <TableRow>

                                <TableCell>Particulars</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Share Capital</TableCell>
                                <TableCell>{shareCap.toFixed(2)}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Rd Refundable</TableCell>
                                <TableCell>{svingsrfnd.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Savings Refundable</TableCell>
                                <TableCell>{savingsrefund.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>TL Refundable</TableCell>
                                <TableCell>{tarfnd.toFixed(2)}


                                </TableCell>
                            </TableRow>
                            {/* <TableRow>
                    <TableCell>RD Refundable</TableCell>
                    <TableCell>{rdrfnd.toFixed(2)}
                                                
                                            
                                            </TableCell>
                </TableRow> */}
                            <TableRow>
                                <TableCell>Devident Refundable</TableCell>
                                <TableCell>{devdnd.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Other ac refundable </TableCell>
                                <TableCell>{otherAc}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Net Profit</TableCell>
                                <TableCell>{
                                    profit - loss < 0 ? (
                                        <Typography>0</Typography>
                                    ) : (
                                        <Typography>{(profit - loss).toFixed(2)}</Typography>
                                    )

                                }</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell> {
                                    profit - loss < 0 ? (
                                        <Typography>{(Number(shareCap) + Number(svingsrfnd) + Number(savingsrefund) + Number(tarfnd) + Number(rdrfnd) + Number(svingsadm) + Number(devdnd) + Number(otherAc)).toFixed(2)}</Typography>
                                    ) : (
                                        <Typography>{(Number(shareCap) + Number(svingsrfnd) + Number(savingsrefund) + Number(tarfnd) + Number(rdrfnd) + Number(svingsadm) + Number(devdnd) + (Number(profit) - Number(loss)) + Number(otherAc)).toFixed(2)}</Typography>
                                    )

                                }

                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={12} sm={6} style={{ height: '83vh' }}>
                    <Table component={Paper} style={{ height: '83vh' }}>
                        <TableBody>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>Assets</TableCell>
                                <TableCell></TableCell>

                            </TableRow>
                            <TableRow>

                                <TableCell>Particulars</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell> Asset purchased</TableCell>
                                <TableCell>{propertyExpent.toFixed(2)}
                                    {openprop ? <ExpandLess style={{ color: '#ddd', marginLeft: 40 }} onClick={() => setOpenprop(false)} /> : <ExpandMore style={{ color: '#ddd', marginLeft: 40 }} onClick={() => setOpenprop(true)} />}
                                </TableCell>
                            </TableRow>
                            {
                                openprop ? (
                                    <div style={{ marginLeft: 40 }}>

                                        <TableRow>
                                            <TableCell> Initial Asset Value </TableCell>
                                            <TableCell>{ip.toFixed(2)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell> Depreciation </TableCell>
                                            <TableCell>{rp.toFixed(2)}</TableCell>
                                        </TableRow>


                                    </div>

                                ) : (
                                    <div></div>
                                )
                            }
                            <TableRow>
                                <TableCell>Loan Realizable</TableCell>
                                <TableCell>{(Number(lnIssued) - Number(realised)).toFixed(2)}

                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Cash in Hand</TableCell>
                                <TableCell>{(Number(cashnd) - Number(bankAmt) + Number(bnkint)).toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Cash in Bank</TableCell>
                                <TableCell>{bankAmt.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Net Loss</TableCell>
                                <TableCell>{
                                    loss - profit < 0 ? (
                                        <Typography>0</Typography>
                                    ) : (
                                        <Typography>{(loss - profit).toFixed(2)}</Typography>
                                    )

                                }</TableCell>
                            </TableRow>



                            <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell>
                                    {
                                        loss - profit < 0 ? (
                                            <Typography>{(Number(propertyExpent) + Number(bankAmt) + (Number(cashnd) - Number(bankAmt) + Number(bnkint)) + Number(lnIssued) - Number(realised)).toFixed(2)}</Typography>
                                        ) : (
                                            <Typography>{(Number(propertyExpent) + Number(bankAmt) + (Number(cashnd) - Number(bankAmt) + Number(bnkint)) + Number(lnIssued) - Number(realised) + (Number(loss) - Number(profit))).toFixed(2)}</Typography>
                                        )

                                    }
                                </TableCell>
                            </TableRow>



                        </TableBody>



                    </Table>
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
        maxHeight: '77vh',

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

