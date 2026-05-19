import React from 'react'

import {
    makeStyles,
    Button,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    Divider,
    TextareaAutosize,
    CircularProgress,
    Toolbar,
    IconButton,
    Modal
} from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useHistory } from 'react-router-dom'
import DeleteLoan from './deleteLoan'
import DateHandler from '../../consts/date_format';
import Api from '../../api/api';
import SnakBar from '../../consts/message'
import ImageApi from '../../api/image_api';
import { ArrowBack } from '@material-ui/icons';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function LoanHolDet(props) {
    const navigate = useHistory()
    const data = props.location.state.data;
    const [imgDisplay, setImgDisplay] = React.useState('');
    const style = useStyle()
    const history = useHistory()
    const handleRoute = () => {
        history.push('/Home/LoanHome/ProfileModify', { data: data })
    }
    const RoutetoLoan = () => {
        if (data.ln_stts === 'completed') {
            setOpen(false)
            alert("Loan Completed! You can not modify completed loan's information")
        }
        else {
            history.push('/Home/LoanHome/LoanModify', { data: data })
        }
    }
    const [open, setOpen] = React.useState(false);
    const [remarks, setRemarks] = React.useState(null)
    const [mssg, setMssg] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    const [agentId, setAgentId] = React.useState({ ag_name: '' });
    const [viewLoan, setViewLoan] = React.useState(false);

    React.useEffect(() => {
        fetch(Api + 'agentDetails', {
            method: 'POST',
            body: JSON.stringify({ agentId: data.agnt_id })
        })
            .then(res => res.json())
            .then(res => setAgentId(res))
            .catch(err => {
                console.log(err);
            });
    }, [data.agnt_id]);

    const handleConformise = () => {
        const sendConf = {
            reffer_id: data.reffer_id,
            press: 'conformiseLoan',
            remarks: remarks

        }
        setOpen(true)
        setLoading(true)
        fetch(Api + 'conformiseLoan', {
            method: 'POST',
            body: JSON.stringify(sendConf)
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                setLoading(false)
                if (res.code === 200) {
                    setMssg({
                        open: true,
                        massg: res.massg,
                        severity: 'success'
                    })
                } else {
                    setMssg({
                        open: true,
                        massg: res.massg,
                        severity: 'error'
                    })
                }
            })
            .catch(err => {
                setLoading(false)
                setMssg({
                    open: true,
                    massg: "Faild to connect to the server",
                    severity: 'error'
                })
            })

    }
    const conformiseCalc = () => {

        const send = {
            press: "getlastEmi",
            reffer_id: data.reffer_id,

        }

        setLoading(true)
        fetch(Api + 'getlastEmi', {
            method: 'POST',
            body: JSON.stringify({ reffer_id: data.reffer_id })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                setLoading(false)
                if (res.code === 200) {
                    setOpen(true)
                } else {
                    setMssg({
                        open: true,
                        massg: res.massg,
                        severity: 'error'
                    })
                }
            })
            .catch(err => {
                setLoading(false)
                setMssg({
                    open: true,
                    massg: "Faild to connect to the server",
                    severity: 'error'
                })
            })
    }



    const persionalInfo = () => {

        return (
            <Table stickyHeader className={style.table}>
                <TableBody>
                    <TableRow>
                        <TableCell component="th" scope="row">Name</TableCell>
                        <TableCell>{data.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Registration No</TableCell>
                        <TableCell>{data.acno}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >C/O</TableCell>
                        <TableCell>{data.f_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Contact No</TableCell>
                        <TableCell>{data.c_nmbr}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Address</TableCell>
                        <TableCell>{data.vill}, {data.pin}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Nominee</TableCell>
                        <TableCell>{data.nmni}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Open Date</TableCell>
                        <TableCell>{DateHandler(data.op_dte)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Referral ac no</TableCell>
                        <TableCell>{data.rfl_ac_no}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Other Info</TableCell>
                        <TableCell>{data.other_info}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Educational qualification</TableCell>
                        <TableCell>{data.edu_qualific}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Occupation</TableCell>
                        <TableCell>{data.occupation}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Bank Ac No</TableCell>
                        <TableCell>{data.bank_ac}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Bank Detials</TableCell>
                        <TableCell>{data.bank_det}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Nominee Address</TableCell>
                        <TableCell>{data.nominee_add}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Relation with Nominee</TableCell>
                        <TableCell>{data.relation_with_nom}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell >Passport image</TableCell>
                        <TableCell>
                            <Button color="primary" onClick={() => setImgDisplay(data.img === null ? alert('no data for display') : 'set')}>view</Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Id proof</TableCell>
                        <TableCell>
                            <Button color="primary" onClick={() => setImgDisplay(data.id_prf === null ? alert('no data for display') : 'id')}>view</Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Address Proof</TableCell>
                        <TableCell>
                            <Button color="primary" onClick={() => setImgDisplay(data.id_prf === null ? alert('no data for display') : 'add')}>view</Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Created/Modified By</TableCell>
                        <TableCell>
                            {data.r_user}
                        </TableCell>
                    </TableRow>

                </TableBody>

            </Table>
        )
    }

    const loanInfo = () => {

        return (
            <>
                {/* {
                    viewLoan ? ( */}
                        <Table stickyHeader className={style.table}>
                            <TableBody>
                                {/* <TableRow>
                                    <TableCell component="th" scope="row">Loan No</TableCell>
                                    <TableCell>{data.id}</TableCell>
                                </TableRow> */}
                                <TableRow>
                                    <TableCell component="th" scope="row">Loan Account No</TableCell>
                                    <TableCell>{data.ln_id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Loan Type</TableCell>
                                    <TableCell>{data.ln_tpe === 'squred' ? 'secured' : data.ln_tpe}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Loan Date</TableCell>
                                    <TableCell>{DateHandler(data.opn_dte)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Agent Id</TableCell>
                                    <TableCell>{data.agnt_id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Agent Name</TableCell>
                                    <TableCell>{agentId.res_name}</TableCell>
                                </TableRow>
                                {/* <TableRow>
                                    <TableCell >Loan Id</TableCell>
                                    <TableCell>{data.ln_id}</TableCell>
                                </TableRow> */}
                                <TableRow>
                                    <TableCell >Loan Amount</TableCell>
                                    <TableCell>Rs.{data.ln_amnt}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Interest Rate</TableCell>
                                    <TableCell>{data.intrst}%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Loan Frequency</TableCell>

                                    <TableCell>{data.frequecy}</TableCell>

                                </TableRow>
                                <TableRow>
                                    <TableCell >Collection Day</TableCell>

                                    <TableCell>{data.collection_day}</TableCell>

                                </TableRow>
                                <TableRow>
                                    <TableCell >No Of EMI</TableCell>
                                    <TableCell>
                                        {data.no_emi}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >No Of Month</TableCell>
                                    <TableCell>
                                        {data.no_of_month}
                                    </TableCell>
                                </TableRow>
                                {/*<TableRow>
                        <TableCell >Insurence</TableCell>
                        <TableCell>
                            {data.insrnce}
                        </TableCell>
                    </TableRow>*/}
                                <TableRow>
                                    <TableCell >Processing Fees</TableCell>
                                    <TableCell>
                                        Rs.{data.pros_chrg}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Insurence</TableCell>
                                    <TableCell>
                                        Rs.{data.insrnce}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Service Tax</TableCell>
                                    <TableCell>
                                        Rs.{data.s_tax}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >EMI amount</TableCell>
                                    <TableCell>
                                        Rs.{data.emi_amnt}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >EMI Principle</TableCell>
                                    <TableCell>
                                        Rs.{data.emi_princ}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >EMI Interest</TableCell>
                                    <TableCell>
                                        Rs.{data.emi_intr}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Interest Amount</TableCell>
                                    <TableCell>
                                        Rs.{data.intrst_amnt}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Total Amount</TableCell>
                                    <TableCell>
                                        Rs.{data.totl_amnt}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Account Status</TableCell>
                                    <TableCell style={{textTransform:'uppercase'}}>
                                        {data.ln_stts} 
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Created/Modified By</TableCell>
                                    <TableCell>
                                        {data.l_user}
                                    </TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
            </>
        )
    }

    const imgViewr = (images) => {
        let size = ''
        if (imgDisplay === 'set') {
            size = 150
        } else if (imgDisplay === 'id') {
            size = 250
        } else {
            size = 250
        }
        const Example = () => <img style={{ width: size }} src={ImageApi + images} />

        return (
            <Example />
        )
    }



    return (
        <>
            <Toolbar component={Paper}>
                <IconButton onClick={() => navigate.push('/Home/LoanHome')}>
                    <ArrowBack />
                </IconButton>
                <h2>Profile</h2>
            </Toolbar>
            <Grid container spacing={1} style={{ height: '100%' }}>

                <Grid item xs={12} sm={6} >
                    <Paper className={style.profdet}>
                        <div style={{ width: '100%', flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                            <Typography style={{ padding: 10 }}>Profile Information</Typography>
                            {/* <Button variant="contained" onClick={() => handleRoute()} color="primary" style={{ marginLeft: 50, height: 30 }} >
                                Edit
                            </Button> */}
                            <Button variant="contained" onClick={() => conformiseCalc()} color="primary" style={{ marginLeft: 5, height: 30 }} >
                                Complete
                                {
                                    loading ? <CircularProgress size={30} color="#fff" /> : ''
                                }
                            </Button>
                        </div>
                        <Divider />
                        {persionalInfo()}
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className={style.profdet}>

                        {
                            imgDisplay === 'set' ? (
                                <div style={{ height: '100%', width: '100%' }}>
                                    <Button onClick={() => setImgDisplay('')}>Return to loan information</Button>
                                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '90%', width: '100%', display: 'flex' }}>
                                        {imgViewr(data.img)}

                                    </div>

                                </div>
                            ) : imgDisplay === 'id' ? (
                                <div style={{ height: '100%', width: '100%' }}>
                                    <Button onClick={() => setImgDisplay('i')}>Return to loan information</Button>
                                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '90%', width: '100%', display: 'flex' }}>
                                        {imgViewr(data.id_prf)}

                                    </div>

                                </div>
                            ) : imgDisplay === 'add' ? (
                                <div style={{ height: '100%', width: '100%' }}>
                                    <Button onClick={() => setImgDisplay('a')}>Return to loan information</Button>
                                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '90%', width: '100%', display: 'flex' }}>
                                        {imgViewr(data.add_prf)}

                                    </div>

                                </div>
                            ) : (
                                <div>
                                    <div style={{ width: '100%', flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                                        <Typography style={{ padding: 10 }}>Loan Information</Typography>
                                        <Button variant="contained" onClick={() => RoutetoLoan()} color="primary" style={{ marginLeft: 15, height: 30 }} >
                                            Edit
                                        </Button>
                                        <DeleteLoan callback={data} />
                                    </div>
                                    <Divider />
                                    {loanInfo()}
                                </div>
                            )
                        }

                    </Paper>
                </Grid>
                <div>


                    <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={() => setOpen(false)}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">{"Are you sure to Complete This loan"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                <TextareaAutosize
                                    rowsMax={3}
                                    aria-label="maximum height"
                                    placeholder="Narration"
                                    value={remarks}
                                    onChange={({ target: { value } }) => setRemarks(value)}
                                    style={{ width: '100%', marginTop: 20, height: 200 }}
                                />

                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)} color="primary">
                                Disagree
                            </Button>
                            <Button onClick={() => handleConformise()} color="primary">
                                Agree
                                {
                                    loading ? <CircularProgress size={30} color="#fff" /> : ''
                                }
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>

                <SnakBar massg={mssg} setMassg={setMssg} />
            </Grid>
            
        </>



    )
}

const useStyle = makeStyles((them) => ({
    profdet: {

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
    table: {

    }
}))