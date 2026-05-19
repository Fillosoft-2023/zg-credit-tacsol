import React from 'react'
import {
    Container,
    Typography
} from '@material-ui/core'
import '../loan_ac/style/style.css'
import json from '../../appInfo.json'
import DateHandler from '../../consts/date_format'
import Logo from '../../assets/icon2.png'

export default class LoanSheetPrintCustomer extends React.Component {

    render() {
        let Isum = 0;
        let Psum = 0;
        const appDet = json.Appinfo
        const info = this.props.info
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const opacityValue = 0.1;
        const initialBalance = Number(info.amount) + Number(info.intrst_amnt || 0);
        const emiAmount = Number(info.emi_amnt || 0);
        const depAmount = Number(info.dep_amount || 0);
        const tableStyle = {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '8px',
        };
        const thStyle = {
            border: '1px solid #000',
            padding: '1px 1px',
            textAlign: 'center',
            backgroundColor: '#f0f0f0',
            borderRight: 0,
            borderBottom: 0
        };
        const tdStyle = {
            border: '1px solid #000',
            padding: '1px 1px',
            textAlign: 'center',
            borderRight: 0,
            borderBottom: 0
        };
        const columnWidths = {
            slNo: '20px',
            day: '35px',
            dueDate: '45px',
            emiAmount: '40px',
            balance: '45px',
            deposit: '35px',
            withdrawl: '35px',
            depositBal: '40px',
            rd: '35px',
            fine: '25px',
            sign: '30px'
        };
        return (
            <div style={{ minHeight: '75vh' }}>
                <div style={{ padding: 5, border: '1px solid #000', paddingBottom: 0 }}>
                    <div
                        className="background-image"
                        style={{
                            backgroundImage: `url(${Logo})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            opacity: opacityValue,
                            position: 'absolute',
                            top: 250,
                            left: 120,
                            width: '60%',
                            height: 350,
                            zIndex: -150,
                        }}
                    ></div>
                    <div style={{ marginTop: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
                        <div>
                            <img src={Logo} width={50} height={50} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                            <Typography style={{ fontWeight: 'bold', fontSize: 12, color: '#FD6704' }}>{appDet.name}</Typography>
                            <Typography style={{ fontSize: 10, color: '#02006B' }} >{appDet.Reg_no}</Typography>
                            <Typography style={{ fontSize: 8, color: '#02006B' }}>{appDet.Place}</Typography>
                        </div>
                        <div>
                            <img src={Logo} width={50} height={50} />
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, }}>
                            <div>
                                <Typography style={{ fontSize: 8 }}>Member No : {info.ac_no}</Typography>
                                <Typography style={{ fontSize: 8 }}>Name : {info.name}</Typography>
                            </div>
                            <div>
                                <Typography style={{ fontSize: 8 }}>Address : {info.vill}</Typography>
                                <Typography style={{ fontSize: 8 }}>Contact No : {info.c_nmbr}</Typography>
                            </div>
                            <div>
                                <Typography style={{ fontSize: 8 }}>Loan A/C No : {info.ln_id}</Typography>
                                <Typography style={{ fontSize: 8 }}>Loan Amount : Rs.{Number(info.amount).toFixed(2)}</Typography>
                            </div>
                            <div>
                                <Typography style={{ fontSize: 8 }}>Interest : {info.intrst}%</Typography>
                                <Typography style={{ fontSize: 8 }}>Date: {new Date().toLocaleDateString('en-US', options)}</Typography>
                            </div>
                        </div>
                    </div>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={{ ...thStyle, width: columnWidths.slNo, fontWeight: 'normal' }}>SL NO</th>
                                <th style={{ ...thStyle, width: columnWidths.day, fontWeight: 'normal' }}>Day</th>
                                <th style={{ ...thStyle, width: columnWidths.dueDate, fontWeight: 'normal' }}>Due Date</th>
                                <th style={{ ...thStyle, width: columnWidths.emiAmount, fontWeight: 'normal' }}>EFI</th>
                                <th style={{ ...thStyle, width: columnWidths.balance, fontWeight: 'normal' }}>Balance</th>
                                <th style={{ ...thStyle, width: columnWidths.rd, backgroundColor: '#E5E5E5', fontWeight: 'normal' }}>RD</th>
                                <th style={{ ...thStyle, width: columnWidths.rd, backgroundColor: '#E5E5E5', fontWeight: 'normal' }}>T.EFI</th>
                                <th style={{ ...thStyle, width: columnWidths.deposit, backgroundColor: '#D3DCE3', fontWeight: 'normal' }}>Deposit</th>
                                <th style={{ ...thStyle, width: columnWidths.withdrawl, backgroundColor: '#D3DCE3', fontWeight: 'normal' }}>Withdrawl</th>
                                <th style={{ ...thStyle, width: columnWidths.depositBal, backgroundColor: '#D3DCE3', fontWeight: 'normal' }}>Deposit Bal</th>
                                <th style={{ ...thStyle, width: columnWidths.fine, backgroundColor: '#FCB8B8', fontWeight: 'normal' }}>Fine</th>
                                <th style={{ ...thStyle, width: columnWidths.sign, borderRight: '1px solid black', fontWeight: 'normal' }}>Sign</th>
                            </tr>
                            <tr>
                                <th style={{ ...thStyle, width: columnWidths.slNo, fontWeight: 'normal' }}>DOD</th>
                                <th style={{ ...thStyle, width: columnWidths.day, fontWeight: 'normal' }}>{info.collection_day}</th>
                                <th style={{ ...thStyle, width: columnWidths.dueDate, fontWeight: 'normal' }}>{info.opn_dte}</th>
                                <th style={{ ...thStyle, width: columnWidths.emiAmount, fontWeight: 'normal' }}>0</th>
                                <th style={{ ...thStyle, width: columnWidths.balance, fontWeight: 'normal' }}>{initialBalance.toFixed(2)}</th>
                                <th style={{ ...thStyle, width: columnWidths.rd, backgroundColor: '#E5E5E5', fontWeight: 'normal' }}></th>
                                <th style={{ ...thStyle, width: columnWidths.rd, backgroundColor: '#E5E5E5', fontWeight: 'normal' }}></th>
                                <th style={{ ...thStyle, width: columnWidths.deposit, backgroundColor: '#D3DCE3', fontWeight: 'normal' }}></th>
                                <th style={{ ...thStyle, width: columnWidths.withdrawl, backgroundColor: '#D3DCE3', fontWeight: 'normal' }}></th>
                                <th style={{ ...thStyle, width: columnWidths.depositBal, backgroundColor: '#D3DCE3', fontWeight: 'normal' }}></th>
                                <th style={{ ...thStyle, width: columnWidths.fine, backgroundColor: '#FCB8B8', fontWeight: 'normal' }}></th>
                                <th style={{ ...thStyle, width: columnWidths.sign, borderRight: '1px solid black', fontWeight: 'normal' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.data.map((item, index) => {
                                Isum += Number(item.interest || 0)
                                Psum += Number(item.prncpl || 0)

                                // Calculate running balance for each row - use (index + 1) to start deductions from first EMI
                                const runningBalance = initialBalance - (emiAmount * (index + 1));

                                return (
                                    <tr key={index} style={{ height: '18px' }}>
                                        <td style={{ ...tdStyle, width: columnWidths.slNo }}>{index + 1}</td>
                                        <td style={{ ...tdStyle, width: columnWidths.day }}>{info.collection_day}</td>
                                        <td style={{ ...tdStyle, width: columnWidths.dueDate }}>{item.due_date ? DateHandler(item.due_date.toLocaleDateString("en-CA")) : ''}</td>
                                        <td style={{ ...tdStyle, width: columnWidths.emiAmount }}>{info.emi_amnt}</td>
                                        <td style={{ ...tdStyle, width: columnWidths.balance }}>
                                            {runningBalance > 0 ? runningBalance.toFixed(2) : '0.00'}
                                        </td>
                                        <td style={{ ...tdStyle, width: columnWidths.deposit }}>{Number(info.dep_amount || 0).toFixed(2)}</td>
                                        <td style={{ ...tdStyle, width: columnWidths.withdrawl }}>
                                            {(Number(info.dep_amount || 0) + Number(info.emi_amnt || 0)).toFixed(2)}
                                        </td>
                                        <td style={{ ...tdStyle, width: columnWidths.depositBal }}></td>
                                        <td style={{ ...tdStyle, width: columnWidths.rd }}></td>
                                        <td style={{ ...tdStyle, width: columnWidths.fine }}></td>
                                        <td style={{ ...tdStyle, width: columnWidths.fine }}></td>
                                        <td style={{ ...tdStyle, width: columnWidths.sign, borderRight: '1px solid black' }}></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 0, borderTop: '1px solid black', padding: 10, marginBottom: 30 }}>
                        <div>
                            <Typography style={{ fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>
                                Loan Officer Signature
                            </Typography>
                            <Typography style={{ fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>

                            </Typography>
                        </div>
                        <div>
                            <Typography style={{ fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>
                                Customer Signature
                            </Typography>
                            <Typography style={{ fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>

                            </Typography>
                        </div>
                        <div>
                            <Typography style={{ fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>
                                Nominee Signature
                            </Typography>
                            <Typography style={{ fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>

                            </Typography>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}