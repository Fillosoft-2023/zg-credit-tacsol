import React from 'react'
import {
    Container,
    Paper,
    Toolbar,
    Menu,
    MenuItem,
    Button,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
    Typography
} from '@material-ui/core'
import AdjustSheet from './adjustSheet'
import ReactToPrint from 'react-to-print';
import LoanSheetPrint from './loanSheetprint';
import {useHistory} from 'react-router-dom'
import PrintIcon from '@material-ui/icons/Print';
import FilterListIcon from '@material-ui/icons/FilterList';
import RefreshIcon from '@material-ui/icons/Refresh';
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
//"","1","","2","","3","","4","","5","","6","","7","","8","","9","","10","","11","","12","","13","","14","","15","","Total"
//"prin","int","prin","int","prin","int","prin","int","prin","int","prin","int","prin","int","prin","int","prin","int","prin","int","prin","int","prin","int","prin","int","prin","int","prin","int", "",

const loan_type = ["VL","PL","EL","HL","ML"]
export default function SheetView(prop){
    const [propData, setPropData] = React.useState(prop.history.location.state)
    const componentRef = React.useRef();
    const [anchorE1, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorE1)
    const [sendData, setSendData] = React.useState({press : "loanSheetView",freq : propData.frequency.value,ln_type : ''})
    const [agentDisplay, setAgentDisplay] = React.useState(false)
    const [agent, setAgent] = React.useState([])
    const [data, setData] = React.useState([])
    const history = useHistory()
    const [tableHeads, setTableHeads] = React.useState(["Name","MCB No","Com Inst","Type","Prin O/S","Int O/S","Disb Amt","Inst Amt",])
    const [subHeads,setSubHeads] = React.useState(["prin","int",])
    const [tableFoot, setTableFoot] = React.useState(["Total","","","","","","","","","","",""])
    const [refresh, setRefresh] = React.useState(Math.random())
    const [anchorE2, setAnchorE2] = React.useState(null)
    const loan_type_open = Boolean(anchorE2)
    const handleClose = ()=>{
        setAnchorEl(null)
        setAnchorE2(null)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    const handleAnchor2 = (e)=>{
        setAnchorE2(e.currentTarget)
    }
    const handleFreqChange = (prop)=>{
        setAnchorEl(null)
        setSendData({
            ...sendData,
            freq : prop
            
        })
        setAgentDisplay(true)
        // sendAsync('agent').then((res)=> {
        //     setAgent(res)
        // })

        // setPropData({
        //     ...propData,
        //     frequency : {
        //         value : prop
        //     }
        // })
        // propData.frequency.value = prop
    }
  
    const onAgentChange = (prop)=>{
        setAgentDisplay(false)
        // sendAsync(
        //     {
        //     ...sendData,
        //     agnt_id : prop.id
        //     }
        // )
        // .then((res)=>{
        //     setData(res)
        //     console.log(res)
        // })

        setPropData({
            ...propData,
            agent : {
                ...propData.agent,
                id : prop.id,
                ag_name : prop.ag_name
            }
        })
    }
    React.useEffect(()=>{
        
        const from = new Date(propData.from)
        const to = new Date(propData.to)
        const diffTime = Math.abs(to - from);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const freq = propData.frequency.value
        const no_install = (diffDays / Number(freq) + 1).toFixed()
        
        //for maintain emai no to 10

        if(no_install > 15){
            alert("Error!, Number of installment must less than or equal to 10")
            history.goBack()
        }

        
        for(var i = 1; i <= no_install; i++){
            // var dateCreate = from.setDate(from.getDate()+i)
            // tableHeads.push("",new Date(dateCreate).toLocaleDateString("en-CA"))
            // subHeads.push("prin","int")
            tableHeads.push(i)
            subHeads.push("prin","int")
            tableFoot.push("","")

        }

        tableHeads.push("Total","GT")
        subHeads.push("prin","int")

        //collecting data
        onAgentChange(propData.agent)

    },[])

    React.useEffect(()=>{
        onAgentChange(propData.agent)
    },[refresh])

    const handleLoanByType = (prop)=>{
        setAnchorE2(null)
        // sendAsync(
        //     {
        //     ...sendData,
        //     ln_type : prop,
        //     press : 'loanSheet_by_type',
        //     agnt_id : propData.agent.id
        //     }
        // )
        // .then((res)=>{
        //     setData(res)
        //     console.log(res)
        // })
    }
    return(
        <Container maxWidth="xxl" style={{overflowY : 'auto'}}>
            <Toolbar component={Paper} style={{marginTop : 10}}>
                <Menu
                    anchorEl={anchorE1}
                    open={open}
                    onClose={handleClose}
                >
                {
                    menus.map((item,index)=>
                        <MenuItem key={index} onClick={()=>handleFreqChange(item.value)} >{item.name}</MenuItem>
                    )
                }
                </Menu>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                    style={{width: 200}}
                >
                    Sheet Type
                </Button>
                <AdjustSheet stateChanger={setData} data={data} />
                <IconButton onClick={()=>setRefresh(Math.random())}>
                    <Tooltip title="Refresh">
                        <RefreshIcon />
                    </Tooltip>
                </IconButton>
                <IconButton onClick={handleAnchor2}>
                    <Tooltip title="Sort by ">
                    <FilterListIcon />
                    </Tooltip>
                </IconButton>
                {/* <ReactToPrint
                    trigger={()=><IconButton><Tooltip title="Print sheet"><PrintIcon/></Tooltip></IconButton>}
                    content={()=>componentRef.current}
                /> */}
                
                
            </Toolbar>
            <Menu
                anchorEl={anchorE2}
                open={loan_type_open}
                onClose={handleClose}
            >
            {
                loan_type.map((item,index)=><MenuItem key={index} onClick={()=>handleLoanByType(item)} >{item}</MenuItem>)
            }
            </Menu>
            
            <TableContainer component={Paper} style={{marginTop: 5,maxHeight: 500}}>
            <Table size="small">
                
                    <TableHead>
                        <TableRow>
                        {
                            tableHeads.map((item,index)=><TableCell key={index} align="right" >{item}</TableCell>)
                        }
                        </TableRow>
                    </TableHead>
                    <TableHead>
                        <TableRow>
                        {
                            subHeads.map((item,index)=><TableCell key={index}>{item}</TableCell>)
                        }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        
                        {
                           data.map((item,index)=>{
                               return(
                                   
                                <TableRow key={index}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.acno}</TableCell>
                                    <TableCell>{(item.inst_no - 1)}</TableCell>
                                    <TableCell>{item.ln_tpe}</TableCell>
                                    <TableCell>{Number(item.ln_amnt) - Number(item.rec_prncpl)}</TableCell>
                                    <TableCell>{Number(item.intrst_amnt) - Number(item.rec_intr)}</TableCell>
                                    <TableCell>{Number(item.ln_amnt)}</TableCell>
                                    <TableCell>{item.emi_princ}</TableCell>
                                    <TableCell>{item.emi_intr}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    
                                    
                                </TableRow>
                               )
                           }) 
                        }
                        
                    </TableBody>
                
            </Table>
            </TableContainer>

            <Dialog
                open={agentDisplay}
                
            >
                <DialogTitle>
                    Select Agent

                </DialogTitle>
                <DialogContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Agent ID</TableCell>
                                <TableCell>Agent Name</TableCell>
                                <TableCell>Set </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                            agent.map((item,index)=>
                                <TableRow key={index}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.ag_name}</TableCell>
                                    <TableCell>
                                        <Button onClick={()=>onAgentChange(item)}>
                                            Set
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
                </DialogContent>
            </Dialog>

            {/* <div >
                <LoanSheetPrint ref={componentRef} tableHead={tableHeads} tableSubHead={subHeads} data={data} tableFoot={tableFoot} date={propData}/>
            </div> */}
        </Container>
    )
}