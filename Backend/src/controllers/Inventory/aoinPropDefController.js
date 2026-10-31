const oracledb = require("oracledb");
const { getConnection } = require("../../config/database.js");

const propertyDefIns = async (req, res) => {
  const {
    in_userId,
    in_mode,
    in_ulbId,
    in_propertyDefId,
    in_entityType,
    in_propertyName,
    in_displayLabel,
    in_dataType,
    in_allowedValues,
    in_required,
    in_sortOrder,
    in_flag,
    in_ipaddress,
    in_source,
  } = req.body;

  // ✅ Basic validation
  if (!in_userId || !in_mode || !in_ulbId || !in_entityType || !in_propertyName || !in_dataType || !in_flag) {
    return res.status(400).json({
      error:
        "Missing required fields (userId, mode, ulbId, entityType, propertyName, dataType, flag)",
    });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN aoin_PropertyDef_ins(
          :in_userId,
          :in_mode,
          :in_ulbId,
          :in_propertyDefId,
          :in_entityType,
          :in_propertyName,
          :in_displayLabel,
          :in_dataType,
          :in_allowedValues,
          :in_required,
          :in_sortOrder,
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
        in_propertyDefId,
        in_entityType,
        in_propertyName,
        in_displayLabel,
        in_dataType,
        in_allowedValues,
        in_required,
        in_sortOrder,
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
    console.error("PropertyDef procedure error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

module.exports = { propertyDefIns };
