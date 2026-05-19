import React from 'react'

import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import json from './../../appInfo.json'

export default function LoanSheetDocument(props){
    const appDet = json.Appinfo
    const[rows,setRows] = React.useState(props.callback)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    console.log(rows)
    return (
        <Document>
            <Page size="LEGAL" orientation="landscape" style={styles.page} >
            <View>
                <View style={{flexDirection : 'row'}}>
                <View style={styles.head}>
                    <Text style={{fontSize: 10,textAlign: 'left'}}>GOVT. OF ASSAM</Text>
                    <Text style={styles.headText}>{appDet.name}</Text>
                    <Text style={styles.secText}>{appDet.Reg_no}</Text>
                    <Text style={{fontSize: 10,textAlign: 'left'}}>{appDet.Place}</Text>
                    <View style={styles.headDet}>
                    <Text style={{fontSize: 10,textAlign: 'left'}}>Loan Sheet</Text>
                    </View>
                </View>
                <View style={styles.head}>
                    <Text style={{fontSize: 10,textAlign: 'left'}}>Sheet Type: Loan</Text>
                    <Text style={{fontSize: 10,textAlign: 'left'}}>Frequency : {rows.date.frequency.value == 1 ? 'Daily' : rows.date.frequency.value == 7 ? 'Weekly' : rows.date.frequency.value == 14 ? 'Fortnightly' : 'Monthly' }</Text>
                    <Text style={{fontSize: 10,textAlign: 'left'}}>Collector : {rows.date.agent.ag_name}</Text>
                    <Text style={{fontSize: 10,textAlign: 'left'}}>Date: {new Date(rows.date.from).toLocaleDateString('en-US',options)} to {new Date(rows.date.to).toLocaleDateString('en-US',options)}</Text>
                    
                    <Text style={{fontSize: 10,textAlign: 'left'}}>Loan Sheet</Text>
                   
                </View>
                </View>
            </View>
            <View style={{display : 'table'}}>
                <View style={styles.tableHead}>
                {
                rows.tableHead.map((item,index)=><Text style={styles.tableheadtext} key={index}>{item}</Text>)
                }
                </View>
                <View style={styles.tableHead}>
                <View style={{flexDirection: 'row'}}>
                {
                            [...Array(8)].map((item,index)=><Text style={styles.tableheadtext} key={index}>{item}</Text>)
                }
                {
                rows.tableSubHead.map((item,index)=>
                   
                        
                        <Text style={styles.tableheadtext} key={index}>{item}</Text>
                   
                )
                }
                 </View>
                </View>
            </View>
            </Page>

        </Document>
    )
}

const styles = StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: '#fff'
    },
    head : {
        justifyContent: 'flex-start',
        textAlign : 'left',
        borderBottom: '1 solid #000',
        padding: 20,
        width: '50%'
    },
    headText : {
        fontSize: 12,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    secText : {
        fontSize: 9,
        textAlign: 'left'
    },
    tableHead : {
        // flexDirection :'row',
        width: '100%',
        display : 'flex'
    },
    tableheadtext : {
        fontSize: 12,
        padding: 2,
        display : ''
    }
   
   
    
})