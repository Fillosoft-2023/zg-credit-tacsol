
import React from 'react'
import {
    Container,
    Typography
} from '@material-ui/core'
import json from '../../appInfo.json'
import '../loan_ac/style/style.css'
import DateHandler from '../../consts/date_format';

export default class DemandLoanReportPrint extends React.Component {

    render() {
        const appDet = json.Appinfo
        const { data, date, agents } = this.props
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        // Resolve Agent Name
        const agentName = date.agent_id ? (agents.find(a => a.id === date.agent_id)?.ag_name || 'All Agents') : 'All Agents';

        // Resolve Frequency
        const freqMap = { 1: 'Daily', 7: 'Weekly', 14: 'Fortnightly', 30: 'Monthly' };
        const freqText = date.frequency ? freqMap[date.frequency] : 'All';

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
                loanDurationMonths = Math.ceil(totalDays / 30);
                const closingDate = new Date(openDate);
                closingDate.setDate(closingDate.getDate() + totalDays);
                expectedClosingDate = closingDate.toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric'
                });
            }
            return { loanDurationMonths, expectedClosingDate };
        };

        return (
            <div className='keep'>
                <div style={{ marginTop: 0, borderBottom: '1px solid grey', display: 'flex', justifyContent: 'center', marginBottom: 10, padding: 15 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>{appDet.name}</Typography>
                        <Typography style={{ textAlign: 'center', fontSize: 12 }} >{appDet.Reg_no}</Typography>
                        <Typography style={{ textAlign: 'center', fontSize: 12 }}>{appDet.Place}</Typography>
                        <Typography style={{ textAlign: 'center', fontSize: 12 }}>Demand Loan Report</Typography>
                    </div>
                </div>
                <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                        <Typography style={{ fontSize: 12 }}>Date Range: {date.from} to {date.to}</Typography>
                        <Typography style={{ fontSize: 12 }}>Printed on: {new Date().toLocaleDateString('en-US', options)}</Typography>
                        <Typography style={{ fontSize: 12 }}>Agent: {agentName}</Typography>
                        <Typography style={{ fontSize: 12 }}>Frequency: {freqText}</Typography>
                        {date.collection_day && (
                            <Typography style={{ fontSize: 12 }}>Collection Day: {date.collection_day}</Typography>
                        )}
                        {date.ln_tpe && (
                            <Typography style={{ fontSize: 12 }}>Loan Type: {date.ln_tpe}</Typography>
                        )}
                    </div>
                </div>
                <table className="table-ladger" style={{ borderRight: 0, width: '100%' }}>
                    <thead>
                        <tr>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Sl No</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Name</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Contact</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Reg No</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Loan No</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Ln Type</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Coll Day</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Open Date</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Ln Amt</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Tot Int</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Tot Amt</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Tot Paid</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Outstndg</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Prnc Bal</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Int Bal</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Rate</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>EMI</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Demand</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>M Paid</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Pending</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Duration (Mo)</th>
                            <th className="th" id="th-ladger" style={{ fontSize: 10 }}>Closing Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{index + 1}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.name}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.c_nmbr}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.acno}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.ln_id}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.ln_tpe}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.collection_day}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.opn_dte}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.ln_amnt).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.intrst_amnt).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{(Number(row.ln_amnt) + Number(row.intrst_amnt)).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.total_received).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.outstanding_amt).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.principle_bal).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.intrst_bal).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.intrst}%</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.emi_amnt).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.monthly_demand).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.monthly_paid).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.monthly_pending).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{calculateLoanStats(row).loanDurationMonths} mo</td>
                                <td className="td-ladger" style={{ fontSize: 10 }}>{calculateLoanStats(row).expectedClosingDate}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }} colSpan={8}>Grand Total</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.ln_amnt), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.intrst_amnt), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + (Number(b.ln_amnt) + Number(b.intrst_amnt)), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.total_received), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.outstanding_amt), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.principle_bal), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.intrst_bal), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}></td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.emi_amnt), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.monthly_demand), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.monthly_paid), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.monthly_pending), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}></td>
                            <td className="td-ladger" style={{ fontSize: 10, fontWeight: 'bold' }}></td>
                        </tr>
                    </tfoot>
                </table>
            </div >
        )
    }
}
