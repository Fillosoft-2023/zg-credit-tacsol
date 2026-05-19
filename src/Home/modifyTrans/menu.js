import React from 'react'
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton
} from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Link, Route, Switch,BrowserRouter as Router, } from "react-router-dom";


const Data = [
    {
        name : "Emi Transaction",
        link : "/Home/ModifyTrans/emi"
    },
    // {
    //     name : "Rd Transaction",
    //     link : "/Home/ModifyTrans/RdTrans/"
    // },
    {
        name : "RD Transaction",
        link : "/Home/ModifyTrans/SavTrans"
    },
    {
        name : "Savings Transaction",
        link : "/Home/ModifyTrans/SavingsTransMain"
    },
    {
        name : "Expense Transaction",
        link : "/Home/ModifyTrans/ExpenseTrans"
    },
    {
        name : "Bank Transaction",
        link : "/Home/ModifyTrans/BankTrans"
    },
    {
        name : "Share Transaction",
        link : "/Home/ModifyTrans/ShareTrans"
    },

    {
        name : "Other Transaction",
        link : "/Home/ModifyTrans/OtherTrans"
    },
    {
        name : "TL Transaction",
        link : "/Home/ModifyTrans/TaTrans"
    },
    // {
    //     name : "Fund Transaction",
    //     link : "/Home/ModifyTrans/FundTrans"
    // },
]
export default function Menu(){
    const [selected, setSelect] = React.useState(null)
    const updateSelected = (selectedIndex)=>{
        setSelect(selectedIndex)
        
        
    }
    return (
        
        <List>
            {
                Data.map((item,index)=>{
                    return (
                        
                        
                        <ListItem key={index} onClick={()=>updateSelected(index)} selected={selected === index}>
                            <ListItemText primary={item.name}></ListItemText>
                            <Link to={item.link} style={{ textDecoration: 'none',color: '#000' }}>
                            <IconButton onClick={()=>updateSelected(index)} selected={selected === index}>
                                <NavigateNextIcon />
                            </IconButton>
                            </Link>
                        </ListItem>
                        
                        
                    )
                })
            }
            
            
        </List>
    )
}