import React from 'react'
import {
    Container, Typography
} from '@material-ui/core'
import json from '../../appInfo.json'
import './style/tablestyle.css'


class SavingsSheetPrint extends React.Component{
    
    render(){
        const appDet = json.Appinfo
        const prop = this.props
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let sl_no = [1]
        const findCumulativeSum = (arr,value,name) => {
            const creds = arr.reduce((acc,val) => {
                
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
        
         sl_no = findCumulativeSum(prop.newData,16)
         let tot_dep_amount = []
         let dep = []
         let int = []
         let withd = []
         prop.newData.map((item,i)=>{
             let last_row = item.length
             if(i+1 < prop.newData.length){
                 prop.newData[i+1].unshift({
                     name : 'BF',
                     acno : 'nill',
                     id : 'nill',
                     dep_amount : findCumulativeSum(prop.newData[i],null,'dep_amount')[last_row - 1],
                     int : findCumulativeSum(prop.newData[i],null,'int')[last_row - 1],
                     dep : findCumulativeSum(prop.newData[i],null,'dep')[last_row - 1],
                     with : findCumulativeSum(prop.newData[i],null,'with')[last_row - 1],
                     not_display : true
                 })

                 
             }

             tot_dep_amount = [
                ...tot_dep_amount,
                findCumulativeSum(prop.newData[i],null,'dep_amount')
            ]
            int = [
                ...int,
                findCumulativeSum(prop.newData[i],null,'int')
            ]
            dep = [
                ...dep,
                findCumulativeSum(prop.newData[i],null,'dep')
            ]
            withd = [
                ...withd,
                findCumulativeSum(prop.newData[i],null,'with')
            ]
         })
        return (
            <div className='keep'>
            {
                prop.newData.map((mains,index)=>{
                    let last_row = mains.length
                    
                    return (
                        <div key={index} style={{marginBottom: 50}}>
                        <div style={{display : 'flex',flexDirection: 'row',justifyContent : 'space-between'}}>
                        <div style={{display:'flex',flexDirection: 'column',justifyContent: 'center'}}>
                            {/* <Typography style={{fontSize : 12}} >GOVT OF ASSAM</Typography> */}
                            <Typography style={{fontWeight : 'bold',fontSize: 12}}>{appDet.name}</Typography>
                            <Typography style={{fontSize : 12}} >{appDet.Reg_no}</Typography>
                            <Typography style={{fontSize : 12}}>{appDet.Place}</Typography>
                            
                        </div>
                        <div>
                        <Typography style={{margin: 0,textAlign: 'right',fontSize : 10}}>Page {index+1}/{prop.newData.length}</Typography>
                        <Typography style={{fontSize : 10}}>Sheet Type: RD</Typography>
                        <Typography style={{fontSize : 10}}>Frequency : {prop.date.freq == 1 ? 'Daily' : prop.date.freq == 7 ? 'Weekly' : prop.date.freq == 14 ? 'Fortnightly' : 'Monthly' }</Typography>
                        <Typography style={{fontSize : 10}}>Collector : {prop.date.ag_name}</Typography>
                        <Typography style={{fontSize : 10}}>Print Date: {new Date().toLocaleDateString('en-US',options)}</Typography>

                        </div>
                        </div>
                       
                        
                        <table className="table">
                            <tr>
                            {
                                prop.tableHead.map((item,index)=><th id='th' className={'table-head-sav-'+item.className} key={index}  >{item.name}</th>)
                            }
                            </tr> 
                            {
                                mains.map((item,ind)=>
                                <tr key={ind}>
                                    <td className='td'>{ item.not_display ? '' : (index < 1 ? ind + 1 : sl_no[index-1] + ind)}</td>
                                    <td className="td">{item.name}</td>
                                    <td className="td">{ item.not_display ? '' : item.acno}</td>
                                    <td className="td">{ item.not_display ? '' : item.id}</td>
                                    <td className="td">{item.dep_amount}</td>
                                    <td className="td">{Number(item.dep) + Number(item.int) - Number(item.with)}</td>
                                    
                                    {
                                        [...Array(prop.tableHead.length - 6)].map((item,index)=><td className="td" key={index}></td>)
                                    }
                                </tr>
                                )
                            }
                            <tr>
                                <td className='td'></td>
                                <td className='td'>Total</td>
                                <td className='td'></td>
                                <td className='td'></td>
                                <td className='td'>{tot_dep_amount[index][last_row -1]}</td>
                                <td className='td'>{dep[index][last_row - 1] + int[index][last_row -1] - withd[index][last_row - 1]}</td>
                                {
                                        [...Array(prop.tableHead.length - 6)].map((item,index)=><td className="td" key={index}></td>)
                                }
                            </tr>
                        </table>
                        </div>
                    )
                })
            }
            
            </div>
        )
    }
}

export default SavingsSheetPrint
