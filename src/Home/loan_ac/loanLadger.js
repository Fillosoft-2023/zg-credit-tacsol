import React, { useEffect, useState } from 'react'
import {
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Paper,
    Container,
    IconButton,
    Tooltip,
    Toolbar,
    Button,
    LinearProgress
} from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import LoanLadgerprint from './ladgerprint';
import PrintIcon from '@material-ui/icons/Print';
import { PDFExport } from '@progress/kendo-react-pdf';
import DateHandler from '../../consts/date_format';
import Api from '../../api/api'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { ArrowBack } from '@material-ui/icons';
import LoanSheetPrintCustomer from './loanSheetPrintCustomer';
import LoanCompletionCertificate from './loanCompletionCertificate';
// import LoanDifferentiator from './loanDifferentiator';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function LadgerBook(props) {
    const navigate = useHistory()
    const pdfExportComponent = React.useRef(null);
    const exportCustomerSheet = React.useRef(null);
    const certificateExportComponent = React.useRef(null);

    const classes = useStyles()
    const [data, setData] = useState([])
    const [rdData, setRdData] = useState([])
    const [modifiedData, setModifiedData] = React.useState([])
    const Data = props.location.state.data;
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false)
    const [massg, setMassg] = React.useState({})
    const emi_start_date = new Date(Data.emi_strt)
    const [date_list, setDateList] = React.useState([]);
    const [lapseEmi, setLapseEMI] = React.useState([])
    const [openDifferentiator, setOpenDifferentiator] = React.useState(false); // State for LoanDifferentiator
    const forSend = {
        ac_no: Data.ac_no,
        reffer_id: Data.reffer_id
    }
    useEffect(() => {
        setDateList([])
        let frequency = Number(Data.frequecy)
        for (let index = 0; index < Data.no_emi; index++) {
            let d = new Date(emi_start_date);
            if (frequency === 30) {
                d.setMonth(d.getMonth() + index + 1);
            } else if (frequency === 7) {
                d.setDate(d.getDate() + (index + 1) * 7);
            } else if (frequency === 1) {
                d.setDate(d.getDate() + index + 1);
            } else if (frequency === 14) {
                d.setDate(d.getDate() + (index + 1) * 14);
            } else {
                console.error("Unsupported frequency!");
                break;
            }

            date_list.push(d);
        }
        setLoading(true)
        fetch(Api + 'ladger', {
            method: 'POST',
            body: JSON.stringify(forSend)
        })
            .then(res => res.json())
            .then(res => {
                setData(res)
                handleNewData(res)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
                setMassg({
                    open: true,
                    severity: 'error',
                    massg: 'Faild to connect to the server'
                })
            })
    }, [props.location.state.refresh])

    useEffect(() => {
        setLoading(true)
        fetch(Api + 'rdDataInLoan', {
            method: 'POST',
            body: JSON.stringify({ ac_no: Data.ac_no })
        })
            .then(res => res.json())
            .then(res => {
                setRdData(res[0])
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
                setMassg({
                    open: true,
                    severity: 'error',
                    massg: 'Faild to connect to the server'
                })
            })
    }, [props.location.state.refresh])
    const handleNewData = (data) => {
        let new_data = []

        if (data.length > Data.no_emi) {
            for (let i = 0; i < data.length; i++) {
                try {
                    new_data.push({
                        emi_amnt: !data[i] ? null : data[i].emi_amnt,
                        fine: !data[i] ? null : data[i].fine,
                        interest: !data[i] ? null : data[i].interest,
                        intrst_amnt: !data[i] ? null : data[i].intrst_amnt,
                        ln_amnt: !data[i] ? null : data[i].ln_amnt,
                        prncpl: !data[i] ? null : data[i].prncpl,
                        due_date: !date_list[i] ? null : i === 0 ? new Date(Data.emi_strt) : date_list[i - 1],
                        recived_date: !data[i] ? null : new Date(data[i].recived_date),
                        ttl: !data[i] ? null : data[i].ttl,
                        remarks: !data[i] ? null : data[i].remarks

                    })
                } catch (error) {
                    console.log(error)
                }
            }
        } else {
            for (let i = 0; i < Data.no_emi; i++) {
                try {
                    new_data.push({
                        emi_amnt: !data[i] ? null : data[i].emi_amnt,
                        fine: !data[i] ? null : data[i].fine,
                        interest: !data[i] ? null : data[i].interest,
                        intrst_amnt: !data[i] ? null : data[i].intrst_amnt,
                        ln_amnt: !data[i] ? null : data[i].ln_amnt,
                        prncpl: !data[i] ? null : data[i].prncpl,
                        due_date: i === 0 ? new Date(Data.emi_strt) : date_list[i - 1],
                        recived_date: !data[i] ? null : new Date(data[i].recived_date),
                        ttl: !data[i] ? null : data[i].ttl,
                        remarks: !data[i] ? null : data[i].remarks,



                    })
                } catch (error) {
                    console.log(error)
                }
            }
        }
        setModifiedData(new_data)
    }

    const adjustEmiByDate = () => {
        if (Data.frequecy === "1") {
            lapseDays();
        } else {
            alert('Sorry, Currently this function will  work only for Daily loan holders');
        }
    }

    const lapseDays = async () => {
        let emi_done = data.length;
        const col_data = [];
        const modi_data = [];
        let maked_data = [];
        for (let index = 0; index < data.length; index++) {
            col_data.push(new Date(data[index].recived_date).toDateString());
            modi_data.push((modifiedData[index].due_date).toDateString());

        }
        setLapseEMI(modi_data.filter(x => !col_data.includes(x)));
        async function first_do() {
            let new_data = [...modifiedData];
            return new Promise((resolve, reject) => {
                for (let index = 0; index < data.length; index++) {
                    const due_date = new Date(modifiedData[index].due_date).toDateString();
                    const recived_date = new Date(modifiedData[index].recived_date).toDateString();

                    if (due_date != recived_date) {
                        for (let index_new = 0; index_new < modifiedData.length; index_new++) {
                            if (recived_date === new Date(modifiedData[index_new].due_date).toDateString()) {
                                // new_data[index_new] = modifiedData[index];
                                new_data[index_new] = {
                                    emi_amnt: !data[index] ? null : modifiedData[index].emi_amnt,
                                    fine: modifiedData[index].fine,
                                    interest: modifiedData[index].interest,
                                    intrst_amnt: modifiedData[index].intrst_amnt,
                                    ln_amnt: modifiedData[index].ln_amnt,
                                    prncpl: modifiedData[index].prncpl,
                                    due_date: new Date(modifiedData[index_new].due_date),
                                    recived_date: modifiedData[index].recived_date,
                                    ttl: modifiedData[index].ttl,
                                    remarks: modifiedData[index].remarks

                                }
                            } else {

                            }

                        }


                    }

                }
                setModifiedData(new_data);
                resolve(new_data);
            })
        }

        async function second_do() {
            let new_data = [...await first_do()];
            return new Promise((resolve, reject) => {
                for (let index = 0; index < data.length; index++) {
                    const due_date = new Date(new_data[index].due_date).toDateString();
                    const recived_date = new Date(new_data[index].recived_date).toDateString();
                    if (due_date != recived_date) {
                        new_data[index] = {
                            emi_amnt: !data[index] ? null : data[index].emi_amnt,
                            fine: null,
                            interest: null,
                            intrst_amnt: null,
                            ln_amnt: null,
                            prncpl: null,
                            due_date: new Date(new_data[index].due_date),
                            recived_date: null,
                            ttl: null
                        }
                    }
                }
                resolve(new_data);
            })
        }
        const result = await second_do();
        setModifiedData(result);
    }

    const lapseCheck = (date) => {
        let lapse = false;
        const date_col = new Date(date);
        if (lapseEmi.length > 0) {
            for (let index = 0; index < lapseEmi.length; index++) {
                const lapseDate = new Date(lapseEmi[index]);
                if (lapseDate.toDateString() === date_col.toDateString()) {
                    lapse = true
                }

            }
        }

        return lapse;
    }
    const handleDifferentiatorOpen = () => {
        setOpenDifferentiator(true);
    };

    const handleDifferentiatorClose = () => {
        setOpenDifferentiator(false);
    };

    let Isum = 0;
    let Psum = 0;
    let net_rec = 0;

    return (
        <Container maxWidth="xl" style={{ width: '100%', padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex' }}>
                    <Button
                        variant='text'
                        style={{ marginRight: 5 }}
                        onClick={() => navigate.push('/Home/LoanHome')}>
                        <ArrowBack />
                    </Button>
                    <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                        Loan Ladger
                    </Typography>
                </div>
                <div>
                    <Tooltip title="Narration">
                        <Button
                            variant='contained'
                            color='primary'
                            size='small'
                            style={{ marginRight: 5 }}
                            onClick={() => setOpen(true)}>
                            <InfoIcon />
                        </Button>
                    </Tooltip>
                    <Button
                        variant='contained'
                        color='primary'
                        size='small'
                        style={{ marginRight: 5 }}
                        onClick={() => {
                            if (pdfExportComponent.current) {
                                pdfExportComponent.current.save();
                            }
                        }}
                    >
                        <PrintIcon />
                    </Button>
                    <Button size='small' onClick={adjustEmiByDate} variant="contained" color='secondary'>
                        Missed EMI
                    </Button>
                    <Button size='small' variant='contained' color='primary' style={{ marginLeft: 10 }} onClick={handleDifferentiatorOpen}>
                        Differentiator
                    </Button>
                    <Button
                        variant='outlined'
                        color='primary'
                        size='small'
                        style={{ marginLeft: 10 }}
                        onClick={() => {
                            if (exportCustomerSheet.current) {
                                exportCustomerSheet.current.save();
                            }
                        }}
                    >
                        Loan Sheet
                    </Button>
                    <Button
                        variant='contained'
                        color='primary'
                        size='small'
                        style={{ marginLeft: 10, backgroundColor: Data.ln_stts !== 'not submitted' ? '#2e7d32' : '#ccc' }}
                        disabled={Data.ln_stts === 'not submitted'}
                        onClick={() => {
                            if (certificateExportComponent.current) {
                                certificateExportComponent.current.save();
                            }
                        }}
                    >
                        NOC Certificate
                    </Button>
                </div>

            </Toolbar>
            {
                loading ? <LinearProgress /> : ''
            }

            <TableContainer component={Paper} className={classes.container}>
                <Table size="small">

                    <TableHead>
                        <TableRow style={{ backgroundColor: '#888888' }}>

                            <TableCell style={{ color: 'white' }}>SL NO</TableCell>
                            <TableCell style={{ color: 'white' }}>EMI AMOUNT</TableCell>
                            <TableCell style={{ color: 'white' }}>RECEIVED</TableCell>
                            <TableCell style={{ color: 'white' }}>Due Date</TableCell>
                            <TableCell style={{ color: 'white' }}>REC. DATE</TableCell>
                            <TableCell style={{ color: 'white' }} align='center'>REALIZATION</TableCell>
                            <TableCell style={{ color: 'white' }} ></TableCell>
                            <TableCell style={{ color: 'white' }}></TableCell>
                            <TableCell style={{ color: 'white' }}>Net Rec.</TableCell>
                            <TableCell style={{ color: 'white' }} align='center' >BALANCE</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>

                    </TableHead>
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#ECECEC' }}>

                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>Principle</TableCell>
                            <TableCell>Interest</TableCell>
                            <TableCell>Fine</TableCell>
                            <TableCell></TableCell>
                            <TableCell>Principle</TableCell>
                            <TableCell>Interest</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Remarks</TableCell>


                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(modifiedData) ? (
                            modifiedData.map((item, index) => {
                                Isum += Number(item.interest)
                                Psum += Number(item.prncpl)
                                let today = new Date().toLocaleDateString('en-CA');
                                net_rec += Number(item.prncpl) || Number(item.interest) != 0 ? Number(item.interest) + Number(item.prncpl) : 0

                                return (
                                    <TableRow style={{ backgroundColor: lapseCheck(item.due_date) ? '#fa9b9b' : !item.due_date ? '#fff' : today > item.due_date.toLocaleDateString("en-CA") && !item.recived_date ? '#fcb8b8' : '#fff', }} key={index}  >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>Rs.{item.emi_amnt}</TableCell>
                                        <TableCell style={{ fontWeight: Number(item.ttl) > Number(item.emi_amnt) ? 'bold' : 'normal' }}>Rs.{item.ttl}</TableCell>
                                        <TableCell>{item.due_date != null ? DateHandler(item.due_date.toLocaleDateString("en-CA")) : null}</TableCell>
                                        <TableCell>{item.recived_date != null ? DateHandler(item.recived_date.toLocaleDateString("en-CA")) : null}</TableCell>
                                        <TableCell>Rs.{Number(item.prncpl).toFixed(2)}</TableCell>
                                        <TableCell>Rs.{Number(item.interest).toFixed(2)}</TableCell>
                                        <TableCell style={{ color: 'red' }}>Rs.{!item.fine ? 0 : item.fine}</TableCell>
                                        <TableCell>Rs.{Number(item.prncpl) || Number(item.interest) != 0 ? net_rec.toFixed(2) : ''}</TableCell>
                                        <TableCell>Rs.{item.prncpl != null ? Number(Number(item.ln_amnt) - Number(Psum)).toFixed(2) : ''}</TableCell>
                                        <TableCell>Rs.{item.interest != null ? Number(Number(item.intrst_amnt) - Number(Isum)).toFixed(2) : ''}</TableCell>
                                        <TableCell>Rs.{(item.prncpl != null && item.interest != null) ? Number((Number(item.ln_amnt) - Number(Psum)) + (Number(item.intrst_amnt) - Number(Isum))).toFixed(2) : ''}</TableCell>
                                        <TableCell>{item.remarks}</TableCell>

                                    </TableRow>
                                )
                            })
                        ) : (
                            <div></div>
                        )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Narration"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">

                        {
                            Data.remarks != null ? (
                                Data.remarks
                            ) : (
                                'No remarks found'
                            )
                        }
                    </DialogContentText>
                </DialogContent>

            </Dialog>
            <div
                style={{
                    position: "fixed",
                    left: "-10000px",
                    top: "-10000px",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden"
                }}
            >
                <PDFExport keepTogether='.keep' paperSize="A4" margin={{ top: 10, right: 10, bottom: 10, left: 10 }} fileName='loan_ladger.pdf' ref={pdfExportComponent}>
                    <LoanLadgerprint data={modifiedData} info={{ ac_no: Data.ac_no, name: Data.name, amount: Data.ln_amnt }} />
                </PDFExport>
                <PDFExport keepTogether='.keep' paperSize="legal" margin={{ top: 10, right: 10, bottom: 10, left: 10 }} fileName='customer_loan_sheet.pdf' ref={exportCustomerSheet}>
                    <LoanSheetPrintCustomer data={modifiedData} info={{
                        ac_no: Data.ac_no,
                        name: Data.name,
                        amount: Data.ln_amnt,
                        ln_id: Data.ln_id,
                        intrst: Data.intrst,
                        intrst_amnt: Data.intrst_amnt,
                        emi_amnt: Data.emi_amnt,
                        opn_dte: Data.opn_dte,
                        collection_day: Data.collection_day,
                        agnt_id: Data.agnt_id,
                        vill: Data.vill,
                        c_nmbr: Data.c_nmbr,
                        rd_no: rdData?.[0]?.rd_no || '',
                        dep_amount: rdData?.dep_amount || ''

                    }} />
                </PDFExport>
                <PDFExport keepTogether='.keep' paperSize="A4" margin={{ top: 10, right: 10, bottom: 10, left: 10 }} fileName='loan_completion_certificate.pdf' ref={certificateExportComponent}>
                    <LoanCompletionCertificate data={modifiedData} info={{
                        ac_no: Data.ac_no,
                        name: Data.name,
                        amount: Data.ln_amnt,
                        ln_id: Data.ln_id,
                        intrst: Data.intrst,
                        intrst_amnt: Data.intrst_amnt,
                        opn_dte: Data.opn_dte,
                        vill: Data.vill,
                        c_nmbr: Data.c_nmbr,
                        ln_stts: Data.ln_stts
                    }} />
                </PDFExport>
            </div>

            {/* <div style={{display : 'none'}}>
            <LoanLadgerprint ref={componentRef}  data={data} info={{ac_no : Data.ac_no,name: Data.name,amount: Data.ln_amnt}} />
            </div> */}
        </Container>
    )
}

const useStyles = makeStyles(() => ({
    container: {
        width: '100%',
        padding: 0,
        maxHeight: '75vh',

        overflowX: 'auto',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
            width: '0.1em',

            backgroundColor: 'rgba(0,0,0,0,0)'
        },

        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',

            borderRadius: 4,

        },

    }
})) 