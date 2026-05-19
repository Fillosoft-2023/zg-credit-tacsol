import React from 'react'

import {
    makeStyles,
    Container,
    Button,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    Divider

} from '@material-ui/core'
import {useHistory} from 'react-router-dom' 
import DeleteOther from './delOther'
export default function OtherHolDet(props){
const data = props.location.state.data;
const [imgDisplay, setImgDisplay] = React.useState('');
const style = useStyle()
const history = useHistory()
const handleRoute = ()=>{
    history.push('/Home/OtherHome/ProfileModify', {data : data})
}
const routeToSav = ()=>{
    history.push('/Home/OtherHome/OtherModify', {data : data})
}

       
       
        
  
const persionalInfo = ()=> {

    return (
        <Table className={style.table}>
            <TableBody>
                <TableRow>
                    <TableCell component="th" scope="row">Name</TableCell>
                    <TableCell>{data.name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >AC No</TableCell>
                    <TableCell>{data.acno}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >C/O</TableCell>
                    <TableCell>{data.f_name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Contact No</TableCell>
                    <TableCell>{data.c_nmbr}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Address</TableCell>
                    <TableCell>{data.vill}, {data.po}, {data.ps}, {data.dist}, {data.pin}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Nominee</TableCell>
                    <TableCell>{data.nmni}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Open Date</TableCell>
                    <TableCell>{data.op_dte}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Referral ac no</TableCell>
                    <TableCell>{data.rfl_ac_no}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Other Info</TableCell>
                    <TableCell>{data.other_info}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Passport image</TableCell>
                    <TableCell>
                        <Button color="primary" onClick={()=>setImgDisplay('set')}>view</Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Signature</TableCell>
                    <TableCell>
                        <Button color="primary" onClick={()=>setImgDisplay(data.id_prf === null ? alert('no data for display') : 'id')}>view</Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Address Proof</TableCell>
                    <TableCell>
                        <Button color="primary" onClick={()=>setImgDisplay(data.id_prf === null ? alert('no data for display') : 'add')}>view</Button>
                    </TableCell>
                </TableRow>

            </TableBody>
        
        </Table>
    )
}

const loanInfo = ()=> {

    return (
        <Table className={style.table}>
            <TableBody>
                <TableRow>
                    <TableCell component="th" scope="row">RD ID</TableCell>
                    <TableCell>{data.id}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Open Date</TableCell>
                    <TableCell>{data.date}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Agent Id</TableCell>
                    <TableCell>{data.agent_id}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Interest Rate</TableCell>
                    <TableCell>{data.intrest}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Admission Fees</TableCell>
                    <TableCell>
                        {data.proc_chrg}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Account Status</TableCell>
                    <TableCell>
                        active
                    </TableCell>
                </TableRow>
                {/*<TableRow>
                    <TableCell >Insurence</TableCell>
                    <TableCell>
                        {data.insur}
                    </TableCell>
                </TableRow>*/}
                
                

            </TableBody>
        
        </Table>
    )
}

const imgViewr = (images)=>{
    let size = ''
    if(imgDisplay === 'set'){
        size = 150
    }else if(imgDisplay === 'id'){
        size = 250
    }else {
        size = 250
    }
    
    const img = Buffer.from(images).toString('base64')
    const datas = img
    const Example = ({data} ) => <img style={{width: size}} src={`data:image/jpeg;base64,${data}`} />
    
    return (
        <Example data={datas} />
    )
}



    return(
        
            <Grid container spacing={1} style={{height: '100%'}}>
             
                <Grid item xs={12} sm={6} >
                    <Paper className={style.profdet}>
                    <div style={{width: '100%', flexDirection:'row', display: 'flex',alignItems: 'center'}}>
                    <Typography style={{padding: 10}}>Profile Information</Typography>
                        <Button variant="contained" onClick={()=>handleRoute()} color="primary" style={{marginLeft: 50,height: 30}} >
                            Edit
                        </Button>
                    </div>
                    <Divider  />
                        {persionalInfo()}
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className={style.profdet}>
                       
                            {
                                imgDisplay === 'set' ? (
                                    <div style={{height : '100%', width: '100%'}}>
                                    <Button onClick={()=>setImgDisplay('')}>Return to loan information</Button>
                                        <div style={{alignItems: 'center',justifyContent: 'center',height: '90%',width: '100%',display:'flex'}}>
                                     { imgViewr(data.img)}
                                     
                                     </div>
                                     
                                    </div>
                                ) : imgDisplay === 'id' ? (
                                    <div style={{height : '100%', width: '100%'}}>
                                    <Button onClick={()=>setImgDisplay('i')}>Return to loan information</Button>
                                        <div style={{alignItems: 'center',justifyContent: 'center',height: '90%',width: '100%',display:'flex'}}>
                                     { imgViewr(data.id_prf)}
                                     
                                     </div>
                                     
                                    </div>
                                ) : imgDisplay === 'add' ? (
                                    <div style={{height : '100%', width: '100%'}}>
                                    <Button onClick={()=>setImgDisplay('a')}>Return to RD information</Button>
                                        <div style={{alignItems: 'center',justifyContent: 'center',height: '90%',width: '100%',display:'flex'}}>
                                     { imgViewr(data.add_prf)}
                                     
                                     </div>
                                     
                                    </div>
                                ) : (
                                <div>
                                <div style={{width: '100%', flexDirection:'row', display: 'flex',alignItems: 'center'}}>
                                <Typography style={{padding: 10}}>RD Information</Typography>
                                    <Button variant="contained" onClick={()=>routeToSav()} color="primary" style={{marginLeft: 50,height: 30}} >
                                        Edit
                                    </Button>
                                    <DeleteOther callback={data} />
                                </div>
                                     <Divider  />
                                    {loanInfo()}
                                 </div>
                                )
                            }
                       
                        </Paper>
                </Grid>
            </Grid>
            
        
        
    )
}

const useStyle = makeStyles((them)=> ({
    profdet : {
      
        height : 550,
        
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
    table : {
        
    }
}))