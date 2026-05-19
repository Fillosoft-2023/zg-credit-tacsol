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
import MyDocument from './../../pdf/juornal/savingsTransRecord'
import GetAppIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import DateHandler from '../../consts/date_format';
import Api from '../../api/api';
export default function SavRecordMain(){
    const classes = use_styles();
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [ready, setReady] = React.useState(false)
    const [send, setSendData] = React.useState(null)
    
    const [date, setDate]= React.useState({
        to : new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
        press : "ladgerBookSavColl"
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
       // sendAsync(date).then((res)=> {setData(res)})
    },[date])
    const cumulativeSum = (sum => value => sum += value)(0);
    let sum = 0
    const filename = Math.floor(Math.random()*10000000);
    const handleDownload = ()=>{
        setSendData(Data)
        setReady(true)
    }
    const onSearch = ()=>{
        fetch(Api+'ladgerBookSavingsCollectionMain',{
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
    

    
    return (
        <Container component={Paper} style={{padding:10,minHeight:'75vh'}}>
        <Paper className={classes.dateBar}>
        <div>
        <Typography style={{margin: 5,fontWeight:'bold'}}>
            Savings A/C Collection Records
            </Typography>

</div>
<div>
    

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
                    <PDFDownloadLink document={<MyDocument callback={send} DateDiffer={date} />} fileName={filename+"Savingsdeposite.pdf"}>
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
            
            </div>
        </Paper>
        <Paper>
            <TableContainer className={classes.table}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Details</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Balance</TableCell>
                        </TableRow>
                    </TableHead>
                      
                           

                        {
                            Data.map((item,index)=> {
                                
                                sum += Number(item.dep) 
                                return (
                                    <TableBody>
                                    { item.dep != 0 ? (

                                    
                                        <TableRow>
                                            <TableCell>{DateHandler(item.date)}</TableCell>
                                            <TableCell> {item.ac_no} / {item.sv_acno}</TableCell>
                                            <TableCell style={{color: '#42f548'}}>{item.dep}</TableCell>
                                            <TableCell style={{color: '#42f548'}}>Deposit</TableCell>
                                            <TableCell style={{color: '#42f548'}}>{sum}</TableCell>
                                        </TableRow>

                                            ) : (
                                                <div></div>
                                            )
                                    }
                                    </TableBody>
                                )
                            })
                        }
                    
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
        justifyContent: 'space-between',
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