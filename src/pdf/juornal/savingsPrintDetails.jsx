import React from 'react'

import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import json from './../../appInfo.json'

export default function MyDocument({ callback, DateDiffer, agentName }) {

    const appDet = json.Appinfo
    const [rows, setRows] = React.useState(callback)
    const date = DateDiffer;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let sum = 0
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View>
                    <View style={styles.head}>
                        <Text style={styles.headText}>{appDet.name}</Text>
                        <Text style={styles.secText}>{appDet.Reg_no}</Text>
                        <Text style={{ fontSize: 10, textAlign: 'center' }}>{appDet.Place}</Text>
                        <View style={styles.headDet}>
                            <Text style={{ fontSize: 10, textAlign: 'center' }}>Employee Savings Collection Details</Text>
                        </View>
                    </View>
                    <View style={styles.body}>
                        <Text style={styles.bodyText}>Date: {new Date(date.to).toLocaleDateString('en-US', options)} to {new Date(date.from).toLocaleDateString('en-US', options)}</Text>
                        <Text style={styles.bodyText}>Agent: {agentName}</Text>
                        <View style={styles.container}>
                            <View style={styles.Table}>
                                <View style={styles.TableRow}>
                                    <View style={{ width: '7%', fontSize: 10 }}><Text>Sl No.</Text></View>
                                    <View style={{ width: '21%', fontSize: 10 }}><Text>Name</Text></View>
                                    <View style={{ width: '14%', fontSize: 10 }}><Text>Reg No.</Text></View>
                                    <View style={{ width: '14%', fontSize: 10 }}><Text>A/C No.</Text></View>
                                    <View style={{ width: '14%', fontSize: 10 }}><Text>Date</Text></View>
                                    <View style={{ width: '14%', fontSize: 10 }}><Text>Amount</Text></View>
                                    <View style={{ width: '14%', fontSize: 10 }}><Text>Total</Text></View>
                                </View>
                                {
                                    rows.map((item, index) => {
                                        sum += Number(item.dep)
                                        return (
                                            <View style={styles.TableRow}>
                                                <View style={{ width: '7%', fontSize: 10 }}><Text>{index + 1}.</Text></View>
                                                <View style={{ width: '21%', fontSize: 10 }}><Text>{item.name}</Text></View>
                                                <View style={{ width: '14%', fontSize: 10 }}><Text>{item.acno}</Text></View>
                                                <View style={{ width: '14%', fontSize: 10 }}><Text>{!item.sav_no ? item.rd_no : item.sav_no}</Text></View>
                                                <View style={{ width: '14%', fontSize: 10 }}><Text>{item.date}</Text></View>
                                                <View style={{ width: '14%', fontSize: 10 }}><Text>Rs.{item.dep}</Text></View>
                                                <View style={{ width: '14%', fontSize: 10 }}><Text>Rs.{sum}</Text></View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <View style={styles.footer}>
                            <Text style={{ textAlign: 'left', fontSize: 10 }}>President Signature</Text>
                            <Text style={{ textAlign: 'right', fontSize: 10 }}>Secretary Signature</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10
    },
    head: {
        justifyContent: 'center',

        borderBottom: '1 solid #000',
        padding: 20,
        width: '100%'
    },
    headText: {
        fontSize: 12,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    secText: {
        fontSize: 9,
        textAlign: 'center'
    },

    bodyText: {
        fontSize: 10,
        textAlign: 'right',
    },
    body: {
        padding: 10,
    },
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 10
    },


    footer: {
        display: 'flex',
        width: '100%',
        marginTop: 30,
        padding: 20,

    },
    footerText: {
        fontSize: 10,

    },
    mainHead: {
        width: '100%',
        borderBottom: '1 solid #000',
        padding: 10,
    },
    Table: {
        width: '100%',

        marginTop: 30,
        border: '1 solid #0000'
    },
    TableRow: {
        width: '100%',
        flexDirection: 'row',
        padding: 5,
        borderBottom: '1 solid #000',
        paddingBottom: 10
    },
    TableColumn: {
        width: '17%',
        fontSize: 10,
    },
    TableColumnLg: {
        width: '32%',
        fontSize: 10
    }

})