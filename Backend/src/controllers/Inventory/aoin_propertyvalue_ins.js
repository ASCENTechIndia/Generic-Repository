const oracledb = require("oracledb");
const { getConnection } = require("../../config/database.js");

const aoin_propertyvalue_ins = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();

    const {
      in_userId,
      in_mode,
      in_ulbId,
      in_entityId,
      in_ipaddress,
      in_source,
      attributeId, // 🔹 frontend se aayega (sirf mode=2 me)
      values,
    } = req.body;

    if (!values || !Array.isArray(values) || values.length === 0) {
      return res.status(400).json({ error: "Values array is required" });
    }

    let in_attributeId = attributeId;

    // 🔹 mode=1 me backend se autogenerate karenge
    if (in_mode === 1) {
      const seqResult = await connection.execute(`
        SELECT NVL(MAX(num_propertyvalue_attributeid), 0) + 1 AS newId
        FROM aoin_propertyvalue_mas
      `);
      in_attributeId = seqResult.rows[0][0];
    }

    const results = [];

    for (const val of values) {
      const {
        in_propertyvalueId = null,
        in_propertydefId,
        in_valueString = null,
        in_valueNumber = null,
        in_valueDate = null,
        in_valueBool = null,
        in_valueJson = null,
      } = val;

      let clobData = null;
      if (in_valueJson) {
        try {
          // Always stringify (so Oracle CLOB gets plain string)
          clobData = JSON.stringify(in_valueJson);
        } catch (e) {
          console.error("CLOB conversion error:", e);
          return res.status(400).json({ error: "Invalid JSON data" });
        }
      }

      const result = await connection.execute(
        `
        BEGIN
          aoin_propertyvalue_ins(
            :in_userId,
            :in_mode,
            :in_ulbId,
            :in_attributeId,
            :in_propertyvalueId,
            :in_propertydefId,
            :in_entityId,
            :in_valueString,
            :in_valueNumber,
            :in_valueDate,
            :in_valueBool,
            :in_valueJson,
            :in_ipaddress,
            :in_source,
            :out_ErrorCode,
            :out_ErrorMsg
          );
        END;`,
        {
          in_userId,
          in_mode,
          in_ulbId,
          in_attributeId, // 🔹 same for all values
          in_propertyvalueId,
          in_propertydefId,
          in_entityId,
          in_valueString,
          in_valueNumber,
          in_valueDate: in_valueDate ? new Date(in_valueDate) : null,
          in_valueBool,
          in_valueJson: { val: clobData, type: oracledb.CLOB },
          in_ipaddress,
          in_source,
          out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          out_ErrorMsg: {
            dir: oracledb.BIND_OUT,
            type: oracledb.STRING,
            maxSize: 4000,
          },
        }
      );

      results.push({
        propertyDefId: in_propertydefId,
        errorCode: result.outBinds.out_ErrorCode,
        errorMsg: result.outBinds.out_ErrorMsg,
      });
    }

    await connection.commit();

    // 🔹 return attributeId also
    return res.json({ attributeId: in_attributeId, results });
  } catch (err) {
    console.error("Bulk Insert Error:", err);
    return res.status(500).json({
      attributeId: null,
      results: [],
      error: err.message,
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

const getVendorsDropdown = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const { ulbId } = req.body;

    if (!ulbId) {
      return res.status(400).json({ error: "ulbId is required" });
    }
//     console.log(new Date().toISOString());
//      console.log(new Date());
// const now = new Date();

// const day = String(now.getDate()).padStart(2, "0");
// const month = String(now.getMonth() + 1).padStart(2, "0");
// const year = now.getFullYear();
// const hours = String(now.getHours()).padStart(2, "0");
// const minutes = String(now.getMinutes()).padStart(2, "0");
// const seconds = String(now.getSeconds()).padStart(2, "0");

// console.log(`${day}/${month}/${year} ${hours}:${minutes}:${seconds}`);
    const result = await connection.execute(
      `SELECT 
          a.num_vendor_id   AS vendorId,
           a.var_vendor_code       AS vendor_code,
          a.var_vendor_name       AS vendor_name,
          a.var_vendor_address    AS vendor_address,
          a.var_vendor_contactperson AS contact_person,
          a.num_vendor_phone      AS phone,
          a.var_vendor_email      AS email,
          a.num_vendor_rating     AS rating,
          (a.var_vendor_code || ' - ' || a.var_vendor_name) AS vendorLabel
       FROM aoin_vendor_mas a
       WHERE a.num_vendor_ulbid = :ulbId
         AND a.var_vendor_flag = 'A'`,
      { ulbId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching vendors dropdown:", err);
    res.status(500).json({ error: "Internal server error" });
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

const getcategoryDropdown = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const { ulbId } = req.body;

    if (!ulbId) {
      return res.status(400).json({ error: "ulbId is required" });
    }

    const result = await connection.execute(
      `select num_category_id,var_category_name from aoin_category_mas
       where var_category_flag='A' and num_category_ulbid=:ulbId`,
      { ulbId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching vendors dropdown:", err);
    res.status(500).json({ error: "Internal server error" });
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

const getMedicineList = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();

    const { ulbId } = req.body; // ULB id will come from request body

    //     const result = await connection.execute(
    //       `
    //      SELECT
    //     pv.num_propertyvalue_attributeid AS attribute_id,
    //     MAX(CASE WHEN pd.var_property_name = 'medicine_name' THEN pv.var_propertyvalue_valuestring END) AS medicine_name,
    //     MAX(CASE WHEN pd.var_property_name = 'generic_name' THEN pv.var_propertyvalue_valuestring END) AS generic_name,
    //     MAX(CASE WHEN pd.var_property_name = 'dosage_form' THEN pv.var_propertyvalue_valuestring END) AS dosage_form,
    //     MAX(CASE WHEN pd.var_property_name = 'strength' THEN pv.var_propertyvalue_valuestring END) AS strength,
    //     MAX(CASE WHEN pd.var_property_name = 'uom' THEN pv.var_propertyvalue_valuestring END) AS uom,
    //     MAX(CASE WHEN pd.var_property_name = 'manufacturer' THEN pv.var_propertyvalue_valuestring END) AS manufacturer,
    //     MAX(CASE WHEN pd.var_property_name = 'primary_supplier' THEN pv.var_propertyvalue_valuestring END) AS primary_supplier,
    //     MAX(CASE WHEN pd.var_property_name = 'min_stock' THEN pv.num_propertyvalue_valuenumber END) AS min_stock,
    //     MAX(CASE WHEN pd.var_property_name = 'max_stock' THEN pv.num_propertyvalue_valuenumber END) AS max_stock,
    //     MAX(CASE WHEN pd.var_property_name = 'expiry_alert' THEN pv.num_propertyvalue_valuenumber END) AS expiry_alert,
    //     MAX(CASE WHEN pd.var_property_name = 'shelf_life' THEN pv.num_propertyvalue_valuenumber END) AS shelf_life,
    //     MAX(CASE WHEN pd.var_property_name = 'storage_conditions' THEN pv.var_propertyvalue_valuestring END) AS storage_conditions,
    //     MAX(CASE WHEN pd.var_property_name = 'controlled_drug' THEN pv.var_propertyvalue_valuestring END) AS controlled_drug
    // FROM
    //     aoin_propertyvalue_mas pv
    // JOIN
    //     aoin_propertydef_mas pd
    //     ON pv.num_propertyvalue_propertyid = pd.num_propertydef_id
    // WHERE
    //     pd.var_property_entitytype = 'MEDICINE'
    //     AND pv.num_propertyvalue_ulbid = :ulbId
    // GROUP BY
    //     pv.num_propertyvalue_attributeid
    // ORDER BY
    //     medicine_name
    //       `,
    //       { ulbId },
    //       { outFormat: oracledb.OUT_FORMAT_OBJECT }
    //     );

    const result = await connection.execute(
      `select medicines.*, vm.var_vendor_name as primary_supplier_name from (
SELECT
    pv.num_propertyvalue_attributeid AS attribute_id,
    MAX(CASE WHEN pd.var_property_name = 'medicine_name' THEN pv.var_propertyvalue_valuestring END) AS medicine_name,
    MAX(CASE WHEN pd.var_property_name = 'generic_name' THEN pv.var_propertyvalue_valuestring END) AS generic_name,
    MAX(CASE WHEN pd.var_property_name = 'dosage_form' THEN pv.var_propertyvalue_valuestring END) AS dosage_form,
    MAX(CASE WHEN pd.var_property_name = 'strength' THEN pv.var_propertyvalue_valuestring END) AS strength,
    MAX(CASE WHEN pd.var_property_name = 'uom' THEN pv.var_propertyvalue_valuestring END) AS uom,
    MAX(CASE WHEN pd.var_property_name = 'manufacturer' THEN pv.var_propertyvalue_valuestring END) AS manufacturer,
    MAX(CASE WHEN pd.var_property_name = 'primary_supplier' THEN pv.var_propertyvalue_valuestring END) AS primary_supplier,
    MAX(CASE WHEN pd.var_property_name = 'min_stock' THEN pv.num_propertyvalue_valuenumber END) AS min_stock,
    MAX(CASE WHEN pd.var_property_name = 'max_stock' THEN pv.num_propertyvalue_valuenumber END) AS max_stock,
    MAX(CASE WHEN pd.var_property_name = 'expiry_alert' THEN pv.num_propertyvalue_valuenumber END) AS expiry_alert,
    MAX(CASE WHEN pd.var_property_name = 'shelf_life' THEN pv.num_propertyvalue_valuenumber END) AS shelf_life,
    MAX(CASE WHEN pd.var_property_name = 'storage_conditions' THEN pv.var_propertyvalue_valuestring END) AS storage_conditions,
    MAX(CASE WHEN pd.var_property_name = 'controlled_drug' THEN pv.var_propertyvalue_valuestring END) AS controlled_drug
FROM 
    aoin_propertyvalue_mas pv
JOIN 
    aoin_propertydef_mas pd 
    ON pv.num_propertyvalue_propertyid = pd.num_propertydef_id
WHERE 
    pd.var_property_entitytype = 'MEDICINE'
    AND pv.num_propertyvalue_ulbid = :ulbId
GROUP BY 
    pv.num_propertyvalue_attributeid
) medicines
left join
    aoin_vendor_mas vm
    ON TO_NUMBER(medicines.primary_supplier) = vm.num_vendor_id  and vm.num_vendor_ulbid = :ulbId
ORDER BY 
    medicine_name`,
      { ulbId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("Error fetching medicine list:", err);
    return res.status(500).json({ error: err.message });
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

async function lobToBase64(lob) {
  if (!lob) return null;
  return new Promise((resolve, reject) => {
    const chunks = [];
    lob.on("data", (chunk) => chunks.push(chunk));
    lob.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer.toString("base64"));
    });
    lob.on("error", reject);
  });
}
const getEquipmentList = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
          pv.num_propertyvalue_attributeid AS attribute_id,
          pd.var_property_name,
          pv.var_propertyvalue_valuestring,
          pv.num_propertyvalue_valuenumber,
          pv.dat_propertyvalue_valuedate,
          pv.clob_propertyvalue_valuejson
      FROM 
          aoin_propertyvalue_mas pv
      JOIN 
          aoin_propertydef_mas pd 
          ON pv.num_propertyvalue_propertyid = pd.num_propertydef_id
      WHERE 
          pd.var_property_entitytype = 'EQUIPMENT' 
          AND pv.num_propertyvalue_ulbid = :ulbId
      ORDER BY 
          pv.num_propertyvalue_attributeid
      `,
      { ulbId: req.body.ulbId }, // frontend se ulbId bhejna hoga body me
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Group data by attribute_id (har equipment ka ek group)
    const equipmentMap = {};

    for (const row of result.rows) {
      const id = row.ATTRIBUTE_ID;

      if (!equipmentMap[id]) {
        equipmentMap[id] = { attribute_id: id };
      }

      switch (row.VAR_PROPERTY_NAME) {
        case "equipment_name":
        case "model":
        case "category":
        case "manufacturer":
        case "supplier":
        case "current_location":
        case "status":
        case "notes":
          equipmentMap[id][row.VAR_PROPERTY_NAME] =
            row.VAR_PROPERTYVALUE_VALUESTRING;
          break;

        case "serial_number":
          equipmentMap[id]["serial_number"] = row.NUM_PROPERTYVALUE_VALUENUMBER;
          break;

        case "warranty_alert":
          equipmentMap[id]["warranty_alert"] =
            row.NUM_PROPERTYVALUE_VALUENUMBER;
          break;

        case "total_stocks":
          equipmentMap[id]["total_stocks"] = row.NUM_PROPERTYVALUE_VALUENUMBER;
          break;

        case "stocks_alert":
          equipmentMap[id]["stocks_alert"] = row.NUM_PROPERTYVALUE_VALUENUMBER;
          break;

        case "purchase_date":
        case "warranty_until":
          equipmentMap[id][row.VAR_PROPERTY_NAME] =
            row.DAT_PROPERTYVALUE_VALUEDATE;
          break;

        case "image":
          // Convert BLOB → Base64
          equipmentMap[id]["imageBase64"] = await lobToBase64(
            row.CLOB_PROPERTYVALUE_VALUEJSON
          );
          break;
      }
    }

    // Convert map → array
    const equipments = Object.values(equipmentMap);

    res.json(equipments);
  } catch (err) {
    console.error("Error fetching equipments:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error("Error closing connection:", e);
      }
    }
  }
};

const getItemdetails = async (req, res) => {
  let connection;
  try {
    const { entityType, ulbId, attributeId } = req.body;
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
          pv.num_propertyvalue_id          AS propertyValueId,
          pv.num_propertyvalue_attributeid AS attributeId,
          pv.num_propertyvalue_propertyid  AS propertyDefId,
          pd.var_property_name             AS propertyName,
          pv.var_propertyvalue_valuestring AS valueString,
          pv.num_propertyvalue_valuenumber AS valueNumber,
          pv.dat_propertyvalue_valuedate   AS valueDate,
          pv.var_propertyvalue_valuebool   AS valueBool,
          pv.clob_propertyvalue_valuejson  AS valueJson
      FROM 
          aoin_propertyvalue_mas pv
      JOIN 
          aoin_propertydef_mas pd
            ON pv.num_propertyvalue_propertyid = pd.num_propertydef_id
      WHERE 
          pd.var_property_entitytype = :entityType
          AND pv.num_propertyvalue_ulbid = :ulbId
          AND pv.num_propertyvalue_attributeid = :attributeId
      ORDER BY 
          pv.num_propertyvalue_propertyid
      `,
      { entityType, ulbId, attributeId },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        fetchInfo: {
          VALUEJSON: { type: oracledb.STRING }, // 🟢 auto string
        },
      }
    );

    const rows = result.rows.map((r) => {
      let valueJson = r.VALUEJSON;
      if (valueJson) {
        try {
          valueJson = JSON.parse(valueJson);
        } catch (e) {
          console.error("Invalid JSON in DB:", valueJson);
        }
      }
      return { ...r, VALUEJSON: valueJson };
    });
    res.json(rows);

    // res.json(result.rows);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

const getStocksList = async (req, res) => {
  let connection;
  try {
    const { ulbId, entityType } = req.body;

    if (!ulbId) {
      return res.status(400).json({ error: "ulbId is required" });
    }

    connection = await oracledb.getConnection();

    const query = `
      SELECT
          pv.num_propertyvalue_attributeid AS attribute_id,
          pd.var_property_entitytype AS entity_type,

          -- Medicine fields
          MAX(CASE WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'medicine_name' THEN pv.var_propertyvalue_valuestring END) AS medicine_name,
          MAX(CASE WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'generic_name' THEN pv.var_propertyvalue_valuestring END) AS generic_name,
          MAX(CASE WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'dosage_form' THEN pv.var_propertyvalue_valuestring END) AS dosage_form,
          MAX(CASE WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'strength' THEN pv.var_propertyvalue_valuestring END) AS strength,
          MAX(CASE WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'uom' THEN pv.var_propertyvalue_valuestring END) AS uom,
          MAX(CASE WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'manufacturer' THEN pv.var_propertyvalue_valuestring END) AS medicine_manufacturer,
          MAX(CASE WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'primary_supplier' THEN pv.var_propertyvalue_valuestring END) AS primary_supplier,
          MAX(CASE WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'min_stock' THEN pv.num_propertyvalue_valuenumber END) AS min_stock,
          MAX(CASE WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'max_stock' THEN pv.num_propertyvalue_valuenumber END) AS max_stock,
          MAX(CASE WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'expiry_alert' THEN pv.num_propertyvalue_valuenumber END) AS expiry_alert,
          MAX(CASE WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'shelf_life' THEN pv.num_propertyvalue_valuenumber END) AS shelf_life,
          MAX(CASE WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'storage_conditions' THEN pv.var_propertyvalue_valuestring END) AS storage_conditions,
          MAX(CASE WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'controlled_drug' THEN pv.var_propertyvalue_valuestring END) AS controlled_drug,

          -- Equipment fields
          MAX(CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'equipment_name' THEN pv.var_propertyvalue_valuestring END) AS equipment_name,
          MAX(CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'model' THEN pv.var_propertyvalue_valuestring END) AS model,
          MAX(CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'serial_number' THEN pv.num_propertyvalue_valuenumber END) AS serial_number,
          MAX(CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'category' THEN pv.var_propertyvalue_valuestring END) AS category,
          MAX(CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'manufacturer' THEN pv.var_propertyvalue_valuestring END) AS equipment_manufacturer,
          MAX(CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'supplier' THEN pv.var_propertyvalue_valuestring END) AS supplier,
          MAX(CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'purchase_date' THEN pv.dat_propertyvalue_valuedate END) AS purchase_date,
          MAX(CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'warranty_until' THEN pv.dat_propertyvalue_valuedate END) AS warranty_until,
          MAX(CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'current_location' THEN pv.var_propertyvalue_valuestring END) AS current_location,
          MAX(CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'status' THEN pv.var_propertyvalue_valuestring END) AS status,
          MAX(CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'notes' THEN pv.var_propertyvalue_valuestring END) AS notes,
          MAX(CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'warranty_alert' THEN pv.num_propertyvalue_valuenumber END) AS warranty_alert,
          MAX(CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'total_stocks' THEN pv.num_propertyvalue_valuenumber END) AS total_stocks,
          MAX(CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'stocks_alert' THEN pv.num_propertyvalue_valuenumber END) AS stocks_alert



      FROM aoin_propertyvalue_mas pv
      JOIN aoin_propertydef_mas pd 
          ON pv.num_propertyvalue_propertyid = pd.num_propertydef_id
      WHERE pv.num_propertyvalue_ulbid = :ulbId
        AND (:entityType IS NULL OR pd.var_property_entitytype = :entityType)
      GROUP BY pv.num_propertyvalue_attributeid, pd.var_property_entitytype
      ORDER BY pd.var_property_entitytype, pv.num_propertyvalue_attributeid
    `;

    const binds = {
      ulbId,
      entityType: entityType || null,
    };

    const result = await connection.execute(query, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    // Convert any CLOB/BLOB to Base64 (if required later for images/JSON)
    const rows = result.rows.map((row) => {
      const newRow = { ...row };
      for (const key in newRow) {
        if (newRow[key] instanceof Buffer) {
          newRow[key] = newRow[key].toString("base64"); // Convert Blob to Base64
        }
      }
      return newRow;
    });

    res.json(rows);
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

const getUtilizationReport = async (req, res) => {
  let connection;
  try {
    const { startDate, endDate, categoryId, ulbId } = req.body;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" });
    }
    if (!ulbId) {
      return res.status(400).json({ error: "ulbId is required" });
    }

    connection = await getConnection();

// const query = `    SELECT 
//           var_issueitem_name AS item_name,
//           num_issue_deptid AS dept_id,
//           var_dept_name AS dept_name,
//           var_property_entitytype AS entity_type,
//           COUNT(num_issueitem_id) AS times_used,
//           SUM(num_poitem_qty) AS qty_used
//       FROM (
//           -- Main Issue Table
//           SELECT 
//               ii.num_issueitem_id,
//               ii.var_issueitem_name,
//               im.num_issue_deptid,
//               dm.var_dept_name,
//               pd.var_property_entitytype,
//               po.num_poitem_qty
//           FROM aoin_issueitem_det ii
//           JOIN aoin_issue_mas im 
//               ON im.num_issue_id = ii.num_issueitem_issueid
//           LEFT JOIN aoin_department_mas dm 
//               ON dm.num_dept_id = im.num_issue_deptid and dm.num_dept_ulbid = :ulbId
//           LEFT JOIN aoin_poitem_det po 
//               ON po.num_poitem_purchaseorderid = im.num_issue_requisitionid
//           JOIN aoin_propertyvalue_mas pv 
//               ON LOWER(TRIM(pv.var_propertyvalue_valuestring)) = LOWER(TRIM(ii.var_issueitem_name))
//           JOIN aoin_propertydef_mas pd 
//               ON pv.num_propertyvalue_propertyid = pd.num_propertydef_id
//           WHERE 
//               im.dat_issue_issuedate BETWEEN TO_DATE(:startDate, 'DD-MON-YYYY') 
//                                         AND TO_DATE(:endDate, 'DD-MON-YYYY')
//               AND im.num_issue_ulbid = :ulbId

//           UNION ALL

//           -- Log Issue Table
//           SELECT 
//               ii.num_issueitem_id,
//               ii.var_issueitem_name,
//               lm.num_issue_deptid,
//               dml.var_dept_name,
//               pd.var_property_entitytype,
//               po.num_poitem_qty
//           FROM aoin_issueitem_det ii
//           JOIN aoin_issue_mas_log lm 
//               ON lm.num_issue_id = ii.num_issueitem_issueid
//           LEFT JOIN aoin_department_mas dml 
//               ON dml.num_dept_id = lm.num_issue_deptid and dml.num_dept_ulbid = :ulbId
//           LEFT JOIN aoin_poitem_det po 
//               ON po.num_poitem_purchaseorderid = lm.num_issue_requisitionid
//           JOIN aoin_propertyvalue_mas pv 
//               ON LOWER(TRIM(pv.var_propertyvalue_valuestring)) = LOWER(TRIM(ii.var_issueitem_name))
//           JOIN aoin_propertydef_mas pd 
//               ON pv.num_propertyvalue_propertyid = pd.num_propertydef_id
//           WHERE 
//               lm.dat_issue_issuedate BETWEEN TO_DATE(:startDate, 'DD-MON-YYYY') 
//                                         AND TO_DATE(:endDate, 'DD-MON-YYYY')
//               AND lm.num_issue_ulbid = :ulbId
//       )
//       WHERE (:entityType IS NULL OR var_property_entitytype = :entityType)
//         AND (:deptId IS NULL OR num_issue_deptid = :deptId)
//       GROUP BY 
//           var_issueitem_name,
//           num_issue_deptid,
//           var_dept_name,
//           var_property_entitytype
//       ORDER BY 
//           times_used DESC`;

const query= `SELECT 
          im.var_item_name AS item_name,
          c.var_category_name AS category_name,
         -- d.var_dept_name AS department_name,
          SUM(NVL(id.num_issueitem_qtyissued,0)) AS qty_used,
          COUNT(id.num_issueitem_id) AS times_used
       FROM aoin_issueitem_det id
       JOIN aoin_issue_mas_log imas
         ON id.num_issueitem_issueid = imas.num_issue_id
       JOIN aoin_item_mas im
         ON im.num_item_id = id.num_issueitem_attributeid
       JOIN aoin_category_mas c
         ON c.num_category_id = im.num_item_categoryid
      -- JOIN aoin_department_mas d
      -- ON d.num_dept_id = imas.num_issue_deptid
       WHERE id.var_issueitem_status = 'A'
         AND imas.num_issue_ulbid = :ulbId
         AND (:categoryId IS NULL OR im.num_item_categoryid = :categoryId)
        -- AND (:deptId IS NULL OR imas.num_issue_deptid = :deptId)
         AND imas.dat_issue_issuedate BETWEEN 
             TO_DATE(:startDate,'YYYY-MM-DD') 
             AND TO_DATE(:endDate,'YYYY-MM-DD')
       GROUP BY 
         im.var_item_name,
         c.var_category_name
        -- d.var_dept_name
       ORDER BY im.var_item_name`;

const binds = {
      startDate,
      endDate,
      ulbId,
      categoryId: categoryId || null,
     // deptId: deptId || null,
    };

    const result = await connection.execute(query, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const rows = result.rows.map((row) => {
      const newRow = { ...row };
      for (const key in newRow) {
        if (newRow[key] instanceof Buffer) {
          newRow[key] = newRow[key].toString("base64");
        }
      }
      return newRow;
    });

    res.json(rows);
  } catch (err) {
    console.error("Error executing utilization query:", err);
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

module.exports = {
  aoin_propertyvalue_ins,
  getVendorsDropdown,
  getcategoryDropdown,
  getMedicineList,
  getEquipmentList,
  getItemdetails,
  getStocksList,
  getUtilizationReport,
};
