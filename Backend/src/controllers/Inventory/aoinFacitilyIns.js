// src/controllers/itemController.js
const oracledb = require("oracledb");
const { getConnection } = require("../../config/database.js");

const facilityIns = async (req, res) => {
  const {
    in_userId,
    in_mode,
    in_ulbId,
    in_facilityId,
    in_facilityName,
    in_facilityType,
    in_facilityLoc,
    in_parentFacId,
    in_flag,
    in_ipaddress,
    in_source,
  } = req.body;

  if (!in_userId || !in_mode || !in_ulbId || !in_facilityName || !in_flag) {
    return res.status(400).json({
      error:
        "Missing required fields (userId, mode, ulbId, facilityName, flag)",
    });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN aoin_Facility_ins(
        :in_userId,
        :in_mode,
        :in_ulbId,
        :in_facilityId,
        :in_facilityName,
        :in_facilityType,
        :in_facilityLoc,
        :in_parentFacId,
        :in_flag,
        :in_ipaddress,
        :in_source,
        :out_ErrorCode,
        :out_ErrorMsg
      ); END;`,
      {
        in_userId,
        in_mode,
        in_ulbId,
        in_facilityId,
        in_facilityName,
        in_facilityType,
        in_facilityLoc,
        in_parentFacId,
        in_flag,
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

    res.status(200).json({
      errorCode: result.outBinds.out_ErrorCode ?? 0,
      errorMessage: result.outBinds.out_ErrorMsg ?? "Success",
    });
  } catch (err) {
    console.error("Facility procedure error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};

const getFacilityActiveList = async (req, res) => {
  const { ulbId } = req.body; // Post parameter

  if (!ulbId) {
    return res.status(400).json({ error: "ulbId is required" });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT num_facility_id AS facility_id,
              var_facility_name AS facility_name
       FROM aoin_facility_mas
       WHERE var_facility_flag = 'A'
         AND num_facility_ulbid = :ulbId`,
      { ulbId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Facility list error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};

// 2. Facility By ID (Autofill)
const getFacilityById = async (req, res) => {
  const { ulbId, facilityId } = req.body; // Post parameters

  if (!ulbId || !facilityId) {
    return res.status(400).json({ error: "ulbId and facilityId are required" });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT num_facility_id       AS facility_id,
              var_facility_name     AS facility_name,
              var_facility_type     AS facility_type,
              var_facility_location AS facility_location,
              num_parent_facility_id AS parent_facility_id,
              var_facility_flag     AS facility_flag,
              num_facility_ulbid    AS ulb_id
       FROM aoin_facility_mas
       WHERE num_facility_id = :facilityId
         AND num_facility_ulbid = :ulbId`,
      { facilityId, ulbId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows[0] || {});
  } catch (err) {
    console.error("Facility fetch by ID error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};

// 3. Full Facility List (with audit fields)
const getFacilityFullList = async (req, res) => {
  const { ulbId } = req.body; // Post parameter

  if (!ulbId) {
    return res.status(400).json({ error: "ulbId is required" });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT num_facility_id       AS facility_id,
              var_facility_name     AS facility_name,
              var_facility_type     AS facility_type,
              var_facility_location AS facility_location,
              num_parent_facility_id AS parent_facility_id,
              var_facility_flag     AS facility_flag,
              num_facility_ulbid    AS ulb_id,
              var_facility_insby    AS inserted_by,
              dat_facility_insdt    AS inserted_date,
              var_facility_updtby   AS updated_by,
              dat_facility_upddt    AS updated_date
       FROM aoin_facility_mas
       WHERE num_facility_ulbid = :ulbId
       ORDER BY dat_facility_insdt DESC`,
      { ulbId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Full Facility list error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = {
  facilityIns,
  getFacilityActiveList,
  getFacilityById,
  getFacilityFullList,
};
