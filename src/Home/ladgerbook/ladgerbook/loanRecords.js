import React from 'react'
import {
    Container,
    Paper,
    makeStyles,
    TextField,
    TableContainer,
    TableCell,
    TableBody,
    TableRow,
    TableHead,
    Table,
    Typography,
    Tooltip,
    IconButton
} from '@material-ui/core'
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';
import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer'
import MyDocument from './../../pdf/juornal/LoanissueRecord'
import GetAppIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
export default function LoanRecords(){
    const classes = use_styles();
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [ready, setReady] = React.useState(false)
    const [send, setSendData] = React.useState(null)
    const [date, setDate]= React.useState({
        to : new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
        press : "ladgerBookLoan"
    })
    const handleDate = (event)=>{
        let name = event.target.name;
        let value = event.target.value;

        setDate({
            ...date,
            [name] : value,
            
        })
    }
    const [Data, setData] = React.useState([])
    React.useEffect(()=>{
        // sendAsync(date).then((res)=> {setData(res)
        // console.log(res)
        // })
    },[date])
    const cumulativeSum = (sum => value => sum += value)(0);
    let sum = 0
    const filename = Math.floor(Math.random()*10000000);
    const handleDownload = ()=>{
        setSendData(Data)
        setReady(true)
    }
    return (
        <Container>
        <Paper className={classes.dateBar}>
            <Typography style={{margin: 5,textAlign: 'center'}}>Loan issue records</Typography>
            <TextField
                type="date"
                variant="outlined"
                size="small"
                name="to"
                value={date.to}
                onChange={handleDate}
                
            />
            <TextField
                type="date"
                variant="outlined"
                size="small"
                name="from"
                style={{marginLeft: 10,}}
                value={date.from}
                onChange={handleDate}
                
            />
            {
                ready ? (   
                    <PDFDownloadLink document={<MyDocument callback={send} />} fileName={filename+"LoanissueRecord.pdf"}>
                        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 
                        <Tooltip title="download this sheet">
                        <IconButton>
                        <GetAppIcon />
                        </IconButton>
                    </Tooltip>
                        
                        )}
                    </PDFDownloadLink>

                ) : (
                   
                      <Tooltip title="Print list">
                        <IconButton onClick={()=>handleDownload()}>
                            <PrintIcon />
                        </IconButton>
                      </Tooltip>
                )
            }
        
            
        
        </Paper>
        <Paper className={classes.table}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>date</TableCell>
                            <TableCell>description</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>type</TableCell>
                            <TableCell>balence</TableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody>
                            {
                                Data.map((item,index)=> {
                                    
                                    sum += Number(item.ln_amnt)
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{item.opn_dte}</TableCell>
                                            <TableCell>Loan to {item.ac_no}</TableCell>
                                            <TableCell style={{color: 'red'}}>{item.ln_amnt}</TableCell>
                                            <TableCell style={{color: 'red'}}>cr</TableCell>
                                            <TableCell style={{color: 'red'}}>{sum}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    
                </Table>
            </TableContainer>
        </Paper>

        </Container>
    )
}

const use_styles = makeStyles(()=>({
    dateBar : {
        padding: 5,
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 15,
        marginBottom: 10,
    },
    table : {
        maxHeight: '75vh',
        overflowX: 'auto',
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