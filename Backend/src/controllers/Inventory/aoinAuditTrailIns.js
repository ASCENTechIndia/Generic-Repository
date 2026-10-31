const oracledb = require("oracledb");
const { getConnection } = require("../../config/database.js");

const auditTrailIns = async (req, res) => {
  const {
    in_userId,
    in_mode,
    in_ulbId,
    in_auditId,
    in_actionType,
    in_entityType,
    in_entityId,
    in_actionDate,
    in_detail,
    in_remark,
    in_ipaddress,
    in_source,
  } = req.body;

  // ✅ Basic validation
  if (!in_userId || !in_mode || !in_ulbId || !in_actionType || !in_entityType) {
    return res.status(400).json({
      error:
        "Missing required fields (userId, mode, ulbId, actionType, entityType)",
    });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN aoin_AuditTrail_ins(
          :in_userId,
          :in_mode,
          :in_ulbId,
          :in_auditId,
          :in_actionType,
          :in_entityType,
          :in_entityId,
          :in_actionDate,
          :in_detail,
          :in_remark,
          :in_ipaddress,
          :in_source,
          :out_ErrorCode,
          :out_ErrorMsg
        ); END;`,
      {
        in_userId,
        in_mode,
        in_ulbId,
        in_auditId,
        in_actionType,
        in_entityType,
        in_entityId,
        // ✅ Ensure DATE field is sent as Oracle DATE
        in_actionDate: {
          val: in_actionDate ? new Date(in_actionDate) : null,
          type: oracledb.DATE,
        },
        in_detail,
        in_remark,
        in_ipaddress,
        in_source,
        out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_ErrorMsg: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 5000,
        },
      }
    );

    const errorCode = result.outBinds.out_ErrorCode ?? 0;
    const errorMessage = result.outBinds.out_ErrorMsg ?? "Success";

    res.status(200).json({ errorCode, errorMessage });
  } catch (err) {
    console.error("AuditTrail procedure error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const purchaseOrderReport = async (req, res) => {
  let connection;
  try {
    const { start_date, end_date } = req.body;

    // ✅ Validate required date parameters
    if (!start_date || !end_date) {
      return res.status(400).json({
        error: "Missing required date parameters (start_date, end_date).",
      });
    }

    connection = await getConnection();



    const query = `
      SELECT
          pom.num_purchaseorder_id AS "Purchase Order ID",
          pom.var_purchaseorder_pono AS "Purchase Order Number",
          pom.dat_purchaseorder_date AS "PO Date",
          pom.dat_purchaseorder_expdeliverydt AS "Expected Delivery Date",
          pom.var_purchaseorder_status AS "Status",
          pom.num_purchaseorder_totalamount AS "Total Amount",
          pom.var_purchaseorder_approvtby AS "Approved By",
          pom.dat_purchaseorder_approvdt AS "Approval Date",
          pom.num_purchaseorder_ulbid AS "ULB ID",
          pom.num_purchaseorder_vendorid AS "Vendor ID",
          LISTAGG(
              poid.var_POitem_name || ' (' || poid.var_POitem_category || ') - Qty: ' || poid.num_POitem_qty,
              ' | '
          ) WITHIN GROUP (ORDER BY poid.num_POitem_id) AS "Purchase Order Items"
      FROM
          aoin_purchaseorder_mas pom
      JOIN
          aoin_POitem_det poid ON pom.num_purchaseorder_id = poid.num_POitem_purchaseorderid
      WHERE
          UPPER(pom.var_purchaseorder_status) = 'A'
          AND TRUNC(pom.dat_purchaseorder_date) BETWEEN TRUNC(:start_date) AND TRUNC(:end_date)
      GROUP BY
          pom.num_purchaseorder_id,
          pom.var_purchaseorder_pono,
          pom.dat_purchaseorder_date,
          pom.dat_purchaseorder_expdeliverydt,
          pom.var_purchaseorder_status,
          pom.num_purchaseorder_totalamount,
          pom.var_purchaseorder_approvtby,
          pom.dat_purchaseorder_approvdt,
          pom.num_purchaseorder_ulbid,
          pom.num_purchaseorder_vendorid
      ORDER BY
          pom.var_purchaseorder_pono DESC
    `;
    const result = await connection.execute(
      query,
      {
        start_date: new Date(start_date),
        end_date: new Date(end_date),
      },
      {
        // Fetch all rows
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    res.status(200).json({ data: result.rows });
  } catch (err) {
    console.error("Purchase order report query error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

module.exports = { auditTrailIns, purchaseOrderReport };
