import React from 'react'
import json from '../../../appInfo.json'
import { Typography } from '@material-ui/core'
import './print_style.css'
import DateHandler from '../../../consts/date_format'

export default function AllLoanPrint(props){
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
                <Typography style={{fontSize : 12}}>Loan Details</Typography>
            </div>
            <table className='table'>
                <tr >
                    <th id="th" className='th_sl_no'>Sl No</th>
                    <th id="th" className='th_name'>Name</th>
                    <th id="th" className='mem_no'>Member No</th>
                    <th id="th" className='th_loan_no'>Loan NO</th>
                    <th id="th" className='th_c_no'>Contact No</th>
                    <th id="th" className='th_add'>Address</th>
                    <th id="th" className='th_disb_date'>Disb Date</th>
                    <th id="th" className='th_disb_amt'>Disb Amt</th>
                    <th id="th" className='th_int_amt'>Int Amt</th>
                    <th id="th" className='th_int_rt'>Int Rate</th>
                    <th id="th" className='th_tot_emi'>Total EMI</th>
                    <th id="th" className='th_emi_amt'>EMI Amt</th>
                    <th id="th" className='th_freq'>Frequency</th>
                    <th id="th" className='th_collect_day'>Collection Day</th>
                    <th id="th" className='th_status'>Status</th>
                    <th id="th" className='th_agent_name'>Agent Name</th>
                </tr>
                {
                    item.map((child_item,child_index)=>
                        <tr key={child_index}>
                            <td className="td">{index < 1 ? child_index + 1 : sl_no[index-1] + child_index +1 }</td>
                            <td className="td">{child_item.name}</td>
                            <td className="td">{child_item.acno}</td>
                            <td className="td">{child_item.ln_tpe+'/'+child_item.id}</td>
                            <td className="td">{child_item.c_nmbr}</td>
                            <td className="td" style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:'150px'}}>{child_item.vill}</td>
                            <td className="td">{DateHandler(child_item.opn_dte)}</td>
                            <td className="td">{child_item.ln_amnt}</td>
                            <td className="td">{child_item.intrst_amnt}</td>
                            <td className="td">{child_item.intrst}</td>
                            <td className="td">{child_item.no_emi}</td>
                            <td className="td">{child_item.emi_amnt}</td>
                            <td className="td">{freqHandler(child_item.frequecy)}</td>
                            <td className="td">{child_item.collection_day === 0 ? 'None' : child_item.collection_day}</td>
                            <td className="td">{child_item.ln_stts}</td>
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