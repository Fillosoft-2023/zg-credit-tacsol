import React from 'react'
import {
    Container,
    Typography
} from '@material-ui/core'
import '../../css/tablePrint.css'
import json from '../../appInfo.json'
export default class FundLadgerPrint extends React.Component{

    render(){
        let dep = 0
        let int_dep = 0
        let withd = 0
       
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
                <Typography style={{fontSize : 12}}>Type: Fund ladger</Typography>
                <Typography style={{fontSize : 12}}>Member No : {info.ac_no }</Typography>
                <Typography style={{fontSize : 12}}>Name : {info.name}</Typography>
               
                <Typography style={{fontSize : 12}}>Date: {new Date().toLocaleDateString('en-US',options)}</Typography>

                </div>
            </div>
            <hr/>
                <table className="table-ladger">
                    <tr>
                        <th className="th" id="th-ladger">SL NO</th>
                        <th className="th" id="th-ladger">DATE</th>
                        <th className="th" id="th-ladger">AMOUNT</th>
                        <th className="th" id="th-ladger">TYPE</th>
                        <th className="th" id="th-ladger">BALANCE</th>
                    </tr>
                    {
                    this.props.data.map((item,index)=>
                    {
                        if(item.trans_type === 'dep'){
                            dep += Number(item.amount)
                        }else if(item.trans_type === 'intr'){
                            int_dep += Number(item.amount)
                        }else if(item.trans_type === 'with'){
                            withd += Number(item.amount) 
                        }
                        return (<tr key={index}>
                            <td className="td-ladger">{index + 1}</td>
                            <td className="td-ladger">{item.date}</td>
                            <td className="td-ladger">{item.amount}</td>
                            <td className="td-ladger">{item.trans_type === 'dep' ? 'deposit' : item.trans_type === 'with' ? 'withdrwal' : 'intrest'}</td>
                            <td className="td-ladger">{(dep + int_dep) - withd}</td>
                          
                        </tr>)
                    }
                    )
                    }
                </table>
            </div>
        )
    }
}