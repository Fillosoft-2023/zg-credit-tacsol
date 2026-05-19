const DateHandler = (date)=>{
    let returns = null;
    
    let prop_date = new Date(date)
    var dd = String(prop_date.getDate()).padStart(2, '0');
    var mm = String(prop_date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = prop_date.getFullYear();
    if(date === null){
        returns = null
    }else {
        
        returns = dd + '/' + mm + '/' + yyyy
    }
    return returns
}

export default DateHandler