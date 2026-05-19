import React from 'react'
import json from '../../appInfo.json'
import { Typography } from '@material-ui/core'
import '../loan_ac/all_loan/print_style.css'
import DateHandler from '../../consts/date_format'

export default function AllSavingsACPrint(props){
    const appDet = json.Appinfo
    const data = props.data
    // const [sl_no,setSl_No] = React.useState([1])
    const freqHandler = (item)=>{
        let returns;
        switch(Number(item)){
            case 7:
                returns = 'Weekly'; 
                break;
            case 1:
                returns = 'Daily';
                break;
            case 14:
                returns = 'Fortnightly';
                break;
            case 30:
                returns = 'Monthly';
                break;
            default:
                returns = 'Not Found';
                
        }

        return returns

    }

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
    
    sl_no = findCumulativeSum(data,18)

    
    return(
    data.map((item,index)=>{
        return(
        <div className={index > 0 ? 'keep' : ''} key={index}>
            <div style={{marginTop : 0,width: '100%',textAlign: 'center'}}>
            <Typography style={{margin: 0,textAlign: 'right',fontSize : 10}}>Page {index+1}/{data.length}</Typography>
                <Typography style={{fontWeight : 'bold',fontSize: 12}}>{appDet.name}</Typography>
                <Typography style={{fontSize : 12}} >{appDet.Reg_no}</Typography>
                <Typography style={{fontSize : 12}}>{appDet.Place}</Typography>
                <Typography style={{fontSize : 12}}>All Savings Account Details</Typography>
            </div>
            <table className='table'>
                <tr >
                    <th id="th" className='th_sl_no'>Sl No</th>
                    <th id="th" className='th_name'>Name</th>
                    <th id="th" className='mem_no'>Reg No</th>
                    <th id="th" className='th_loan_no'>A/C NO</th>
                    <th id="th" className='th_c_no'>Contact No</th>
                    <th id="th" className='th_add'>Address</th>
                    <th id="th" className='th_disb_date'>Opening Date</th>
                    <th id="th" className='th_int_amt'>Interest Rate</th>
                    <th id="th" className='th_int_rt'>Dep Amt</th>
                    <th id="th" className='th_emi_amt'>Status</th>
                    <th id="th" className='th_freq'>Agent Name</th>
                </tr>
                {
                    item.map((child_item,child_index)=>
                        <tr key={child_index}>
                            <td className="td">{index < 1 ? child_index + 1 : sl_no[index-1] + child_index +1 }</td>
                            <td className="td">{child_item.name}</td>
                            <td className="td">{child_item.acno}</td>
                            <td className="td">{child_item.sav_no}</td>
                            <td className="td">{child_item.c_nmbr}</td>
                            <td className="td">{child_item.vill}</td>
                            <td className="td">{DateHandler(child_item.date)}</td>
                            <td className="td">{child_item.intrest}%</td>
                            <td className="td">{child_item.dep_amount}</td>
                            <td className="td">{child_item.status}</td>
                            <td className="td">{child_item.ag_name}</td>
                        </tr>
                    )
                }
            </table>
        </div>
        )
    })
    )
}