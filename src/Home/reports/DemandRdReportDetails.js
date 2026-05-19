import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Paper,
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
    IconButton
} from '@material-ui/core';
import { ArrowBack, Print } from '@material-ui/icons';
import { useHistory, useLocation } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import DemandRdReportDetailsPrint from './DemandRdReportDetailsPrint';

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
}));

export default function DemandRdReportDetails() {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const printRef = useRef();
    const [allDemands, setAllDemands] = useState([]);
    const [groupedByDate, setGroupedByDate] = useState([]);
    const [rdNo, setRdNo] = useState('');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    useEffect(() => {
        if (location.state && location.state.details && location.state.dateRange) {
            const rawDetails = location.state.details;
            const dateRangeData = location.state.dateRange;
            setRdNo(location.state.rd_no);
            setDateRange(dateRangeData);

            // Generate individual demands for each account
            const demands = [];
            rawDetails.forEach(account => {
                const accountDemands = generateDemands(account, dateRangeData.from, dateRangeData.to);
                demands.push(...accountDemands);
            });

            setAllDemands(demands);

            // Group by demand date
            const groups = {};
            demands.forEach(demand => {
                const key = demand.demand_date;

                if (!groups[key]) {
                    groups[key] = {
                        demandDate: key,
                        demands: [],
                        totalDemand: 0,
                        totalCollected: 0,
                        totalPending: 0
                    };
                }

                groups[key].demands.push(demand);
                groups[key].totalDemand += Number(demand.demand_amount);
                groups[key].totalCollected += Number(demand.collected_amount);
                groups[key].totalPending += Number(demand.pending_amount);
            });

            // Sort by demand date
            const sorted = Object.values(groups).sort((a, b) =>
                new Date(a.demandDate) - new Date(b.demandDate)
            );
            setGroupedByDate(sorted);
        }
    }, [location]);

    const generateDemands = (account, fromDate, toDate) => {
        const demands = [];
        const freq = parseInt(account.frquency);
        const instAmt = parseFloat(account.installment_amount);
        const periodCollected = parseFloat(account.period_collected);

        const start = new Date(fromDate);
        const end = new Date(toDate);

        // Calculate total demands first
        const totalDemands = calculateTotalDemands(freq, fromDate, toDate);
        const collectedPerDemand = totalDemands > 0 ? periodCollected / totalDemands : 0;

        // Generate demand dates based on frequency
        let currentDate = new Date(start);
        let demandNumber = 0;

        while (currentDate <= end) {
            // Skip Fridays for daily frequency
            if (freq === 1 && currentDate.getDay() === 5) {
                currentDate.setDate(currentDate.getDate() + 1);
                continue;
            }

            demands.push({
                ...account,
                demand_date: currentDate.toISOString().split('T')[0],
                demand_number: demandNumber + 1,
                demand_amount: instAmt,
                collected_amount: collectedPerDemand,
                pending_amount: instAmt - collectedPerDemand
            });

            demandNumber++;

            // Increment based on frequency
            if (freq === 1) {
                currentDate.setDate(currentDate.getDate() + 1);
            } else if (freq === 7) {
                currentDate.setDate(currentDate.getDate() + 7);
            } else if (freq === 14) {
                currentDate.setDate(currentDate.getDate() + 14);
            } else if (freq === 30) {
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else {
                break;
            }
        }

        return demands;
    };

    const calculateTotalDemands = (freq, fromDate, toDate) => {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (freq === 1) {
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

    const handleBack = () => {
        history.goBack();
    };

    const freqMap = { 1: 'Daily', 7: 'Weekly', 14: 'Fortnightly', 30: 'Monthly' };

    return (
        <Container maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: "space-between", marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleBack} color="primary">
                        <ArrowBack />
                    </IconButton>
                    <Typography variant='h5' style={{ fontWeight: 'bold', marginLeft: 10 }}>
                        RD Demand Details - {rdNo}
                    </Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Typography variant='subtitle1' style={{ color: '#666' }}>
                        {allDemands.length} Total Transaction{allDemands.length !== 1 ? 's' : ''}
                    </Typography>
                    <ReactToPrint
                        trigger={() => (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Print />}
                            >
                                Print
                            </Button>
                        )}
                        content={() => printRef.current}
                    />
                </div>
            </Toolbar>

            <div style={{ display: 'none' }}>
                <div ref={printRef}>
                    <DemandRdReportDetailsPrint
                        data={allDemands}
                        rdNo={rdNo}
                        dateRange={dateRange}
                    />
                </div>
            </div>


            <TableContainer component={Paper} className={classes.container}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Sl No</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Demand Date</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Name</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Reg No</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>RD No</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Freq</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Demand #</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Inst. Amt</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Demand</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Collected</Typography></TableCell>
                            <TableCell className={classes.tableHead}><Typography className={classes.whiteText}>Pending</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allDemands.map((demand, index) => (
                            <TableRow key={index} hover>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{demand.demand_date}</TableCell>
                                <TableCell>{demand.name}</TableCell>
                                <TableCell>{demand.acno}</TableCell>
                                <TableCell>{demand.rd_no}</TableCell>
                                <TableCell>{freqMap[demand.frquency] || demand.frquency}</TableCell>
                                <TableCell>{demand.demand_number}</TableCell>
                                <TableCell>{Number(demand.installment_amount).toFixed(2)}</TableCell>
                                <TableCell>{Number(demand.demand_amount).toFixed(2)}</TableCell>
                                <TableCell>{Number(demand.collected_amount).toFixed(2)}</TableCell>
                                <TableCell>{Number(demand.pending_amount).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                        {allDemands.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={11} align="center">
                                    No demands found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TableContainer component={Paper} style={{ marginTop: 10 }}>
                <Table size="small">
                    <TableBody>
                        <TableRow style={{ backgroundColor: '#e8f5e9' }}>
                            <TableCell colSpan={8} style={{ fontWeight: 'bold', textAlign: "right", fontSize: '1.1em' }}>Grand Total</TableCell>
                            <TableCell style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{allDemands.reduce((a, b) => a + Number(b.demand_amount), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{allDemands.reduce((a, b) => a + Number(b.collected_amount), 0).toFixed(2)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{allDemands.reduce((a, b) => a + Number(b.pending_amount), 0).toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
