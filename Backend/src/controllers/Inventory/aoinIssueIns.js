// src/controllers/itemController.js
const oracledb = require("oracledb");
const { getConnection } = require("../../config/database.js");

// 🔥 Insert/Update/Delete Issue Master + Items
const issueIns = async (req, res) => {
  const {
    In_UserId,
    In_Mode,
    In_issueid,
    In_requisitionid,
    In_hospitalid,
    In_issuedby,
    In_issuedate,
    In_remarks,
    In_ulbid,
     In_pono,
    In_flag,
    In_str,
    In_ipaddress,
    In_source
  } = req.body;

  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN
        aoin_issue_ins(
          :In_UserId,
          :In_Mode,
          :In_issueid,
          :In_requisitionid,
          :In_hospitalid,
          :In_issuedby,
          TO_DATE(:In_issuedate,'DD-Mon-YYYY'),
          :In_remarks,
          :In_ulbid,
           :In_pono,
          :In_flag,
          :In_str,
          :In_ipaddress,
          :In_source,
          :Out_ErrorCode,
          :Out_ErrorMsg
        );
      END;`,
      {
        In_UserId,
        In_Mode,
        In_issueid,
        In_requisitionid,
        In_hospitalid,
        In_issuedby,
        In_issuedate,
        In_remarks,
        In_ulbid,
        In_pono,
        In_flag,
        In_str,
        In_ipaddress,
        In_source,
        Out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        Out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 },
      },
      { autoCommit: true }
    );

    return res.status(200).json({
      ErrorCode: result.outBinds.Out_ErrorCode,
      ErrorMessage: result.outBinds.Out_ErrorMsg,
    });
  } catch (error) {
    console.error("Error executing aoin_issue_ins:", error);
    return res.status(500).json({ ErrorCode: -500, ErrorMessage: error.message });
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

// 🔥 Insert / Update / Delete Requisition + Items
const requisitionIns = async (req, res) => {
  const {
    in_userId,
    in_mode,
    in_UlbId,
    in_requisitionItemId = null,
    In_requisistiondate,
    In_Hospital,
    In_remark = null,
    in_itemstr,
    In_status,
    In_lastIssueDate = null,
    in_ipaddress = null,
    in_source = null,
  } = req.body;

  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN
        aoin_RequisitionItem_ins(
          :in_userId,
          :in_mode,
          :in_UlbId,
          :in_requisitionItemId,
          TO_DATE(:In_requisistiondate,'DD-Mon-YYYY'),
          :In_Hospital,
          :In_remark,
          :in_itemstr,
          :In_status,
          TO_DATE(:In_lastIssueDate,'DD-Mon-YYYY'),
          :in_ipaddress,
          :in_source,
          :out_ErrorCode,
          :out_ErrorMsg
        );
      END;`,
      {
        in_userId,
        in_mode: Number(in_mode),
        in_UlbId: Number(in_UlbId),
        in_requisitionItemId: in_requisitionItemId
          ? Number(in_requisitionItemId)
          : null,
        In_requisistiondate,
        In_Hospital,
        In_remark,
        in_itemstr,
        In_status,
        In_lastIssueDate,
        in_ipaddress,
        in_source,
        out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_ErrorMsg: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 4000,
        },
      },
      { autoCommit: true },
    );

    return res.status(200).json({
      ErrorCode: result.outBinds.out_ErrorCode,
      ErrorMessage: result.outBinds.out_ErrorMsg,
    });
  } catch (error) {
    console.error("Error executing aoin_RequisitionItem_ins:", error);
    return res.status(500).json({
      ErrorCode: -500,
      ErrorMessage: error.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Connection close error:", err);
      }
    }
  }
};
// 🔥 Requisition Detail (Single Query with Join)
const requisitionById = async (req, res) => {
  const { ulbId, requisitionId } = req.body;

  if (!ulbId || !requisitionId) {
    return res.status(400).json({ error: "ulbId and requisitionId required" });
  }

  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT 
    m.num_requisitionitem_id       AS requisition_id,
    m.var_requisitionitem_requno   AS requisition_no,
    TO_CHAR(m.dat_requisitionitem_requdate,'DD-Mon-YYYY') AS requisition_date,
    m.var_requisitionitem_hospital AS hospital,
    m.var_requisitionitem_remark   AS remark,
    m.var_requisitionitem_status   AS status,
    TO_CHAR(m.dat_requisitionitem_lastissuedat,'DD-Mon-YYYY') AS last_issue_date,

    d.num_reqitemdet_id            AS detail_id,
    d.num_reqitemdet_itemid        AS item_id,

    i.var_item_name                AS item_name,          -- ✅ from item master
    d.num_reqitemdet_qty           AS quantity,

    d.num_reqitemdet_categoryid    AS category_id,
    c.var_category_name            AS category_name,       -- ✅ from category master
v.var_vendor_name AS vendor_name

FROM aoin_requisitionitem_mas m

LEFT JOIN aoin_requisitionitem_det d
  ON m.num_requisitionitem_id = d.num_reqitemdet_reqitemid
 AND m.num_requisitionitem_ulbid = d.num_reqitemdet_ulbid

LEFT JOIN aoin_item_mas i
  ON i.num_item_id = d.num_reqitemdet_itemid
 AND i.num_item_ulbid = d.num_reqitemdet_ulbid

LEFT JOIN aoin_category_mas c
  ON c.num_category_id = d.num_reqitemdet_categoryid

  LEFT join aoin_vendor_mas v
  ON v.num_vendor_id = i.num_item_venderid

WHERE m.num_requisitionitem_ulbid = :ulbId
  AND m.num_requisitionitem_id = :requisitionId
      `,
      {
        ulbId: Number(ulbId),
        requisitionId: Number(requisitionId),
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const rows = result.rows;

    if (!rows.length) {
      return res.status(404).json({ error: "No data found" });
    }

    // Extract master (same for all rows)
    const master = {
      requisition_id: rows[0].REQUISITION_ID,
      requisition_no: rows[0].REQUISITION_NO,
      requisition_date: rows[0].REQUISITION_DATE,
      hospital: rows[0].HOSPITAL,
      remark: rows[0].REMARK,
      status: rows[0].STATUS,
      last_issue_date: rows[0].LAST_ISSUE_DATE,
    };

    // Extract items
    const items = rows
      .filter((r) => r.ITEM_ID !== null)
      .map((r) => ({
        detail_id: r.DETAIL_ID,
        item_id: r.ITEM_ID,
        item_name: r.ITEM_NAME,
        quantity: r.QUANTITY,
        category_id: r.CATEGORY_ID,
        vendor_name: r.VENDOR_NAME,
      }));

    // Build procedure string
    const itemString = items
      .map((i) => `${i.item_id}#${i.item_name}#${i.quantity}#${i.category_id}`)
      .join("$");

    res.status(200).json({
      master,
      items,
      itemString,
    });
  } catch (err) {
    console.error("Requisition Detail Error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// 🔥 Requisition List (Single Query with Items)
const requisitionList = async (req, res) => {
  const { ulbId } = req.body;

  if (!ulbId) {
    return res.status(400).json({ error: "ulbId is required" });
  }

  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT 
    m.num_requisitionitem_id       AS requisition_id,
    m.var_requisitionitem_requno   AS requisition_no,
    TO_CHAR(m.dat_requisitionitem_requdate,'DD-Mon-YYYY') AS requisition_date,
    m.var_requisitionitem_hospital AS hospital,
    m.var_requisitionitem_status   AS status,
    TO_CHAR(m.dat_requisitionitem_lastissuedat,'DD-Mon-YYYY') AS last_issue_date,
    m.var_requisitionitem_insby    AS created_by,
    m.dat_requisitionitem_insdt    AS insdt,   -- ✅ Added

    COUNT(d.num_reqitemdet_id)     AS item_count,

    LISTAGG(
      d.num_reqitemdet_itemid || '#' ||
      d.var_reqitemdet_name   || '#' ||
      d.num_reqitemdet_qty    || '#' ||
      d.num_reqitemdet_categoryid,
      '$'
    ) WITHIN GROUP (ORDER BY d.num_reqitemdet_id) AS item_string

FROM aoin_requisitionitem_mas m
LEFT JOIN aoin_requisitionitem_det d
  ON m.num_requisitionitem_id = d.num_reqitemdet_reqitemid
 AND m.num_requisitionitem_ulbid = d.num_reqitemdet_ulbid

WHERE m.num_requisitionitem_ulbid = :ulbId

GROUP BY
    m.num_requisitionitem_id,
    m.var_requisitionitem_requno,
    m.dat_requisitionitem_requdate,
    m.var_requisitionitem_hospital,
    m.var_requisitionitem_status,
    m.dat_requisitionitem_lastissuedat,
    m.var_requisitionitem_insby,
    m.dat_requisitionitem_insdt     -- ✅ Added

ORDER BY m.dat_requisitionitem_insdt DESC
      `,
      { ulbId: Number(ulbId) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Requisition List Error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};
module.exports = {
  issueIns,
  requisitionIns,
  requisitionById,
  requisitionList,
};
