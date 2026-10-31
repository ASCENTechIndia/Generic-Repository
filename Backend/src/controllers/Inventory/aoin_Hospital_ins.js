const oracledb = require("oracledb");
const { getConnection } = require("../../config/database");

const hospitalIns = async (req, res) => {
  const {
    in_userId,
    in_ulbid,
    in_mode,
    in_hospitalId = null,
    in_hospitalName,
    in_location,
    in_activeFlag,
    in_ipaddress = null,
    in_source = null
  } = req.body;

  if (!in_userId || !in_ulbid || !in_mode || !in_hospitalName || !in_activeFlag) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN
        aoin_Hospital_ins(
          :in_userId,
          :in_ulbid,
          :in_mode,
          :in_hospitalId,
          :in_hospitalName,
          :in_location,
          :in_activeFlag,
          :in_ipaddress,
          :in_source,
          :out_ErrorCode,
          :out_ErrorMsg
        );
      END;`,
      {
        in_userId,
        in_ulbid: Number(in_ulbid),
        in_mode: Number(in_mode),
        in_hospitalId: in_hospitalId ? Number(in_hospitalId) : null,
        in_hospitalName,
        in_location,
        in_activeFlag,
        in_ipaddress,
        in_source,
        out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 }
      },
      { autoCommit: true }
    );

    return res.status(200).json({
      errorCode: result.outBinds.out_ErrorCode,
      message: result.outBinds.out_ErrorMsg
    });

  } catch (err) {
    console.error("Hospital procedure error:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

const getHospitalList = async (req, res) => {
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
        num_hospital_id,
        var_hospital_name,
        var_hospital_location,
        var_hospital_activeflag,
        num_hospital_ulbid
      FROM aoin_hospital_mas
      WHERE num_hospital_ulbid = :ulbId
      ORDER BY var_hospital_name
      `,
      { ulbId: Number(ulbId) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return res.status(200).json(result.rows);

  } catch (err) {
    console.error("Hospital list error:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

const getHospitalById = async (req, res) => {
  const { hospitalId, ulbId } = req.body;

  if (!hospitalId || !ulbId) {
    return res.status(400).json({ error: "hospitalId and ulbId required" });
  }

  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT 
        num_hospital_id,
        var_hospital_name,
        var_hospital_location,
        var_hospital_activeflag,
        num_hospital_ulbid
      FROM aoin_hospital_mas
      WHERE num_hospital_id = :hospitalId
      AND num_hospital_ulbid = :ulbId
      `,
      {
        hospitalId: Number(hospitalId),
        ulbId: Number(ulbId)
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return res.status(200).json(result.rows[0] || null);

  } catch (err) {
    console.error("Hospital fetch error:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = { hospitalIns , getHospitalList, getHospitalById};