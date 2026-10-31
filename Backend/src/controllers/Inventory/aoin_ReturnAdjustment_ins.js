const oracledb = require("oracledb");
const { getConnection } = require("../../config/database.js");

const aoin_ReturnAdjustment_ins = async (req, res) => {
  const {
    in_userId,
    in_mode,
    in_UlbId,
    in_returnAdjId,
    in_itemid,
    in_deptId,
    in_Issueid,
    in_type,
    in_quantity,
    in_adjDate,
    in_reason,
    in_remarks,
    in_ipaddress,
    in_source,
  } = req.body;

  // ✅ Basic validation
  if (!in_userId || !in_mode || !in_UlbId || !in_type || !in_quantity) {
    return res.status(400).json({
      error: "Missing required fields (userId, mode, ulbId, type, quantity)",
    });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN aoin_ReturnAdjustment_ins(
          :in_userId,
          :in_mode,
          :in_UlbId,
          :in_returnAdjId,
          :in_itemid,
          :in_deptId,
          :in_Issueid,
          :in_type,
          :in_quantity,
          TO_DATE(:in_adjDate, 'DD-MON-YYYY'),
          :in_reason,
          :in_remarks,
          :in_ipaddress,
          :in_source,
          :out_ErrorCode,
          :out_ErrorMsg
        ); END;`,
      {
        in_userId,
        in_mode,
        in_UlbId,
        in_returnAdjId,
        in_itemid,
        in_deptId,
        in_Issueid,
        in_type,
        in_quantity,
        in_adjDate,
        in_reason,
        in_remarks,
        in_ipaddress,
        in_source,
        out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 5000 },
      },
      { autoCommit: true } // ✅ commit automatically
    );

    const errorCode = result.outBinds.out_ErrorCode ?? 0;
    const errorMessage = result.outBinds.out_ErrorMsg ?? "Success";

    res.status(200).json({ errorCode, errorMessage });
  } catch (err) {
    console.error("ReturnAdjustment procedure error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getIssueItemList = async (req, res) => {
  const { ulbId } = req.body; 

  if (!ulbId) {
    return res.status(400).json({ error: "Missing required field: ulbId" });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
//       `SELECT 
//     d.num_issueitem_id,
//     d.num_issueitem_issueid,
//     d.num_issueitem_ulbid,
//     d.var_issueitem_name,
//     d.var_issueitem_category,
//     d.num_issueitem_qtyissued,
//     d.num_issueitem_price,
//     d.num_issueitem_total,
//     d.var_issueitem_status,
//     d.var_issueitem_insby,
//     d.dat_issueitem_insdt,
//     m.num_issue_id,
//     m.num_issue_requisitionid,
//     m.num_issue_deptid,
//     m.var_issue_issuedby,
//     m.dat_issue_issuedate,
//     m.var_issue_remarks,
//     c.var_category_name
   
// FROM aoin_issueitem_det d
// JOIN aoin_issue_mas m 
//   ON d.num_issueitem_issueid = m.num_issue_id   
//   join aoin_category_mas c
//   on c.num_category_id=TO_NUMBER(d.var_issueitem_category)
// WHERE d.var_issueitem_status = 'A'  AND NVL(d.num_issueitem_qtyissued,0) <> 0
//           AND d.num_issueitem_ulbid = :ulbId`,
 `SELECT 
    item.num_item_id,
    item.var_item_name,
    SUM(g.num_grnitem_deliveredqty) AS num_grnitem_deliveredqty,
    MAX(i.num_item_packsize) AS num_item_packsize,
    SUM(g.num_grnitem_deliveredqty) + MAX(i.num_item_packsize) AS current_stock,
    c.var_category_name
FROM invmgmt.aoin_item_mas item
JOIN invmgmt.aoin_grnitem_det g 
    ON item.num_item_id = g.num_grnitem_itemid
JOIN invmgmt.aoin_grn_mas gm
    ON gm.num_grn_id = g.num_grnitem_grnid
JOIN invmgmt.aoin_item_mas i
    ON i.num_item_id = item.num_item_id
JOIN invmgmt.aoin_category_mas c
    ON c.num_category_id = TO_NUMBER(item.num_item_categoryid)
WHERE i.num_item_ulbid = :ulbId
AND gm.var_grn_status = 'A'
GROUP BY
    item.num_item_id,
    item.var_item_name,
    c.var_category_name`,
      { ulbId:Number(ulbId) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows || []);
  } catch (err) {
    console.error("Error fetching issue item list:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};


const getDepartmentddList = async (req, res) => {
  const { ulbId } = req.body; // frontend will send ulbId

  if (!ulbId) {
    return res.status(400).json({ error: "Missing required field: ulbId" });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT num_dept_id, var_dept_name
         FROM aoin_department_mas
        WHERE var_dept_flag = 'A'
          AND num_dept_ulbid = :ulbId`,
      { ulbId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows || []);
  } catch (err) {
    console.error("Error fetching department list:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const getIssueList = async (req, res) => {
  const { ulbId } = req.body; // frontend will send ulbId

  if (!ulbId) {
    return res.status(400).json({ error: "Missing required field: ulbId" });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT num_issue_id, var_issue_issuedby
         FROM aoin_issue_mas
        WHERE num_issue_ulbid = :ulbId`,
      { ulbId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows || []);
  } catch (err) {
    console.error("Error fetching issue list:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const getReturnAdjustmentList = async (req, res) => {
  const { ulbId } = req.body;

  if (!ulbId) {
    return res.status(400).json({ error: "Missing required field: ulbId" });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT ra.num_returnadjustment_id           AS "returnAdjId",
             ra.var_returnadjustment_type         AS "adjType",
             ra.num_returnadjustment_quantity     AS "quantityReturn",
             ra.dat_returnadjustment_adjdate      AS "adjDate",
             ra.var_returnadjustment_reason       AS "reason",
             ra.var_returnadjustment_remarks      AS "remarks",
             ra.num_returnadjustment_ulbid        AS "ulbId",

             ii.num_issueitem_id                  AS "issueItemId",
             ii.var_issueitem_name                AS "itemName",
             ii.var_issueitem_category            AS "itemCategory",
             ii.num_issueitem_qtyissued           AS "qtyIssued",
             ii.num_issueitem_price               AS "itemPrice",
             ii.num_issueitem_total               AS "itemTotal",

             im.num_issue_id                      AS "issueId",
             im.var_issue_issuedby                AS "issuedBy",
             im.dat_issue_issuedate               AS "issueDate",

             d.num_dept_id                        AS "deptId",
             d.var_dept_name                      AS "deptName",
             d.var_dept_type                      AS "deptType"

      FROM aoin_returnadjustment_mas ra
      LEFT JOIN aoin_issueitem_det ii
             ON ra.num_returnadjustment_itemid = ii.num_issueitem_id
      LEFT JOIN aoin_issue_mas im
             ON ra.num_returnadjustment_issueid = im.num_issue_id
      LEFT JOIN aoin_department_mas d
             ON ra.num_returnadjustment_deptid = d.num_dept_id and d.num_dept_ulbid = :ulbId
      WHERE ra.num_returnadjustment_ulbid = :ulbId
      ORDER BY ra.num_returnadjustment_id DESC
      `,
      { ulbId }, { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows || []);
  } catch (err) {
    console.error("Error fetching Return Adjustment List:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
   
      await connection.close();
  
  }
};

const getReturnAdjbyId = async (req, res) => {
  const { ulbId, returnAdjId } = req.body;

  if (!ulbId || !returnAdjId) {
    return res.status(400).json({ error: "Missing required fields: ulbId, returnAdjId" });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT ra.num_returnadjustment_id           AS returnAdjId,
             ra.var_returnadjustment_type         AS adjType,
             ra.num_returnadjustment_quantity     AS quantityReturn,
             ra.dat_returnadjustment_adjdate      AS adjDate,
             ra.var_returnadjustment_reason       AS reason,
             ra.var_returnadjustment_remarks      AS remarks,
             ra.num_returnadjustment_ulbid        AS ulbId,

             ii.num_issueitem_id                  AS issueItemId,
             ii.var_issueitem_name                AS itemName,
             ii.var_issueitem_category            AS itemCategory,
             ii.num_issueitem_qtyissued           AS qtyIssued,
             ii.num_issueitem_price               AS itemPrice,
             ii.num_issueitem_total               AS itemTotal,

             im.num_issue_id                      AS issueId,
             im.var_issue_issuedby                AS issuedBy,
             im.dat_issue_issuedate               AS issueDate,

             d.num_dept_id                        AS deptId,
             d.var_dept_name                      AS deptName,
             d.var_dept_type                      AS deptType

      FROM aoin_returnadjustment_mas ra
      LEFT JOIN aoin_issueitem_det ii
             ON ra.num_returnadjustment_itemid = ii.num_issueitem_id
      LEFT JOIN aoin_issue_mas im
             ON ra.num_returnadjustment_issueid = im.num_issue_id
      LEFT JOIN aoin_department_mas d
             ON ra.num_returnadjustment_deptid = d.num_dept_id and d.num_dept_ulbid = :ulbId
      WHERE ra.num_returnadjustment_ulbid = :ulbId
        AND ra.num_returnadjustment_id   = :returnAdjId
      ORDER BY ra.num_returnadjustment_id DESC
      `,
      { ulbId, returnAdjId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT } // ✅ Oracle JSON format
    );

    res.status(200).json(result.rows || []);
  } catch (err) {
    console.error("Error fetching Return Adjustment List:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const aoin_issueitemutdt_ins = async (req, res) => {
    const {
    In_Userid,
    In_issueid,
    In_issueitemid,
    In_name,
    In_Qty,
    In_status,
    In_ulbid,
    In_ipaddress,
    In_source
  } = req.body;

  let connection;

  try {
  connection = await getConnection();

    const result = await connection.execute(
      `BEGIN
         aoin_issueitemutdt_ins(
           :In_Userid,
           :In_issueid,
           :In_issueitemid,
           :In_name,
           :In_Qty,
           :In_status,
           :In_ulbid,
           :In_ipaddress,
           :In_source,
           :Out_ErrorCode,
           :Out_ErrorMsg
         );
       END;`,
      {
        In_Userid,
        In_issueid,
        In_issueitemid,
        In_name,
        In_Qty,
        In_status,
        In_ulbid,
        In_ipaddress,
        In_source,
        Out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        Out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 }
      }
    );

    res.json({
      errorCode: result.outBinds.Out_ErrorCode,
      errorMsg: result.outBinds.Out_ErrorMsg
    });

  } catch (err) {
    console.error('Error calling stored procedure:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const getReturnAdjReport = async (req, res) => {
  let connection;
  try {
    const { ulbId, startDate, endDate, Type } = req.body;

    if (!ulbId || !startDate || !endDate) {
      return res.status(400).json({ error: "ulbId, startDate, and endDate are required" });
    }

    connection = await oracledb.getConnection();

    const query = `
      SELECT 
          ra.num_returnadjustment_id,
          ra.num_returnadjustment_itemid,
          ra.num_returnadjustment_deptid,
          d.var_dept_name,
          ra.num_returnadjustment_issueid,
          dt.var_issueitem_name,
          dt.num_issueitem_qtyissued,
          ra.var_returnadjustment_type,   
          ra.num_returnadjustment_quantity,
          ra.dat_returnadjustment_adjdate,
          ra.var_returnadjustment_reason, 
          ra.var_returnadjustment_remarks
        
      FROM aoin_returnadjustment_mas ra
      inner join aoin_issueitem_det dt on dt.num_issueitem_id=ra.num_returnadjustment_itemid
      LEFT JOIN aoin_department_mas d  
          ON ra.num_returnadjustment_deptid = d.num_dept_id and d.num_dept_ulbid = :ulbId
      WHERE ra.dat_returnadjustment_adjdate BETWEEN TO_DATE(:startDate, 'DD-MON-YYYY') 
                                                AND TO_DATE(:endDate, 'DD-MON-YYYY')
        AND ra.num_returnadjustment_ulbid = :ulbId
        AND (:Type IS NULL OR ra.var_returnadjustment_type = : Type)
      ORDER BY ra.dat_returnadjustment_adjdate ASC
    `;

    const binds = {
      ulbId,
      startDate,
      endDate,
      Type: Type || null,
    };

    const result = await connection.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json(result.rows);

  } catch (err) {
    console.error("Error executing query:", err);
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



module.exports = { aoin_ReturnAdjustment_ins,getIssueItemList,getDepartmentddList ,
    getIssueList,getReturnAdjustmentList,getReturnAdjbyId,aoin_issueitemutdt_ins,getReturnAdjReport};
