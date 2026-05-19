import React from 'react'
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
    Paper
} from '@material-ui/core'
import { useHistory } from 'react-router'
import Api from '../../api/api'
const menus = [
    {
        name: 'Daily',
        value: 1
    },
    {
        name: 'Weekly',
        value: 7
    },
    {
        name: 'Fortnightly',
        value: 14
    },
    {
        name: 'Monthly',
        value: 30
    }
]
const week = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
export default function LoanSheetHome(prop) {
    const [anchorE1, setAnchorE1] = React.useState(null)
    const menuOpen = Boolean(anchorE1)
    const [anchorE2, setAnchorE2] = React.useState(null)
    const nextMenu = Boolean(anchorE2)
    const history = useHistory()
    const [sendData, setSendData] = React.useState({ frequency: {}, day: null })
    const [err, setErr] = React.useState({})
    const [routeHandler, setRouteHandler] = React.useState(null)
    const handlemenuClose = () => {
        setAnchorE1(null)
        setAnchorE2(null)
        setRouteHandler(null)
    }
    const handlemenueOpen = (event) => {
        setAnchorE1(event.currentTarget)
    }
    const handleNextMenu = (item, target) => {
        setAnchorE2(target.currentTarget)
        setSendData({
            ...sendData,
            frequency: item
        })
    }
    const [agent, setAgent] = React.useState([])
    React.useEffect(() => {
        fetch(Api + 'agent')
            .then(res => res.json())
            .then(res => setAgent(res))
    }, [])
    const handleChange = (e) => {
        setSendData({
            ...sendData,
            [e.target.name]: e.target.value
        })
    }
    const validate = () => {
        let valid = true
        let err = {}
        if (!sendData.date) {
            valid = false
            err['date'] = true
        }
        if (!sendData.agent) {
            valid = false
            err['agent'] = true
        }
        // if (!sendData.from) {
        //     valid = false
        //     err['from'] = true
        // }
        // if (!sendData.to) {
        //     valid = false
        //     err['to'] = true
        // }
        setErr(err)
        return valid
    }
    const finalSubmit = () => {
        if (validate()) {
            if (routeHandler != null) {
                history.push('/Home/LoanSheetView', sendData)
            } else {
                history.push('/Home/LoanSheet', sendData)
            }
        }
    }
    return (
        <Container
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10
            }}
            maxWidth="xxl"
        >
            <Toolbar component={Paper} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlemenueOpen}
                >
                    Generate Sheet
                </Button>
            </Toolbar>
            <div>
            </div>
            <Menu
                open={menuOpen}
                anchorEl={anchorE1}
                onClose={handlemenuClose}
            >
                {
                    menus.map(item => <MenuItem key={item.name} onClick={(target) => handleNextMenu(item, target)} >{item.name}</MenuItem>)
                }
            </Menu>
            <Menu
                open={nextMenu}
                anchorEl={anchorE2}
                style={{
                    width: 540,

                }}
                aria-haspopup="true"
                aria-expanded={nextMenu ? 'true' : undefined}
                onClose={handlemenuClose}
            >
                <div style={{ padding: 30, }}>

                    <div style={{ marginBottom: 10 }}>
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
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={sendData.date}
                            name="date"
                            onChange={handleChange}
                            error={err.date}

                        />
                    </div>

                    <FormControl variant="outlined" fullWidth>
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
                                agent.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item}>{item.ag_name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                    {
                        sendData.frequency.value === 7 || sendData.frequency.value === 14 ? (
                            <FormControl variant="outlined" style={{ marginTop: 10 }} fullWidth>
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
                                        week.map((item, index) => {
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
                        style={{ marginTop: 10 }}
                        onClick={finalSubmit}
                    >
                        Generate Now
                    </Button>
                </div>
            </Menu>
        </Container>
    )
}