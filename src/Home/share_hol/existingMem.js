import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
 
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Divider from "@material-ui/core/Divider";
import DeleteAc from './del_ac'
import {useHistory} from 'react-router-dom'

import Transac from './share_transc'
import GroupIcon from '@material-ui/icons/Group';
import RefreshIcon from '@material-ui/icons/Refresh';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));



export default function ExistingMem() {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  const history = useHistory();
  const [isrefresh, setIsRefres] = React.useState(false)
  React.useEffect(()=>{
      // sendAsync('allShare').then((res)=> {
      //     setUserData(res)
      //     setIsRefres(false)
      // })
  },[isrefresh])

  
 const handleSubmit = (value)=> {
      
      
        history.push('/Home/Share_reg/test', {"values" : value, refres : Math.random()})
      
      
 }
    
 const generate = ()=>   userData.map((value,key) =>{
        const img = Buffer.from(value.img).toString('base64')
        const data = img
        const Example = ({data} ) => <img style={{width: 50}} src={`data:image/jpeg;base64,${data}`} />
        return (
            
            <ListItem button key={key.id} >
                <ListItemAvatar>
                <Avatar>
                
                <Example data={data} />
                </Avatar>
                </ListItemAvatar>
                <ListItemText
                primary={value.name}
                secondary={secondary ? 'Secondary text' : null}
                />
                <ListItemSecondaryAction style={{display: 'flex', justifyContent: 'center',alignItems: 'center'}}>
                
                <Transac callback={value.id} />
                <DeleteAc callback={value} />
                
                
                <IconButton onClick={handleSubmit(value)} edge="end" aria-label="delete">
                    <NavigateNextIcon />
                </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            )});
  
  return (
    <div className={classes.root}>
    
    <Divider />
        <Grid item xs={12} md={12}>
          
          <div className={classes.demo}>
            <List dense={dense}>
            <ListItem>
                <GroupIcon style={{color: '#808080'}}/>
                <Typography style={{marginLeft: 5,color: '#808080'}}>{userData.length}</Typography>
                <IconButton size="small" style={{marginLeft: 10}} onClick={()=>setIsRefres(true)}>
                    <RefreshIcon />
                </IconButton>
                
            </ListItem>
            <Divider />
              { Array.isArray(userData) ? (
                generate()
              ) : (
                <div></div>
              )
              }
                
            </List>
          </div>
        </Grid>
        
    </div>
  );
}
