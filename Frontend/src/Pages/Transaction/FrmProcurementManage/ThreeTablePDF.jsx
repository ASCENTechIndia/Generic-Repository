import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

Font.register({
  family: "NotoMarathi",
  src: "/fonts/NotoSansDevanagari-Regular.ttf",
});

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 8, fontFamily: "NotoMarathi" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  logo: {
    width: 60,
    height: 60,
  },
  titleSection: {
    flex: 1,
    marginLeft: 10,
    textAlign: "center",
  },
  ulbName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  reportTitle: {
    fontSize: 14,
    color: "black",
    marginTop: 5,
  },

  tablesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 10,
  },

  tableContainer: {
    marginBottom: 15,
    flex: 1,
  },
  sideBySideTableContainer: {
    width: "48%",
  },
  tableTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #000",
    minHeight: 20,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#eee",
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
  },

  twoColumnCell: {
    flex: 1,
    padding: 5,
    textAlign: "center",
    width: "50%",
  },

  threeColumnCell: {
    flex: 1,
    padding: 5,
    textAlign: "center",
    width: "33.33%",
  },
});

const TableWithTitle = ({
  tableName,
  tableHeader,
  tableData,
  columnCount = 2,
  isSideBySide = false,
}) => (
  <View
    style={[
      styles.tableContainer,
      isSideBySide && styles.sideBySideTableContainer,
    ]}
  >
    {/* Table Name */}
    {tableName && <Text style={styles.tableTitle}>{tableName}</Text>}
    {/* Table */}
    <View style={styles.table}>
      {/* Table Header */}
      <View style={[styles.tableRow, styles.tableHeader]}>
        {tableHeader.map((head, i) => (
          <Text
            key={i}
            style={
              columnCount === 2 ? styles.twoColumnCell : styles.threeColumnCell
            }
          >
            {head}
          </Text>
        ))}
      </View>

      {/* Table Rows */}
      {tableData.map((row, i) => (
        <View key={i} style={styles.tableRow} wrap={false}>
          {row.map((cell, j) => (
            <Text
              key={j}
              style={
                columnCount === 2
                  ? styles.twoColumnCell
                  : styles.threeColumnCell
              }
            >
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  </View>
);

const ThreeTablePDF = ({
  table1Name = "Table 1",
  table1Header,
  table1Data,
  table2Name = "Table 2",
  table2Header,
  table2Data,
  table3Name = "Table 3",
  table3Header,
  table3Data,
  logoUrl,
  ulbName,
  reportTitle = "Three Table Report",
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section - Same as original */}
      <View style={styles.header}>
        {/* Logo */}
        {logoUrl ? (
          <Image style={styles.logo} src={logoUrl} />
        ) : (
          <Image
            style={styles.logo}
            src="https://via.placeholder.com/60?text=Logo"
          />
        )}
        {/* ULB Name + Report Title */}
        <View style={styles.titleSection}>
          <Text style={styles.ulbName}>{ulbName}</Text>
          <Text style={styles.reportTitle}>{reportTitle}</Text>
        </View>
        {/* Right side empty (for balance spacing) */}
        <View style={{ width: 60 }} />
      </View>

      {/* First two tables side by side */}
      <View style={styles.tablesRow}>
        {/* Table 1 - 2 columns */}
        <TableWithTitle
          tableName={table1Name}
          tableHeader={table1Header}
          tableData={table1Data}
          columnCount={2}
          isSideBySide={true}
        />

        {/* Table 2 - 2 columns */}
        <TableWithTitle
          tableName={table2Name}
          tableHeader={table2Header}
          tableData={table2Data}
          columnCount={2}
          isSideBySide={true}
        />
      </View>

      {/* Third table - full width with 3 columns */}
      <TableWithTitle
        tableName={table3Name}
        tableHeader={table3Header}
        tableData={table3Data}
        columnCount={3}
        isSideBySide={false}
      />
    </Page>
  </Document>
);

// Main PDF Download Component
const ThreeTablePdf = ({
  table1Name = "Table 1",
  table1Header,
  table1Data,
  table2Name = "Table 2",
  table2Header,
  table2Data,
  table3Name = "Table 3",
  table3Header,
  table3Data,
  fileName = "three-table-report.pdf",
  ulbName,
  logoUrl,
  reportTitle,
}) => (
  <PDFDownloadLink
    document={
      <ThreeTablePDF
        table1Name={table1Name}
        table1Header={table1Header}
        table1Data={table1Data}
        table2Name={table2Name}
        table2Header={table2Header}
        table2Data={table2Data}
        table3Name={table3Name}
        table3Header={table3Header}
        table3Data={table3Data}
        ulbName={ulbName}
        logoUrl={logoUrl}
        reportTitle={reportTitle}
      />
    }
    fileName={fileName}
  >
    {({ loading }) => (
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md hover:cursor-pointer hover:cursor-pointer">
        {loading ? "Generating PDF..." : "Print PO"}
      </button>
    )}
  </PDFDownloadLink>
);

export default ThreeTablePdf;
