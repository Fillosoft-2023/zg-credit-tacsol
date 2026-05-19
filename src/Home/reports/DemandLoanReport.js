import React, { useState, useEffect, useRef } from 'react';
import {
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
    Toolbar,
    Button,
    CircularProgress,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Tooltip
} from '@material-ui/core';
import Api from '../../api/api';
import { Print } from '@material-ui/icons';
import { PDFExport } from '@progress/kendo-react-pdf';
import DemandLoanReportPrint from './DemandLoanReportPrint';
import DateHandler from '../../consts/date_format';

const useStyles = makeStyles((theme) => ({
    container: {
        maxHeight: '83vh',
    },
    tableHead: {
        backgroundColor: theme.palette.primary.main,
    },
    whiteText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export default function DemandLoanReport() {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]); // Store complete fetched data
    const [loading, setLoading] = useState(false);
    const [agents, setAgents] = useState([]);
    const [collectionDays, setCollectionDays] = useState([]);
    const [loanTypes, setLoanTypes] = useState([]); // Dynamic list of loan types
    const [selectedDay, setSelectedDay] = useState(''); // Client-side filter
    const [selectedLoanType, setSelectedLoanType] = useState(''); // Client-side filter

    const [filters, setFilters] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
        agent_id: '',
        frequency: ''
    });

    const pdfExportComponent = useRef(null);

    useEffect(() => {
        // Fetch agents on mount
        fetch(Api + 'agent')
            .then(res => res.json())
            .then(res => setAgents(res))
            .catch(err => console.log(err));
    }, []);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilter = (rawData, day, loanType) => {
        let filtered = rawData;

        // Filter by Loan Type
        if (loanType) {
            filtered = filtered.filter(loan => loan.ln_tpe === loanType);
        }

        // Then filter by Collection Day
        if (!day) {
            setData(filtered);
            return;
        }

        filtered = filtered.filter(loan => {
            const freq = Number(loan.frequecy);
            const rawLoanDay = loan.collection_day;
            const loanDay = String(rawLoanDay || '').trim().toLowerCase();
            const filterDay = String(day || '').trim().toLowerCase();

            // Simple string matching for Collection Day
            // We trust the backend has already filtered by Date Range (including Overdue)

            // Logic:
            // 1. If loan has a specific collection day string, it MUST match the filter.
            // 2. If loan has NO collection day string:
            //      a. If Daily (freq=1), KEEP IT (Daily implies all days).
            //      b. If not Daily, REJECT IT (Can't match a specific day).

            if (loanDay.length > 0) {
                // If it has a day, strict match required
                return loanDay === filterDay;
            } else {
                // No day specified in loan
                if (freq === 1) {
                    return true; // Daily loans without specific day show on all filters
                } else {
                    return false; // Weekly/Fortnightly with no day set -> don't show on specific day filter
                }
            }
        });

        setData(filtered);
    };

    const handleDayChange = (e) => {
        const val = e.target.value;
        setSelectedDay(val);
        applyFilter(allData, val, selectedLoanType);
    };

    const handleLoanTypeChange = (e) => {
        const val = e.target.value;
        setSelectedLoanType(val);
        applyFilter(allData, selectedDay, val);
    };

    const fetchData = () => {
        setLoading(true);
        setData([]);
        setAllData([]);

        fetch(Api + 'demandLoanReport', {
            method: 'POST',
            body: JSON.stringify(filters)
        })
            .then(res => res.json())
            .then(res => {
                if (Array.isArray(res)) {
                    // Extract unique collection days
                    const days = [...new Set(res.map(item => item.collection_day))]
                        .filter(d => d && d.trim() !== '');

                    setCollectionDays(days);
                    setAllData(res);

                    // Extract unique loan types
                    const types = [...new Set(res.map(item => item.ln_tpe))]
                        .filter(t => t && t.trim() !== '');

                    setLoanTypes(types);

                    // Apply current filters (day and loan type)
                    applyFilter(res, selectedDay, selectedLoanType);
                } else {
                    console.error("API did not return an array", res);
                }
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                setData([]);
            });
    };

    const handlePrint = () => {
        if (pdfExportComponent.current) {
            pdfExportComponent.current.save();
        }
    };

    // Calculate total loan duration in months and expected closing date
    const calculateLoanStats = (row) => {
        const openDate = new Date(row.opn_dte);

        const emi = parseFloat(row.emi_amnt) || 0;
        const totlAmnt = parseFloat(row.totl_amnt) || 0;
        const freq = parseInt(row.frequecy) || 30;

        let loanDurationMonths = '-';
        let expectedClosingDate = '-';

        if (emi > 0 && totlAmnt > 0) {
            const totalInstallments = Math.ceil(totlAmnt / emi);
            const totalDays = totalInstallments * freq;

            // Convert total days to months (÷ 30)
            loanDurationMonths = Math.ceil(totalDays / 30);

            // Expected closing date = open date + total days
            const closingDate = new Date(openDate);
            closingDate.setDate(closingDate.getDate() + totalDays);
            expectedClosingDate = closingDate.toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
        }

        return { loanDurationMonths, expectedClosingDate };
    };

    return (
        <Container maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: "space-between", marginBottom: 5 }}>
                <Typography variant='h5' style={{ fontWeight: 'bold' }}>Demand Loan Report</Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>

                    {/* Agent Filter */}
                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel>Agent</InputLabel>
                        <Select
                            name="agent_id"
                            value={filters.agent_id}
                            onChange={handleChange}
                            label="Agent"
                        >
                            <MenuItem value=""><em>All Agents</em></MenuItem>
                            {agents.map((agent) => (
                                <MenuItem key={agent.id} value={agent.id}>{agent.ag_name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Frequency Filter */}
                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel>Frequency</InputLabel>
                        <Select
                            name="frequency"
                            value={filters.frequency}
                            onChange={handleChange}
                            label="Frequency"
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            <MenuItem value={1}>Daily</MenuItem>
                            <MenuItem value={7}>Weekly</MenuItem>
                            <MenuItem value={14}>Fortnightly</MenuItem>
                            <MenuItem value={30}>Monthly</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Collection Day Filter - Client Side */}
                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel>Collection Day</InputLabel>
                        <Select
                            name="collection_day"
                            value={selectedDay}
                            onChange={handleDayChange}
                            label="Collection Day"
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            {collectionDays.map((day, index) => (
                                <MenuItem key={index} value={day}>{day}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Loan Type Filter - Client Side */}
                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel>Loan Type</InputLabel>
                        <Select
                            name="loan_type"
                            value={selectedLoanType}
                            onChange={handleLoanTypeChange}
                            label="Loan Type"
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            {loanTypes.map((type, index) => (
                                <MenuItem key={index} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        label="From"
                        InputLabelProps={{ shrink: true }}
                        name="from"
                        value={filters.from}
                        onChange={handleChange}
                        style={{ marginRight: 10 }}
                    />
                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        label="To"
                        InputLabelProps={{ shrink: true }}
                        name="to"
                        value={filters.to}
                        onChange={handleChange}
                        style={{ marginRight: 10 }}
                    />
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={fetchData}
                        disabled={loading}
                        style={{ marginRight: 10 }}
                    >
                        {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Search'}
                    </Button>

                    <Tooltip title="Print Report">
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handlePrint}
                            disabled={data.length === 0}
                        >
                            <Print />
                        </Button>
                    </Tooltip>
                </div>
            </Toolbar>

            <TableContainer component={Paper} className={classes.container}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Sl No</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Name</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Contact</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Reg No</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Loan No</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Loan Type</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Collection Day</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Open Date</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Loan Amount</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Total Interest</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Total Loan Amt</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Total Paid</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Total Outstanding</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Principle Bal</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Interest Bal</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Int Rate</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>EMI Amount</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Monthly Demand</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Monthly Paid</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Monthly Pending</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Loan Duration (Months)</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Expected Closing Date</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index} hover>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.c_nmbr}</TableCell>
                                <TableCell>{row.acno}</TableCell>
                                <TableCell>{row.ln_id}</TableCell>
                                <TableCell>{row.ln_tpe}</TableCell>
                                <TableCell>{row.collection_day}</TableCell>
                                <TableCell>{row.opn_dte}</TableCell>
                                <TableCell>{Number(row.ln_amnt).toFixed(2)}</TableCell>
                                <TableCell>{Number(row.intrst_amnt).toFixed(2)}</TableCell>
                                <TableCell>{(Number(row.ln_amnt) + Number(row.intrst_amnt)).toFixed(2)}</TableCell>
                                <TableCell>{Number(row.total_received).toFixed(2)}</TableCell>
                                <TableCell>{Number(row.outstanding_amt).toFixed(2)}</TableCell>
                                <TableCell>{Number(row.principle_bal).toFixed(2)}</TableCell>
                                <TableCell>{Number(row.intrst_bal).toFixed(2)}</TableCell>
                                <TableCell>{row.intrst}%</TableCell>
                                <TableCell>{Number(row.emi_amnt).toFixed(2)}</TableCell>
                                <TableCell>{Number(row.monthly_demand).toFixed(2)}</TableCell>
                                <TableCell>{Number(row.monthly_paid).toFixed(2)}</TableCell>
                                <TableCell>{Number(row.monthly_pending).toFixed(2)}</TableCell>
                                <TableCell>{calculateLoanStats(row).loanDurationMonths} mo</TableCell>
                                <TableCell>{calculateLoanStats(row).expectedClosingDate}</TableCell>
                            </TableRow>
                        ))}
                        {data.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={21} align="center">
                                    No records found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TableContainer component={Paper} className={classes.container} style={{ marginTop: 10, maxHeight: 'none' }}>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={6} style={{ fontWeight: 'bold', textAlign: "right" }}>Grand Total</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.ln_amnt), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.intrst_amnt), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{data.reduce((a, b) => a + (Number(b.ln_amnt) + Number(b.intrst_amnt)), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.total_received), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.outstanding_amt), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.principle_bal), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.intrst_bal), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}></TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.emi_amnt), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.monthly_demand), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.monthly_paid), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.monthly_pending), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}></TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Hidden Print Component */}
            <div style={{ position: "absolute", left: "-10000px", top: 0 }}>
                <PDFExport
                    ref={pdfExportComponent}
                    paperSize="A4"
                    margin={20}
                    fileName={`Demand_Loan_Report_${filters.from}_${filters.to}.pdf`}
                    author="Tacsol"
                    landscape={true}
                    scale={0.6}
                >
                    <DemandLoanReportPrint
                        data={data}
                        date={{ ...filters, collection_day: selectedDay, ln_tpe: selectedLoanType }}
                        agents={agents}
                    />
                </PDFExport>
            </div>
        </Container>
    );
}
