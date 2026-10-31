const oracledb = require("oracledb");
const { getConnection } = require("../../config/database.js");

const purchaseOrderIns = async (req, res) => {
  const {
    in_userId,
    in_mode,
    in_ulbId,
    in_porderId,          // ✅ corrected name
    in_vendorId,
    in_poDate,
    in_expDeliveryDt,
    in_status,
    in_totalAmount,
    in_approvedBy,
    in_approvedDt,
    In_poitemstr, 
    In_deliaddres,
    In_addnotes  ,        // ✅ new param
    in_ipaddress,
    in_source
  } = req.body;

  // ✅ Basic validation
  if (!in_userId || !in_mode || !in_ulbId || !in_vendorId || !In_poitemstr) {
    return res.status(400).json({
      error:
        "Missing required fields (userId, mode, ulbId, vendorId, poitemstr)",
    });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN aoin_PurchaseOrder_ins(
          :in_userId,
          :in_mode,
          :in_ulbId,
          :in_porderId,
          :in_vendorId,
          :in_poDate,
          :in_expDeliveryDt,
          :in_status,
          :in_totalAmount,
          :in_approvedBy,
          :in_approvedDt,
          :In_poitemstr,
           :In_deliaddres ,
    :In_addnotes ,
          :in_ipaddress,
          :in_source,
          :out_ErrorCode,
          :out_ErrorMsg
      ); END;`,
      {
        in_userId,
        in_mode,
        in_ulbId,
        in_porderId,
        in_vendorId,
        in_poDate: { val: in_poDate ? new Date(in_poDate) : null, type: oracledb.DATE },
        in_expDeliveryDt: { val: in_expDeliveryDt ? new Date(in_expDeliveryDt) : null, type: oracledb.DATE },
        in_status,
        in_totalAmount,
        in_approvedBy,
        in_approvedDt: { val: in_approvedDt ? new Date(in_approvedDt) : null, type: oracledb.DATE },
        In_poitemstr,
        In_deliaddres ,
    In_addnotes ,
        in_ipaddress,
        in_source,
        out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 5000 },
      }
    );

    const errorCode = result.outBinds.out_ErrorCode ?? 0;
    const errorMessage = result.outBinds.out_ErrorMsg ?? "Success";

    res.status(200).json({ errorCode, errorMessage });
  } catch (err) {
    console.error("PurchaseOrder procedure error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection", err);
      }
    }
  }
};



const getActivePurchaseOrders = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();

    const query = `
       SELECT
    po.num_purchaseorder_id,
    po.var_purchaseorder_pono,
    po.num_purchaseorder_vendorid,
    v.var_vendor_name,
    po.dat_purchaseorder_date,
    po.dat_purchaseorder_expdeliverydt,
    po.var_purchaseorder_status,
    po.num_purchaseorder_totalamount,
    po.var_purchaseorder_approvtby,
    po.dat_purchaseorder_approvdt,
    po.num_purchaseorder_ulbid,
    po.var_purchaseorder_insby,
    po.dat_purchaseorder_insdt,
    item.var_POitem_name,
    item.var_POitem_category,
    item.num_POitem_qty,
    item.num_POitem_price,
    item.num_POitem_total,
    item.num_poitem_attributeid,
    c.var_category_name
FROM aoin_purchaseorder_mas po
JOIN aoin_POitem_det item
  ON po.num_purchaseorder_id = item.num_POitem_purchaseorderid
JOIN aoin_vendor_mas v
  ON po.num_purchaseorder_vendorid = v.num_vendor_id
 AND v.num_vendor_ulbid = po.num_purchaseorder_ulbid
JOIN aoin_category_mas c
  ON c.num_category_id = item.var_poitem_category
WHERE po.var_purchaseorder_status = 'A'
  AND NVL(po.var_purchaseorder_active, ' ') <> 'I'
  AND po.num_purchaseorder_ulbid = :ulbId
  AND ( :pono IS NULL OR po.var_purchaseorder_pono = :pono )
ORDER BY po.var_purchaseorder_insby DESC
    `;

    const binds = {
      pono: req.body.pono,
      ulbId : req.body.ulbId
    };

    const result = await connection.execute(query, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching active purchase orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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

const getActivePurchaseOrdersForIssue = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();

    const query = `
       SELECT
    po.num_purchaseorder_id,
    po.var_purchaseorder_pono,
    po.num_purchaseorder_vendorid,
    v.var_vendor_name,
    po.dat_purchaseorder_date,
    po.dat_purchaseorder_expdeliverydt,
    po.var_purchaseorder_status,
    po.num_purchaseorder_totalamount,
    po.var_purchaseorder_approvtby,
    po.dat_purchaseorder_approvdt,
    po.num_purchaseorder_ulbid,
    po.var_purchaseorder_insby,
    po.dat_purchaseorder_insdt,
    item.var_POitem_name,
    item.var_POitem_category,
    item.num_POitem_qty,
    item.num_POitem_price,
    item.num_POitem_total,
    item.num_poitem_attributeid,
    c.var_category_name
FROM aoin_purchaseorder_mas po
JOIN aoin_POitem_det item
  ON po.num_purchaseorder_id = item.num_POitem_purchaseorderid
JOIN aoin_vendor_mas v
  ON po.num_purchaseorder_vendorid = v.num_vendor_id
 AND v.num_vendor_ulbid = po.num_purchaseorder_ulbid
JOIN aoin_category_mas c
  ON c.num_category_id = item.var_poitem_category
WHERE po.var_purchaseorder_status = 'A'
 AND NVL(po.var_purchaseorder_active, ' ') <> 'I'
  AND po.num_purchaseorder_ulbid = :ulbId
  AND ( :pono IS NULL OR po.var_purchaseorder_pono = :pono )
ORDER BY po.var_purchaseorder_insby DESC
    `;

    const binds = {
      pono: req.body.pono,
      ulbId : req.body.ulbId
    };

    const result = await connection.execute(query, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching active purchase orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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

const getPurchaseOrders = async (req, res) => {
  let connection;

  try {
    const { ulbId } = req.body;
    connection = await getConnection();

    const query = `
      SELECT
    po.num_purchaseorder_id,
    po.var_purchaseorder_pono,
    po.num_purchaseorder_vendorid,
    v.var_vendor_name,                             -- ✅ Vendor Name
    po.dat_purchaseorder_date,
    po.dat_purchaseorder_expdeliverydt,
    po.var_purchaseorder_status,
    po.num_purchaseorder_totalamount,
    po.var_purchaseorder_approvtby,
    po.dat_purchaseorder_approvdt,
    po.num_purchaseorder_ulbid,
    po.var_purchaseorder_insby,
    po.dat_purchaseorder_insdt,
    item.var_POitem_name,
    item.var_POitem_category,
    item.num_POitem_qty,
    item.num_POitem_price,
    item.num_POitem_total,
    item.num_poitem_attributeid,
   c.var_category_name
FROM
    aoin_purchaseorder_mas po
JOIN
    aoin_POitem_det item 
    ON po.num_purchaseorder_id = item.num_POitem_purchaseorderid
JOIN 
    aoin_vendor_mas v  ON po.num_purchaseorder_vendorid = v.num_vendor_id 
     and v.num_vendor_ulbid=po.num_purchaseorder_ulbid
     join aoin_category_mas c 
     on c.num_category_id=item.var_POitem_category
     where po.num_purchaseorder_ulbid = :ulbId
    order BY po.num_purchaseorder_id DESC

      
    `;

    const result = await connection.execute(query, { ulbId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching active purchase orders:', error);
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

const getPurApproveOrders = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();

    const query = `
      SELECT
    po.num_purchaseorder_id,
    po.var_purchaseorder_pono,
    po.num_purchaseorder_vendorid,
    v.var_vendor_name,                             -- ✅ Vendor Name
    po.dat_purchaseorder_date,
    po.dat_purchaseorder_expdeliverydt,
    po.var_purchaseorder_status,
    po.num_purchaseorder_totalamount,
    po.var_purchaseorder_approvtby,
    po.dat_purchaseorder_approvdt,
    po.num_purchaseorder_ulbid,
    po.var_purchaseorder_insby,
    po.dat_purchaseorder_insdt,
    item.var_POitem_name,
    item.var_POitem_category,
    item.num_POitem_qty,
    item.num_POitem_price,
    item.num_POitem_total
FROM
    aoin_purchaseorder_mas po
JOIN
    aoin_POitem_det item 
    ON po.num_purchaseorder_id = item.num_POitem_purchaseorderid
JOIN 
    aoin_vendor_mas v  ON po.num_purchaseorder_vendorid = v.num_vendor_id 
     and v.num_vendor_ulbid=po.num_purchaseorder_ulbid
     where po.var_purchaseorder_status<>'A'and po.var_purchaseorder_status<>'R'
    order BY po.num_purchaseorder_id DESC

      
    `;

    const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching active purchase orders:', error);
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

const getPurchaseOrderDetailsById = async (req, res) => {
  const { purchaseOrderId } = req.body; // expecting PO ID from request body

  if (!purchaseOrderId) {
    return res.status(400).json({
      success: false,
      message: "Missing required field: purchaseOrderId",
    });
  }

  let connection;
  try {
    connection = await getConnection();

    const query = `
         SELECT
          po.num_purchaseorder_id,
          po.var_purchaseorder_pono,
          po.num_purchaseorder_vendorid,
          po.dat_purchaseorder_date,
          po.dat_purchaseorder_expdeliverydt,
          po.var_purchaseorder_status,
          po.num_purchaseorder_totalamount,
          po.var_purchaseorder_approvtby,
          po.dat_purchaseorder_approvdt,
          po.num_purchaseorder_ulbid,
          po.var_purchaseorder_insby,
          po.dat_purchaseorder_insdt,
          po.var_purchaseorder_deliaddres,
         po.var_purchaseorder_addnotes,
          item.var_POitem_name,
          item.var_POitem_category,
          item.num_POitem_qty,
          item.num_POitem_price,
          item.num_POitem_total,
          item.num_poitem_attributeid,
          c.var_category_name,
          c.num_category_id,
          v.var_vendor_name  -- ✅ Vendor Name
      FROM
          aoin_purchaseorder_mas po
      JOIN
          aoin_POitem_det item 
          ON po.num_purchaseorder_id = item.num_POitem_purchaseorderid
      LEFT JOIN aoin_vendor_mas v                                 
    ON po.num_purchaseorder_vendorid = v.num_vendor_id and v.num_vendor_ulbid= po.num_purchaseorder_ulbid
    join aoin_category_mas c on c.num_category_id=item.var_poitem_category
      WHERE
          po.num_purchaseorder_id = :purchaseOrderId
    `;

    const result = await connection.execute(
      query,
      { purchaseOrderId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });

    console.log(res);
  } catch (error) {
    console.error("Error fetching purchase order details:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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

const getIssueIdByAttrId = async (req, res) => {
  let connection;
  try {
    const { attributeid } = req.body;

    if (!attributeid) {
      return res.status(400).json({
        success: false,
        message: "attributeid is required"
      });
    }

    connection = await getConnection();

    const query = `
      SELECT 
        num_issueitem_issueid AS IssueItemIssueId
      FROM aoin_issueitem_det
      WHERE num_issueitem_attributeid = :attributeid
    `;

    const result = await connection.execute(
      query,
      { attributeid },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error fetching issue item issue id:", error);
    res.status(500).json({
      success: false,
      // message: "Error fetching issue item issue id",
      error: error.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing Oracle connection:", err);
      }
    }
  }
};

const getPoItemsBySup = async (req, res) => {
  let connection;
  try {
    const { ulbId, vendorId, page = 1, pageSize = 10 } = req.body;

    if (!ulbId || !vendorId) {
      return res.status(400).json({ error: "ulbId and vendorId are required" });
    }

    const offset = (page - 1) * pageSize;

    connection = await getConnection();

    // const query = `
    //   SELECT *
    //   FROM (
    //     SELECT 
    //         vw.attribute_id,
    //         rm.var_reqitemdet_name,
    //         rm.num_reqitemdet_qty,
    //         c.num_category_id,
    //         c.var_category_name,
    //         ROW_NUMBER() OVER (ORDER BY vw.attribute_id) AS rn
    //     FROM vw_inventory_item_details vw 
    //     JOIN aoin_requisitionitem_det rm 
    //         ON vw.attribute_id = rm.num_reqitemdet_itemid
    //     JOIN aoin_category_mas c 
    //         ON c.num_category_id = rm.num_reqitemdet_categoryid
    //     JOIN aoin_vendor_mas v 
    //         ON v.num_vendor_id = COALESCE(vw.primary_supplier, vw.supplier)
    //     WHERE v.num_vendor_id = :vendorId
    //       AND vw.ulbid = :ulbId
    //   )
    //   WHERE rn BETWEEN :startRow AND :endRow
    // `;

    const query = `
      SELECT *
      FROM (
    SELECT 
    ROW_NUMBER() OVER (ORDER BY r.var_reqitemdet_name) AS rn,
    r.var_reqitemdet_name,
    i.num_item_rate,
    i.num_item_id,
    c.num_category_id,
    c.var_category_name,
    r.num_reqitemdet_reqitemid,
    r.req_qty AS qty
FROM
(
    SELECT 
        rm.var_reqitemdet_name,
        rm.num_reqitemdet_itemid,
        rm.num_reqitemdet_categoryid,
        MAX(rm.num_reqitemdet_reqitemid) AS num_reqitemdet_reqitemid,
        SUM(rm.num_reqitemdet_qty) AS req_qty
    FROM invmgmt.aoin_requisitionitem_det rm
    GROUP BY 
        rm.var_reqitemdet_name,
        rm.num_reqitemdet_itemid,
        rm.num_reqitemdet_categoryid
) r

LEFT JOIN invmgmt.aoin_item_mas i
ON r.num_reqitemdet_itemid = i.num_item_id

JOIN invmgmt.aoin_category_mas c
ON c.num_category_id = r.num_reqitemdet_categoryid

WHERE r.req_qty > 0 and   i.num_item_venderid = :vendorId
           AND i.num_item_ulbid = :ulbId
       )
       WHERE rn BETWEEN :startRow AND :endRow
     `;

    const binds = {
      ulbId,
      vendorId,
      startRow: offset + 1,
      endRow: offset + pageSize,
    };

    const result = await connection.execute(query, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    // Convert Buffer/CLOB if any
    const rows = result.rows.map((row) => {
      const newRow = { ...row };
      for (const key in newRow) {
        if (newRow[key] instanceof Buffer) {
          newRow[key] = newRow[key].toString("base64");
        }
      }
      return newRow;
    });

    res.json({
      page,
      pageSize,
      data: rows,
    });
  } catch (err) {
    console.error("Error executing paginated vendor items query:", err);
    res.status(500).json({ error: err.message });
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
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");
const axios = require("axios");
// const { PDFDocument } = require("pdf-lib");

const PurOrdPdf = async (req, res) => {
  let connection;
  let browser;

  try {
    const { purchaseOrderId } = req.body;

    if (!purchaseOrderId) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: purchaseOrderId",
      });
    }

    connection = await getConnection();

    /* ================= PO QUERY ================= */
    const query = `
      SELECT
        po.num_purchaseorder_id,
        po.var_purchaseorder_pono,
        po.num_purchaseorder_vendorid,
        po.dat_purchaseorder_date,
        po.dat_purchaseorder_expdeliverydt,
        po.var_purchaseorder_status,
        po.num_purchaseorder_totalamount,
        po.var_purchaseorder_approvtby,
        po.dat_purchaseorder_approvdt,
        po.num_purchaseorder_ulbid,
        po.var_purchaseorder_insby,
        po.dat_purchaseorder_insdt,
        item.var_POitem_name,
        item.var_POitem_category,
        item.num_POitem_qty,
        item.num_POitem_price,
        item.num_POitem_total,
        item.num_poitem_attributeid,
        c.var_category_name,
        v.var_vendor_name,
        v.var_vendor_address
      FROM aoin_purchaseorder_mas po
      JOIN aoin_POitem_det item 
        ON po.num_purchaseorder_id = item.num_POitem_purchaseorderid
      LEFT JOIN aoin_vendor_mas v                                 
        ON po.num_purchaseorder_vendorid = v.num_vendor_id 
        AND v.num_vendor_ulbid = po.num_purchaseorder_ulbid
      JOIN aoin_category_mas c 
        ON c.num_category_id = item.var_poitem_category
      WHERE po.num_purchaseorder_id = :purchaseOrderId
    `;

    const result = await connection.execute(
      query,
      { purchaseOrderId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Purchase Order not found" });
    }

    /* ================= FORMAT DATA ================= */
    const poHeader = result.rows[0];

    const items = result.rows.map((r) => ({
      name: r.VAR_POITEM_NAME,
      category: r.VAR_CATEGORY_NAME,
      categoryId: r.VAR_POITEM_CATEGORY,
      qty: r.NUM_POITEM_QTY,
      price: r.NUM_POITEM_PRICE,
      total: r.NUM_POITEM_TOTAL,
    }));

    const totalAmount = items.reduce((sum, item) => {
      return sum + Number(item.total || 0);
    }, 0)

    /* ================= CORPORATION LOGO & NAME ================= */
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
      { ulbId: poHeader.NUM_PURCHASEORDER_ULBID },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!corpResult.rows.length) {
      return res.status(404).json({ message: "Corporation details not found" });
    }

    const corp = corpResult.rows[0];

    corporationName = corp.CORPORATIONNAME || "";
    corporationEName = corp.CORPORATIONENAME || "";

    /* Convert BLOB logo to base64 */
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
    } else {
      return res.status(404).json({ message: "Logo Image not found" });
    }


    /* ================= TEMPLATE ================= */
    const templatePath = path.join(
      __dirname,
      "../../templates/purchase-order.html"
    );
    const templateSource = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(templateSource);

    const html = template({
      logo,
      corporationName,
      corporationEName,
      poNo: poHeader.VAR_PURCHASEORDER_PONO,
      vendorName: poHeader.VAR_VENDOR_NAME,
      vendorAddress: poHeader.VAR_VENDOR_ADDRESS,
      poDate: poHeader.DAT_PURCHASEORDER_DATE,
      deliveryDate: poHeader.DAT_PURCHASEORDER_EXPDELIVERYDT,
      // totalAmount: poHeader.NUM_PURCHASEORDER_TOTALAMOUNT,
      totalAmount,
      items,
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

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await page.close();
    await browser.close();

    /* ================= RESPONSE ================= */
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=PurchaseOrder_${poHeader.VAR_PURCHASEORDER_PONO}.pdf`
    );

    return res.end(pdfBuffer);
  } catch (err) {
    console.error("❌ Purchase Order PDF Error:", err);
    res.status(500).json({ message: "PDF generation failed" });
  } finally {
    if (browser) await browser.close();
    if (connection) await connection.close();
  }
};

const issueDespenseList = async (req, res) => {
  let connection;

  try {
    const { ulbId } = req.body;
    connection = await getConnection();

    const query = `
   SELECT
    grn.num_grn_id,
    grn.num_grn_pono,
    grn.num_grn_vendorid,
    v.var_vendor_name,
    grn.dat_grn_challandate,
    grn.dat_grn_receiveddate,
    grn.var_grn_status,
    g.num_grnitem_poqty,
    g.num_grnitem_deliveredqty,
    g.num_grnitem_categoryid,
    c.var_category_name,
     g.var_grnitem_name,
     po.num_purchaseorder_id,
     po.dat_purchaseorder_date
FROM inmgmt.aoin_grn_mas grn
LEFT JOIN inmgmt.aoin_vendor_mas v
    ON grn.num_grn_vendorid = v.num_vendor_id
LEFT JOIN inmgmt.aoin_grnitem_det g
    ON grn.num_grn_id = g.num_grnitem_grnid
LEFT JOIN inmgmt.aoin_category_mas c
    ON g.num_grnitem_categoryid = c.num_category_id
LEFT JOIN inmgmt.aoin_purchaseorder_mas po 
ON po.var_purchaseorder_pono = grn.num_grn_pono
WHERE grn.num_grn_ulbid =:ulbId AND var_grn_status = 'A'
ORDER BY grn.num_grn_id DESC
    `;

    const result = await connection.execute(query, { ulbId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching active purchase orders:', error);
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

const getPurApproveGrn = async (req, res) => {
  let connection;

  if (!req.body.ulbid) {
    return res.status(400).json({
      success: false,
      message: "Missing required field: ulbid",
    });
  }

  try {
    connection = await getConnection();

    const query = `
     SELECT
    po.num_purchaseorder_id,
    po.var_purchaseorder_pono,
    po.num_purchaseorder_vendorid,
    v.var_vendor_name,                             -- ✅ Vendor Name
    po.dat_purchaseorder_date,
    po.dat_purchaseorder_expdeliverydt,
    po.var_purchaseorder_status,
    po.num_purchaseorder_totalamount,
    po.var_purchaseorder_approvtby,
    po.dat_purchaseorder_approvdt,
    po.num_purchaseorder_ulbid,
    po.var_purchaseorder_insby,
    po.dat_purchaseorder_insdt,
    item.var_POitem_name,
    item.var_POitem_category,
    item.num_POitem_qty,
    item.num_POitem_price,
    item.num_POitem_total,
    rm.var_requisitionitem_requno
FROM
    aoin_purchaseorder_mas po
JOIN
    aoin_POitem_det item 
    ON po.num_purchaseorder_id = item.num_POitem_purchaseorderid
JOIN 
    aoin_vendor_mas v  ON po.num_purchaseorder_vendorid = v.num_vendor_id 
     and v.num_vendor_ulbid=po.num_purchaseorder_ulbid
     join aoin_requisitionitem_det rd on rd.num_reqitemdet_itemid= item.num_poitem_attributeid
     join aoin_requisitionitem_mas rm on rm.num_requisitionitem_id=rd.num_reqitemdet_reqitemid
      LEFT JOIN aoin_grn_mas g
  ON g.num_grn_pono = po.var_purchaseorder_pono
 AND g.num_grn_ulbid = po.num_purchaseorder_ulbid
     where po.var_purchaseorder_status='A'and po.num_purchaseorder_ulbid=:ulbid AND g.num_grn_id IS NULL
    order BY po.num_purchaseorder_id DESC
    `;

    const result = await connection.execute(query, {ulbid:req.body.ulbid}, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching active purchase orders:', error);
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

module.exports = {
  purchaseOrderIns, getActivePurchaseOrders, getPurchaseOrders,
  getPurchaseOrderDetailsById, getPurApproveOrders, getIssueIdByAttrId, getPoItemsBySup, PurOrdPdf,
  issueDespenseList,getPurApproveGrn, getActivePurchaseOrdersForIssue
};
