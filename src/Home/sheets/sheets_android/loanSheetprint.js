import React from 'react'
import {
    Container, Typography
} from '@material-ui/core'
import json from '../../../appInfo.json'
import './style/tablestyle.css'
import DateHandler from '../../../consts/date_format'

class LoanSheetPrint extends React.Component {

    render() {
        const appDet = json.Appinfo
        const prop = this.props
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        // Calculate serial numbers across pages
        let sl_no = [];
        let serialCounter = 1;
        prop.newData.forEach((page) => {
            sl_no.push(...Array.from({ length: page.length }, (_, idx) => serialCounter++));
        });

        const findCumulativeSum = (arr, value, name) => {
            const creds = arr.reduce((acc, val) => {
                let { sum, res } = acc;
                sum += value != null ? value : Number(val[name]);
                res.push(sum);
                return { sum, res };
            }, {
                sum: 0,
                res: []
            });
            return creds.res;
        };

        const freqTypehandler = (frequency, no_emi) => {
            const freq = Number(frequency);

            if (freq === 1) {
                return Math.floor(no_emi / 26); // Daily
            } else if (freq === 7) {
                return Math.floor(no_emi / 4); // Weekly
            } else if (freq === 14) {
                return Math.floor(no_emi / 2); // Fortnightly
            } else {
                return no_emi; // Monthly
            }
        };

        const totals = {
            ln_amnt: 0,
            intrst_amnt: 0,
            total_prncpl: 0,
            total_intr: 0,
            emi_amnt: 0,
            monthly_demand: 0,
            paid_this_month: 0,
            totalOutstanding:0,
            totalMonthlyPendingBalance:0
        }; 
        console.log(sl_no)
        return (
            <div>
                {
                    prop.newData.map((arrays, pageIndex) => {
                        return (
                            <div className='keep' key={pageIndex}>
                                <div style={{ marginTop: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Typography style={{ fontWeight: 'bold', fontSize: 12 }}>{appDet.name}</Typography>
                                        <Typography style={{ fontSize: 12 }} >{appDet.Reg_no}</Typography>
                                        <Typography style={{ fontSize: 12 }}>{appDet.Place}</Typography>

                                    </div>
                                    <div>
                                        <Typography style={{ margin: 0, textAlign: 'right', fontSize: 10 }}>Page {pageIndex + 1}/{prop.newData.length}</Typography>
                                        <Typography style={{ fontSize: 10 }}>Sheet Type: Demand Sheet</Typography>
                                        <Typography style={{ fontSize: 10 }}>Frequency : {prop.date.frequency.value == 1 ? 'Daily' : prop.date.frequency.value == 7 ? 'Weekly' : prop.date.frequency.value == 14 ? 'Fortnightly' : 'Monthly'}</Typography>
                                        <Typography style={{ fontSize: 10 }}>Collector : {prop.date.agent.ag_name}</Typography>
                                        <Typography style={{ fontSize: 10 }}>Date: {new Date(prop.print_date).toLocaleDateString('en-US', options)}</Typography>
                                        {
                                            prop.collection_day != null ? <Typography style={{ fontSize: 10 }}>Collection Day : {prop.collection_day}</Typography> : ''
                                        }

                                    </div>
                                </div>

                                <table className="table">
                                    <tr>
                                        {
                                            prop.tableHead.map((item, index) =>
                                                <th
                                                    id='th'
                                                    className={'table-head-' + item.className}
                                                    key={index}
                                                >
                                                    {item.head}
                                                </th>
                                            )
                                        }
                                    </tr>

                                    {
                                        arrays.map((item, ind) => {
                                            const newDate = new Date(item.opn_dte); // Parse the opening date
                                            const monthsToAdd = freqTypehandler(item.frequecy, item.no_emi); // Get months to add
                                            newDate.setMonth(newDate.getMonth() + monthsToAdd); // Add the months
                                            const outstanding = (Number(item.ln_amnt) + Number(item.intrst_amnt) - (Number(item.total_prncpl) + Number(item.total_intr))).toFixed(2);
                                            const monthlyPendingBalance = (Number(item.monthly_demand || 0) - Number(item.paid_this_month || 0)).toFixed(2);

                                            // Update totals
                                            totals.ln_amnt += Number(item.ln_amnt);
                                            totals.intrst_amnt += Number(item.intrst_amnt);
                                            totals.total_prncpl += Number(item.ln_amnt) - Number(item.total_prncpl);
                                            totals.total_intr += Number(item.intrst_amnt) - Number(item.total_intr);
                                            totals.emi_amnt += Number(item.emi_amnt);
                                            totals.monthly_demand += Number(item.monthly_demand || 0);
                                            totals.paid_this_month += Number(item.paid_this_month || 0);
                                            totals.totalOutstanding += Number(outstanding);
                                            totals.totalMonthlyPendingBalance += Number(monthlyPendingBalance);
                                            return (
                                                <tr key={ind}>
                                                    <td className="td">{item.not_display ? '' : sl_no[(pageIndex * 16 )+ ind]}</td>
                                                    <td className="td">{item.name}</td>
                                                    <td className="td">{item.acno}</td>
                                                    <td className="td">{item.c_nmbr}</td>
                                                    <td className="td">{item.ln_id}</td>
                                                    <td className="td">{DateHandler(item.opn_dte)}</td>
                                                    <td className="td">{item.ln_amnt}</td>
                                                    <td className="td">{item.intrst}</td>
                                                    <td className="td">{freqTypehandler(item.frequecy, item.no_emi)} Months </td>
                                                    <td className="td">{DateHandler(newDate)}</td>
                                                    <td className="td">{(Number(item.ln_amnt) + Number(item.intrst_amnt) - (Number(item.total_prncpl) + Number(item.total_intr))).toFixed(2)}</td>
                                                    <td className="td">{(Number(item.ln_amnt) - Number(item.total_prncpl)).toFixed(2)}</td>
                                                    <td className="td">{(Number(item.intrst_amnt) - Number(item.total_intr)).toFixed(2)}</td>
                                                    <td className="td">{Number(item.emi_amnt).toFixed(2)}</td>
                                                    <td className="td">{Number(item.monthly_demand || 0).toFixed(2)}</td>
                                                    <td className="td">{Number(item.paid_this_month || 0).toFixed(2)}</td>
                                                    <td className="td">{(Number(item.monthly_demand || 0) - Number(item.paid_this_month || 0)).toFixed(2)}</td>
                                                </tr>
                                            )
                                        })
                                    }

                                    {pageIndex === prop.newData.length - 1 && (
                                        <tr>
                                            <td className="td"></td>
                                            <td className="td">Total</td>
                                            <td className="td"></td>
                                            <td className="td"></td>
                                            <td className="td"></td>
                                            <td className="td"></td>
                                            <td className="td">{totals.ln_amnt.toFixed(2)}</td>
                                            <td className="td"></td>
                                            <td className="td"></td>
                                            <td className="td"></td>
                                            <td className="td">{totals.totalOutstanding.toFixed(2)}</td>
                                            <td className="td">{totals.total_prncpl.toFixed(2)}</td>
                                            <td className="td">{totals.total_intr.toFixed(2)}</td>
                                            <td className="td">{totals.emi_amnt.toFixed(2)}</td>
                                            <td className="td">{totals.monthly_demand.toFixed(2)}</td>
                                            <td className="td">{totals.paid_this_month.toFixed(2)}</td>
                                            <td className="td">{totals.totalMonthlyPendingBalance.toFixed(2)}</td>
                                        </tr>
                                    )}
                                </table>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default LoanSheetPrint
