import React from 'react'
import {
    Container,
    Typography
} from '@material-ui/core'
import '../../css/tablePrint.css'
import json from '../../appInfo.json'
import DateHandler from '../../consts/date_format';
export default class ShareLadgerPrint extends React.Component{

    render(){
        let sum = 0;
        let dep = 0;
        let dep_with = 0;
        let dev = 0;
        let dev_with = 0;
       
        const appDet = json.Appinfo
        const info = this.props.info
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return(
            <div>
            <div style={{marginTop : 0,display : 'flex',flexDirection: 'row',justifyContent : 'space-between'}}>
                <div style={{display:'flex',flexDirection: 'column',justifyContent: 'center'}}>
                    {/* <Typography style={{fontSize : 12}} >GOVT OF ASSAM</Typography> */}
                    <Typography style={{fontWeight : 'bold',fontSize: 12}}>{appDet.name}</Typography>
                    <Typography style={{fontSize : 12}} >{appDet.Reg_no}</Typography>
                    <Typography style={{fontSize : 12}}>{appDet.Place}</Typography>
                    
                </div>
                <div>
                <Typography style={{fontSize : 12}}>Type: Share ladger</Typography>
                <Typography style={{fontSize : 12}}>Member Name : {info.ac_no }</Typography>
                <Typography style={{fontSize : 12}}>Name : {info.name}</Typography>
               
                <Typography style={{fontSize : 12}}>Date: {new Date().toLocaleDateString('en-US',options)}</Typography>

                </div>
            </div>
            <hr/>
                <table className="table-ladger">
                    <tr>
                        <th className="th" id="th-ladger">SL NO</th>
                        <th className="th" id="th-ladger">DATE</th>
                        <th className="th" id="th-ladger">DEPOSITE</th>
                        <th className="th" id="th-ladger">WITHDRWAL</th>
                        <th className="th" id="th-ladger">DEVIDEND DEP.</th>
                        <th className="th" id="th-ladger">DEVIDEND WITH.</th>
                        <th className="th" id="th-ladger">BALANCE</th>
                    </tr>
                    {
                    this.props.data.map((item,index)=>
                    {
                        sum += (Number(item.dr) - Number(item.cr)) + (Number(item.dev) - Number(item.dev_with))
                        dep += Number(item.dr)
                        dep_with += Number(item.cr)
                        dev += Number(item.dev)
                        dev_with += Number(item.dev_with)
                        return (<tr key={index}>
                            <td className="td-ladger">{index + 1}</td>
                            <td className="td-ladger">{DateHandler(item.date)}</td>
                            <td className="td-ladger">{item.dr}</td>
                            <td className="td-ladger">{item.cr}</td>
                            <td className="td-ladger">{item.dev}</td>
                            <td className="td-ladger">{item.dev_with}</td>
                            <td className="td-ladger">{sum}</td>
                          
                        </tr>)
                    }
                    )
                    }
                </table>
            </div>
        )
    }
}