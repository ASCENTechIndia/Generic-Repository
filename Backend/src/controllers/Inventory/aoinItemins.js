// src/controllers/itemController.js
const oracledb = require("oracledb");
const { getConnection } = require("../../config/database.js");

const itemIns = async (req, res) => {
  const {
    in_userId,
    in_mode,
    in_UlbId,
    in_itemId = null,
    in_itemCode = null,
    in_itemName,
    in_itemCategory = null,
    in_packsize = null,
    in_orderquanty = null,
    in_vendorid = null,
    in_manufacturer = null,
    in_gstapplflag = null,   // ✅ ADDED
    in_itemUnit = null,
    in_itemType = null,
    in_subcategoryid = null,
    in_flag,
    in_rate = null,
    in_GSTrate = null,
    in_ipaddress = null,
    in_source = null,
  } = req.body;

  /* ✅ Validation */
  if (!in_userId)
    return res.status(400).json({ error: "UserId is required" });

  if (in_mode === undefined || in_mode === null)
    return res.status(400).json({ error: "Mode is required (1/2/3)" });

  if (!in_UlbId)
    return res.status(400).json({ error: "UlbId is required" });

  if (!in_itemName)
    return res.status(400).json({ error: "Item Name is required" });

  if (!in_flag)
    return res.status(400).json({ error: "Flag is required" });

  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN 
        aoin_Item_ins(
          :in_userId,
          :in_mode,
          :in_UlbId,
          :in_itemId,
          :in_itemCode,
          :in_itemName,
          :in_itemCategory,
          :in_packsize,
          :in_orderquanty,
          :in_vendorid,
          :in_manufacturer,
          :in_gstapplflag,   -- ✅ ADDED (POSITION IMPORTANT)
          :in_itemUnit,
          :in_itemType,
          :in_subcategoryid,
          :in_flag,
          :in_rate,
          :in_GSTrate,
          :in_ipaddress,
          :in_source,
          :out_ErrorCode,
          :out_ErrorMsg
        ); 
      END;`,
      {
        in_userId: { val: in_userId, type: oracledb.STRING },
        in_mode: { val: Number(in_mode), type: oracledb.NUMBER },
        in_UlbId: { val: Number(in_UlbId), type: oracledb.NUMBER },
        in_itemId: { val: in_itemId ? Number(in_itemId) : null, type: oracledb.NUMBER },
        in_itemCode: { val: in_itemCode, type: oracledb.STRING },
        in_itemName: { val: in_itemName, type: oracledb.STRING },
        in_itemCategory: { val: in_itemCategory ? Number(in_itemCategory) : null, type: oracledb.NUMBER },
        in_packsize: { val: in_packsize ? Number(in_packsize) : null, type: oracledb.NUMBER },
        in_orderquanty: { val: in_orderquanty ? Number(in_orderquanty) : null, type: oracledb.NUMBER },
        in_vendorid: { val: in_vendorid ? Number(in_vendorid) : null, type: oracledb.NUMBER },
        in_manufacturer: { val: in_manufacturer, type: oracledb.STRING },
        in_gstapplflag: { val: in_gstapplflag, type: oracledb.STRING }, // ✅ ADDED
        in_itemUnit: { val: in_itemUnit, type: oracledb.STRING },
        in_itemType: { val: in_itemType, type: oracledb.STRING },
        in_subcategoryid: { val: in_subcategoryid ? Number(in_subcategoryid) : null, type: oracledb.NUMBER },
        in_flag: { val: in_flag, type: oracledb.STRING },
        in_rate: {val: in_rate, type: oracledb.NUMBER},
        in_GSTrate: {val: in_GSTrate, type: oracledb.NUMBER},
        in_ipaddress: { val: in_ipaddress, type: oracledb.STRING },
        in_source: { val: in_source, type: oracledb.STRING },

        out_ErrorCode: {
          dir: oracledb.BIND_OUT,
          type: oracledb.NUMBER,
        },
        out_ErrorMsg: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 4000,
        },
      },
      { autoCommit: true }
    );

    return res.status(200).json({
      errorCode: result.outBinds.out_ErrorCode,
      errorMessage: result.outBinds.out_ErrorMsg,
    });

  } catch (err) {
    console.error("Item procedure error:", err);
    return res.status(500).json({
      errorCode: -500,
      message: err.message,
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


const getItemActiveList = async (req, res) => {
 const { ulbId } = req.query;

  if (!ulbId) {
    return res.status(400).json({ error: "ulbId is required" });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT 
          num_item_id AS item_id,
          var_item_code AS item_code,
          var_item_name AS item_name
       FROM aoin_item_mas
       WHERE var_item_flag = 'A'
         AND num_item_ulbid = :ulbId
       ORDER BY var_item_name`,
      { ulbId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows || []);
  } catch (err) {
    console.error("getItemActiveList error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};

// ======================= FULL LIST =======================
const getItemList = async (req, res) => {
const { ulbId } = req.body;

  if (!ulbId) {
    return res.status(400).json({ error: "ulbId is required" });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT 
    i.num_item_id              AS "Item Id",
    i.var_item_code                     AS "Item Code/SKU",
    i.var_item_name                     AS "Item Name",
    c.var_category_name                 AS "Category",  
    c.num_category_id                   AS "Category_id",
    sc.num_subcategory_id               AS "SubCategory_id",
    sc.var_subcategory_name             AS "Sub Category",
    i.var_item_unitmeasure              AS "Item Unit",
    i.num_item_packsize                 AS "Pack Size",

    CASE i.VAR_ITEM_GSTAPPLIFLAG 
        WHEN 'Y' THEN 'Yes'
        WHEN 'N' THEN 'No'
    END                                 AS "GST Applicable",

    i.num_item_orderquantity            AS "Minimum Order Quantity (MOQ)",
    i.num_item_gstrate                AS "Applied GST Rate",    
    v.var_vendor_name                   AS "Vendor",  -- ✅ FIXED

    i.var_item_manufacturer             AS "Manufacturer",

    CASE i.var_item_flag
        WHEN 'A' THEN 'Yes'
        WHEN 'I' THEN 'No'
    END                                 AS "Flag"

FROM aoin_item_mas i

LEFT JOIN aoin_vendor_mas v
       ON v.num_vendor_id = i.num_item_venderid   -- 🔥 IMPORTANT

LEFT JOIN aoin_category_mas c
       ON c.num_category_id = i.num_item_categoryid

LEFT JOIN aoin_subcategory_mas sc
       ON sc.num_subcategory_id = i.num_item_subcategoryid

WHERE i.num_item_ulbid = :ulbId
ORDER BY i.dat_item_insdt DESC`,
      {
        ulbId: { val: Number(ulbId), type: oracledb.NUMBER }
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows || []);

  } catch (err) {
    console.error("getItemList error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};

// ======================= SINGLE DETAIL =======================
const getItemDetail = async (req, res) => {
  const { ulbId, itemId } = req.body;

  if (!ulbId || !itemId) {
    return res.status(400).json({ error: "ulbId and itemId are required" });
  }

  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT 
          i.num_item_id              AS item_id,
          i.var_item_code            AS item_code,
          i.var_item_name            AS item_name,
          i.num_item_categoryid      AS category_id,
          i.num_item_subcategoryid   AS subcategory_id,
          i.var_item_unitmeasure     AS unit_measure,
          i.var_item_type            AS item_type,
          i.num_item_packsize        AS pack_size,
          i.num_item_orderquantity   AS order_quantity,
          i.num_item_venderid        AS vendor_id,
          i.var_item_manufacturer    AS manufacturer,
          i.VAR_ITEM_GSTAPPLIFLAG    AS gst_applicable,
          i.var_item_flag            AS item_flag,
          i.num_item_ulbid           AS ulb_id,
          i.var_item_insby           AS inserted_by,
          i.dat_item_insdt           AS inserted_date,
          i.var_item_updby           AS updated_by,
          i.dat_item_upddt           AS updated_date,
          i.num_item_rate AS rate,
          i.num_item_gstrate AS gst_rate

       FROM aoin_item_mas i
       WHERE i.num_item_id = :itemId
         AND i.num_item_ulbid = :ulbId`,
      {
        itemId: { val: Number(itemId), type: oracledb.NUMBER },
        ulbId: { val: Number(ulbId), type: oracledb.NUMBER }
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows[0] || {});

  } catch (err) {
    console.error("getItemDetail error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = {
  itemIns,
  getItemActiveList,
  getItemList,
  getItemDetail,
};
