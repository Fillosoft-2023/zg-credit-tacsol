import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core'
import React from 'react'
import Api from '../api/api';

function TransDates({ variant, error, onChange, value, name, helperText }) {
    const today = new Date()

    const [allowedDates, setAllowedDates] = React.useState([{date:today.setDate(today.getDate() - 1),color:'#f4acb7'},{date:new Date(),color:'#c4fff9'}])

    React.useEffect(() => {
        fetch(Api + 'transactionDates', {
            method: 'POST',
            body: JSON.stringify(),
        })
            .then(res => res.json())
            .then(res => setAllowedDates([...allowedDates,...res]))
            .catch(err => {
                console.log(err);
            });
    },[]);
    return (
        <>
            <FormControl variant="outlined" fullWidth>
                <InputLabel id="demo-simple-select-outlined-label"> Date</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    error={error}
                    value={value}
                    onChange={onChange}
                    name={name}
                    helperText={helperText}
                    
                >
                  
                    {
                        allowedDates.map((item, index) => 
                        <MenuItem key={index} value={new Date(item.date).toLocaleDateString('en-CA')} style={{backgroundColor:item.color}}>
                            {new Date(item.date).toLocaleDateString('en-CA')}
                        </MenuItem>)
                    }


                </Select>
            </FormControl>
        </>

    )
}

export default TransDates