import React from 'react'
import {
    Container,
    Typography
} from '@material-ui/core'
import '../../css/tablePrint.css'
import json from '../../appInfo.json'
import DateHandler from '../../consts/date_format'
import Logo from '../../assets/icon2.png'
import VerifiedBySignature from '../../assets/verified_by.png'
import AuthorisedSignature from '../../assets/authorised_signatory.png'

export default class FdMaturityCertificate extends React.Component {

    render() {
        let dep = 0
        let int_dep = 0
        let withd = 0

        let totalVal = 0;
        let t_dep = 0;
        let t_intr = 0;
        let t_with = 0;
        if (this.props.data && this.props.data.length > 0) {
            this.props.data.map((item) => {
                if (item.type === 'dep') {
                    t_dep += Number(item.amount) || 0
                } else if (item.type === 'intr') {
                    t_intr += Number(item.amount) || 0
                } else if (item.type === 'with') {
                    t_with += Number(item.amount) || 0
                }
            })
            totalVal = (t_dep + t_intr) - t_with
        }

        const appDet = json.Appinfo
        const info = this.props.info
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const backgroundImageUrl = Logo;
        const opacityValue = 0.2;
        return (
            <div className='keep' style={{ minHeight: '75vh' }} >
                <div style={{ padding: 10, border: '1px solid black' }}>
                    <div
                        className="background-image"
                        style={{
                            backgroundImage: `url(${backgroundImageUrl})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            opacity: opacityValue,
                            position: 'absolute',
                            top: 110,
                            left: 120,
                            width: '60%',
                            height: 350,
                            zIndex: -150,
                        }}
                    ></div>
                    <div style={{ marginTop: 0, display: 'flex', justifyContent: 'space-around' }}>
                        <div>
                            <img src={Logo} width={80} height={80} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant='h4' style={{ fontWeight: 'bold', fontSize: 13, textAlign: 'center', color: '#FD6704' }}>{appDet.name}</Typography>
                            <Typography style={{ fontSize: 12, textAlign: 'center', color: '#02006B' }} >{appDet.Reg_no}</Typography>
                            <Typography style={{ marginBottom: 10, fontSize: 10, textAlign: 'center', color: '#02006B' }}>{appDet.Place}</Typography>
                        </div>
                        <div>
                            <img src={Logo} width={80} height={80} />
                        </div>
                    </div>
                    <Typography style={{ textAlign: 'center', color: '#FD6704', marginBottom: 15, marginTop: -20 }}>
                        Fixed Deposit Receipt
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid black' }}>
                        <div style={{ borderRight: '1px solid black', width: '50%' }}>
                            <Typography style={{ borderBottom: '1px solid black', padding: 5, fontSize: 14, fontWeight: 'bold' }}>
                                Received From
                            </Typography>
                            <div style={{ padding: 5 }}>
                                <Typography style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>Mr/Mrs:{info.name}</Typography>
                                <Typography style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>C/O: Mr/Mrs {info.f_name}</Typography>
                                <Typography style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>Mobile: {info.c_nmbr}</Typography>
                                <Typography style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>Pin: {info.per_pin}</Typography>
                                <Typography style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>Address: {info.vill}</Typography>
                            </div>
                        </div>
                        <div style={{ width: '50%' }}>
                            <Typography style={{ borderBottom: '1px solid black', padding: 5, fontSize: 14, fontWeight: 'bold' }}>
                                Account Details
                            </Typography>
                            <div style={{ padding: 5 }}>
                                <Typography style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>Account No: <span style={{ color: 'red' }}>{info.ac_no}</span></Typography>
                                <Typography style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>Rate Of Interest: {info.int_rt}%</Typography>
                                <Typography style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>Maturity Date: {info.mt_dt}</Typography>
                                <Typography style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>Payment Mode: {info.pay_mode}</Typography>
                                <Typography style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>Interest Amount Paid: Rs.{t_intr.toFixed(2)}</Typography>
                                <Typography style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>Maturity Value: Rs.{t_with.toFixed(2)}</Typography>
                                <Typography style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>Nominee: {info.nmni}</Typography>
                            </div>
                        </div>
                    </div>
                    <table className="table-ladger" style={{ marginTop: 20 }}>
                        <tr>
                            <th className="th" id="th-ladger" style={{ fontWeight: 'bold' }}>Date</th>
                            <th className="th" id="th-ladger" style={{ fontWeight: 'bold' }}>Amount</th>
                            <th className="th" id="th-ladger" style={{ fontWeight: 'bold' }}>TYPE</th>
                            <th className="th" id="th-ladger" style={{ fontWeight: 'bold' }}>BALANCE</th>
                        </tr>
                        {
                            this.props.data.map((item, index) => {
                                if (item.type === 'dep') {
                                    dep += Number(item.amount)
                                } else if (item.type === 'intr') {
                                    int_dep += Number(item.amount)
                                } else if (item.type === 'with') {
                                    withd += Number(item.amount)
                                }
                                return (<tr key={index}>
                                    <td className="td-ladger" style={{ fontWeight: 'bold' }}>{DateHandler(item.date)}</td>
                                    <td className="td-ladger" style={{ fontWeight: 'bold' }}>Rs.{item.amount}</td>
                                    <td className="td-ladger" style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{item.type === 'dep' ? 'deposit' : item.type === 'with' ? 'withdrwal' : 'intrest'}</td>
                                    <td className="td-ladger" style={{ fontWeight: 'bold' }}>Rs.{(dep + int_dep) - withd}</td>
                                    {/* <td className="td-ladger" style={{ fontWeight: 'bold' }}>Rs.{info.mt_amt}</td> */}
                                </tr>)
                            }
                            )
                        }
                    </table>
                    <table className="table-ladger" style={{ marginTop: 0, borderTop: 0 }}>
                        <tfoot>
                            <tr>
                                <td className="td-ladger" style={{ fontWeight: 'bold', borderRight: 0 }}>Total</td>
                                <td className="td-ladger" style={{ fontWeight: 'bold', borderRight: 0, borderLeft: 0 }}></td>
                                <td className="td-ladger" style={{ fontWeight: 'bold', borderRight: 0, borderLeft: 0 }}></td>
                                <td className="td-ladger" style={{ fontWeight: 'bold' }}>Rs.{(dep + int_dep).toFixed(2)}</td>
                                {/* <td className="td-ladger" style={{ fontWeight: 'bold', borderRight: 0 }}>Rs.{((dep + int_dep) - withd).toFixed(2)}</td> */}
                            </tr>
                        </tfoot>
                    </table>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <img src={VerifiedBySignature} alt="Verified by signature" style={{ width: 120, height: 60, objectFit: 'contain' }} />
                            <Typography style={{ fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>
                                Verified by
                            </Typography>
                            <Typography style={{ fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>
                                {appDet.name}
                            </Typography>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <img src={AuthorisedSignature} alt="Authorised signature" style={{ width: 120, height: 60, objectFit: 'contain' }} />
                            <Typography style={{ fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>
                                Authorised Signature
                            </Typography>
                            <Typography style={{ fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>
                                {appDet.name}
                            </Typography>
                        </div>
                    </div>
                </div>
                {/* <Typography style={{ fontSize: 8, fontFamily: 'roboto', textAlign: 'end', color: 'red' }}>
                    Generated By Tacsol
                </Typography> */}
            </div>
        )
    }
}