// src/controllers/itemController.js
const oracledb = require("oracledb");
const { getConnection } = require("../../config/database.js");


const categoryIns = async (req, res) => {
  const {
    in_userId,
    in_mode,
    in_ulbId,
    in_categoryId,
    in_categoryName,
    in_parentCatId,
    in_flag,
    in_ipaddress,
    in_source,
  } = req.body;

  // Basic validation
  if (!in_userId || !in_mode || !in_ulbId || !in_categoryName || !in_flag) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN 
        aoin_Category_ins(
          :in_userId,
          :in_mode,
          :in_ulbId,
          :in_categoryId,
          :in_categoryName,
          :in_parentCatId,
          :in_flag,
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
        in_categoryId,
        in_categoryName,
        in_parentCatId,
        in_flag,
        in_ipaddress,
        in_source,
        out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 5000 },
      }
    );

    const errorCode = result.outBinds.out_ErrorCode ;
    const errorMessage = result.outBinds.out_ErrorMsg ;

    res.status(200).json({ errorCode, errorMessage });
  } catch (err) {
    console.error("Category procedure error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const getCategoryActiveList = async (req, res) => {
  const { ulbId } = req.body;
  if (!ulbId) return res.status(400).json({ error: "ulbId is required" });

  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT num_category_id AS category_id, var_category_name AS category_name
       FROM aoin_category_mas 
       WHERE var_category_flag='A' AND num_category_ulbid=:ulbId`,
      [ulbId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Active category list error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};

// ===================== All Categories by ULB =====================
const getCategoryListByUlb = async (req, res) => {
  const { ulbId } = req.body;
  if (!ulbId) return res.status(400).json({ error: "ulbId is required" });

  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
          c.num_category_id       AS category_id,
          c.var_category_name     AS category_name,
          c.num_parent_categoryid AS parent_category_id,
          c.var_category_flag     AS category_flag,
          c.num_category_ulbid    AS ulb_id,
          c.var_category_insby    AS inserted_by,
          c.dat_category_insdt    AS inserted_date,
          c.var_category_updtby   AS updated_by,
          c.dat_category_upddt    AS updated_date
       FROM aoin_category_mas c
       WHERE c.num_category_ulbid = :ulbId
       ORDER BY c.dat_category_insdt DESC`,
      [ulbId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Category list by ULB error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};

// ===================== Category Autofill by ID =====================
const getCategoryById = async (req, res) => {
  const { categoryId, ulbId } = req.body;
  if (!categoryId || !ulbId) {
    return res.status(400).json({ error: "categoryId and ulbId are required" });
  }

  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
          c.num_category_id       AS category_id,
          c.var_category_name     AS category_name,
          c.num_parent_categoryid AS parent_category_id,
          c.var_category_flag     AS category_flag,
          c.num_category_ulbid    AS ulb_id
       FROM aoin_category_mas c
       WHERE c.num_category_id = :categoryId
         AND c.num_category_ulbid = :ulbId`,
      [categoryId, ulbId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows[0] || null);
  } catch (err) {
    console.error("Category by ID error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};

const subcategoryIns = async (req, res) => {
  const {
    in_userId,
    in_mode,
    in_ulbId,
    in_subcategoryId = null,
    in_categoryId,
    in_subcategoryName,
    in_activeFlag,
    in_ipaddress = null,
    in_source = null,
  } = req.body;

  /* ✅ Proper Validation */
  if (!in_userId) {
    return res.status(400).json({ error: "UserId is required" });
  }

  if (in_mode === undefined || in_mode === null) {
    return res.status(400).json({ error: "Mode is required (1/2/3)" });
  }

  if (!in_ulbId) {
    return res.status(400).json({ error: "UlbId is required" });
  }

  if (!in_categoryId) {
    return res.status(400).json({ error: "CategoryId is required" });
  }

  if (!in_subcategoryName) {
    return res.status(400).json({ error: "Subcategory Name is required" });
  }

  if (!in_activeFlag) {
    return res.status(400).json({ error: "Active Flag is required" });
  }

  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN 
        aoin_Subcategory_ins(
          :in_userId,
          :in_mode,
          :in_ulbId,
          :in_subcategoryId,
          :in_categoryId,
          :in_subcategoryName,
          :in_activeFlag,
          :in_ipaddress,
          :in_source,
          :out_ErrorCode,
          :out_ErrorMsg
        ); 
      END;`,
      {
        in_userId: { val: in_userId, type: oracledb.STRING },
        in_mode: { val: Number(in_mode), type: oracledb.NUMBER },
        in_ulbId: { val: Number(in_ulbId), type: oracledb.NUMBER },
        in_subcategoryId: {
          val: in_subcategoryId ? Number(in_subcategoryId) : null,
          type: oracledb.NUMBER,
        },
        in_categoryId: {
          val: Number(in_categoryId),
          type: oracledb.NUMBER,
        },
        in_subcategoryName: { val: in_subcategoryName, type: oracledb.STRING },
        in_activeFlag: { val: in_activeFlag, type: oracledb.STRING },
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

    const errorCode = result.outBinds.out_ErrorCode;
    const errorMessage = result.outBinds.out_ErrorMsg;

    return res.status(200).json({
      errorCode,
      message: errorMessage,
    });

  } catch (err) {
    console.error("Subcategory procedure error:", err);

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
const getSingleSubcategory = async (req, res) => {
  const { subcategoryId, ulbId } = req.body;

  if (!subcategoryId || !ulbId) {
    return res.status(400).json({ error: "subcategoryId and ulbId are required" });
  }

  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT 
          sc.num_subcategory_id,
          sc.var_subcategory_name,
          sc.num_subcategory_categoryid,
          sc.num_subcategory_ulbid,
          sc.var_subcategory_activeflag,
          c.var_category_name

      FROM aoin_subcategory_mas sc
      JOIN aoin_category_mas c
        ON sc.num_subcategory_categoryid = c.num_category_id
       AND sc.num_subcategory_ulbid = c.num_category_ulbid

      WHERE sc.num_subcategory_id = :subcategoryId
      AND sc.num_subcategory_ulbid = :ulbId
      `,
      {
        subcategoryId: Number(subcategoryId),
        ulbId: Number(ulbId),
      },
      { outFormat: require("oracledb").OUT_FORMAT_OBJECT }
    );

    return res.status(200).json(result.rows[0] || null);

  } catch (err) {
    console.error("Fetch single subcategory error:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};
const getSubcategoryList = async (req, res) => {
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
          sc.num_subcategory_id        AS subcategory_id,
          sc.var_subcategory_name      AS subcategory_name,
          sc.var_subcategory_activeflag AS active_flag,
          sc.num_subcategory_ulbid     AS ulb_id,
          c.num_category_id            AS category_id,
          c.var_category_name          AS category_name

      FROM aoin_subcategory_mas sc
      JOIN aoin_category_mas c
        ON sc.num_subcategory_categoryid = c.num_category_id
       AND sc.num_subcategory_ulbid = c.num_category_ulbid

      WHERE sc.num_subcategory_ulbid = :ulbId

      ORDER BY c.var_category_name, sc.var_subcategory_name
      `,
      { ulbId: Number(ulbId) },
      { outFormat: require("oracledb").OUT_FORMAT_OBJECT }
    );

    return res.status(200).json(result.rows);

  } catch (err) {
    console.error("Fetch subcategory list error:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};
const getActiveSubcategories = async (req, res) => {
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
          sc.num_subcategory_id,
          sc.var_subcategory_name,
          sc.num_subcategory_categoryid,
          sc.num_subcategory_ulbid

      FROM aoin_subcategory_mas sc
      WHERE sc.var_subcategory_activeflag = 'A'
      AND sc.num_subcategory_ulbid = :ulbId

      ORDER BY sc.var_subcategory_name
      `,
      { ulbId: Number(ulbId) },
      { outFormat: require("oracledb").OUT_FORMAT_OBJECT }
    );

    return res.status(200).json(result.rows);

  } catch (err) {
    console.error("Fetch active subcategories error:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = {
  categoryIns,
  getCategoryActiveList,
  getCategoryListByUlb,
  getCategoryById,
  subcategoryIns,
  getSingleSubcategory,
  getSubcategoryList,
  getActiveSubcategories

};