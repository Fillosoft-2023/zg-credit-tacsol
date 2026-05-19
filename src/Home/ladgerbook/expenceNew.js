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
    Menu,
    MenuItem,
    Button
} from '@material-ui/core'

import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer'
import MyDocument from './../../pdf/juornal/expenseColRecord'
import GetAppIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import FilterListIcon from '@material-ui/icons/FilterList';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DateHandler from '../../consts/date_format';
import Api from '../../api/api';

const expence = [ 
   
    {
        name : "Room rent",
        value : "room rent"
    },
    {
        name : "Electricity Bill",
        value : "electricity"
    },
    {
        name : "Donation",
        value : "donation"
    },
    {
        name : "Food Expenditure",
        value : "food"
    },
    {
        name : "Salary Paid",
        value : "salary"
    },
    {
        name : "Management Expenditure",
        value : "management"
    },
    {
        name : "Travelling Allowance",
        value : "travelling"
    },
    {
        name : "Meeting expenses",
        value : "meeting"
    },
    {
        name : "Audit fee",
        value : "Audit fee"
    },
    {
        name : "Agent comission",
        value : "agent comission"
    },
    {
        name : "Other",
        value : "Other expenses"
    },
]
export default function Expence(){
    const classes = use_styles();
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [ready, setReady] = React.useState(false)
    const [send, setSendData] = React.useState(null)
    const [date, setDate]= React.useState({
        to : new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
        type : "property buy",
        
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
    const [filterd, setFiltered] = React.useState([])
    const [condition, setCondition] = React.useState(null)
    React.useEffect(()=>{
        
        // sendAsync(date).then((res)=> {
        //     setData(res) 
            // if(condition != null){
            //     console.log('runed')
            //     filter(condition)
                
            // }else {
            //     setFiltered(res)
            // }
        // })
        fetch(Api+'ladgerBookExpence',{
            method : 'POST',
            body : JSON.stringify(date)
        })
        .then(res=>res.json())
        .then(res=>{
            setData(res)
            if(condition != null){
                
                filter(condition)
                
            }else {
                setFiltered(res)
            }
        })
        .catch(err=>{
           console.log(err)
        })
    },[])
    const onSearch = ()=>{
        // console.log(date)
        fetch(Api+'ladgerBookExpence',{
            method : 'POST',
            body : JSON.stringify(date)
        })
        .then(res=>res.json())
        .then(res=>{
            setData(res)
            if(condition != null){
                
                filter(condition)
                
            }else {
                setFiltered(res)
            }
        })
        .catch(err=>{
           console.log(err)
        })
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setReady(false)
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
    const cumulativeSum = (sum => value => sum += value)(0);
    let sum = 0
    const filename = Math.floor(Math.random()*10000000);
    const handleDownload = ()=>{
        setSendData(filterd)
        setReady(true)
    }

    const filter = (condition)=> {
        
        setFiltered(Data.filter(type => type.type === condition))
        setAnchorEl(null);
        setCondition(condition)
    }
    return (
        <Container>
        <Paper className={classes.dateBar}>
        <Typography style={{margin: 5,marginRight: 20,textAlign: 'center'}}>Expence Record</Typography>
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
            <IconButton onClick={handleClick} >
                <FilterListIcon />
            </IconButton>
            <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'bottom',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'bottom',
                    }}
            >
            {
                expence.map((item,index)=> {

                    return (
                        <MenuItem key={index} onClick={()=>filter(item.value)}>
                            {item.name}
                            <IconButton style={{float : 'right'}} size="small" >
                                <ChevronRightIcon />
                            </IconButton>
                        </MenuItem>
                    )
                })
            }
            </Menu>
        
        </Paper>
        <Paper>
            <TableContainer className={classes.table}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Balance</TableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody>
                            {
                                filterd.map((item,index)=> {
                                    
                                    sum += Number(item.amount)
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{DateHandler(item.date)}</TableCell>
                                            <TableCell>{item.type}</TableCell>
                                            <TableCell>{item.detail}</TableCell>
                                            <TableCell style={{color: 'red'}}>{item.amount}</TableCell>
                                            <TableCell style={{color: 'red'}}>Withdrawal</TableCell>
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