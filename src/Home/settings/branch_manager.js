import { Button, CircularProgress, Container, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from "@material-ui/core";
import { Add, LockOpen, MoreHoriz, SyncDisabled } from "@material-ui/icons";
import { useEffect, useState } from "react";
import Api from "../../api/api";
import { Link, useHistory } from "react-router-dom";
import SnakBar from "../../consts/message";



export default function BranchManager(){
    const [branch, setBranch] = useState([])
    const [menu,setMenu] = useState(null)
    const menuView = Boolean(menu)
    const history = useHistory()
    const [selected, setSelected] = useState({})
    const [massg, setMassg] = useState({})
    const [updateLoading, setUpdateLoading] = useState(false)
    const [refresh, setRefresh] = useState(Math.random())
    useEffect(()=>{
        fetch(Api+'all_branch')
        .then(res=>res.json())
        .then(res=>setBranch(res))
        .catch(err=>{
           console.log(err)
        })
    },[refresh])

    const handleMore = (e,item)=>{
        setSelected(item)
        setMenu(e.currentTarget)
    }

    const handleDisable = ()=>{
        console.log(localStorage.getItem('branch_code'))
        if(localStorage.getItem('branch_code') === "0"){
            setUpdateLoading(true)
            fetch(Api+'disableBranch',{
                method : 'POST',
                body : JSON.stringify({id : selected.id, status : selected.status === 'active' ? 'deactive' : 'active'})
            })
            .then(res=>res.json())
            .then(res=>{
                setRefresh(Math.random())
                setMenu(null)
                setUpdateLoading(false)
                setMassg({
                    open: true,
                    severity : 'success',
                    massg: 'Branch Disabled'
                })
            })
            .catch(err=>{
                setMassg({
                    open: true,
                    severity : 'error',
                    massg: 'Faild to connect to the server'
                })
            })
        }else{
            setMassg({
                open: true,
                severity : 'error',
                massg: "You don't have permision to deactive branch"
            })
        }
    }

    const handleModify = ()=>{
        const branc_code = localStorage.getItem('branch_code')
        if(branc_code === "0"){
            history.push('/Home/settings/EditBranch',{selected})
        }else{
            setMassg({
                open: true,
                severity : 'error',
                massg: "You don't have permision to modify branch"
            })
        }
    }

    return(
        <Container>
            <Paper variant="outlined">
            <Toolbar style={{justifyContent : 'space-between',padding: 10}}>
                <Typography>Branch Manager</Typography>
                <div style={{display : 'flex'}}>
                    <Link to={'/Home/settings/AddBranch'} style={{textDecoration : 'none'}}>
                    <Button disableElevation variant="contained" color="primary" size="small">
                        Add New Branch
                        <Add />
                    </Button>
                    </Link>
                </div>
            </Toolbar>
            <Divider />
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableCell>SL NO</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Branch Code</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>More</TableCell>
                    </TableHead>
                    <TableBody>
                    {
                        branch.map((item,index)=>
                            <TableRow key={index}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.branch_code}</TableCell>
                                <TableCell>{item.address}</TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e)=>handleMore(e,item)}>
                                        <MoreHoriz />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )
                    }
                    </TableBody>
                </Table>
            </TableContainer>
            </Paper>
            <Menu
                anchorEl={menu}
                open={menuView}
                onClose={()=>setMenu(null)}
            >
            <List>
                <ListItem onClick={()=>handleDisable()}>
                    <ListItemIcon>
                        {updateLoading ? <CircularProgress size={16} /> : <SyncDisabled />}
                    </ListItemIcon>
                    <ListItemText
                        primary={selected.status === 'active' ? 'Deactive Branch' : 'Reactive Branch'}

                    />

                </ListItem>
                <Divider />
                <ListItem onClick={()=>handleModify()}>
                    <ListItemIcon>
                        <LockOpen />
                    </ListItemIcon>
                    <ListItemText
                        primary="Modify Branch Information"

                    />
                </ListItem>
                
            </List>

            </Menu>

            <SnakBar massg={massg} setMassg={setMassg} />
        </Container>
    )
}