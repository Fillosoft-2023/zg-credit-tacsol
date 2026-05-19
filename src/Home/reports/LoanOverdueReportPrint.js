import React from 'react';
import { Typography } from '@material-ui/core';
import json from '../../appInfo.json';
import '../loan_ac/style/style.css';

export default class LoanOverdueReportPrint extends React.Component {
    // Calculate EMI end date based on start date, frequency, and number of EMIs
    calculateEmiEndDate = (emiStartDate, frequency, noOfEmis) => {
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
    calculateLoanMonths = (frequency, noOfEmis) => {
        if (!frequency || !noOfEmis) return 0;
        const freq = Number(frequency);
        const numEmis = Number(noOfEmis);

        if (freq === 30) return numEmis;
        if (freq === 7) return Math.round((numEmis * 7) / 30);
        if (freq === 14) return Math.round((numEmis * 14) / 30);
        if (freq === 1) return Math.round(numEmis / 30);
        return 0;
    };

    // Calculate total loan duration in months and expected closing date (from opn_dte)
    calculateLoanStats = (row) => {
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

    render() {
        const appDet = json.Appinfo;
        const { data, filters, agents, summary } = this.props;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        // Resolve Agent Name
        const agentName = filters.agent_id
            ? (agents.find(a => a.id === filters.agent_id)?.ag_name || 'All Agents')
            : 'All Agents';

        const freqMap = { 1: 'Daily', 7: 'Weekly', 14: 'Fortnightly', 30: 'Monthly' };
        const loanTypeMap = { auto: 'Auto EMI', manual: 'Manual EMI' };
        const loanTypeText = filters.loan_type ? loanTypeMap[filters.loan_type] : 'All';
        const overdueRangeText = filters.overdue_range || 'All';

        return (
            <div className='keep'>
                <div style={{ marginTop: 0, borderBottom: '1px solid grey', display: 'flex', justifyContent: 'center', marginBottom: 10, padding: 15 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>{appDet.name}</Typography>
                        <Typography style={{ textAlign: 'center', fontSize: 12 }}>{appDet.Reg_no}</Typography>
                        <Typography style={{ textAlign: 'center', fontSize: 12 }}>{appDet.Place}</Typography>
                        <Typography style={{ textAlign: 'center', fontSize: 12 }}>Loan Overdue Report</Typography>
                    </div>
                </div>

                <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography style={{ fontSize: 10 }}>As of Date: {filters.as_of_date}</Typography>
                        <Typography style={{ fontSize: 10 }}>Printed on: {new Date().toLocaleDateString('en-US', options)}</Typography>
                        <Typography style={{ fontSize: 10 }}>Agent: {agentName}</Typography>
                        <Typography style={{ fontSize: 10 }}>Loan Type: {loanTypeText}</Typography>
                        <Typography style={{ fontSize: 10 }}>Overdue Range: {overdueRangeText}</Typography>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                        <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>Total Accounts: {summary.totalAccounts}</Typography>
                        <Typography style={{ fontSize: 10, fontWeight: 'bold', color: '#f44336' }}>Total Overdue: ₹{summary.totalAmount.toFixed(2)}</Typography>
                        <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>Avg Days: {summary.avgDays.toFixed(0)}</Typography>
                    </div>
                </div>

                <table className="table-ladger" style={{ borderRight: 0, width: '100%' }}>
                    <thead>
                        <tr>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>Sl</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>Reg No</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>Name</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>Loan No</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>Agent</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>Type</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>Freq</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>EMI</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>Exp</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>Rec</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>O/D Cnt</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>O/D Amt</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>O/D Days</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>Contact</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>EMI Start</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>EMI End</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>Months</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>Open Date</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 8 }}>Duration (Mo)</th>
                            <th className="th" id="th-ladger" style={{ fontSize: 8 }}>Closing Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => {
                            const emiEndDate = this.calculateEmiEndDate(row.emi_strt, row.frquency, row.no_emi);
                            const loanMonths = this.calculateLoanMonths(row.frquency, row.no_emi);
                            const loanStats = this.calculateLoanStats(row);

                            return (
                                <tr key={index}>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{index + 1}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{row.acno}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{row.name}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{row.ln_id}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{row.ag_name}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{row.emi_type === 'auto' ? 'A' : 'M'}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{freqMap[row.frquency] || row.frquency}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>₹{Number(row.emi_amnt).toFixed(2)}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{row.expected_emis}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{row.received_emis}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{row.overdue_count}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8, color: '#f44336' }}>₹{Number(row.overdue_amount).toFixed(2)}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{row.overdue_days}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{row.c_nmbr}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{row.emi_strt ? new Date(row.emi_strt).toLocaleDateString('en-GB') : 'N/A'}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{emiEndDate ? emiEndDate.toLocaleDateString('en-GB') : 'N/A'}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{loanMonths}m</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{row.opn_dte || 'N/A'}</td>
                                    <td className="td-ladger" style={{ borderRight: 0, fontSize: 8 }}>{loanStats.loanDurationMonths} mo</td>
                                    <td className="td-ladger" style={{ fontSize: 8 }}>{loanStats.expectedClosingDate}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 8, fontWeight: 'bold' }} colSpan={11}>Grand Total</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 8, fontWeight: 'bold', color: '#f44336' }}>₹{data.reduce((a, b) => a + Number(b.overdue_amount), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ fontSize: 8, fontWeight: 'bold' }} colSpan={8}></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    }
}
