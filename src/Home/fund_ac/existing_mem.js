import React,{useState,useEffect} from 'react'
import {
    Container,
    Grid,
    Paper,
    InputBase,
    IconButton,
    List,
    ListItem,
    Avatar,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Typography,
    Divider,
    Tooltip

} from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import SearchIcon from '@material-ui/icons/Search'
import {makeStyles} from  '@material-ui/styles'
import PaymentIcon from '@material-ui/icons/Payment';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import {useHistory} from 'react-router-dom'
import GroupIcon from '@material-ui/icons/Group';
import RefreshIcon from '@material-ui/icons/Refresh';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import FdTransaction from './fundTransaction';
import logo from '../../assets/logo.png'
export default function ExistingHolder(props){
const classess = useStyle();
const [allLoan,setallLoan] = useState([]);
const [sendData, setsendData] = useState({})
const [secondary, setSecondary] = React.useState(false);

const history = useHistory()
const handleChange = (event)=>{
    let value = event.target.value;
    
    Object.assign(sendData,{
        "data" : value,
        "press" : "searchTa"
    })
    
    
    // sendAsync(sendData).then((res)=>{
    //     setallLoan(res)
    // })
}

    const linkToLoan = (props,key)=>{
        updateSelected(key)
        history.push('/Home/FundHome/FdHolDet/', {"data" : props})
    }
    const linkToLadger = (props,key)=>{
        updateSelected(key)
        history.push('/Home/FundHome/FdLadgerBook/', {"data" : props})
    }
   
    const [existingData, setExisting] = React.useState([])
    const [isLoadin, setisLoading] = React.useState([])
    React.useEffect(()=>{
    
        // sendAsync('allFund').then((result)=>{
        //     setallLoan(result.data2);
        //     setisLoading(false)
        //     console.log(result)
        // })
       
    
},[isLoadin])
    
var countMat = allLoan.reduce(function(n, val) {
    return n + (val.mt_stus === 'matured');
}, 0);
var countActive = allLoan.reduce(function(n, val) {
    return n + (val.mt_stus === 'not done');
}, 0);
const [selected, setSelect] = React.useState(null)
const updateSelected = (selectedIndex)=>{
    setSelect(selectedIndex)
    
    
}

   const ListGenerate = ()=>
    allLoan.map((value,key) =>{
        let Example = ''
        let data = ''
        if(value.img != null){
            const img = Buffer.from(value.img).toString('base64')
             data = img
            Example = ({data} ) => <img style={{width: 50}} src={`data:image/jpeg;base64,${data}`} />
        }else{
             Example = () => <img style={{width: 50}} src={logo} />
        }
        return (
            
            <ListItem button key={key} onClick={()=>linkToLoan(value,key)} selected={selected === key}>
                <ListItemAvatar>
                <Avatar>
                <Example data={data} />
                </Avatar>
                </ListItemAvatar>
                <ListItemText
                
                primary={<Typography className={classess.font}>{value.name}</Typography>}
                secondary={<Typography className={classess.fontSec}>{value.acno}</Typography>}
                />
                <ListItemSecondaryAction style={{display: 'flex', justifyContent: 'center',alignItems: 'center'}}>
                <div style={{display: 'flex'}}>
                <FdTransaction callback={value} onClick={()=>updateSelected(key)} />
                <IconButton size="small" onClick={()=>linkToLadger(value,key)}>
                    <ImportContactsIcon />
                </IconButton>
                <IconButton onClick={()=>linkToLoan(value,key)} edge="end" size="small" aria-label="delete">
                    <NavigateNextIcon />
                </IconButton>
                </div>
                </ListItemSecondaryAction>
            </ListItem>
            )});





    return (
        <Paper  className={classess.Container}>
            <Paper component="form" className={classess.search}>
                <InputBase
                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                placeholder="Search by account no or name"
                inputProps={{ 'aria-label': 'Search by account no or name' }}
                className={classess.input}
                onChange={handleChange}
                />
                <IconButton  aria-label="search">
                <SearchIcon />
                </IconButton>
            
            
            </Paper>
            
            <List>
            <ListItem>
            <Tooltip title="Displayed Holder's">
            <GroupIcon style={{color: '#808080',marginLeft: 10}}/>
            </Tooltip>
            <Typography style={{marginLeft: 5,color: '#808080'}}>{allLoan.length}</Typography>
            
            <Tooltip title="Completed Account">
            <CheckCircleOutlineIcon style={{color: 'green',marginLeft: 10}}/>
            </Tooltip>
            <Typography style={{marginLeft: 5,color: 'green'}}>{countMat}</Typography>
            
            <Tooltip title="Running Loan">
            <DirectionsRunIcon style={{color: 'red',marginLeft: 10}}/>
            </Tooltip>
            <Typography style={{marginLeft: 5,color: 'red'}}>{countActive}</Typography>
            
            <Tooltip title="Refresh">
            <IconButton size="small" style={{marginLeft: 10}} onClick={()=>setisLoading(true)}>
                <RefreshIcon style={{color: '#808080',marginLeft: 10}}/>
            </IconButton>
            </Tooltip>
                
            </ListItem>
            <Divider />
            {ListGenerate()}
            </List>

        </Paper>
    )
}

const useStyle = makeStyles((theme)=>({
    Container: {
        padding: 0,
        backgroundColor: '#fff',
        
        borderRadius: 3,
        overflowX: 'auto',
        height: '78vh',
        '&::-webkit-scrollbar': {
          width: '0.4em',
          
          backgroundColor: 'rgba(0,0,0,0,0)'
        },
        
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          
          borderRadius: 4,
         
        },
        
    },
    search: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        
       
      },
      input: {
       
        flex: 1,
      },
      font:{
          fontSize : '0.9em'
      },
      fontSec:{
          fontSize: '0.9em',
          color: '#5c5c5c'
      }
}))