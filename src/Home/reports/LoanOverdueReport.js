import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
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
    Tooltip,
    Card,
    CardContent,
    Grid
} from '@material-ui/core';
import Api from '../../api/api';
import { Print, ArrowForwardIos } from '@material-ui/icons';
import { PDFExport } from '@progress/kendo-react-pdf';
import LoanOverdueReportPrint from './LoanOverdueReportPrint';
import DateHandler from '../../consts/date_format';

const useStyles = makeStyles((theme) => ({
    container: {
        maxHeight: '75vh',
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
    summaryCard: {
        marginBottom: 10,
    },
    green: {
        backgroundColor: '#e8f5e9'
    },
    yellow: {
        backgroundColor: '#fff9c4'
    },
    orange: {
        backgroundColor: '#ffe0b2'
    },
    red: {
        backgroundColor: '#ffebee'
    }
}));

export default function LoanOverdueReport() {
    const classes = useStyles();
    const history = useHistory();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [agents, setAgents] = useState([]);

    const [filters, setFilters] = useState({
        as_of_date: new Date().toISOString().split('T')[0],
        agent_id: '',
        loan_type: '',
        overdue_range: ''
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

    const fetchData = () => {
        setLoading(true);
        setData([]);

        fetch(Api + 'loanOverdueReport', {
            method: 'POST',
            body: JSON.stringify({ as_of_date: filters.as_of_date })
        })

            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (Array.isArray(res)) {
                    setData(res); // Store all data
                    setLoading(false);
                } else {
                    console.error("API did not return an array", res);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                setData([]);
            });
    };

    // Client-side filtering
    const getFilteredData = () => {
        let filtered = [...data];

        // Filter by agent
        if (filters.agent_id) {
            filtered = filtered.filter(row => row.agnt_id === filters.agent_id);
        }

        // Filter by loan type
        if (filters.loan_type) {
            filtered = filtered.filter(row => row.emi_type === filters.loan_type);
        }

        // Filter by overdue range
        if (filters.overdue_range) {
            const range = filters.overdue_range;
            filtered = filtered.filter(row => {
                const days = row.overdue_days;
                if (range === '1-7') return days >= 1 && days <= 7;
                if (range === '8-30') return days >= 8 && days <= 30;
                if (range === '31-60') return days >= 31 && days <= 60;
                if (range === '60+') return days >= 60;
                return true;
            });
        }

        return filtered;
    };

    const filteredData = getFilteredData();

    const handlePrint = () => {
        if (pdfExportComponent.current) {
            pdfExportComponent.current.save();
        }
    };

    const linkToLadger = (row) => {
        history.push('/Home/LadgerBookHome', {
            data: row,
            refresh: Math.random()
        });
    };

    // Calculate EMI end date based on start date, frequency, and number of EMIs
    const calculateEmiEndDate = (emiStartDate, frequency, noOfEmis) => {
        if (!emiStartDate || !frequency || !noOfEmis) return null;
        const startDate = new Date(emiStartDate);
        const freq = Number(frequency);
        const numEmis = Number(noOfEmis);
        let endDate = new Date(startDate);

        if (freq === 30) {
            endDate.setMonth(endDate.getMonth() + numEmis);
        } else if (freq === 7) {
            endDate.setDate(endDate.getDate() + numEmis * 7);
        } else if (freq === 1) {
            endDate.setDate(endDate.getDate() + numEmis);
        } else if (freq === 14) {
            endDate.setDate(endDate.getDate() + numEmis * 14);
        }

        return endDate;
    };

    // Calculate loan months (tenure) based on frequency and number of EMIs
    const calculateLoanMonths = (frequency, noOfEmis) => {
        if (!frequency || !noOfEmis) return 0;
        const freq = Number(frequency);
        const numEmis = Number(noOfEmis);

        if (freq === 30) return numEmis; // Monthly
        if (freq === 7) return Math.round((numEmis * 7) / 30); // Weekly to months
        if (freq === 14) return Math.round((numEmis * 14) / 30); // Fortnightly to months
        if (freq === 1) return Math.round(numEmis / 30); // Daily to months
        return 0;
    };

    // Calculate total loan duration in months and expected closing date (from opn_dte)
    const calculateLoanStats = (row) => {
        const openDate = new Date(row.opn_dte);
        const emi = parseFloat(row.emi_amnt) || 0;
        const totlAmnt = parseFloat(row.totl_amnt) || 0;
        const freq = parseInt(row.frquency) || 30;
        let loanDurationMonths = '-';
        let expectedClosingDate = '-';
        if (emi > 0 && totlAmnt > 0) {
            const totalInstallments = Math.ceil(totlAmnt / emi);
            const totalDays = totalInstallments * freq;
            loanDurationMonths = Math.ceil(totalDays / 30);
            const closingDate = new Date(openDate);
            closingDate.setDate(closingDate.getDate() + totalDays);
            expectedClosingDate = closingDate.toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
        }
        return { loanDurationMonths, expectedClosingDate };
    };

    // Calculate summary statistics
    const totalOverdueAmount = data.reduce((sum, row) => sum + Number(row.overdue_amount), 0);
    const avgOverdueDays = data.length > 0
        ? data.reduce((sum, row) => sum + Number(row.overdue_days), 0) / data.length
        : 0;
    const maxOverdueAccount = data.length > 0
        ? data.reduce((max, row) => Number(row.overdue_amount) > Number(max.overdue_amount) ? row : max, data[0])
        : null;

    const freqMap = { 1: 'Daily', 7: 'Weekly', 14: 'Fortnightly', 30: 'Monthly' };

    return (
        <Container maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: "space-between", marginBottom: 5 }}>
                <Typography variant='h5' style={{ fontWeight: 'bold' }}>Loan Overdue Report</Typography>
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

                    {/* Loan Type Filter */}
                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel>Loan Type</InputLabel>
                        <Select
                            name="loan_type"
                            value={filters.loan_type}
                            onChange={handleChange}
                            label="Loan Type"
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            <MenuItem value="auto">Auto EMI</MenuItem>
                            <MenuItem value="manual">Manual EMI</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Overdue Range Filter */}
                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel>Overdue Range</InputLabel>
                        <Select
                            name="overdue_range"
                            value={filters.overdue_range}
                            onChange={handleChange}
                            label="Overdue Range"
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            <MenuItem value="1-7">1-7 days</MenuItem>
                            <MenuItem value="8-30">8-30 days</MenuItem>
                            <MenuItem value="31-60">31-60 days</MenuItem>
                            <MenuItem value="60+">60+ days</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        label="As of Date"
                        InputLabelProps={{ shrink: true }}
                        name="as_of_date"
                        value={filters.as_of_date}
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
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Reg No</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Name</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Loan No</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Agent</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Loan Type</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Freq</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>EMI Amt</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Expected</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Received</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Overdue Count</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Overdue Amt</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Overdue Days</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Last Payment</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Contact</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>EMI Start Date</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>EMI End Date</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Loan Months</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Open Date</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Duration (Mo)</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Closing Date</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Action</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row, index) => {
                            const emiEndDate = calculateEmiEndDate(row.emi_strt, row.frquency, row.no_emi);
                            const loanMonths = calculateLoanMonths(row.frquency, row.no_emi);
                            const loanStats = calculateLoanStats(row);

                            return (
                                <TableRow key={index} hover>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.acno}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell><strong>{row.ln_id}</strong></TableCell>
                                    <TableCell>{row.ag_name}</TableCell>
                                    <TableCell>{row.emi_type === 'auto' ? 'Auto' : 'Manual'}</TableCell>
                                    <TableCell>{freqMap[row.frquency] || row.frquency}</TableCell>
                                    <TableCell>₹{Number(row.emi_amnt).toFixed(2)}</TableCell>
                                    <TableCell>{row.expected_emis}</TableCell>
                                    <TableCell>{row.received_emis}</TableCell>
                                    <TableCell><strong>{row.overdue_count}</strong></TableCell>
                                    <TableCell style={{ color: '#f44336', fontWeight: 'bold' }}>₹{Number(row.overdue_amount).toFixed(2)}</TableCell>
                                    <TableCell><strong>{row.overdue_days}</strong> days</TableCell>
                                    <TableCell>{row.last_payment_date || 'N/A'}</TableCell>
                                    <TableCell>{row.c_nmbr}</TableCell>
                                    <TableCell>{row.emi_strt ? DateHandler(row.emi_strt) : 'N/A'}</TableCell>
                                    <TableCell>{emiEndDate ? DateHandler(emiEndDate.toISOString().split('T')[0]) : 'N/A'}</TableCell>
                                    <TableCell>{loanMonths} months</TableCell>
                                    <TableCell>{row.opn_dte || 'N/A'}</TableCell>
                                    <TableCell>{loanStats.loanDurationMonths} mo</TableCell>
                                    <TableCell>{loanStats.expectedClosingDate}</TableCell>
                                    <TableCell>
                                        <Tooltip title="View Ledger">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => linkToLadger(row)}
                                            >
                                                <ArrowForwardIos fontSize="small" />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {filteredData.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={22} align="center">
                                    No overdue accounts found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Hidden Print Component */}
            <div style={{ position: "absolute", left: "-10000px", top: 0 }}>
                <PDFExport
                    ref={pdfExportComponent}
                    paperSize="A4"
                    margin={20}
                    fileName={`Loan_Overdue_Report_${filters.as_of_date}.pdf`}
                    author="Tacsol"
                    landscape={true}
                    scale={0.5}
                >
                    <LoanOverdueReportPrint
                        data={filteredData}
                        filters={filters}
                        agents={agents}
                        summary={{
                            totalAccounts: filteredData.length,
                            totalAmount: totalOverdueAmount,
                            avgDays: avgOverdueDays
                        }}
                    />
                </PDFExport>
            </div>
        </Container>
    );
}
