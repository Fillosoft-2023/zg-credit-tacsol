import React from 'react'
import {
    Container,
    Typography
} from '@material-ui/core'
import '../loan_ac/style/style.css'
import json from '../../appInfo.json'
import DateHandler from '../../consts/date_format'
import Logo from '../../assets/icon2.png'

export default class LoanLadgerprint extends React.Component {

    render() {
        let Isum = 0;
        let Psum = 0;
        const appDet = json.Appinfo
        const info = this.props.info
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const opacityValue = 0.1;

        return (
            <div style={{ minHeight: '75vh' }}>
                <div style={{ padding: 10, border: '1px solid black' }}>
                    <div
                        className="background-image"
                        style={{
                            backgroundImage: `url(${Logo})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            opacity: opacityValue,
                            position: 'absolute',
                            top: 25,
                            left: 120,
                            width: '60%',
                            height: 350,
                            zIndex: -150,
                        }}
                    ></div>
                    <div style={{ marginTop: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <div>
                            <img src={Logo} width={80} height={80} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                            <Typography style={{ fontWeight: 'bold', fontSize: 12 }}>{appDet.name}</Typography>
                            <Typography style={{ fontSize: 12 }} >{appDet.Reg_no}</Typography>
                            <Typography style={{ fontSize: 12 }}>{appDet.Place}</Typography>
                        </div>
                        <div>
                            <img src={Logo} width={80} height={80} />
                        </div>
                    </div>
                    <Typography style={{ fontSize: 12, textAlign: 'center', paddingBottom: 10, borderBottom: '1px solid black', color: 'red' }}>
                        Loan Ledger
                    </Typography>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, marginTop: 10 }}>
                            <div>
                                <Typography style={{ fontSize: 12 }}>Member No : {info.ac_no}</Typography>
                                <Typography style={{ fontSize: 12 }}>Name : {info.name}</Typography>
                                <Typography style={{ fontSize: 12 }}>Loan Amount : {info.amount}</Typography>
                            </div>
                            <div>
                                <Typography style={{ fontSize: 12 }}>Date: {new Date().toLocaleDateString('en-US', options)}</Typography>
                            </div>
                        </div>
                    </div>

                    <table className="table-ladger">
                        <tr>
                            <th className="th" id="th-ladger" style={{ width: '40px', textAlign: 'center' }}>SL NO</th>
                            <th className="th" id="th-ladger">EMI AMOUNT</th>
                            <th className="th" id="th-ladger">RECEIVED</th>
                            <th className="th" id="th-ladger">Due Date</th>
                            <th className="th" id="th-ladger">Rec. Date</th>
                            <th className="th" id="th-ladger" colSpan={3}>REALIZATION</th>
                            <th className="th" id="th-ladger" colSpan={2}>BALANCE</th>
                            <th className="th" id="th-ladger">Total</th>
                        </tr>
                        <tr>
                            <th className="th" id="th-ladger"></th>
                            <th className="th" id="th-ladger"></th>
                            <th className="th" id="th-ladger"></th>
                            <th className="th" id="th-ladger"></th>
                            <th className="th" id="th-ladger"></th>
                            <th className="th" id="th-ladger">Principle</th>
                            <th className="th" id="th-ladger">Interest</th>
                            <th className="th" id="th-ladger">Fine</th>
                            <th className="th" id="th-ladger">Principle</th>
                            <th className="th" id="th-ladger">Interest</th>
                            <th className="th" id="th-ladger">Balance</th>
                        </tr>
                        {
                            this.props.data.map((item, index) => {
                                Isum += Number(item.interest)
                                Psum += Number(item.prncpl)
                                return (
                                    <tr key={index}>
                                        <td className="td-ladger" style={{ width: '40px', textAlign: 'center' }}>{index + 1}</td>
                                        <td className="td-ladger">{item.emi_amnt}</td>
                                        <td className="td-ladger">{item.ttl}</td>
                                        <td className="td-ladger">
                                            {item.due_date ? DateHandler(item.due_date.toLocaleDateString("en-CA")) : ''}
                                        </td>
                                        <td className="td-ladger">
                                            {item.recived_date ? DateHandler(item.recived_date.toLocaleDateString("en-CA")) : ''}
                                        </td>
                                        <td className="td-ladger">{Number(item.prncpl).toFixed(2)}</td>
                                        <td className="td-ladger">{Number(item.interest).toFixed(2)}</td>
                                        <td className="td-ladger">{item.fine}</td>
                                        <td className="td-ladger">
                                            {item.prncpl != null ? Number(Number(item.ln_amnt) - Number(Psum)).toFixed(2) : ''}
                                        </td>
                                        <td className="td-ladger">
                                            {item.interest != null ? Number(Number(item.intrst_amnt) - Number(Isum)).toFixed(2) : ''}
                                        </td>
                                        <td className="td-ladger">
                                            {(item.prncpl != null && item.interest != null)
                                                ? Number((Number(item.ln_amnt) - Number(Psum)) +
                                                    (Number(item.intrst_amnt) - Number(Isum))).toFixed(2)
                                                : ''}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </table>

                </div>
            </div>
        )
    }
}