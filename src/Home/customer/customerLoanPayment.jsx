import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Button, IconButton, CircularProgress, LinearProgress, Box, Dialog, DialogContent, Tooltip } from "@material-ui/core";
import React from "react";
import Api from "../../api/api";
import { useHistory } from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SnakBar from "../../consts/message";
import { Delete } from "@material-ui/icons";
import ImageApi from "../../api/image_api";
export default function CustomerLoanPayments(props) {
    const navigate = useHistory()
    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [massg, setMassg] = React.useState({})
    const [refresh, setRefresh] = React.useState(Math.random())
    const [openDialog, setOpenDialog] = React.useState(false);
    const [dialogImageUrl, setDialogImageUrl] = React.useState('');
    const agentId = data[0]?.agnt_id;

    React.useEffect(() => {
        fetch(Api + 'customerLoanPayments', {
            method: 'POST',
            body: JSON.stringify({
                date: props.location.state.up_date,
                customer: props.location.state.ac_no,
                branch_id: localStorage.getItem('branc_code')
            })
        })
            .then(res => res.json())
            .then(res => {
                setData(res)
            })
            .catch(err => {
                console.log(err)
            })
    }, [refresh])
    const onApprove = () => {
        setLoading(true)
        fetch(Api + 'approveCustomerLoan', {
            method: 'POST',
            body: JSON.stringify({
                date: props.location.state.up_date,
                customer: props.location.state.ac_no,
                agent_id: agentId
            })
        })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                setRefresh(Math.random())
                if (res.code === 200) {
                    setMassg({
                        open: true,
                        severity: 'success',
                        massg: res.massg
                    })
                } else {
                    setMassg({
                        open: true,
                        severity: 'error',
                        massg: res.massg
                    })
                }
            })
            .catch(err => {
                setLoading(false)
                setMassg({
                    open: true,
                    severity: 'error',
                    massg: 'Faild to connect to the server'
                })
            })
    }

    const onDeleteEmi = (id) => {
        setLoading(true)
        fetch(Api + 'deleteCustLoanPay', {
            method: 'POST',
            body: JSON.stringify({
                id: id
            })
        })
            .then(res => res.json())
            .then(res => {
                setRefresh(Math.random())
                setLoading(false)
                setMassg({
                    open: true,
                    severity: res.code === 200 ? 'success' : 'error',
                    massg: res.massg
                })
            })
            .catch(err => {
                setLoading(false)
                setMassg({
                    open: true,
                    severity: 'error',
                    massg: 'Faild to connect to the server'
                })
            })
    }
    const handleOpenDialog = (imageUrl) => {
        setDialogImageUrl(imageUrl);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    return (
        <Container style={{ padding: 0 }} component={Paper} maxWidth="false">
            <Toolbar component={Paper} style={{ padding: 5, marginBottom: 5, justifyContent: 'space-between' }}>
                <IconButton onClick={() => navigate.push('/Home/CustomerHome/CustomerPayments')}>
                    <ArrowBackIcon />
                </IconButton>
                <h2 style={{ color: '#303F9F' }}>Loan Payments</h2>

                <Button onClick={onApprove} variant="contained" color="primary">
                    Approve

                </Button>
            </Toolbar>
            <TableContainer component={Paper}>
                {
                    loading ? <LinearProgress /> : ''
                }
                <Table size="small">
                    <TableHead style={{ backgroundColor: '#888888' }}>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Sl No.</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Loan No</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>NAME</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>DATE</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>PRINCIPLE</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>INTEREST</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>EMI</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Transaction Id</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Remarks</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Screenshot</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>STATUS</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>More</TableCell>

                    </TableHead>
                    <TableBody>
                        {
                            data.map((item, index) =>
                                <TableRow key={index}>
                                    <TableCell>{index + 1}.</TableCell>
                                    <TableCell>{item.ln_id}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.recived_date}</TableCell>
                                    <TableCell>Rs.{item.prncpl}</TableCell>
                                    <TableCell>Rs.{item.interest}</TableCell>
                                    <TableCell>Rs.{item.ttl}</TableCell>
                                    <TableCell>{item.transaction_id}</TableCell>
                                    <TableCell>{item.remarks}</TableCell>
                                    <TableCell>
                                        {item.screenshot ? (
                                            <Tooltip title="Payment Screenshot">
                                                <Button
                                                    size='small'
                                                    variant='outlined'
                                                    style={{ textAlign: 'center', margin: 5 }}
                                                    color="primary"
                                                    onClick={() => handleOpenDialog(item.screenshot)}
                                                >
                                                    View
                                                </Button>
                                            </Tooltip>
                                        ) : (
                                            <span style={{ fontSize: 12, color: 'gray' }}>No image</span>
                                        )}


                                    </TableCell>
                                    <TableCell >
                                        <Box
                                            sx={{
                                                backgroundColor:
                                                    item.approval_status === 'pending'
                                                        ? '#F4A800'
                                                        : item.approval_status === 'approved'
                                                            ? '#22B33A'
                                                            : item.approval_status === 'rejected'
                                                                ? '#F60002'
                                                                : 'transparent',
                                                borderRadius: 20,
                                                px: 1,
                                                py: 0.1,
                                                display: 'inline-block',
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold',
                                                color: 'white'
                                            }}
                                        >
                                            {item.approval_status}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Delete Payment">
                                            <IconButton size="small" onClick={() => onDeleteEmi(item.id)}>
                                                <Delete style={{ color: 'red' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <SnakBar massg={massg} setMassg={setMassg} />
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogContent>
                    {dialogImageUrl && <img style={{ width: '100%' }} src={ImageApi + dialogImageUrl} alt="Image" />}
                </DialogContent>
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                    <Button size='small' variant='contained' color='secondary' onClick={handleCloseDialog} style={{ marginRight: 23, marginBottom: 5 }}>
                        Close
                    </Button>
                </div>
            </Dialog>
        </Container>
    )
}