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
import MyDocument from './../../pdf/juornal/propertyExpence'
import GetAppIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import DateHandler from '../../consts/date_format';
import Api from '../../api/api';
export default function PropExpence(){
    const classes = use_styles();
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [ready, setReady] = React.useState(false)
    const [send, setSendData] = React.useState(null)
    const [date, setDate]= React.useState({
        to : new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
        press : "propertyexpence"
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
        // sendAsync(date).then((res)=> {
        //     console.log(res)
        //     setData(res)
        // })
    },[date])
    const onSearch = ()=>{
        // console.log(date)
        fetch(Api+'propertyexpence',{
            method : 'POST',
            body : JSON.stringify(date)
        })
        .then(res=>res.json())
        .then(res=>{
            setData(res)
            
        })
        .catch(err=>{
           console.log(err)
        })
    }
    const cumulativeSum = (sum => value => sum += value)(0);
    let sum = 0
    let subs = 0
    const filename = Math.floor(Math.random()*10000000);
    const handleDownload = ()=>{
        setSendData(Data)
        setReady(true)
    }
    return (
        <Container>
        <Paper className={classes.dateBar}>
        <Typography style={{margin: 5,marginRight: 20,textAlign: 'center'}}>Property Purchased Record</Typography>
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
                    <PDFDownloadLink document={<MyDocument callback={send} DateDiffer={date} />} fileName={filename+"ExpensecollectionRecord.pdf"}>
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
                            <TableCell>Expense Type</TableCell>
                            <TableCell>Details</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Depreciation</TableCell>
                            <TableCell>Balance</TableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody>
                            {
                                Data.map((item,index)=> {
                                    
                                    sum += Number(item.amount) - Number(item.red_amount)
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{DateHandler(item.date)}</TableCell>
                                            <TableCell>{item.type}</TableCell>
                                            <TableCell>{item.detail}</TableCell>
                                            <TableCell style={{color: 'red'}}>Withdrawal</TableCell>
                                            <TableCell style={{color: 'red'}}>{item.amount}</TableCell>
                                            <TableCell style={{color: 'red'}}>{item.red_amount}</TableCell>
                                            
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