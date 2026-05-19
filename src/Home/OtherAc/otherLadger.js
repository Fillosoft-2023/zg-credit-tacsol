import React from 'react'
import {
    Paper,
    Table,
    TableContainer,
    TableCell,
    TableHead,
    TableBody,
    TableRow,
    makeStyles,
    Container,
    TableFooter
    
} from '@material-ui/core'

export default function OtherLadger(props){
    const style = useStyle()
    const Data = props.location.state.data
    const [recData, setRecData] = React.useState([])
    const sendData = {
        reffer_id : Data.reffer_id,
        press : 'savLadger'
    }
    React.useEffect(()=>{
        // sendAsync(sendData).then((res)=>{
        //     console.log(res)
        //     setRecData(res)
        // })
    },[props.location.state.change])
    let sum = 0
    let dep = 0
    let withd = 0
    let int = 0
    let fine = 0
    return (
        
        <TableContainer component={Paper} className={style.table} >
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell style={{background: 'green',color: '#fff'}}>Deposit</TableCell>
                        <TableCell style={{background: 'red',color: '#fff'}}>Withdrwal</TableCell>
                        <TableCell style={{background: 'orange',color: '#fff'}}>Interest</TableCell>
                        <TableCell style={{background: 'red',color: '#fff'}}>Fine</TableCell>
                        <TableCell style={{background: '#e4e4e4',color: '#000'}}>Remarks</TableCell>
                    </TableRow>
                </TableHead>
                
                {
                    Array.isArray(recData) ? (
                        <TableBody >{
                        recData.map((item,index)=> {
                            sum += (Number(item.dep) + Number(item.int)) - Number(item.with)
                            dep += Number(item.dep)
                            withd += Number(item.with)
                            int += Number(item.int)
                            fine += Number(item.fine)
                            return (
                                <TableRow key={index}>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell style={{color: 'green'}}>{item.dep}</TableCell> 
                                    <TableCell style={{color: 'red'}}>{item.with}</TableCell> 
                                    <TableCell style={{color: 'orange'}}>{item.int}</TableCell>  
                                    <TableCell style={{color: 'red'}}>{item.fine}</TableCell>  
                                    <TableCell>{item.remarks}</TableCell> 
                                </TableRow>
                            )
                        })
                    }
                        <TableRow></TableRow>
                        </TableBody>
                    ) : (
                        <div></div>
                    )
                }
                
                    
            </Table>
            <Table stickyHeader className={style.stickyFooter}>
                   
                        <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell >{dep}</TableCell>
                        <TableCell>{withd}</TableCell>
                        <TableCell>{int}</TableCell>
                        <TableCell>{fine}</TableCell>
                        
                        </TableRow>
                  
            </Table>
        </TableContainer>
       
    )
}

const useStyle = makeStyles(()=>({
    table : {
     
        maxHeight: '85vh',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          width: '0.4em',
          
          backgroundColor: 'rgba(0,0,0,0,0)'
        },
        
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          
          borderRadius: 4,
         
        },
    },
    bar: {
        marginBottom: 5,
        
    },
    stickyFooter: {
        
        bottom: 0,
        position:"sticky",
        backgroundColor: "#e4e4e4",
        zIndex: 999
      }
}))