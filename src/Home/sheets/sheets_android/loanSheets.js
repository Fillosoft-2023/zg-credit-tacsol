import React from 'react'
import {
    Container,
    Paper,
    Toolbar,
    Menu,
    MenuItem,
    Button,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    LinearProgress,
    Typography

} from '@material-ui/core'

import LoanSheetPrint from './loanSheetprint';
import {useHistory} from 'react-router-dom'
import PrintIcon from '@material-ui/icons/Print';
import FilterListIcon from '@material-ui/icons/FilterList';
import RefreshIcon from '@material-ui/icons/Refresh';
import Doc from '../../../docService/docService'
import { PDFExport } from '@progress/kendo-react-pdf';
import Api from '../../../api/api';
const menus = [
    {
        name: 'Daily',
        value: 1
    },
    {
        name: 'Weekly',
        value: 7
    },
    {
        name: 'Fortnightly',
        value: 14
    },
    {
        name: 'Monthly',
        value: 30
    }
]
const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
export default function LoanSheet(prop) {
    const pdfExportComponent = React.useRef(null);
    const [propData, setPropData] = React.useState(prop.history.location.state)
    const [anchorE1, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorE1)
    const [sendData, setSendData] = React.useState({ ...propData, freq: propData.frequency.value, ln_type: '',day:propData.day })
    const [agentDisplay, setAgentDisplay] = React.useState(false)
    const [agent, setAgent] = React.useState([])
    const [data, setData] = React.useState([])
    const history = useHistory()
    const [adjustStatus, setAdjustStatus] = React.useState(false)
    const [tableHeads, setTableHeads] = React.useState([
        {
            head: "Sl No.",
            width: "30px",
            className: 'sl'
        },
        {
            head: "Name",
            width: "200px",
            className: 'name'
        },
        {
            head: "Reg NO",
            width: "50px",
            className: 'mem-no'
        },
        {
            head: "Contact NO",
            width: "100px",
            className: 'mem-no'
        },
        {
            head: "L No",
            width: "50px",
            className: 'l-no'
        },

        
        {
            head: "Disb Date",
            width: "80px",
            className: 'disb-date'
        },
        {
            head: "Disb Amount",
            width: "80px",
            className: 'disb-date'
        },
        {
            head: "Int Rate",
            width: "80px",
            className: 'disb-date'
        },
        {
            head: "Tenure",
            width: "80px",
            className: 'disb-date'
        },
        {
            head: "Closing Date",
            width: "80px",
            className: 'disb-date'
        },
        {
            head: "Outstanding Amount",
            width: "50px",
            className: 'disb-amt'
        },
        {
            head: "Princ Bal",
            width: "50px",
            className: 'disb-amt'
        },
        {
            head: "Intr Bal",
            width: "50px",
            className: 'disb-amt'
        },
        {
            head: "EMI",
            width: "50px",
            className: 'disb-amt'
        },
        {
            head: "Monthly Demand",
            width: "50px",
            className: 'disb-amt'
        },
        {
            head: "Monthly Paid",
            width: "50px",
            className: 'disb-amt'
        },
        {
            head: "Monthly Pending Balance",
            width: "50px",
            className: 'disb-amt'
        },
        
    ])

    const [newData, setNewData] = React.useState([])
    const [tableFoot, setTableFoot] = React.useState(["", "Total", "", "", "", "", "", "", "", "", "", "", ""])
    const [refresh, setRefresh] = React.useState(Math.random())
    const [anchorE2, setAnchorE2] = React.useState(null)
    const loan_type_open = Boolean(anchorE2)
    const [dayOpen, setDayOpen] = React.useState()
    const [err, setErr] = React.useState({})
    const [loan_type, setLoanType] = React.useState([])
    const [massg, setMassg] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    const handleClose = () => {
        setAnchorEl(null)
        setAnchorE2(null)
        setRefresh(Math.random())
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleAnchor2 = (e) => {
        setAnchorE2(e.currentTarget)
        fetch(Api + 'loan_type')
            .then(res => res.json())
            .then(res => { setLoanType(res); setRefresh(Math.random()) })

    }

    const handleChange = (e) => {
        setSendData({
            ...sendData,
            [e.target.name]: e.target.value
        })
        setDayOpen(false)
    }

    const handleFreqChange = (prop) => {
        setAnchorEl(null)
        setSendData({
            ...sendData,
            freq: prop

        })
        if (prop === 7 || prop === 14) {
            setDayOpen(true)
            setSendData({
                ...sendData,
                day: propData.day
            })
        } else {
            setDayOpen(false)
            setSendData({
                ...sendData,
                day: propData.day,
                freq: prop
            })
        }
        setAgentDisplay(true)

        fetch(Api + 'agent')
            .then(res => res.json())
            .then(res => setAgent(res))

        setPropData({
            ...propData,
            frequency: {
                value: prop
            }
        })
    }

    const onAgentChange = (prop) => {

        setAgentDisplay(false)
        setLoading(true)
        fetch(Api + 'loanSheet', {
            method: 'POST',
            body: JSON.stringify({
                 ...sendData,
                  agnt_id: prop.id })
        })
            .then(res => res.json())
            .then(res => {
                setData(res); 
                setNewData(sliceIntoChunks(res, 16));
                 setLoading(false)

            })
            .catch(err => {
                console.log(err)
            })

        setPropData({
            ...propData,
            agent: {
                ...propData.agent,
                id: prop.id,
                ag_name: prop.ag_name
            }
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

    React.useEffect(() => {

        const from = new Date(propData.from)
        const to = new Date(propData.to)
        const diffTime = Math.abs(to - from);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const freq = propData.frequency.value
        const no_install = 8
        const sheet_start = propData.sheet_start

        //for maintain emai no to 10


        onAgentChange(propData.agent)





    }, [])

    React.useEffect(() => {
        const from = new Date(propData.from)
        const to = new Date(propData.to)
        const diffTime = Math.abs(to - from);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const freq = propData.frequency.value
        const no_install = 8
        if (no_install > 8) {
            alert("Error!, Number of installment must less than or equal to 8")
            history.push('/Home/LoanSheetHome/')
        } else {
            onAgentChange(propData.agent)
        }

    }, [refresh])

    const handleLoanByType = (prop) => {
        setLoading(true)
        setAnchorE2(null)
        fetch(Api + 'loanSheet_by_type', {
            method: 'POST',
            body: JSON.stringify({
                ...sendData,
                ln_type: prop,
                agnt_id: propData.agent.id,
                day:propData.day 
            })
        })
            .then(res => res.json())
            .then(res => {
                setNewData(sliceIntoChunks(res, 16))
                setData(res)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleDownload = (html) => Doc.createPdf(html);
    return (
        <React.Fragment>
            <Container component={Paper} maxWidth="xxl" style={{ overflow: 'auto', minHeight: '93vh' }}>
                <Typography variant='h5' style={{ textAlign: 'center', fontWeight: 'bold', padding: 15 }}>
                    Loan Sheet
                </Typography>
                <hr />
                <Toolbar style={{ marginTop: 10, justifyContent: 'space-between' }}>
                    <Menu
                        anchorEl={anchorE1}
                        open={open}
                        onClose={handleClose}
                    >
                        {
                            menus.map((item, index) =>
                                <MenuItem key={index} onClick={(value) => {
                                    handleFreqChange(item.value)
                                    // handleDayDisplay(value,item.value)
                                }} >{item.name}</MenuItem>
                            )
                        }
                    </Menu>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClick}
                        style={{ width: 200 }}
                    >
                        Sheet Type
                    </Button>
                    <div>
                        <IconButton onClick={() => setRefresh(Math.random())}>
                            <Tooltip title="Refresh">
                                <RefreshIcon />
                            </Tooltip>
                        </IconButton>
                        <IconButton onClick={handleAnchor2}>
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
                <hr />
                {loading ? <LinearProgress /> : ''}
                <Menu
                    anchorEl={anchorE2}
                    open={loan_type_open}
                    onClose={handleClose}
                >
                    {
                        loan_type.map((item, index) => <MenuItem key={index} onClick={() => handleLoanByType(item.loan_type)} >{item.loan_type}</MenuItem>)
                    }
                </Menu>
                <Dialog
                    open={agentDisplay}

                >
                    <DialogTitle>
                        Manage Sheet

                    </DialogTitle>
                    <DialogContent>
                        {
                            dayOpen ? (
                                <FormControl variant="outlined" style={{ marginTop: 10, width: 300 }} fullWidth>
                                    <InputLabel id="demo-simple-select-outlined-label">Select Day</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        // error={err.agentid}
                                        value={sendData.day}
                                        name="day"
                                        onChange={handleChange}
                                        error={err.day}

                                    >
                                        <MenuItem value={false}>
                                            <em>None</em>
                                        </MenuItem>
                                        {
                                            week.map((item, index) => {
                                                return (
                                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Agent ID</TableCell>
                                                <TableCell>Agent Name</TableCell>
                                                <TableCell>Set </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                agent.map((item, index) =>
                                                    <TableRow key={index}>
                                                        <TableCell>{item.id}</TableCell>
                                                        <TableCell>{item.ag_name}</TableCell>
                                                        <TableCell>
                                                            <Button onClick={() => onAgentChange(item)}>
                                                                Set
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )
                        }
                    </DialogContent>
                </Dialog>
                <PDFExport keepTogether='.keep' paperSize="LEGAL" margin={{ top: 0, right: 5, bottom: 0, left: 60 }} fileName='deemand.pdf' landscape ref={pdfExportComponent}>
                    <LoanSheetPrint newData={newData} tableHead={tableHeads} data={data} tableFoot={tableFoot} date={propData} collection_day={!sendData.day ? null : sendData.day} print_date={sendData.date} />
                </PDFExport>
                {/* <PdfContainer createPdf={handleDownload} >
            <React.Fragment>
                 <LoanSheetPrint ref={componentRef} tableHead={tableHeads} tableSubHead={subHeads} data={data} tableFoot={tableFoot} date={propData} collection_day={!sendData.day ? null : sendData.day}/>
            </React.Fragment>
            </PdfContainer> */}
            </Container>
        </React.Fragment>
    )
}