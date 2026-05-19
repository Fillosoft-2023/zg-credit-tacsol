import React from 'react'
import {
    Container, Typography
} from '@material-ui/core'
import json from '../../appInfo.json'
import './style/tablestyle.css'
import DateHandler from '../../consts/date_format'

class LoanSheetPrint extends React.Component {

    render() {
        const appDet = json.Appinfo
        const prop = this.props
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

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
                return Math.floor(no_emi / 26);
            } else if (freq === 7) {
                return Math.floor(no_emi / 4);
            } else if (freq === 14) {
                return Math.floor(no_emi / 2);
            } else {
                return no_emi;
            }
        };

        const totals = {
            ln_amnt: 0,
            intrst_amnt: 0,
            total_prncpl: 0,
            total_intr: 0,
            emi_amnt: 0,
            total_received: 0,
            total_princ_rec: 0,
            total_int_rec: 0,
            tot_prncpl: 0,
            tot_interest: 0,
            tot_amnt: 0,
            totalOutstanding: 0,
            totalPrincipalOutstanding: 0,
            totalInterestOutstanding: 0,
            // New totals for monthly columns
            monthly_demand: 0,
            monthly_paid: 0,
            monthly_pending: 0
        };

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
                                            const newDate = new Date(item.opn_dte);
                                            const monthsToAdd = freqTypehandler(item.frequecy, item.no_emi);
                                            newDate.setMonth(newDate.getMonth() + monthsToAdd);

                                            // Use backend-calculated values if available, otherwise calculate locally
                                            const principalOutstanding = item.principle_bal !== undefined ?
                                                Number(item.principle_bal) :
                                                (Number(item.tot_prncpl || item.ln_amnt) - Number(item.total_princ_rec || 0));

                                            const interestOutstanding = item.intrst_bal !== undefined ?
                                                Number(item.intrst_bal) :
                                                (Number(item.tot_interest || item.intrst_amnt) - Number(item.total_int_rec || 0));

                                            const totalOutstanding = item.outstanding_amt !== undefined ?
                                                Number(item.outstanding_amt) :
                                                (principalOutstanding + interestOutstanding);

                                            // Monthly calculations - prefer backend values
                                            const monthlyDemand = item.monthly_demand !== undefined ?
                                                Number(item.monthly_demand) :
                                                Number(item.emi_amnt || 0);

                                            const monthlyPaid = item.monthly_paid !== undefined ?
                                                Number(item.monthly_paid) :
                                                0;

                                            const monthlyPending = item.monthly_pending !== undefined ?
                                                Number(item.monthly_pending) :
                                                (monthlyDemand - monthlyPaid);

                                            // Update totals
                                            totals.ln_amnt += Number(item.ln_amnt);
                                            totals.intrst_amnt += Number(item.intrst_amnt);
                                            totals.emi_amnt += Number(item.emi_amnt);
                                            totals.totalOutstanding += totalOutstanding;
                                            totals.totalPrincipalOutstanding += principalOutstanding;
                                            totals.totalInterestOutstanding += interestOutstanding;
                                            totals.monthly_demand += monthlyDemand;
                                            totals.monthly_paid += monthlyPaid;
                                            totals.monthly_pending += monthlyPending;

                                            return (
                                                <tr key={ind}>
                                                    <td className="td">{item.not_display ? '' : sl_no[(pageIndex * 16) + ind]}</td>
                                                    <td className="td">{item.name}</td>
                                                    <td className="td">{item.acno}</td>
                                                    <td className="td">{item.c_nmbr}</td>
                                                    <td className="td">{item.ln_id}</td>
                                                    <td className="td">{DateHandler(item.opn_dte)}</td>
                                                    <td className="td">{Number(item.ln_amnt).toFixed(2)}</td>
                                                    <td className="td">{item.intrst}%</td>
                                                    <td className="td">{freqTypehandler(item.frequecy, item.no_emi)} Months </td>
                                                    <td className="td">{DateHandler(newDate)}</td>
                                                    <td className="td">{totalOutstanding.toFixed(2)}</td>
                                                    <td className="td">{principalOutstanding.toFixed(2)}</td>
                                                    <td className="td">{interestOutstanding.toFixed(2)}</td>
                                                    <td className="td">{Number(item.emi_amnt).toFixed(2)}</td>
                                                    <td className="td">{monthlyDemand.toFixed(2)}</td>
                                                    <td className="td">{monthlyPaid.toFixed(2)}</td>
                                                    <td className="td">{monthlyPending.toFixed(2)}</td>
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
                                            <td className="td">{totals.totalPrincipalOutstanding.toFixed(2)}</td>
                                            <td className="td">{totals.totalInterestOutstanding.toFixed(2)}</td>
                                            <td className="td">{totals.emi_amnt.toFixed(2)}</td>
                                            <td className="td">{totals.monthly_demand.toFixed(2)}</td>
                                            <td className="td">{totals.monthly_paid.toFixed(2)}</td>
                                            <td className="td">{totals.monthly_pending.toFixed(2)}</td>
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