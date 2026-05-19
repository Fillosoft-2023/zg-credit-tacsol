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
    IconButton,
    Button
} from '@material-ui/core'
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';
import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer'
import MyDocument from './../../pdf/juornal/bankInterest'
import GetAppIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import DateHandler from '../../consts/date_format';
import Api from '../../api/api';
export default function BankInterest(){
    const classes = use_styles();
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [ready, setReady] = React.useState(false)
    const [send, setSendData] = React.useState(null)
    const [date, setDate]= React.useState({
        to : new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
        press : "ladgerBookBankWith",
        type : "Interst"
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
    const [AllData, setAllData] = React.useState([])
    const [modifyData, setModifyData] = React.useState({})
    React.useEffect(async ()=>{
        // await sendAsync(date).then((res)=> {
        //     console.log(res)
        // setAllData(res)
        
        // })
        fetch(Api+'ladgerBookBankWith',{
            method : 'POST',
            body : JSON.stringify(date)
        })
        .then(res=>res.json())
        .then(res=>setAllData(res))
        .catch(err=>{
           console.log(err)
        })
    },[])

    const onSearch = ()=>{
        // console.log(date)
        fetch(Api+'ladgerBookBankDep',{
            method : 'POST',
            body : JSON.stringify(date)
        })
        .then(res=>res.json())
        .then(res=>{
            setData(res)
            console.log(res)
            
        })
        .catch(err=>{
           console.log(err)
        })
    }
    React.useEffect(()=>{
        const mergeDedupe = (arr) => {
            return [...new Set([].concat(...arr))];
          }

        setData(mergeDedupe(AllData))
    },[AllData])

    
    let sum = 0
    const filename = Math.floor(Math.random()*10000000);
    const handleDownload = ()=>{
        setSendData(Data)
        setReady(true)
    }
    return (
        <Container>
        <Paper className={classes.dateBar}>
        <Typography style={{margin: 5,marginRight: 20,textAlign: 'center'}}>Bank Interest Receipt</Typography>
            {/* <TextField
                type="date"
                variant="outlined"
                size="small"
                name="to"
                value={date.to}
                onChange={handleDate}
                
            /> */}
            <TextField
                type="month"
                variant="outlined"
                size="small"
                name="from"
                style={{marginLeft: 10,}}
                value={date.from}
                onChange={handleDate}
                
            />
            <Button onClick={onSearch} style={{marginLeft: 10}} size="small" color='primary' variant='contained'>
                Search
            </Button>
             {
                ready ? (   
                    <PDFDownloadLink document={<MyDocument callback={send} DateDiffer={date} />} fileName={filename+"BankIterestRecord.pdf"}>
                        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 
                        <Tooltip title="download this sheet">
                        <IconButton onClick={()=>setReady(false)}>
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
        <Paper>
        <TableContainer className={classes.table}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Bank name</TableCell>
                            <TableCell>Remarks</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Balance</TableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody>
                            {
                                Data.map((item,index)=> {
                                    
                                    sum += Number(item.amount)
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{DateHandler(item.date)}</TableCell>
                                            <TableCell>{item.bank_name}</TableCell>
                                            <TableCell>{item.remarks}</TableCell>
                                            <TableCell style={{color: 'green'}}>{item.amount}</TableCell>
                                            <TableCell style={{color: 'green'}}>Deposit</TableCell>
                                            <TableCell style={{color: 'green'}}>{sum}</TableCell>
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
    table: {
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