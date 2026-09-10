import React from "react";
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "NotoSansDevanagari",
  src: "/fonts/NotoSansDevanagari-Regular.ttf",
});
Font.register({
  family: "NotoSansDevanagari",
  src: "/fonts/NotoSansDevanagari-Bold.ttf",
  fontWeight: "bold", // important
});
// Styles
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12,   fontFamily: "NotoSansDevanagari", },
  section: { marginBottom: 10 },
  heading: { fontSize: 16, marginBottom: 10, textAlign: "center" },
   sectionHeading: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
    textDecoration: "underline",
    textAlign: "center",
      fontFamily: "NotoSansDevanagari",
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
   receiptBox: {
    border: "1pt solid #000",
    borderRadius: 5,
    padding: 15,
    marginTop: 10,
  },

  title: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },

  divider: {
    borderBottom: "1pt dashed #000",
    marginVertical: 8,
  },

 item: {
  flexDirection: "row",
  marginBottom: 5,
},

label: {
  fontWeight: "bold",
},

label1: {
 fontSize: 12,
},

value: {
  flex: 1,          // takes remaining space
  marginLeft: 5,    // small gap after label
},

  footer: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 10,
  },
});

const TokenReceipt = ({ receipt, companyName }) => {
  // Map slot ID to text
  // const slotText = receipt.slotId === 1 ? "Morning" : receipt.slotId === 2 ? "Evening" : "N/A";

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        {/* Company Name */}
        <Text style={styles.heading}>{companyName}</Text>
        <Text style={styles.sectionHeading}>Token Receipt</Text>

        {/* Token No and Slot */}
        <View style={styles.receiptBox}>
          <View style={styles.item}>
            <Text style={styles.label1}>Token No:</Text>
            <Text style={styles.value}>{receipt.tokenNo}</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.label1}>Slot:</Text>
            <Text style={styles.value}>{receipt.slotId}</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.label1}>Slot Start Time:</Text>
            <Text style={styles.value}>{receipt.startTime}</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.label1}>Slot End Time:</Text>
            <Text style={styles.value}>{receipt.endTime}</Text>
          </View>

          <View style={styles.divider} />

          {/* Patient Details */}
          <Text style={styles.sectionHeading}>Patient Details</Text>
          <View style={styles.item}>
            <Text style={styles.label1}>Patient ID:</Text>
            <Text style={styles.value}>{receipt.patientId}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label1}>Patient Card No:</Text>
            <Text style={styles.value}>{receipt.patientCard}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label1}>Name:</Text>
            <Text style={styles.value}>{receipt.patientName}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label1}>Date:</Text>
            <Text style={styles.value}>{receipt.date}</Text>
          </View>

          <View style={styles.divider} />

          {/* Doctor & Department */}
          <Text style={styles.sectionHeading}>Doctor & Department</Text>
          <View style={styles.item}>
            <Text style={styles.label1}>Doctor Name:</Text>
            <Text style={styles.value}>{receipt.doctorName}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label1}>Department Name:</Text>
            <Text style={styles.value}>{receipt.department}</Text>
          </View>

          {/* <View style={styles.divider} /> */}
          {/* <Text style={styles.footer}>Please arrive 10 mins early. Thank you!</Text> */}
        </View>
      </Page>
    </Document>
  );
};


export default TokenReceipt;
