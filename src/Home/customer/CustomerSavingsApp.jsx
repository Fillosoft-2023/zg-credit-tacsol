import { useEffect, useState } from "react"
import { Box, Button, Container, FormControl, IconButton, InputLabel, LinearProgress, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from "@material-ui/core"
import { Refresh } from "@material-ui/icons"
import { Link } from 'react-router-dom'
import Api from "../../api/api"
import SnakBar from "../../consts/message"
import { useHistory } from "react-router-dom/cjs/react-router-dom"




export default function CustomerSavingsApp(params) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [massg, setMassg] = useState({})
    const [refresh, setRefresh] = useState(Math.random())
    const [statusFilter, setStatusFilter] = useState("all");
    const history = useHistory();

    const handleMoreClick = (acno) => {
        history.push(`/home/MemberDetails/${acno}`, { acno });
    };


    useEffect(() => {
        setLoading(true)
        fetch(Api + 'custSavApplication')
            .then(res => res.json())
            .then(res => {
                setData(res)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }, [refresh])

    const onApproved = (id) => {

        setLoading(true)
        fetch(Api + 'approveCustSav', {
            method: 'POST',
            body: JSON.stringify({
                id: id
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
    const onReject = (id) => {

        setLoading(true)
        fetch(Api + 'rejectCustSav', {
            method: 'POST',
            body: JSON.stringify({
                id: id
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

    return (
        <Container component={Paper} maxWidth="false" style={{ padding: 0, minHeight: '85vh' }}>
            <Toolbar component={Paper} variant='contained' style={{ justifyContent: 'space-between' }}>
                <IconButton onClick={() => setRefresh(Math.random())} style={{ backgroundColor: '#22B33A', margin: 10 }}>
                    <Refresh style={{ color: 'white' }} />
                </IconButton>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Customer Savings Applications</Typography>

                <FormControl variant="outlined" size="small" style={{ minWidth: 150, marginLeft: 10 }}>
                    <InputLabel>Filter </InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        label="Status"
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="pending" style={{ color: '#F4A800' }}>Pending</MenuItem>
                        <MenuItem value="approved" style={{ color: '#22B33A' }}>Approved</MenuItem>
                        <MenuItem value="rejected" style={{ color: '#F60002' }}>Rejected</MenuItem>
                    </Select>
                </FormControl>

            </Toolbar>
            {
                loading ? <LinearProgress /> : ''
            }
            <TableContainer component={Paper}>
                <Table>
                    <TableHead style={{ backgroundColor: '#888888' }}>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Sl No.</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>ID</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Ac No</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Name</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>RD Type</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Dep Amount</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>RD Tenure</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Deposit Date</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Application Date</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Application Status</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Approve</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Reject</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Create</TableCell>
                    </TableHead>

                    <TableBody>
                        {
                            data
                                .filter(item => statusFilter === "all" || item.app_status === statusFilter)
                                .map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}.</TableCell>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell
                                            style={{ cursor: 'pointer', color: '#1976d2', fontWeight: 'bold' }}
                                            onClick={() => handleMoreClick(item.ac_no)}
                                        >
                                            {item.ac_no}
                                        </TableCell>

                                        <TableCell
                                            style={{ cursor: 'pointer', color: '#1976d2', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}
                                            onClick={() => handleMoreClick(item.ac_no)}
                                        >
                                            {item.name}
                                        </TableCell>
                                        <TableCell>{item.rd_type}</TableCell>
                                        <TableCell>Rs.{item.dep_amnt}</TableCell>
                                        <TableCell>{item.tenure} Months</TableCell>
                                        <TableCell>{item.dep_date}</TableCell>
                                        <TableCell>{item.appl_date}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Box
                                                sx={{
                                                    color:
                                                        item.app_status === 'pending'
                                                            ? '#F4A800'
                                                            : item.app_status === 'approved'
                                                                ? '#22B33A'
                                                                : item.app_status === 'rejected'
                                                                    ? '#F60002'
                                                                    : 'transparent',
                                                    borderRadius: 20,
                                                    px: 1,
                                                    py: 0.1,
                                                    display: 'inline-block',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {item.app_status}
                                            </Box>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Button onClick={() => onApproved(item.id)} variant="contained" size="small" style={{ backgroundColor: '#22B33A', fontWeight: 'bold', color: 'white', borderRadius: 15 }}>Approve</Button>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Button onClick={() => onReject(item.id)} variant="contained" size="small" style={{ backgroundColor: '#F60002', fontWeight: 'bold', color: 'white', borderRadius: 15 }}>Reject</Button>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Link to={{ pathname: '/Home/SavMainHome/CreateSavings', query: item.ac_no }}
                                                style={{ textDecoration: 'none', pointerEvents: item.app_status !== 'approved' ? 'none' : 'auto' }}
                                            >
                                                <Button
                                                    variant='contained'
                                                    size='small'
                                                    color="primary"
                                                    style={{ borderRadius: 15 }}
                                                    disabled={item.app_status !== 'approved'}
                                                >                                                    Create
                                                </Button>
                                            </Link>
                                        </TableCell>

                                    </TableRow>
                                ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <SnakBar massg={massg} setMassg={setMassg} />
        </Container>
    )
}