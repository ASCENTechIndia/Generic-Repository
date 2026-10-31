// src/controllers/itemController.js
const oracledb = require("oracledb");
const { getConnection } = require("../../config/database.js");



const departmentIns = async (req, res) => {
  const {
    in_userId,
    in_mode,
    in_ulbId,
    in_deptId,
    in_facilityId,
    in_deptName,
    in_deptType,
    in_flag,
    in_ipaddress,
    in_source,
  } = req.body;

  // ✅ Basic validation
  if (!in_userId || !in_mode || !in_ulbId || !in_facilityId || !in_deptName || !in_flag) {
    return res.status(400).json({
      error: "Missing required fields (userId, mode, ulbId, facilityId, deptName, flag)",
    });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN aoin_Department_ins(
          :in_userId,
          :in_mode,
          :in_ulbId,
          :in_deptId,
          :in_facilityId,
          :in_deptName,
          :in_deptType,
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
        in_deptId,
        in_facilityId,
        in_deptName,
        in_deptType,
        in_flag,
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
    console.error("Department procedure error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const getDepartmentsWithFacility = async (req, res) => {
  const { in_ulbId } = req.body; // ✅ we’ll pass ulbId in POST body

  if (!in_ulbId) {
    return res.status(400).json({ error: "Missing required field (ulbId)" });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT 
          d.num_dept_id,
          d.var_dept_name,
          d.var_dept_type,
          d.var_dept_flag,
          d.num_dept_ulbid,
          d.num_dept_facilityid,
          f.var_facility_name AS facility_name
       FROM aoin_department_mas d
       JOIN aoin_facility_mas f 
         ON d.num_dept_facilityid = f.num_facility_id
        AND d.num_dept_ulbid = f.num_facility_ulbid
       WHERE d.num_dept_ulbid = :in_ulbId`,
      { in_ulbId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Fetch departments error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const getDeptById = async (req, res) => {
  try {
    const { deptId } = req.body;

    if (!deptId) {
      return res.status(400).json({ error: "Missing required field (deptId)" });
    }

    const connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT 
          d.num_dept_id,
          d.var_dept_name,
          d.var_dept_type,
          d.var_dept_flag,
          d.num_dept_ulbid,
          d.num_dept_facilityid,
          f.var_facility_name AS facility_name
      FROM 
          aoin_department_mas d
      JOIN 
          aoin_facility_mas f 
          ON d.num_dept_facilityid = f.num_facility_id
         AND d.num_dept_ulbid = f.num_facility_ulbid
      WHERE d.num_dept_id = :deptId
      `,
      { deptId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json(result.rows[0]); // only one dept expected
    await connection.close();
  } catch (err) {
    console.error("Error in getDeptById:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { departmentIns, getDepartmentsWithFacility,getDeptById };
