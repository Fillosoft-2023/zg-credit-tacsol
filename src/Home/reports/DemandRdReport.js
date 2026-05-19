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
    Tooltip
} from '@material-ui/core';
import Api from '../../api/api';
import { Print, Visibility } from '@material-ui/icons';
import { PDFExport } from '@progress/kendo-react-pdf';
import DemandRdReportPrint from './DemandRdReportPrint';
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

export default function DemandRdReport() {
    const classes = useStyles();
    const history = useHistory();
    const [data, setData] = useState([]);
    const [groupedData, setGroupedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [agents, setAgents] = useState([]);

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

    const groupByRdNo = (rawData) => {
        const groups = {};

        rawData.forEach(row => {
            const rdNo = row.rd_no;

            if (!groups[rdNo]) {
                groups[rdNo] = {
                    rd_no: rdNo,
                    name: row.name,
                    c_nmbr: row.c_nmbr,
                    acno: row.acno,
                    frquency: row.frquency,
                    start_date: row.start_date,
                    maturity_date: row.maturity_date,
                    installment_amount: 0,
                    total_collected: 0,
                    balance_to_pay: 0,
                    period_demand: 0,
                    period_collected: 0,
                    period_pending: 0,
                    details: [],
                    count: 0,
                    transactionCount: 0
                };
            }

            // Calculate transaction count for this account
            const freq = parseInt(row.frquency);
            const txCount = calculateTransactionCount(freq, filters.from, filters.to);

            // Aggregate totals
            groups[rdNo].installment_amount += Number(row.installment_amount);
            groups[rdNo].total_collected += Number(row.total_collected);
            groups[rdNo].balance_to_pay += Number(row.balance_to_pay);
            groups[rdNo].period_demand += Number(row.period_demand);
            groups[rdNo].period_collected += Number(row.period_collected);
            groups[rdNo].period_pending += Number(row.period_pending);
            groups[rdNo].count += 1;
            groups[rdNo].transactionCount += txCount;

            // Add to details
            groups[rdNo].details.push(row);
        });

        return Object.values(groups);
    };

    const calculateTransactionCount = (freq, fromDate, toDate) => {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (freq === 1) {
            // Daily - exclude Fridays
            let count = 0;
            let current = new Date(start);
            while (current <= end) {
                if (current.getDay() !== 5) count++;
                current.setDate(current.getDate() + 1);
            }
            return count;
        } else if (freq === 7) {
            return Math.floor(diffDays / 7);
        } else if (freq === 14) {
            return Math.floor(diffDays / 14);
        } else if (freq === 30) {
            return Math.floor(diffDays / 30);
        }
        return 1;
    };

    const handleViewDetails = (group) => {
        history.push({
            pathname: '/Home/reports/DemandRdReportDetails',
            state: {
                rd_no: group.rd_no,
                details: group.details,
                dateRange: {
                    from: filters.from,
                    to: filters.to
                }
            }
        });
    };

    const fetchData = () => {
        setLoading(true);
        setData([]);
        setGroupedData([]);

        fetch(Api + 'demandRdReport', {
            method: 'POST',
            body: JSON.stringify(filters)
        })
            .then(res => res.json())
            .then(res => {
                if (Array.isArray(res)) {
                    setData(res);
                    const grouped = groupByRdNo(res);
                    setGroupedData(grouped);
                } else {
                    console.error("API did not return an array", res);
                }
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                setData([]);
                setGroupedData([]);
            });
    };

    const handlePrint = () => {
        if (pdfExportComponent.current) {
            pdfExportComponent.current.save();
        }
    };

    const freqMap = { 1: 'Daily', 7: 'Weekly', 14: 'Fortnightly', 30: 'Monthly' };

    return (
        <Container maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: "space-between", marginBottom: 5 }}>
                <Typography variant='h5' style={{ fontWeight: 'bold' }}>Demand RD Report</Typography>
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
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>RD No</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Freq</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Start Date</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Mat. Date</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Inst. Amt</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Total Coll.</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Balance</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Demand</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Collected</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Pending</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Action</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groupedData.map((group, groupIndex) => (
                            <TableRow key={groupIndex} hover style={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell>{groupIndex + 1}</TableCell>
                                <TableCell>{group.name}</TableCell>
                                <TableCell>{group.c_nmbr}</TableCell>
                                <TableCell>{group.acno}</TableCell>
                                <TableCell>
                                    <strong>{group.rd_no}</strong>
                                    <Typography variant="caption" style={{ marginLeft: 5, color: '#666' }}>
                                        ({group.transactionCount} transaction{group.transactionCount !== 1 ? 's' : ''})
                                    </Typography>
                                </TableCell>
                                <TableCell>{freqMap[group.frquency] || group.frquency}</TableCell>
                                <TableCell>{DateHandler(group.start_date)}</TableCell>
                                <TableCell>{DateHandler(group.maturity_date)}</TableCell>
                                <TableCell><strong>{group.installment_amount.toFixed(2)}</strong></TableCell>
                                <TableCell><strong>{group.total_collected.toFixed(2)}</strong></TableCell>
                                <TableCell><strong>{group.balance_to_pay.toFixed(2)}</strong></TableCell>
                                <TableCell><strong>{group.period_demand.toFixed(2)}</strong></TableCell>
                                <TableCell><strong>{group.period_collected.toFixed(2)}</strong></TableCell>
                                <TableCell><strong>{group.period_pending.toFixed(2)}</strong></TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleViewDetails(group)}
                                        startIcon={<Visibility />}
                                    >
                                        View ({group.transactionCount})
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {groupedData.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={15} align="center">
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
                            <TableCell colSpan={6 + 2} style={{ fontWeight: 'bold', textAlign: "right" }}>Grand Total</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{groupedData.reduce((a, b) => a + Number(b.installment_amount), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{groupedData.reduce((a, b) => a + Number(b.total_collected), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{groupedData.reduce((a, b) => a + Number(b.balance_to_pay), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{groupedData.reduce((a, b) => a + Number(b.period_demand), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{groupedData.reduce((a, b) => a + Number(b.period_collected), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>{groupedData.reduce((a, b) => a + Number(b.period_pending), 0).toFixed(2)}</TableCell>
                            <TableCell></TableCell>
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
                    fileName={`Demand_RD_Report_${filters.from}_${filters.to}.pdf`}
                    author="Tacsol"
                    landscape={true}
                    scale={0.6}
                >
                    <DemandRdReportPrint
                        data={data}
                        date={filters}
                        agents={agents}
                    />
                </PDFExport>
            </div>
        </Container>
    );
}
