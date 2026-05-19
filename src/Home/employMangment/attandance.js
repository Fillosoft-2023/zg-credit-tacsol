import { Box, CircularProgress, Container, Dialog, Divider, IconButton, LinearProgress, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from "@material-ui/core";
import { ArrowBack, Delete, Image, MoreHoriz, Search, ThumbUp } from "@material-ui/icons";
import { useEffect, useState } from "react";
import Api from "../../api/api";
import SnakBar from "../../consts/message";



export default function Attandance() {
    const [data, setData] = useState([])
    const [date, setDate] = useState(new Date())
    const [loading, setLoading] = useState(false)
    const [menu, setMenu] = useState(null)
    const menu_open = Boolean(menu)
    const [dialog, setDialog] = useState(false)
    const [selected, setSelected] = useState({})
    const [massg, setMassg] = useState({})
    const [app_loading, setAppLoading] = useState(false)
    const [refresh, setRefresh] = useState(Math.random())
    const [del_loading, setDelLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        fetch(Api + 'attandance', {
            method: 'POST',
            body: JSON.stringify({
                date: date
            })
        })
            .then(res => res.json())
            .then(res => {
                setData(res)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }, [refresh])

    const onApprove = () => {
        setAppLoading(true)
        fetch(Api + 'onAttanedApprove', {
            method: 'POST',
            body: JSON.stringify({
                id: selected.id
            })
        })
            .then(res => res.json())
            .then(res => {
                setAppLoading(false)
                setRefresh(Math.random())
                setMassg({
                    open: true,
                    severity: res.code === 200 ? 'success' : 'error',
                    massg: res.massg
                })
            })
            .catch(err => {
                setAppLoading(false)
                setMassg({
                    open: true,
                    severity: 'error',
                    massg: "Faild to connect to the server"
                })
                console.log(err)
            })
    }
    const onDeleteAttandance = () => {
        setDelLoading(true)
        fetch(Api + 'onDeleteAttandance', {
            method: 'POST',
            body: JSON.stringify({
                id: selected.id
            })
        })
            .then(res => res.json())
            .then(res => {
                setDelLoading(false)
                setRefresh(Math.random())
                setMassg({
                    open: true,
                    severity: res.code === 200 ? 'success' : 'error',
                    massg: res.massg
                })
            })
            .catch(err => {
                setDelLoading(false)
                setMassg({
                    open: true,
                    severity: 'error',
                    massg: "Faild to connect to the server"
                })
                console.log(err)
            })
    }

    return (
        <Container>
            <Container component={Paper} style={{ minHeight: '82vh' }}>


                <Box>
                    <Toolbar style={{ justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex' }}>
                            <ArrowBack />

                        </div>
                        <Typography variant="h6" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                            Attandance Record
                        </Typography>
                        <div style={{ display: 'flex' }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <IconButton onClick={() => setRefresh(Math.random())}>
                                <Search color="primary" />
                            </IconButton>
                        </div>
                    </Toolbar>
                    <Divider />
                    <Box>
                        {loading ? <LinearProgress /> : ''}
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableCell>Attandance ID</TableCell>
                                    <TableCell>Employee ID</TableCell>
                                    <TableCell>Date and Time</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>More</TableCell>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.map((item, index) =>
                                            <TableRow key={index}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.em_id}</TableCell>
                                                <TableCell>{item.date_time}</TableCell>
                                                <TableCell>{item.status}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={(e) => { setMenu(e.currentTarget); setSelected(item) }}>
                                                        <MoreHoriz />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Container>

            <Menu
                open={menu_open}
                anchorEl={menu}
                onClose={() => setMenu(null)}
            >
                <MenuItem onClick={() => { setDialog(true); setMenu(null) }}>
                    <Image />
                    Check Selfie
                </MenuItem>
                <MenuItem onClick={onApprove}>
                    {app_loading ? <CircularProgress size={16} /> : <ThumbUp />}

                    Approve Employee
                </MenuItem>
                <MenuItem onClick={onDeleteAttandance}>
                    {del_loading ? <CircularProgress size={16} /> : <Delete />}

                    Delete Request
                </MenuItem>
            </Menu>
            <Dialog
                open={dialog}
                onClose={() => setDialog(false)}
            >
                <img src={"https://sg1.tacsol.in/sg_main/attandance/" + selected.img} style={{ width: '100%', height: 300 }} />
            </Dialog>

            <SnakBar massg={massg} setMassg={setMassg} />
        </Container>
    )
}