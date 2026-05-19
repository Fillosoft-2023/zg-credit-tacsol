import React from 'react'
import {
    Container,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Toolbar,
    TextField,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Checkbox
} from '@material-ui/core'



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
const tableHeads = ["Add","Name","MCB No","Completed Inst","Type","Prin O/S","Int O/S","Disb Amt","Inst Amt","",]
const subHeads = ["","","","","","","","","prin","int",]


export default function AdjustSheet({stateChanger,data,tableFoot, ...rest}){
    const [open, setOpen] = React.useState(false)
    const [datas, setDatas] = React.useState([])
    
    const handleClose = ()=>{
        setOpen(false)
        setDatas([])
    }
    const handleClick = ()=>{
        setOpen(true)
    }

    const handleSearch = (e)=>{
        // send({
        //     press : 'search_by_ac',
        //     search : e.target.value
        // })
        // .then((res)=>{
        //     // console.log(res)
        //     setDatas(res)
        // })
    }
    const handleCheckClicked = (item)=>{
        stateChanger(
            [...data,item]
            )
        alert("Add successfull")
    }
    return(
        <Container>
            <Button
                variant="contained"
                color="primary"
                // onClick={setAnchorE1(true)}
                style={{marginLeft : 5}}
                onClick={handleClick}
            >
                    Adjust Sheet
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="xl"
                fullWidth
            >
                <DialogTitle>
                    <Toolbar style={{justifyContent : 'space-between'}}>
                        <Typography>Add another member</Typography>
                        <TextField
                            label="Search by ac no or name"
                            variant="outlined"
                            onChange={handleSearch}
                            size="small"
                        />
                        <Button onClick={handleClose}>
                            close
                        </Button>
                    </Toolbar>
                </DialogTitle>
                <DialogContent>
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
                           datas.map((item,index)=>{
                               return(
                                   
                                <TableRow key={index}>
                                    <TableCell ><Button onClick={()=>handleCheckClicked(item)}>Add</Button></TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.acno}</TableCell>
                                    <TableCell>{(item.inst_no - 1)}</TableCell>
                                    <TableCell>{item.ln_tpe}</TableCell>
                                    <TableCell>{Number(item.ln_amnt) - Number(item.rec_prncpl)}</TableCell>
                                    <TableCell>{Number(item.intrst_amnt) - Number(item.rec_intr)}</TableCell>
                                    <TableCell>{item.ln_amnt}</TableCell>
                                    <TableCell>{item.emi_princ}</TableCell>
                                    <TableCell>{item.emi_intr}</TableCell>
                                    {
                                        [...Array(subHeads.length - 10)].map((item,index)=><TableCell key={index}></TableCell>)
                                    }
                                </TableRow>
                               )
                           }) 
                        }
                        
                    </TableBody>
                
            </Table>
            </TableContainer>

                </DialogContent>
            </Dialog>
        </Container>
    )
}