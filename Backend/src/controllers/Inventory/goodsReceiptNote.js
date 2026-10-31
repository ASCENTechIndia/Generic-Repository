const oracledb = require("oracledb");
const { getConnection } = require("../../config/database");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");
const axios = require("axios");

const insertGoodsReceiptNote = async (req, res) => {
  let connection;

  try {
    const {
      in_userId,
      in_mode,
      in_UlbId,
      in_grnId,
      in_Vendorid,
      in_PONo,
      in_invoiceno,
      in_challandate,
      in_receivedbye,
      in_receiveddate,
      in_Receivingstore,
      in_status,
      in_grnItemStr,
      in_ipaddress,
      in_source,
    } = req.body;

    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN aoin_grn_ins(
        :in_userId,
        :in_mode,
        :in_UlbId,
        :in_grnId,
        :in_Vendorid,
        :in_PONo,
        :in_invoiceno,
        :in_challandate,
        :in_receivedbye,
        :in_receiveddate,
        :in_Receivingstore,
        :in_status,
        :in_grnItemStr,
        :in_ipaddress,
        :in_source,
        :out_ErrorCode,
        :Out_ErrorMsg
      ); END;`,
      {
        in_userId,
        in_mode,
        in_UlbId,
        in_grnId,
        in_Vendorid,
        in_PONo,
        in_invoiceno,
        in_challandate,
        in_receivedbye,
        in_receiveddate,
        in_Receivingstore,
        in_status,
        in_grnItemStr,
        in_ipaddress,
        in_source,
        out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        Out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      },
      { autoCommit: true },
    );

    res.status(200).json({
      success: true,
      errorCode: result.outBinds.out_ErrorCode,
      errorMessage: result.outBinds.Out_ErrorMsg,
    });
  } catch (error) {
    console.error("Error calling procedure:", error);
    res.status(500).json({
      success: false,
      message: "Error executing procedure.",
      error: error.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

const getGoodsReceiptNoteList = async (req, res) => {
  let connection;

  try {
    const { ulbId } = req.body;
    connection = await getConnection();

    const query = `
SELECT
  grn.num_grn_id            AS grn_id,
  grn.num_grn_ulbid         AS ulbid,
  grn.num_grn_vendorid      AS vendor_id,
  v.var_vendor_name         AS vendor_name,
  grn.num_grn_pono          AS pono,
  grn.var_grn_invoiceno     AS invoice_no,
  grn.dat_grn_challandate   AS challan_date,
  grn.num_grn_receivedby   AS received_by,
  grn.dat_grn_receiveddate AS received_date,
  grn.var_grn_receivingstore AS receiving_store,
  grn.var_grn_status        AS status,
  grn.dat_grn_insdt         AS created_date
FROM invmgmt.aoin_grn_mas grn
JOIN invmgmt.aoin_vendor_mas v
  ON v.num_vendor_id = grn.num_grn_vendorid
WHERE grn.num_grn_ulbid = :ulbid
ORDER BY grn.dat_grn_insdt DESC
    `;
    const result = await connection.execute(query, { ulbId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching goods receipt note list:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

const getGoodsReceiptNoteDetbyId = async (req, res) => {
  let connection;

  try {
    const { ulbId, grnId } = req.body;
    connection = await getConnection();

    const query = `
SELECT
  grn.num_grn_id            AS grn_id,
  grn.num_grn_ulbid         AS ulbid,
  grn.num_grn_vendorid      AS vendor_id,
  v.var_vendor_name         AS vendor_name,
  grn.num_grn_pono          AS pono,
  grn.var_grn_invoiceno     AS invoice_no,
  grn.dat_grn_challandate   AS challan_date,
  grn.num_grn_receivedby   AS received_by,
  grn.dat_grn_receiveddate AS received_date,
  grn.var_grn_receivingstore AS receiving_store,
  grn.var_grn_status        AS status,
  grn.dat_grn_insdt         AS created_date,
  i.num_grnitem_itemid        AS item_id,
  i.var_grnitem_name      AS item_name,
  i.num_grnitem_categoryid        AS category_id,
  i.num_grnitem_poqty    AS po_qty,
  i.num_grnitem_deliveredqty AS delivery_qty,
  i.num_grnitem_batchno AS batchno,
  i.dat_grnitem_expirydate AS expiry_date,
  i.var_grnitem_remarks AS remarks,
  c.var_category_name AS category_name
FROM invmgmt.aoin_grn_mas grn
JOIN invmgmt.aoin_vendor_mas v
  ON v.num_vendor_id = grn.num_grn_vendorid
INNER JOIN invmgmt.aoin_grnitem_det i
  ON grn.num_grn_id = i.num_grnitem_grnid
INNER JOIN invmgmt.aoin_category_mas c
 ON c.num_category_id = i.num_grnitem_categoryid
WHERE grn.num_grn_id = :grnId and grn.num_grn_ulbid = :ulbId
    `;
    const result = await connection.execute(query, { grnId, ulbId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching goods receipt note list:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

const formatDateDDMMYYYY = (date) => {
    if (!date) return "";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

const GRNChallanPdf = async (req, res) => {
  let connection;
  let browser;

  try {
    const { grnId, ulbid } = req.body;

    if (!grnId || !ulbid) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: grnId, ulbid",
      });
    }

    connection = await getConnection();

    /* ================= GRN QUERY ================= */
    const query = `
      SELECT DISTINCT
        grn.num_grn_id            AS grn_id,
        grn.num_grn_ulbid         AS ulbid,
        grn.num_grn_vendorid      AS vendor_id,

        v.var_vendor_name         AS vendor_name,
        v.var_vendor_address      AS vendor_add,
        v.num_vendor_phone        AS vendor_phone,
        v.var_vendor_email        AS vendor_email,

        grn.num_grn_pono          AS pono,
        grn.var_grn_invoiceno     AS invoice_no,
        grn.dat_grn_challandate   AS challan_date,
        grn.num_grn_receivedby    AS received_by,
        grn.dat_grn_receiveddate  AS received_date,
        grn.var_grn_receivingstore AS receiving_store,
        grn.var_grn_status        AS status,

        i.num_grnitem_itemid      AS item_id,
        i.var_grnitem_name        AS item_name,
        i.num_grnitem_categoryid  AS category_id,
        i.num_grnitem_poqty AS po_qty,
         i.num_grnitem_deliveredqty AS delivery_qty,
          i.num_grnitem_batchno AS batchno,
           i.dat_grnitem_expirydate AS expiry_date,

        im.var_item_code          AS item_code,
        im.var_item_unitmeasure   AS item_unit,
        im.var_item_manufacturer  AS item_manu,
        im.num_item_gstrate       AS item_gst,
        im.num_item_packsize AS pack_size,
         im.dat_item_insdt AS itm_manu_dt,

        c.var_category_name       AS category_name,
        rm.var_requisitionitem_insby AS requestor,
 pd.num_poitem_price AS itmPrice,
         (i.num_grnitem_deliveredqty * pd.num_poitem_price) AS itmTotal

      FROM inmgmt.aoin_grn_mas grn
      JOIN inmgmt.aoin_vendor_mas v
        ON v.num_vendor_id = grn.num_grn_vendorid
      JOIN inmgmt.aoin_grnitem_det i
        ON grn.num_grn_id = i.num_grnitem_grnid
      JOIN inmgmt.aoin_item_mas im
        ON im.num_item_id = i.num_grnitem_itemid
      JOIN inmgmt.aoin_category_mas c
        ON c.num_category_id = i.num_grnitem_categoryid
      JOIN inmgmt.aoin_requisitionitem_det rd
        ON rd.num_reqitemdet_itemid = i.num_grnitem_itemid
      JOIN inmgmt.aoin_requisitionitem_mas rm
        ON rm.num_requisitionitem_id = rd.num_reqitemdet_reqitemid
      JOIN inmgmt.aoin_poitem_det pd
      on pd.num_poitem_attributeid= i.num_grnitem_itemid
      join inmgmt.aoin_purchaseorder_mas pm
      on pm.num_purchaseorder_id= pd.num_poitem_purchaseorderid
      WHERE grn.num_grn_id = :grnId
        AND grn.num_grn_ulbid = :ulbid
        AND grn.var_grn_status = 'A'
    `;

    const result = await connection.execute(
      query,
      { grnId, ulbid },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "GRN not found" });
    }

    /* ================= FORMAT DATA ================= */
    const header = result.rows[0];
    console.log(header);
    const items = result.rows.map((r) => ({
      itemCode: r.ITEM_CODE,
      itemName: r.ITEM_NAME,
      unit: r.ITEM_UNIT,
      manufacturer: r.ITEM_MANU,
      qty: r.DELIVERY_QTY,
      rate: r.ITMPRICE,
      amount: r.ITMTOTAL,
      batchNumber: r.BATCHNO,
       gst: r.ITEM_GST,
      mfgDate: formatDateDDMMYYYY(r.ITM_MANU_DT),
      expDate: formatDateDDMMYYYY(r.EXPIRY_DATE)
    }));

    /* ================= CORPORATION LOGO ================= */
    let logo;
    let corporationName = "";
    let corporationEName = "";

    const corpQuery = `
      SELECT 
        var_corporation_name AS corporationName,
        blob_corporation_img AS corporationLogo,
        var_corporation_mname AS corporationEName
      FROM admins.aoma_corporation_mas 
      WHERE num_corporation_id = :ulbId
    `;

    const corpResult = await connection.execute(
      corpQuery,
      { ulbId: header.ULBID },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!corpResult.rows.length) {
      return res.status(404).json({ message: "Corporation details not found" });
    }

    const corp = corpResult.rows[0];
    corporationName = corp.CORPORATIONNAME || "";
    corporationEName = corp.CORPORATIONENAME || "";

    if (corp.CORPORATIONLOGO) {
      if (corp.CORPORATIONLOGO instanceof Buffer) {
        logo = `data:image/png;base64,${corp.CORPORATIONLOGO.toString("base64")}`;
      } else {
        const chunks = [];
        for await (const chunk of corp.CORPORATIONLOGO) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        logo = `data:image/png;base64,${buffer.toString("base64")}`;
      }
    }

    /* ================= LOAD HTML TEMPLATE ================= */
    const templatePath = path.join(
      __dirname,
      "../../templates/delivery-challan.html"
    );
    const templateSource = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(templateSource);
    //data to total
    const totalQty = items.reduce((s, i) => s + i.qty, 0);
    const totalAmount = items.reduce((s, i) => s + i.amount, 0);

    // const cgstPercent = 2.5;
    // const sgstPercent = 2.5;
    const gstPercent = items[0]?.gst || 0;
    const cgstPercent = gstPercent / 2;
    const sgstPercent = gstPercent / 2;
    const cgstAmount = (totalAmount * cgstPercent) / 100;
    const sgstAmount = (totalAmount * sgstPercent) / 100;
    const grandTotal = totalAmount + cgstAmount + sgstAmount;
    const taxable = cgstAmount + sgstAmount;
    const html = template({
      logo,
      corporationName,
      corporationEName,
      challanNo: header.GRN_ID,
      challanDate: header.CHALLAN_DATE,
      poNo: header.PONO,
      vendorName: header.VENDOR_NAME,
      vendorAddress: header.VENDOR_ADD,
      vendorEmail: header.VENDOR_EMAIL,
      vendorPhone: header.VENDOR_PHONE,
      items,
      totalQty,
      totalAmount,
      cgstPercent,
      sgstPercent,
      cgstAmount,
      sgstAmount,
      taxable,
      grandTotal,
      amountInWords: "ONLY",
      currentDate: new Date().toLocaleDateString("en-GB"),
    });

    /* ================= GENERATE PDF ================= */
    const chromePath = path.resolve(
      __dirname,
      "../../../node_modules/puppeteer/.cache/puppeteer/chrome/win64-135.0.7049.84/chrome-win64/chrome.exe"
    );

    browser = await puppeteer.launch({
      headless: true,
      executablePath: chromePath,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 0 });

    // const pdfBuffer = await page.pdf({
    //   format: "A4",
    //   printBackground: true,
    // });

    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,   
      printBackground: true,
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm",
      },
    });

    await page.close();
    await browser.close();

    /* ================= RESPONSE ================= */
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=GRN_Challan_${header.GRN_ID}.pdf`
    );

    return res.end(pdfBuffer);
  } catch (err) {
    console.error("❌ GRN Challan PDF Error:", err);
    res.status(500).json({ message: "PDF generation failed" });
  } finally {
    if (browser) await browser.close();
    if (connection) await connection.close();
  }
};

module.exports = {
  insertGoodsReceiptNote, getGoodsReceiptNoteList, getGoodsReceiptNoteDetbyId, GRNChallanPdf
};