import React from 'react'
import {
    Container,
    Typography
} from '@material-ui/core'
import '../../css/tablePrint.css'
import json from '../../appInfo.json'
import DateHandler from '../../consts/date_format'
import Logo from '../../assets/icon2.png'

export default class TaLadgerPrint extends React.Component {

    render() {
        let dep = 0
        let int_dep = 0
        let withd = 0

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
                        TL Ledger
                    </Typography>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, marginTop: 10 }}>
                            <div>
                                <Typography style={{ fontSize: 12 }}>Member No : {info.ac_no}</Typography>
                                <Typography style={{ fontSize: 12 }}>Name : {info.name}</Typography>
                            </div>
                            <div>
                                <Typography style={{ fontSize: 12 }}>Date: {new Date().toLocaleDateString('en-US', options)}</Typography>
                            </div>
                        </div>
                    </div>

                    <table className="table-ladger">
                        <tr>
                            <th className="th" id="th-ladger">SL NO</th>
                            <th className="th" id="th-ladger">DATE</th>
                            <th className="th" id="th-ladger">AMOUNT</th>
                            <th className="th" id="th-ladger">TYPE</th>
                            <th className="th" id="th-ladger">BALANCE</th>
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
                                    <td className="td-ladger">{index + 1}</td>
                                    <td className="td-ladger">{DateHandler(item.date)}</td>
                                    <td className="td-ladger">{item.amount}</td>
                                    <td className="td-ladger">{item.type === 'dep' ? 'deposit' : item.type === 'with' ? 'withdrawal' : 'interest'}</td>
                                    <td className="td-ladger">{(dep + int_dep) - withd}</td>
                                </tr>)
                            })
                        }
                    </table>
                </div>
            </div>
        )
    }
}