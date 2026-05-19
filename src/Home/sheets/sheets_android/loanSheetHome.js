import React, { useEffect, useState } from 'react'
import {
    Button,
    Container,
    Menu,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    TextField,
    Toolbar,
    Paper,
    Typography
} from '@material-ui/core'
import { useHistory } from 'react-router'
import Api from '../../../api/api'
const menus = [
    {
        name : 'Daily',
        value : 1
    },
    {
        name : 'Weekly',
        value : 7
    },
    {
        name : 'Fortnightly',
        value : 14
    },
    {
        name : 'Monthly',
        value : 30
    }
]
const week = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
export default function LoanSheetHomeandroid(prop){
    const [anchorE1, setAnchorE1] = React.useState(null)
    const menuOpen = Boolean(anchorE1)
    const [anchorE2, setAnchorE2] = React.useState(null)
    const nextMenu = Boolean(anchorE2)
    const history = useHistory()
    const [sendData, setSendData] = React.useState({frequency : {},day : null})
    const [err, setErr] = React.useState({})
    const [routeHandler, setRouteHandler] = React.useState(null)
    const queryParameters = new URLSearchParams(window.location.search)
    const id = queryParameters.get("id")
    const date = queryParameters.get("t_id")
    const [expired,setExpired] = useState(false)
    const handlemenuClose = ()=>{
        setAnchorE1(null)
        setAnchorE2(null)
        setRouteHandler(null)
    }
    const handlemenueOpen = (event)=>{
        setAnchorE1(event.currentTarget)
    }

    const handleNextMenu = (item,target)=>{
        setAnchorE2(target.currentTarget)
        setSendData({
            ...sendData,
            frequency : item
        })

       
    }

    const [agent, setAgent] = React.useState([])
    useEffect(()=>{ 
        if(new Date() > date){
            setExpired(true)
        }
        const F_data = new FormData()
        F_data.append('id',id)
        fetch(Api+'agent_android',{
            method : 'POST',
            body : F_data
        })
        .then(res=>res.json())
        .then(res=>setAgent(res))

        setSendData({
            ...sendData,
            ag_id : id
        })
    },[])

    const handleChange = (e)=>{
        setSendData({
            ...sendData,
            [e.target.name] : e.target.value
        })
    }

    const validate = ()=>{
        let valid = true
        let err = {}

        if(!sendData.date){
            valid = false
            err['date'] = true
        }
        if(!sendData.agent){
            valid = false
            err['agent'] = true
        }

        setErr(err)

        return valid
    }

    const finalSubmit = ()=>{
        if(validate()){
            if(routeHandler != null){
                history.push('/LoanSheetAndroid',sendData)
            }else{
                history.push('/LoanSheetAndroid',sendData)
            }
            
        }
    }
    return(
        <Container
            style={{
                display:'flex',
                flexDirection: 'column',
                justifyContent:'center',
                alignItems: 'center',
                marginTop : 10
            }}
        >
        {
            expired ? (
                <Typography>Link Expired</Typography>
            ) : (
        <>
        <Toolbar component={Paper} style={{width : '100%'}}>
        <Button 
                    variant="contained"
                    color="primary"
                    onClick={handlemenueOpen}
                >
                    Generate Sheet
                </Button>
        </Toolbar>
            {/* <img src={calender} width="300" /> */}
            <div>
                {/* <Button 
                    variant="outlined"
                    color="primary"
                    style={{marginRight : 5}}
                    onClick={(currentTarget)=>{
                        setRouteHandler('view')
                        handlemenueOpen(currentTarget)
                    }
                        }
                >
                    View Sheet
                </Button> */}
               
            </div>
            <Menu
                open={menuOpen}
                anchorEl={anchorE1}
                onClose={handlemenuClose}
            >
            {
                menus.map(item=><MenuItem key={item.name} onClick={(target)=>handleNextMenu(item,target)} >{item.name}</MenuItem>)
            }
            </Menu>
            <Menu
                open={nextMenu}
                anchorEl={anchorE2}
                style={{
                    width : 540,
                    
                }}
                aria-haspopup="true"
                aria-expanded={nextMenu ? 'true' : undefined}
                onClose={handlemenuClose}
            >
                <div style={{padding : 30,}}>
                
                <div style={{marginBottom : 10}}>
                    {/* <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        helperText="From"
                        fullWidth
                        value={sendData.from}
                        name="from"
                        onChange={handleChange}
                        error={err.from}
                    />

                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        helperText="To"
                        fullWidth
                        value={sendData.to}
                        name="to"
                        onChange={handleChange}
                        error={err.to}
                    /> */}
                    {/* <Alert severity="info">
                        Select date to generate 
                    </Alert> */}
                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        label="Sheet Date"
                        InputLabelProps={{shrink : true}}
                        fullWidth
                        value={sendData.date }
                        name="date"
                        onChange={handleChange}
                        error={err.date}

                    />
                </div>

                <FormControl variant="outlined"  fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">Select Agent</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            // error={err.agentid}
                            value={sendData.agent}
                            name="agent"
                            onChange={handleChange}
                            error={err.agent}
                            
                        >
                        <MenuItem value={false}>
                            <em>None</em>
                        </MenuItem>
                        {
                            agent.map((item,index)=>{
                                return (
                                    <MenuItem key={index} value={item}>{item.ag_name}</MenuItem>
                                )
                            })
                        }
                        </Select>
                </FormControl>
                {
                sendData.frequency.value === 7 || sendData.frequency.value === 14 ? (
                    <FormControl variant="outlined" style={{marginTop: 10}}  fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">Select Day</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            // error={err.agentid}
                            value={sendData.day}
                            name="day"
                            onChange={handleChange}
                            error={err.day}
                            
                        >
                        <MenuItem value={false}>
                            <em>None</em>
                        </MenuItem>
                        {
                            week.map((item,index)=>{
                                return (
                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                )
                            })
                        }
                        </Select>
                    </FormControl>
                ) : ''
                }
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{marginTop : 10}}
                    onClick={finalSubmit}
                >
                    Generate Now
                </Button>
                </div>
            </Menu>
            </>
            ) }
        </Container>
    )
}