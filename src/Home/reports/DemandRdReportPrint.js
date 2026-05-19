import React from 'react'
import {
    Container,
    Typography
} from '@material-ui/core'
import json from '../../appInfo.json'
import '../loan_ac/style/style.css'
import DateHandler from '../../consts/date_format';

export default class DemandRdReportPrint extends React.Component {

    render() {
        const appDet = json.Appinfo
        const { data, date, agents } = this.props
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        // Resolve Agent Name
        const agentName = date.agent_id ? (agents.find(a => a.id === date.agent_id)?.ag_name || 'All Agents') : 'All Agents';

        // Resolve Frequency
        const freqMap = { 1: 'Daily', 7: 'Weekly', 14: 'Fortnightly', 30: 'Monthly' };
        const freqText = date.frequency ? freqMap[date.frequency] : 'All';

        return (
            <div className='keep'>
                <div style={{ marginTop: 0, borderBottom: '1px solid grey', display: 'flex', justifyContent: 'center', marginBottom: 10, padding: 15 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>{appDet.name}</Typography>
                        <Typography style={{ textAlign: 'center', fontSize: 12 }} >{appDet.Reg_no}</Typography>
                        <Typography style={{ textAlign: 'center', fontSize: 12 }}>{appDet.Place}</Typography>
                        <Typography style={{ textAlign: 'center', fontSize: 12 }}>Demand RD Report</Typography>
                    </div>
                </div>
                <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                        <Typography style={{ fontSize: 12 }}>Date Range: {date.from} to {date.to}</Typography>
                        <Typography style={{ fontSize: 12 }}>Printed on: {new Date().toLocaleDateString('en-US', options)}</Typography>
                        <Typography style={{ fontSize: 12 }}>Agent: {agentName}</Typography>
                        <Typography style={{ fontSize: 12 }}>Frequency: {freqText}</Typography>
                    </div>
                </div>
                <table className="table-ladger" style={{ borderRight: 0, width: '100%' }}>
                    <thead>
                        <tr>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Sl No</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Name</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Contact</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Reg No</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>RD No</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Freq</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Start Date</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Mat. Date</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Inst Amt</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Tot Coll</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Balance</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Demand</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Collected</th>
                            <th className="th" id="th-ladger" style={{ fontSize: 10 }}>Pending</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{index + 1}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.name}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.c_nmbr}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.acno}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.rd_no}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{freqMap[row.frquency] || row.frquency}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{DateHandler(row.start_date)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{DateHandler(row.maturity_date)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.installment_amount).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.total_collected).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.balance_to_pay).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.period_demand).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.period_collected).toFixed(2)}</td>
                                <td className="td-ladger" style={{ fontSize: 10 }}>{Number(row.period_pending).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }} colSpan={8}>Grand Total</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.installment_amount), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.total_collected), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.balance_to_pay), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.period_demand), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.period_collected), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.period_pending), 0).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div >
        )
    }
}
