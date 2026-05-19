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
    IconButton,
    Tooltip,
    Typography,
    Menu,
    MenuItem,
    Button
} from '@material-ui/core'
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';
import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer'
import MyDocument from './../../pdf/juornal/interestColRecord'
import GetAppIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import FilterListIcon from '@material-ui/icons/FilterList';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DateHandler from '../../consts/date_format';
import Api from '../../api/api';

export default function EmiIntrest(){
    const classes = use_styles();
    const today = new Date()
    const [send, setSendData] = React.useState(null)
    const next = today.setDate(today.getDate() + 7);
    const [ready, setReady] = React.useState(false)
    const [date, setDate]= React.useState({
        to : new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
        press : "ladgerBookLoanIntrest"
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
    const [loan_type, setLoanType] = React.useState([])
    React.useEffect(()=>{
        // sendAsync(date).then((res)=> {
        //     console.log(res)
        //     setData(res)
        //     if(condition != null){
        //         filter(condition)
                
        //     }else {
        //         setFiltered(res)
        //     }
        // })
    },[date])

    const onSearch = ()=>{
        // console.log(date)
        fetch(Api+'ladgerBookInterst',{
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
        //sendAsync('loan_type').then((res)=>setLoanType(res))
      };
      const handleClose = () => {
        setAnchorEl(null);
      };

    const filter = (condition)=> {
        
        setFiltered(Data.filter(type => type.ln_tpe === condition))
        setAnchorEl(null);
        setCondition(condition)
    }
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
        <Typography style={{margin: 5,marginRight: 20,textAlign: 'center'}}>Loan Interest records</Typography>
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
                    <PDFDownloadLink document={<MyDocument callback={send} DateDiffer={date} />} fileName={filename+"InterestcollectionRecord.pdf"}>
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
                loan_type.map((item,index)=>
                <MenuItem key={index} onClick={()=>filter(item.loan_type)} >
                    {item.loan_type}
                    <IconButton style={{float : 'right'}} size="small" >
                        <ChevronRightIcon />
                    </IconButton>
                </MenuItem>
                )
            }
           
            
                
            </Menu>
        </Paper>
        <Paper>
            <TableContainer className={classes.table}>
            <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Balance</TableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody>
                            {
                                filterd.map((item,index)=> {
                                    
                                    sum += Number(item.interest)
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{DateHandler(item.recived_date)}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.ln_type} {item.ac_no} / {item.ln_acno}</TableCell>
                                            <TableCell style={{color: '#42f548'}}>{item.interest}</TableCell>
                                            <TableCell style={{color: '#42f548'}}>Deposit</TableCell>
                                            <TableCell style={{color: '#42f548'}}>{sum.toFixed(2)}</TableCell>
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