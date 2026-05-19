import React from 'react'
import {
    Container,
    Typography
} from '@material-ui/core'
// import '../../css/tablePrint.css'
import json from '../../appInfo.json'
import '../loan_ac/style/style.css'

export default class CollectionPrint extends React.Component {

    render() {


        const appDet = json.Appinfo
        const info = this.props.info
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let grand_total = 0
        let grand_total_sav = 0
        return (
            <div className='keep'>
                <div style={{ marginTop: 0, borderBottom: '1px solid grey', display: 'flex', justifyContent: 'center', marginBottom: 10, padding: 15 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>{appDet.name}</Typography>
                        <Typography style={{ textAlign: 'center', fontSize: 12 }} >{appDet.Reg_no}</Typography>
                        <Typography style={{ textAlign: 'center', fontSize: 12 }}>{appDet.Place}</Typography>
                        <Typography style={{ textAlign: 'center', fontSize: 12 }}>Members Collection Report</Typography>
                    </div>
                </div>
                <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                        <Typography style={{ fontSize: 12 }}>Date: {new Date().toLocaleDateString('en-US', options)}</Typography>
                        <Typography style={{ fontSize: 12 }}>Account Type: {this.props.accountType.type}</Typography>
                    </div>

                </div>
                <table className="table-ladger" style={{ borderRight: 0 }}>
                    <tr>
                        <th className="th" id="th-ladger" style={{ borderRight: 0 }}>Name</th>
                        <th className="th" id="th-ladger" style={{ borderRight: 0 }}>Reg No.</th>
                        <th className="th" id="th-ladger" style={{ borderRight: 0 }}>{this.props.accountType.type} A/C No.</th>
                        <th className="th" id="th-ladger" style={{ borderRight: 0 }}>Agent</th>
                        <th className="th" id="th-ladger" style={{ borderRight: 0 }}>REC. DATE</th>
                        <th className="th" id="th-ladger" >Amount</th>
                    </tr>
                    {
                        this.props.data.map((row, index) => {
                            let total = 0;
                            let sav_total = 0;
                            if (this.props.accountType.type === "EMI") {
                                return (
                                    <>
                                        {
                                            row.map((item, index2) => {
                                                total += Number(item.ttl)
                                                grand_total += total

                                                return (
                                                    <tr key={index2}>
                                                        <td className="td-ladger" style={{ borderRight: 0 }}>{item.name}</td>
                                                        <td className="td-ladger" style={{ borderRight: 0 }}>{item.ac_no}</td>
                                                        <td className="td-ladger" style={{ borderRight: 0 }}>{item.ac_number}</td>
                                                        <td className="td-ladger" style={{ borderRight: 0 }}>{this.props.agents[item.agnt_id]}</td>
                                                        <td className="td-ladger" style={{ borderRight: 0 }}>{item.recived_date ? item.recived_date : item.date}</td>
                                                        <td className="td-ladger" >Rs. {item.ttl ? item.ttl : item.dep}</td>
                                                    </tr>
                                                )
                                            })}
                                        <tr>
                                            <td className="td-footer"></td>
                                            <td className="td-footer"></td>
                                            <td className="td-footer"></td>
                                            <td className="td-footer"></td>
                                            <td className="td-footer">Total</td>
                                            <td className="td-footer">RS.{total ? total : sav_total}</td>
                                        </tr>
                                    </>
                                )
                            } else {
                                return (
                                    <>
                                        {
                                            row.map((item, index2) => {
                                                sav_total += Number(item.dep)
                                                grand_total_sav += sav_total
                                                if (item.dep > 0) {
                                                    return (
                                                        <tr key={index2}>
                                                            <td className="td-ladger" style={{ borderRight: 0 }}>{item.name}</td>
                                                            <td className="td-ladger" style={{ borderRight: 0 }}>{item.ac_no}</td>
                                                            <td className="td-ladger" style={{ borderRight: 0 }}>{item.ac_number}</td>
                                                            <td className="td-ladger" style={{ borderRight: 0 }}>{this.props.agents[item.agnt_id]}</td>
                                                            <td className="td-ladger" style={{ borderRight: 0 }}>{item.recived_date ? item.recived_date : item.date}</td>
                                                            <td className="td-ladger" >Rs. {item.ttl ? item.ttl : item.dep}</td>
                                                        </tr>
                                                    )
                                                } else {
                                                    return null
                                                }

                                            })}
                                        {
                                            sav_total > 0 ? (
                                                <tr>
                                                    <td className="td-footer"></td>
                                                    <td className="td-footer"></td>
                                                    <td className="td-footer"></td>
                                                    <td className="td-footer"></td>
                                                    <td className="td-footer">Total</td>
                                                    <td className="td-footer">RS.{sav_total}</td>
                                                </tr>
                                            ) : ''
                                        }

                                    </>
                                )
                            }

                        })
                    }
                    <tr>
                        <td className="td-footer"></td>
                        <td className="td-footer"></td>
                        <td className="td-footer"></td>
                        <td className="td-footer"></td>
                        <td className="td-footer">Grand Total</td>
                        <td className="td-footer">RS.{grand_total ? grand_total : grand_total_sav}</td>
                    </tr>
                </table>
            </div>
        )
    }
}