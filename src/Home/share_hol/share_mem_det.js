import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


export default function ShareMemDet(props){
    const data = props.location.state.values;
    const [trans, setTrans] = useState({
      mainData : [],
      sumData : []
    });
    const  style = useStyle();
    const datas = {
        "id" : data.id,
        "press" : "sh_trans"
    }
    console.log(props.location.state.refres)
    useEffect(()=> {
        if(data.id != null && data.id != undefined ){
          // sendAsync(datas).then((res)=> {
          //   setTrans(res)
          //   console.log(res)
          // })
        }
        
    },[props.location.state.refres])
    
    return (
        <div>
        <TableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Ac No</TableCell>
            <TableCell align="right">C/O</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Open Date</TableCell>
            <TableCell align="right">Referred by</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
         
            <TableRow key={data.name}>
              <TableCell component="th" scope="row">
                {data.name}
              </TableCell>
              <TableCell align="right">{data.acno}</TableCell>
              <TableCell align="right">{data.f_name}</TableCell>
              <TableCell align="right">{data.vill}, {data.po}, {data.ps}, {data.pin}, {data.dist}</TableCell>
              <TableCell align="right">{data.op_dte}</TableCell>
              <TableCell align="right">{data.rfl_ac_no}</TableCell>
            </TableRow>
       
        </TableBody>
      </Table>
      </TableContainer>
      <TableContainer component={Paper} className={style.transTable}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
           
            <TableCell align="right">Share ID</TableCell>
            <TableCell align="right">date</TableCell>
            <TableCell align="right" >deposit</TableCell>
            <TableCell align="right">Withdrawal</TableCell>

          </TableRow>
        </TableHead>
        <TableBody >
            {
              trans.mainData != undefined ? (
                trans.mainData.map((item)=>{
                  
                 
                  return (
                  <TableRow key={item.id} >
                      
                      <TableCell align="right">{item.sh_id}</TableCell>
                      <TableCell align="right">{item.date}</TableCell>
                      <TableCell align="right" style={{color: 'green'}}>{item.dr}</TableCell>
                      <TableCell align="right" style={{color: 'red'}}>{item.cr}</TableCell>
                      
                      
          
                  </TableRow>
                  )})
            
         
              ): (
                <div></div>
              )
                
              }

              <TableRow>
                 <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>Total</TableCell>
                
                  {
                    trans.sumData != null ? (
                        trans.sumData.map((item,index)=>{
                          return (
                            <TableCell>{item.dr - item.cr}</TableCell>
                          )
                        })
                    ) : (
                      <div></div>
                    )
                  }
                
              </TableRow>
       
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    )
    
    

    
}


const useStyle = makeStyles(()=>({
    transTable : {
      borderRadius: 3,
      marginTop: 5,
      overflowX: 'auto',
      maxHeight: '66vh',
      '&::-webkit-scrollbar': {
        width: '0.4em',
        
        backgroundColor: 'rgba(0,0,0,0,0)'
      },
      
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,0.2)',
        
        borderRadius: 4,
       
      },
    }
}))
