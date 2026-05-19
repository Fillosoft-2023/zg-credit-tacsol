import React from 'react'
import {
    Container, TextField, Toolbar, Menu, MenuItem, Tooltip, Paper, IconButton, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, Divider, DialogContent, Box, Button, DialogActions, TableFooter
} from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import FilterListIcon from '@material-ui/icons/FilterList';
import Doc from '../../../docService/docService'
import { PDFExport } from '@progress/kendo-react-pdf';
import PrintIcon from '@material-ui/icons/Print';
import AllLoanPrint from './print_page';
import DateHandler from '../../../consts/date_format';
import Api from '../../../api/api';
export default function AllLoan() {
    const pdfExportComponent = React.useRef(null);
    const history = useHistory()
    const [data, setData] = React.useState([])
    const [sliceData, setSliceData] = React.useState([])
    const [allAgent, setAllAgent] = React.useState([])
    const [dialogView, setDialogView] = React.useState(true)
    const [secondary_data, setSecondary_data] = React.useState([])
    const [dialogLoading, setDialogLoading] = React.useState(false)
    const [anchorE1, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorE1)
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [date, setDate] = React.useState({
        from: new Date().toLocaleDateString("en-CA"),
        to: new Date(next).toLocaleDateString("en-CA"),
        from_emi: new Date().toLocaleDateString("en-CA"),
        to_emi: new Date(next).toLocaleDateString("en-CA")
    })
    const handleDate = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setDate({
            ...date,
            [name]: value,

        })
    }
    // React.useEffect(()=>{
    //     // send({
    //     //     press : 'allLoanDisplay',
    //     //     agent : null,
    //     //     to : date.to,
    //     //     from : date.from
    //     // }).then((res)=>{
    //     //     setData(res)
    //     //     setSliceData(sliceIntoChunks(res,18))
    //     // })

    //     fetch(Api+'allLoanDisplay',{
    //         method : 'POST',
    //         body : JSON.stringify({
    //             agent : null,
    //             to : date.to,
    //             from : date.from
    //         })
    //     })
    //     .then(res=>res.json())
    //     .then(res=>{
    //         dialogView(false)
    //         setData(res)
    //         setSliceData(sliceIntoChunks(res,18))
    //     })
    // },[date])

    const search_data = () => {
        setDialogLoading(true)
        fetch(Api + 'allLoanDisplay', {
            method: 'POST',
            body: JSON.stringify({
                agent: null,
                to: date.to,
                from: date.from,
                to_emi: date.to_emi,
                from_emi: date.from_emi
            })
        })
            .then(res => res.json())
            .then(res => {
                // console.log(res)
                setDialogLoading(false)
                setDialogView(false)
                setData(res.main)
                setSliceData(sliceIntoChunks(res.main, 18))
                setSecondary_data(res.secondary)
                // amount_adjust(res.main)
            })
            .catch(err => {
                setDialogLoading(false)

            })
    }

    const collectAgent = (e) => {
        fetch(Api + 'agent')
            .then(res => res.json())
            .then(res => setAllAgent(res))

        setAnchorEl(e.currentTarget)
    }

    const handleAgent = (id) => {
        setAnchorEl(null)
        // send({
        //     press : 'allLoanDisplay',
        //     agent : id,
        //     to : date.to,
        //     from : date.from
        // }).then((res)=>{
        //     setData(res)
        //     setSliceData(sliceIntoChunks(res,18))
        // })
        fetch(Api + 'allLoanDisplay', {
            method: 'POST',
            body: JSON.stringify({
                agent: id,
                to: date.to,
                from: date.from
            })
        })
            .then(res => res.json())
            .then(res => {
                setData(res.main)
                setSliceData(sliceIntoChunks(res.main, 18))
            })
    }

    function sliceIntoChunks(arr, chunkSize) {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        return res;
    }

    const freqHandler = (item) => {
        let returns;
        switch (Number(item)) {
            case 7:
                returns = 'Weekly';
                break;
            case 1:
                returns = 'Daily';
                break;
            case 14:
                returns = 'Fortnightly';
                break;
            case 30:
                returns = 'Monthly';
                break;
            default:
                returns = 'Not Found';

        }

        return returns

    }

    //temporary function to display 

    const check_princ = (refferss, mood) => {
        let out = {}
        if (secondary_data.length > 0) {
            let reffer = secondary_data.find(o => o.reffer_id === refferss);
            if (!reffer) {
                return 0
            } else {
                out['prncpl'] = (reffer.prncpl).toFixed(2)
                out['intr'] = (reffer.intr).toFixed(2)
                if (mood === 'prncpl') {
                    return out.prncpl
                } else {
                    return out.intr
                }
            }
        } else {
            return 0
        }

    }

    let total_p_rec = 0;
    let total_i_rec = 0;
    let tot_rec = 0;

    let total_l_dis = 0;
    let total_i_col = 0;
    let tot_emi = 0;
    return (
        <Container maxWidth="xxl">
            <Toolbar component={Paper} style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => history.push('/Home/LoanHome/')} >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography>All Loan Account</Typography>
                </div>
                <div>

                    <Button variant='contained' color="primary" disableElevation onClick={() => setDialogView(true)}>
                        Adjust Dates
                    </Button>
                    <IconButton onClick={collectAgent}>
                        <Tooltip title="Sort by ">
                            <FilterListIcon />
                        </Tooltip>
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            if (pdfExportComponent.current) {
                                pdfExportComponent.current.save();
                            }
                        }}
                    >
                        <PrintIcon />
                    </IconButton>
                </div>
            </Toolbar>
            <Menu
                anchorEl={anchorE1}
                open={open}
                onClose={() => setAnchorEl(null)}
            >
                {
                    allAgent.map((item, index) => <MenuItem key={index} onClick={() => handleAgent(item.id)} >{item.ag_name}</MenuItem>)
                }
            </Menu>
            <TableContainer style={{ height: '80vh' }} component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Sl No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Member No</TableCell>
                            <TableCell>Loan NO</TableCell>
                            <TableCell>Contact No</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Disb Date</TableCell>
                            <TableCell>Disb Amt</TableCell>
                            <TableCell>Int Amt</TableCell>
                            <TableCell>Int Rate</TableCell>
                            <TableCell>Total EMI</TableCell>
                            <TableCell>EMI Amt</TableCell>
                            <TableCell>Total Princ. Rec.</TableCell>
                            <TableCell>Total Intr. Rec.</TableCell>
                            <TableCell>Total Amount Rec.</TableCell>
                            <TableCell>Total Princ. Bal.</TableCell>
                            <TableCell>Total Intr. Bal.</TableCell>
                            <TableCell>Total Amount Bal.</TableCell>
                            <TableCell>Frequency</TableCell>
                            <TableCell>Collection Day</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Agent Name</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.map((item, index) => {
                                let prncpl = check_princ(item.reffer_id, "prncpl");
                                let intr = check_princ(item.reffer_id, "intr")
                                let total = Number(prncpl) + Number(intr)

                                total_p_rec += Number(prncpl);
                                total_i_rec += Number(intr)
                                tot_rec += Number(total);

                                total_l_dis += Number(item.ln_amnt);
                                total_i_col += Number(item.intrst_amnt)
                                tot_emi += Number(item.emi_amnt)


                                return (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.acno}</TableCell>
                                        <TableCell>{item.ln_tpe + '/' + item.id}</TableCell>
                                        <TableCell>{item.c_nmbr}</TableCell>
                                        <TableCell style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>{item.vill}</TableCell>
                                        <TableCell>{DateHandler(item.opn_dte)}</TableCell>
                                        <TableCell>{item.ln_amnt}</TableCell>
                                        <TableCell>{item.intrst_amnt}</TableCell>
                                        <TableCell>{item.intrst}</TableCell>
                                        <TableCell>{item.no_emi}</TableCell>
                                        <TableCell>{item.emi_amnt}</TableCell>
                                        <TableCell style={{ color: 'green', fontWeight: 'bold' }}>{Number(prncpl).toFixed(2)}</TableCell>
                                        <TableCell style={{ color: 'green', fontWeight: 'bold' }}>{Number(intr).toFixed(2)}</TableCell>
                                        <TableCell style={{ color: 'green', fontWeight: 'bold' }}>{Number(total).toFixed(2)}</TableCell>
                                        <TableCell style={{ color: 'red', fontWeight: 'bold' }}>{(item.ln_amnt - prncpl).toFixed(2)}</TableCell>
                                        <TableCell style={{ color: 'red', fontWeight: 'bold' }}>{(item.intrst_amnt - intr).toFixed(2)}</TableCell>
                                        <TableCell style={{ color: 'red', fontWeight: 'bold' }}>{(Number(item.ln_amnt) + Number(item.intrst_amnt) - (Number(prncpl) + Number(intr))).toFixed(2)}</TableCell>
                                        <TableCell>{freqHandler(item.frequecy)}</TableCell>
                                        <TableCell>{item.collection_day === 0 ? 'None' : item.collection_day}</TableCell>
                                        <TableCell>{item.ln_stts}</TableCell>
                                        <TableCell>{item.ag_name}</TableCell>
                                    </TableRow>
                                )
                            }
                            )
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow >
                            <TableCell></TableCell>
                            <TableCell style={{ fontSize: 18, fontWeight: 'bolder', color: '#000' }}>Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell style={{ fontSize: 18, fontWeight: 'bolder', color: '#000' }}>Rs.{total_l_dis.toFixed(2)}</TableCell>
                            <TableCell style={{ fontSize: 18, fontWeight: 'bolder', color: '#000' }}>Rs.{total_i_col.toFixed(2)}</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell style={{ fontSize: 18, fontWeight: 'bolder', color: '#000' }}>{tot_emi.toFixed(2)}</TableCell>
                            <TableCell style={{ color: 'green', fontSize: 18, fontWeight: 'bolder' }}>{total_p_rec.toFixed(2)}</TableCell>
                            <TableCell style={{ color: 'green', fontSize: 18, fontWeight: 'bolder' }}>{total_i_rec.toFixed(2)}</TableCell>
                            <TableCell style={{ color: 'green', fontSize: 18, fontWeight: 'bolder' }}>{tot_rec.toFixed(2)}</TableCell>
                            <TableCell style={{ color: 'red', fontSize: 18, fontWeight: 'bolder' }}>
                                {(total_l_dis - total_p_rec).toFixed(2)}
                            </TableCell>
                            <TableCell style={{ color: 'red', fontSize: 18, fontWeight: 'bolder' }}>
                                {(total_i_col - total_i_rec).toFixed(2)}
                            </TableCell>
                            <TableCell style={{ color: 'red', fontSize: 18, fontWeight: 'bolder' }}>
                                Rs.{((Number(total_l_dis - total_p_rec) + Number(total_i_col - total_i_rec))).toFixed(2)}
                            </TableCell>

                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>

            <Dialog
                open={dialogView}
                onClose={() => setDialogView(false)}
            >
                <DialogTitle>Adjust Dates</DialogTitle>
                <Divider />
                <DialogContent>
                    <Box>
                        <Typography>Loan Accounts in Between</Typography>
                        <Toolbar>
                            <TextField
                                type="date"
                                variant="outlined"
                                size="small"
                                name="from"
                                style={{ marginRight: 10, }}
                                value={date.from}
                                onChange={handleDate}

                            />
                            <TextField
                                type="date"
                                variant="outlined"
                                size="small"
                                name="to"
                                value={date.to}
                                onChange={handleDate}

                            />
                        </Toolbar>
                    </Box>
                    <Box>
                        <Typography>Emi amount in between</Typography>
                        <Toolbar>
                            <TextField
                                type="date"
                                variant="outlined"
                                size="small"
                                name="from_emi"
                                style={{ marginRight: 10, }}
                                value={date.from_emi}
                                onChange={handleDate}

                            />
                            <TextField
                                type="date"
                                variant="outlined"
                                size="small"
                                name="to_emi"
                                value={date.to_emi}
                                onChange={handleDate}

                            />
                        </Toolbar>
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button onClick={search_data} variant="contained" color='primary'>
                        Search
                    </Button>
                </DialogActions>
            </Dialog>
            <div
                style={{
                    position: "absolute",
                    left: "-1000px",
                    top: 0,
                }}
            >
                <PDFExport forcePageBreak='.keep' paperSize="LEGAL" margin={{ top: 5, right: 5, bottom: 5, left: 60 }} fileName='loan_details.pdf' landscape ref={pdfExportComponent}>
                    <AllLoanPrint data={sliceData} />
                </PDFExport>
            </div>
        </Container>
    )
}