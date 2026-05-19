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
const tableHeads = ["Add","Name","Ac No","Dep Amnt","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15"]

export default function AdjustSheet({stateChanger,data, ...rest}){
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
        //     press : 'search_by_ac_savings',
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
                    <TableBody>
                        
                        {
                           datas.map((item,index)=>{
                               return(
                                   
                                <TableRow key={index}>
                                     <TableCell ><Button onClick={()=>handleCheckClicked(item)}>Add</Button></TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.acno}</TableCell>
                                    <TableCell>{item.dep_amount}</TableCell>
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


                </DialogContent>
            </Dialog>
        </Container>
    )
}