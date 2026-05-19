import React,{useEffect,useState} from 'react'
import {
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Paper,
    Container,
    IconButton,
    Tooltip,
    Toolbar
} from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import FundLadgerPrint from './fundladgerprint';
import PrintIcon from '@material-ui/icons/Print';
import ReactToPrint from 'react-to-print';
import { PDFExport } from '@progress/kendo-react-pdf';
import DateHandler from '../../consts/date_format';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
export default function FdLadgerBook(props){
    const classes = useStyles()
    const pdfExportComponent = React.useRef(null);
    const [data, setData] = useState([])
    const Data = props.location.state.data;
    const [open, setOpen] = React.useState(false);
    const forSend = {
        ac_no : Data.ac_no,
        reffer_id : Data.reffer_id,
        "press" : "fundLadger"
    }

    useEffect(()=>{
        // sendAsync(forSend).then((res)=>{
        //     setData(res)
        // })
    },[Data.reffer_id])
    
   
   
    
    
    let dep = 0
    let int_dep = 0
    let withd = 0
   
    
    return (
        <Container maxWidth="lg" style={{width: '100%',padding: 0}}>
            <Toolbar>
            {/* <ReactToPrint
                    trigger={()=><IconButton><Tooltip title="Print sheet"><PrintIcon/></Tooltip></IconButton>}
                    content={()=>componentRef.current}
            /> */}
            <IconButton
                    onClick={() => {
                        if (pdfExportComponent.current) {
                          pdfExportComponent.current.save();
                        }
                      }}
                >
                    <PrintIcon />
            </IconButton>
            </Toolbar>
            
                <TableContainer component={Paper} className={classes.container}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            
                            <TableCell>SL NO</TableCell>
                            <TableCell>DATE</TableCell>
                            <TableCell>AMOUNT</TableCell>
                            <TableCell>TYPE</TableCell>
                            <TableCell>BALANCE</TableCell>
                            <TableCell>REMARKS</TableCell>
                            
                        </TableRow>
                        
                    </TableHead>
                    <TableBody>
                        {   Array.isArray(data) ? (
                            data.map((item,index)=>{
                                if(item.trans_type === 'dep'){
                                    dep += Number(item.amount)
                                }else if(item.trans_type === 'intr'){
                                    int_dep += Number(item.amount)
                                }else if(item.trans_type === 'with'){
                                    withd += Number(item.amount) 
                                }
                               
                               
                               
                               
                               
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{DateHandler(item.date)}</TableCell>
                                        <TableCell>{item.amount}</TableCell>
                                        <TableCell>{item.trans_type === 'dep' ? 'deposit' : item.trans_type === 'with' ? 'withdrwal' : 'intrest'}</TableCell>
                                        <TableCell>{(dep + int_dep) - withd}</TableCell>
                                        <TableCell>{item.remark}</TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <div></div>
                        )
                            

                            
                        }

                       
                    </TableBody>
                    </Table>
                </TableContainer>
            
            

                    <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={()=>setOpen(false)}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">{"Narration"}</DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">

                            {
                                Data.remarks != null ? (
                                    Data.remarks
                                ) : (
                                    'No remarks found'
                                )
                            }
                        </DialogContentText>
                        </DialogContent>
                        
                    </Dialog>
            <div
                style={{
                    position: "absolute",
                    left: "-1000px",
                    top: 0,
                  }}
            > 
            <PDFExport  keepTogether='.keep'  paperSize="LEGAL" margin={{top: 10,right: 10,bottom: 10,left: 10}} fileName='fund_ladger.pdf'  ref={pdfExportComponent}>
            <FundLadgerPrint data={data} info={{ac_no : Data.ac_no,name: Data.name}} />
            </PDFExport>
            </div>
            {/* <div style={{display : 'none'}}>
                <FundLadgerPrint ref={componentRef}  data={data} info={{ac_no : Data.ac_no,name: Data.name}} />
            </div> */}
        </Container>
    )
}

const useStyles = makeStyles(()=>({
    container: {
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
        
    }
})) 