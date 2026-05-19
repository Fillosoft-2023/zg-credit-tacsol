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
    TextField,
    LinearProgress
} from '@material-ui/core'
import AdjustSheet from './adjustSavingsSheet'
import SavingsSheetPrint from './savingsSheetPrint'
import PrintIcon from '@material-ui/icons/Print';
import Doc from '../../docService/docService'
import { PDFExport } from '@progress/kendo-react-pdf';
import Api from '../../api/api';
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
// const tableHeads = ["Name","Ac No","MCB No","Dep Amnt","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","Total"]

const tableHeads = [
    {
        sl_no : 'SL NO',
        className : 'sl_no'
    },
    {
        name : 'Name',
        className : 'name'
    },
    {
        name : 'Member No',
        className : 'mem_no'
    },
    {
        name : 'MCB No',
        className : 'mcb_no'
    },
    {
        name : 'Dep Amnt',
        className : 'dep_amnt'
    },
    {
        name : 'O/S',
        className : 'os'
    },
    
]

export default function SavingsSheet(){
    const pdfExportComponent = React.useRef(null);
    const [anchorE1, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorE1)
    const [sendData, setSendData] = React.useState({press : "savSheet"})
    const [agentDisplay, setAgentDisplay] = React.useState(false)
    const [agent, setAgent] = React.useState([])
    const [data, setData] = React.useState([])
    const [newData, setNewData] = React.useState([])
    const [loading,setLoading] = React.useState(false)
    const [tableFoot, setTableFoot] = React.useState(["","Total","","","","","","","","","","","","","","","","","","","","",""])
    const [sheet_start, setSheetStart] = React.useState(null)
    const handleClose = ()=>{
        setAnchorEl(null)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        if(tableHeads.length < 16){
            for(var i = 1; i < 17; i++){
                tableHeads.push(
                    {
                        name : i + Number(sheet_start),
                        className : 'filed'
                    }
                )
            }
    
            tableHeads.push(
            {
                name : 'Total',
                className : 'total'
            })
        }else {
            for(var i = 1; i < 17; i++){
                tableHeads[i + 5].name = i + Number(sheet_start)
            }
        }
      };
    const handleFreqChange = (prop)=>{
        setAnchorEl(null)
        setSendData({
            ...sendData,
            freq : prop
            
        })
        setAgentDisplay(true)
        fetch(Api+'agent')
        .then(res=>res.json())
        .then(res=>setAgent(res))
    }

    function sliceIntoChunks(arr, chunkSize) {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        return res;
    }
  
    const onAgentChange = (prop)=>{
        setAgentDisplay(false)
        
        setSendData({
            ...sendData,
            ag_name : prop.ag_name
        })
        // sendAsync(
        //     {
        //     ...sendData,
        //     agnt_id : prop.id,
            
        //     }
        // )
        // .then((res)=>{
        //     setData(res)
            
            
        // })
        setLoading(true)
        fetch(Api+'savSheet',{
            method : 'POST',
            body : JSON.stringify({...sendData,agnt_id : prop.id})
        })
        .then(res=>res.json())
        .then(res=>{
            setData(res)
            setLoading(false)
        })
        .catch(err=>{
           console.log(err)
        })
    }
    React.useEffect(()=>{
        setNewData(sliceIntoChunks(data, 16))
        
    },[data])

    React.useEffect(()=>{
        
    },[])
    

    const handleDownload = (html) => Doc.createPdf(html);
    return(
        <Container maxWidth="xxl" style={{overflow : 'auto',height: 550}}>
            <Toolbar component={Paper} style={{marginTop : 10,justifyContent : 'space-between'}}>
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
                <div>
                
                <TextField
                    variant="outlined"
                    label="Sheet start after"
                    size='small'
                    value={sheet_start}
                    onChange={({target : {value}})=>setSheetStart(value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                    style={{width: 250}}
                >
                    Generate Sheet
                </Button>
                </div>
                {/* <AdjustSheet stateChanger={setData} data={data}/> */}
                
                {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={addmoreRow}
                >
                    Add Row
                </Button> */}
                <div>
                <IconButton
                    onClick={() => {
                        if (pdfExportComponent.current) {
                          pdfExportComponent.current.save();
                        }
                      }}
                >
                    <PrintIcon />
                </IconButton>
                </div>
            </Toolbar>
            {loading ? <LinearProgress /> : ''}
    
            {/* <PdfContainer createPdf={handleDownload} >
            <React.Fragment>
                 
            </React.Fragment>
            </PdfContainer>  */}
            <PDFExport  keepTogether='.keep' paperSize="LEGAL" margin={{top: 10,right: 5,bottom: 0,left: 60}}  fileName='rd_sheet.pdf' landscape ref={pdfExportComponent}>
                <SavingsSheetPrint newData={newData} tableHead={tableHeads}  data={data} tableFoot={tableFoot} date={sendData}/>
            </PDFExport>
            

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
        </Container>
    )
}