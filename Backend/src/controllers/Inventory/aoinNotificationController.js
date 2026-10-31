const oracledb = require("oracledb");
const { getConnection } = require("../../config/database.js");

const notificationIns = async (req, res) => {
  const {
    in_userId,
    in_mode,
    in_ulbId,
    in_notificationId,
    in_title,
    in_message,
    in_type,
    in_entityType,
    in_entityId,
    in_readStatus,
    in_ipaddress,
    in_source,
  } = req.body;

  // ✅ Basic validation
  if (!in_userId || !in_mode || !in_ulbId || !in_title || !in_type) {
    return res.status(400).json({
      error:
        "Missing required fields (userId, mode, ulbId, title, type)",
    });
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN aoin_Notification_ins(
          :in_userId,
          :in_mode,
          :in_ulbId,
          :in_notificationId,
          :in_title,
          :in_message,
          :in_type,
          :in_entityType,
          :in_entityId,
          :in_readStatus,
          :in_ipaddress,
          :in_source,
          :out_ErrorCode,
          :out_ErrorMsg
        ); END;`,
      {
        in_userId,
        in_mode,
        in_ulbId,
        in_notificationId,
        in_title,
        in_message,
        in_type,
        in_entityType,
        in_entityId,
        in_readStatus,
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
    console.error("Notification procedure error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = { notificationIns };
