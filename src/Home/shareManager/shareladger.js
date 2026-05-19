import React from 'react'
import {
    TableCell,
    TableRow,
    TableContainer,
    Table,
    TableBody,
    Paper,
    TableHead,
    makeStyles,
    IconButton,
    Toolbar,
    Tooltip,
    Container,
    Typography,
    Button,
    LinearProgress
} from '@material-ui/core'

import PrintIcon from '@material-ui/icons/Print';
import ReactToPrint from 'react-to-print';
import ShareLadgerPrint from './shareladgerprint';
import { PDFExport } from '@progress/kendo-react-pdf';
import DateHandler from '../../consts/date_format';
import Api from '../../api/api';
import { ArrowBack } from '@material-ui/icons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
export default function ShareLadger(props){
    const navigate = useHistory()
    const [loading, setLoading] = React.useState(false)

    const pdfExportComponent = React.useRef(null);
    const Data = props.location.state.data;
    const style = useStyle()
    const [recvData, setRecvData] = React.useState([])
    const sendData = {
        reffer_id : Data.reffer_id,
        press: 'shTrans'
    }
    React.useEffect(()=>{
        if(Data.id != null && Data.id != undefined ){
            setLoading(true)

            fetch(Api+'shTrans&reffer_id='+Data.reffer_id)
            .then(res=>res.json())
            .then(res=>{
                setRecvData(res)
                setLoading(false)

            })
            .catch(err=>{
               console.log(err)
            })
          }
        
    },[props.location.state.change])

    let sum = 0;
    let dep = 0; 
    let dep_with = 0;
    let dev = 0;
    let dev_with = 0;
    return (
        <Container maxWidth="false" style={{padding:0}}>
        <TableContainer  className={style.container}>
            <Toolbar component={Paper} style={{display:'flex',justifyContent:'space-between'}}>
                <div style={{display:'flex',justifyContent:'space-between'}}> 
                    <Button variant='text'onClick={() => navigate.push('/Home/Share_reg')}>
                        <ArrowBack/>
                    </Button>
                <Typography variant='h6' style={{fontWeight:'bold',marginLeft:5}}>
                    Share Account Ladger
                </Typography>
                </div>
            <Button
            variant='contained'
            color='primary'
                    onClick={() => {
                        if (pdfExportComponent.current) {
                          pdfExportComponent.current.save();
                        }
                      }}
                >
                    <PrintIcon />
            </Button>
            </Toolbar>
            {
                loading ? <LinearProgress /> : ''
            }
            <Table component={Paper}>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Deposite</TableCell>
                        <TableCell>Withdrawl</TableCell>
                        <TableCell>Devidend Deposit</TableCell>
                        <TableCell>Devidend Withdrawl</TableCell>
                        <TableCell>Total</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Array.isArray(recvData) ? (
                                recvData.map((item,index)=>{
                                    sum += (Number(item.dr) - Number(item.cr)) + (Number(item.dev) - Number(item.dev_with))
                                    dep += Number(item.dr)
                                    dep_with += Number(item.cr)
                                    dev += Number(item.dev)
                                    dev_with += Number(item.dev_with)
                                    return(
                                        <TableRow key={index}>
                                            {/*<TableCell>{item.date}</TableCell>
                                            {
                                                Number(item.cr) === 0 ? (
                                                    <TableCell style={{color: 'green'}}>{item.dr}</TableCell>
                                                ) : (
                                                    <TableCell style={{color: 'red'}}>{item.cr}</TableCell>
                                                )
                                            }
                                            {
                                                Number(item.cr) === 0 ? (
                                                    <TableCell style={{color: 'green'}}>Deposit</TableCell>
                                                ) : (
                                                    <TableCell style={{color: 'red'}}>Withdrawal</TableCell>
                                                )
                                            } */}
                                           <TableCell style={{color: 'green'}}>{DateHandler(item.date)}</TableCell>
                                            <TableCell style={{color: 'green'}}>{item.dr}</TableCell>
                                            <TableCell style={{color: 'green'}}>{item.cr}</TableCell>
                                            <TableCell style={{color: 'green'}}>{item.dev}</TableCell>
                                            <TableCell style={{color: 'green'}}>{item.dev_with}</TableCell>
                                            
                                            <TableCell>{sum}</TableCell>
                                            
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <div></div>
                            )
                            
                        }
                    </TableBody>
                
            </Table>
            <Table stickyHeader className={style.stickyFooter}>
                   
                        <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell align="left">{dep}</TableCell>
                        <TableCell align="left">{dep_with}</TableCell>
                        <TableCell align="left">{dev}</TableCell>
                        <TableCell align="left">{dev_with}</TableCell>
                        <TableCell align="right">{sum}</TableCell>
                        </TableRow>
                  
            </Table>
            {/* <div style={{display:'none'}}>
                <ShareLadgerPrint ref={componentRef}  data={recvData} info={{ac_no : Data.ac_no,name: Data.name}} />
            </div> */}
            <div
                style={{
                    position: "absolute",
                    left: "-1000px",
                    top: 0,
                  }}
            > 
            <PDFExport  keepTogether='.keep'  paperSize="LEGAL" margin={{top: 10,right: 10,bottom: 10,left: 10}} fileName='share_ladger.pdf'  ref={pdfExportComponent}>
                <ShareLadgerPrint  data={recvData} info={{ac_no : Data.ac_no,name: Data.name}}  />
            </PDFExport>
            </div>
        </TableContainer>
        </Container>
    )
}

const useStyle = makeStyles(()=>({
    container : {
        width: '100%',
        padding: 0,
        maxHeight : '85vh',
        
        overflowX: 'auto',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '0.4em',
          
          backgroundColor: 'rgba(0,0,0,0,0)'
        },
        
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          
          borderRadius: 4,
         
        },
        
    },
    stickyFooter: {
        
        bottom: 0,
        position:"sticky",
        backgroundColor: "#e4e4e4",
        zIndex: 999
      }
}))