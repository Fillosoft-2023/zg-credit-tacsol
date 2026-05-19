import React from 'react'
import {
    Typography
} from '@material-ui/core'
import json from '../../appInfo.json'
import '../loan_ac/style/style.css'

export default class DemandRdReportDetailsPrint extends React.Component {

    render() {
        const appDet = json.Appinfo
        const { data, rdNo, dateRange } = this.props
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        const freqMap = { 1: 'Daily', 7: 'Weekly', 14: 'Fortnightly', 30: 'Monthly' };

        return (
            <div className='keep'>
                <div style={{ marginTop: 0, borderBottom: '1px solid grey', display: 'flex', justifyContent: 'center', marginBottom: 10, padding: 15 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>{appDet.name}</Typography>
                        <Typography style={{ textAlign: 'center', fontSize: 12 }} >{appDet.Reg_no}</Typography>
                        <Typography style={{ textAlign: 'center', fontSize: 12 }}>{appDet.Place}</Typography>
                        <Typography style={{ textAlign: 'center', fontSize: 12 }}>RD Demand Details - {rdNo}</Typography>
                    </div>
                </div>
                <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                        <Typography style={{ fontSize: 12 }}>Date Range: {dateRange.from} to {dateRange.to}</Typography>
                        <Typography style={{ fontSize: 12 }}>Printed on: {new Date().toLocaleDateString('en-US', options)}</Typography>
                        <Typography style={{ fontSize: 12 }}>Total Transactions: {data.length}</Typography>
                    </div>
                </div>
                <table className="table-ladger" style={{ borderRight: 0, width: '100%' }}>
                    <thead>
                        <tr>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Sl No</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Date</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Name</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Reg No</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>RD No</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Freq</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Demand #</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Inst Amt</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Demand</th>
                            <th className="th" id="th-ladger" style={{ borderRight: 0, fontSize: 10 }}>Collected</th>
                            <th className="th" id="th-ladger" style={{ fontSize: 10 }}>Pending</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{index + 1}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.demand_date}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.name}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.acno}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.rd_no}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{freqMap[row.frquency] || row.frquency}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{row.demand_number}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.installment_amount).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.demand_amount).toFixed(2)}</td>
                                <td className="td-ladger" style={{ borderRight: 0, fontSize: 10 }}>{Number(row.collected_amount).toFixed(2)}</td>
                                <td className="td-ladger" style={{ fontSize: 10 }}>{Number(row.pending_amount).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }} colSpan={8}>Grand Total</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.demand_amount), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ borderRight: 0, fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.collected_amount), 0).toFixed(2)}</td>
                            <td className="td-ladger" style={{ fontSize: 10, fontWeight: 'bold' }}>{data.reduce((a, b) => a + Number(b.pending_amount), 0).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div >
        )
    }
}
