const oracledb = require("oracledb");
const { getConnection } = require("../../config/database.js");

// Controller for Vendor Insert/Update/Delete
const vendorIns = async (req, res) => {
  const {
    in_userId,
    in_mode,
    in_ulbId,
    in_vendorId = null,
    in_vendorCode = null,
    in_vendorName,
    in_vendorAddress = null,
    in_contactPerson = null,
    in_phone = null,
    in_email = null,
    in_paymentTerms = null,
    in_creditLimit = null,
    in_rating = null,
    in_flag,
    in_ipaddress = null,
    in_source = null,
    in_gstin = null,      // ✅ ADDED
    in_panno = null       // ✅ ADDED
  } = req.body;

  // Proper validation
  if (!in_userId || in_mode === undefined || !in_ulbId || !in_vendorName || !in_flag) {
    return res.status(400).json({
      error: "Required fields: userId, mode, ulbId, vendorName, flag"
    });
  }

  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN 
        aoin_Vendor_ins(
          :in_userId,
          :in_mode,
          :in_ulbId,
          :in_vendorId,
          :in_vendorCode,
          :in_vendorName,
          :in_vendorAddress,
          :in_contactPerson,
          :in_phone,
          :in_email,
          :in_paymentTerms,
          :in_creditLimit,
          :in_rating,
          :in_flag,
          :in_ipaddress,
          :in_source,
          :in_gstin,
          :in_panno,
          :out_ErrorCode,
          :out_ErrorMsg
        ); 
      END;`,
      {
        in_userId: { val: in_userId, type: oracledb.STRING },
        in_mode: { val: Number(in_mode), type: oracledb.NUMBER },
        in_ulbId: { val: Number(in_ulbId), type: oracledb.NUMBER },
        in_vendorId: { val: in_vendorId ? Number(in_vendorId) : null, type: oracledb.NUMBER },
        in_vendorCode: { val: in_vendorCode, type: oracledb.STRING },
        in_vendorName: { val: in_vendorName, type: oracledb.STRING },
        in_vendorAddress: { val: in_vendorAddress, type: oracledb.STRING },
        in_contactPerson: { val: in_contactPerson, type: oracledb.STRING },
        in_phone: { val: in_phone ? Number(in_phone) : null, type: oracledb.NUMBER },
        in_email: { val: in_email, type: oracledb.STRING },
        in_paymentTerms: { val: in_paymentTerms, type: oracledb.STRING },
        in_creditLimit: { val: in_creditLimit ? Number(in_creditLimit) : null, type: oracledb.NUMBER },
        in_rating: { val: in_rating ? Number(in_rating) : null, type: oracledb.NUMBER },
        in_flag: { val: in_flag, type: oracledb.STRING },
        in_ipaddress: { val: in_ipaddress, type: oracledb.STRING },
        in_source: { val: in_source, type: oracledb.STRING },
        in_gstin: { val: in_gstin, type: oracledb.STRING },   // ✅
        in_panno: { val: in_panno, type: oracledb.STRING },   // ✅
        out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 }
      },
      { autoCommit: true }
    );

    res.status(200).json({
      errorCode: result.outBinds.out_ErrorCode,
      message: result.outBinds.out_ErrorMsg
    });

  } catch (err) {
    console.error("Vendor procedure error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

const vendorList = async (req, res) => {
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
          a.num_vendor_id         AS vendor_id,
          a.var_vendor_code       AS vendor_code,
          a.var_vendor_name       AS vendor_name,
          a.var_vendor_address    AS vendor_address,
          a.var_vendor_contactperson AS contact_person,
          a.num_vendor_phone      AS phone,
          a.var_vendor_email      AS email,
          a.var_vendor_paymentterms AS payment_terms,
          a.num_vendor_creditlimit AS credit_limit,
          a.num_vendor_rating     AS rating,
          a.var_vendor_gstin      AS gstin,        -- ✅
          a.var_vendor_panno      AS panno,        -- ✅
          a.num_vendor_ulbid      AS ulb_id,
          a.var_vendor_flag       AS flag,
          TO_CHAR(a.dat_vendor_insdt,'DD/MM/YYYY HH24:MI:SS') AS ins_date,
          TO_CHAR(a.dat_vendor_upddt,'DD/MM/YYYY HH24:MI:SS') AS upd_date
      FROM aoin_vendor_mas a
      WHERE a.num_vendor_ulbid = :ulbId
      ORDER BY a.dat_vendor_insdt DESC
      `,
      { ulbId: Number(ulbId) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

const vendorsById = async (req, res) => {
  const { ulbId, vendorId } = req.body;

  if (!ulbId || !vendorId) {
    return res.status(400).json({ error: "ulbId and vendorId required" });
  }

  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT 
          a.num_vendor_id         AS vendor_id,
          a.var_vendor_code       AS vendor_code,
          a.var_vendor_name       AS vendor_name,
          a.var_vendor_address    AS vendor_address,
          a.var_vendor_contactperson AS contact_person,
          a.num_vendor_phone      AS phone,
          a.var_vendor_email      AS email,
          a.var_vendor_paymentterms AS payment_terms,
          a.num_vendor_creditlimit AS credit_limit,
          a.num_vendor_rating     AS rating,
          a.var_vendor_gstin      AS gstin,
          a.var_vendor_panno      AS panno,
          a.var_vendor_flag       AS flag,
          a.num_vendor_ulbid      AS ulb_id
      FROM aoin_vendor_mas a
      WHERE a.num_vendor_ulbid = :ulbId
        AND a.num_vendor_id = :vendorId
      `,
      {
        ulbId: Number(ulbId),
        vendorId: Number(vendorId)
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows[0] || {});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = { vendorIns, vendorList,vendorsById };

