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


export default class LoanCompletionCertificate extends React.Component {

    render() {
        const appDet = json.Appinfo
        const info = this.props.info
        const data = this.props.data || []

        // Find the closure date (last received date in ledger)
        let closureDate = 'N/A';
        if (data.length > 0) {
            const receivedDates = data
                .filter(item => item.recived_date)
                .map(item => new Date(item.recived_date));

            if (receivedDates.length > 0) {
                const lastDate = new Date(Math.max.apply(null, receivedDates));
                closureDate = DateHandler(lastDate.toISOString().split('T')[0]);
            }
        }

        // Calculate total amount paid from sum(emi.ttl)
        const totalPaid = data.reduce((sum, item) => sum + (Number(item.ttl) || 0), 0).toFixed(2);

        const backgroundImageUrl = Logo;
        const opacityValue = 0.1;

        return (
            <div className='keep' style={{ minHeight: '80vh', padding: '20px' }} >
                <div style={{ padding: 20, border: '2px solid #02006B', borderRadius: '10px', position: 'relative' }}>
                    {/* Watermark */}
                    <div
                        className="background-image"
                        style={{
                            backgroundImage: `url(${backgroundImageUrl})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            opacity: opacityValue,
                            position: 'absolute',
                            top: '20%',
                            left: '10%',
                            width: '80%',
                            height: '60%',
                            zIndex: -1,
                        }}
                    ></div>

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <img src={Logo} width={80} height={80} alt="Logo Left" />
                        <div style={{ textAlign: 'center', flex: 1 }}>
                            <Typography variant='h6' style={{ fontWeight: 'bold', fontSize: 14, color: '#FD6704', marginBottom: 5 }}>
                                {appDet.name}
                            </Typography>
                            <Typography style={{ fontSize: 10, color: '#02006B', fontWeight: 'bold' }}>
                                Registration No: {appDet.Reg_no}
                            </Typography>
                            <Typography style={{ fontSize: 8, color: '#02006B' }}>
                                {appDet.Place}
                            </Typography>
                        </div>
                        <img src={Logo} width={80} height={80} alt="Logo Right" />
                    </div>

                    <hr style={{ border: '1px solid #02006B', marginBottom: 20 }} />

                    <Typography style={{ textAlign: 'center', fontWeight: 'bold', color: '#FD6704', textDecoration: 'underline', marginBottom: 30, fontSize: 14 }}>
                        LOAN COMPLETION CERTIFICATE / NOC
                    </Typography>

                    <div style={{ padding: '0 20px' }}>
                        <Typography style={{ fontSize: 10, lineHeight: '2.0', textAlign: 'justify', marginBottom: 30 }}>
                            This is to certify that <b>Mr/Mrs. {info.name}</b>, residing at <b>{info.vill}</b>, having Loan Account Number <b>{info.ln_id}</b> (Account No: {info.ac_no}), has successfully repaid the entire loan amount along with the applicable interest.
                        </Typography>

                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
                            <table style={{ borderCollapse: 'collapse', minWidth: '400px', fontSize: 10 }}>
                                <tbody>
                                    <tr>
                                        <td style={{ border: '1px solid #02006B', padding: '6px 12px', fontWeight: 'bold', backgroundColor: '#f0f0f0', width: '45%' }}>Loan Date</td>
                                        <td style={{ border: '1px solid #02006B', padding: '6px 12px' }}>{DateHandler(info.opn_dte)}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #02006B', padding: '6px 12px', fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Loan Amount</td>
                                        <td style={{ border: '1px solid #02006B', padding: '6px 12px' }}>Rs. {info.amount}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #02006B', padding: '6px 12px', fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Interest Amount</td>
                                        <td style={{ border: '1px solid #02006B', padding: '6px 12px' }}>Rs. {info.intrst_amnt}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #02006B', padding: '6px 12px', fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Total Amount Paid</td>
                                        <td style={{ border: '1px solid #02006B', padding: '6px 12px' }}>Rs. {totalPaid}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #02006B', padding: '6px 12px', fontWeight: 'bold', backgroundColor: '#e6f9e6', color: 'green' }}>Closure Date</td>
                                        <td style={{ border: '1px solid #02006B', padding: '6px 12px', fontWeight: 'bold', color: 'green', backgroundColor: '#e6f9e6' }}>{closureDate}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <Typography style={{ fontSize: 10, lineHeight: '1.8', textAlign: 'justify', marginBottom: 50 }}>
                            As of today, there are no outstanding dues against the aforementioned loan account. We hereby issue this <b>No Objection Certificate (NOC)</b> and confirm that the society has no further claim or charge on any assets or documents related to this loan.
                        </Typography>

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

                    <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
                        <Typography style={{ fontSize: 8, fontFamily: 'monospace', color: '#888' }}>
                            Generated on: {new Date().toLocaleDateString()}
                        </Typography>
                    </div>
                </div>

            </div >
        )
    }
}
