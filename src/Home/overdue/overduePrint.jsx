import React from 'react';
import {
  Typography
} from '@material-ui/core';
import json from '../../appInfo.json';

export default class OverduePrint extends React.Component {
  render() {
    const appDet = json.Appinfo;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
      <div className='keep'>
        <div style={{ marginTop: 0, borderBottom: '1px solid grey', display: 'flex', justifyContent: 'center', marginBottom: 10, padding: 15 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>{appDet.name}</Typography>
            <Typography style={{ textAlign: 'center', fontSize: 12 }} >{appDet.Reg_no}</Typography>
            <Typography style={{ textAlign: 'center', fontSize: 12 }}>{appDet.Place}</Typography>
            <Typography style={{ textAlign: 'center', fontSize: 12 }}>Overdue Report</Typography>
          </div>
        </div>
        <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
            <Typography style={{ fontSize: 12 }}>Date: {new Date().toLocaleDateString('en-US', options)}</Typography>
            <Typography style={{ fontSize: 12 }}>Agent Name {this.props.agentName.ag_name ? this.props.agentName.ag_name : 'All Agents'}</Typography>
          </div>
        </div>
        <table className="table-ladger" style={{ borderRight: 0 }}>
          <thead>
            <tr>
              <th className="th" id="th-ladger">Name</th>
              <th className="th" id="th-ladger">Reg No.</th>
              <th className="th" id="th-ladger">Loan A/C No.</th>
              <th className="th" id="th-ladger">EMI Amount</th>
              <th className="th" id="th-ladger">No Of Overdue</th>
              <th className="th" id="th-ladger">Overdue Amount</th>
              <th className="th" id="th-ladger">Review</th>
            </tr>
          </thead>
          <tbody>
            {this.props.data.map((item, index) => {
              if (item.overdue >= 1) {
                return (
                  <tr key={index}>
                    <td className="td-ladger">{item.name}</td>
                    <td className="td-ladger">{item.ac_no}</td>
                    <td className="td-ladger">{item.ln_id}</td>
                    <td className="td-ladger">Rs. {item.emi_amnt}</td>
                    <td className="td-ladger">{Math.floor(item.overdue)}</td>
                    <td className="td-ladger" style={{ color: 'red' }}>Rs. {(item.overdue_amount).toFixed(2)}</td>
                    <td className="td-ladger"></td>
                  </tr>
                );
              }
              return null; 
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
