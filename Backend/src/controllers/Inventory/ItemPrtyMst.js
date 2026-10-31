const oracledb = require("oracledb");
const { getConnection } = require("../../config/database.js");

const savePropertyDefinition = async (req, res) => {
  let connection;
  try {
    const {
      num_propertydef_ulbid,
      var_property_entitytype,
      var_property_name,
      var_property_displaylabel,
      var_property_datatype,
      var_property_allowedvalues,
      var_property_required,
      num_property_sortorder,
      var_property_flag,
      var_property_insby,
      var_property_updby
    } = req.body;

    connection = await getConnection();

    // Generate nextId manually
    const idResult = await connection.execute(
      `SELECT NVL(MAX(num_propertydef_id), 0) + 1 as NEXTID 
       FROM aoin_propertydef_mas`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const nextId = idResult.rows[0].NEXTID;

    const sql = `
      INSERT INTO aoin_propertydef_mas (
        num_propertydef_id,
        num_propertydef_ulbid,
        var_property_entitytype,
        var_property_name,
        var_property_displaylabel,
        var_property_datatype,
        var_property_allowedvalues,
        var_property_required,
        num_property_sortorder,
        var_property_flag,
        var_property_insby,
        dat_property_insdt,
        var_property_updby,
        dat_property_upddt
      )
      VALUES (
        :id, :ulbId, :entityType, :name, :displayLabel, :datatype,
        :allowed, :required, :sortOrder, :flag, :insBy, SYSDATE, :updBy, SYSDATE
      )
    `;

    const binds = {
      id: nextId,
      ulbId: num_propertydef_ulbid || null,
      entityType: var_property_entitytype,
      name: var_property_name,
      displayLabel: var_property_displaylabel,
      datatype: var_property_datatype,
      allowed: var_property_allowedvalues || null,
      required: var_property_required,
      sortOrder: num_property_sortorder,
      flag: var_property_flag || "A",
      insBy: var_property_insby || "system",
      updBy: var_property_updby || "system"
    };

    await connection.execute(sql, binds, { autoCommit: true });

    res.json({ message: "Property definition saved successfully", id: nextId });
  } catch (err) {
    console.error("Error saving property definition:", err);
    res.status(500).json({ error: "Failed to save property definition" });
  } finally {
    if (connection) await connection.close();
  }
};


// Fetch property definitions by entity type (Medicine, Equipment, etc.)
const getPropertyDefinitions = async (req, res) => {
    console.log("hii");
  let connection;
  try {
const { entityType } = req.body;
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT num_propertydef_id,
              var_property_entitytype,
              var_property_name,
              var_property_displaylabel,
              var_property_datatype,
              var_property_allowedvalues,
              var_property_required,
              num_property_sortorder
       FROM aoin_propertydef_mas
       WHERE var_property_flag = 'A'
         AND var_property_entitytype = :entityType
       ORDER BY num_property_sortorder`,
      [entityType],
      { outFormat: require("oracledb").OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch property definitions" });
  } finally {
    if (connection) await connection.close();
  }
};

// Insert/Update property values

const savePropertyValues = async (req, res) => {
  let connection;
  try {
    const { entityId, values } = req.body; // values = array of property values
    connection = await getConnection();

    for (let val of values) {
      const { num_propertyvalue_propertydefid, value } = val;

      // Generate next ID manually
      const idResult = await connection.execute(
        `SELECT NVL(MAX(num_propertyvalue_id), 0) + 1 as NEXTID 
         FROM aoin_propertyvalue_mas`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const nextId = idResult.rows[0].NEXTID;

      let sql = "";
      let binds = {};

      switch (typeof value) {
        case "number": // NUMBER
          sql = `
            INSERT INTO aoin_propertyvalue_mas (
              num_propertyvalue_id, num_propertyvalue_ulbid,
              num_propertyvalue_propertydefid, num_propertyvalue_entityid,
              num_propertyvalue_valuenumber, var_propertyvalue_insby,
              var_propertyvalue_updby, dat_propertyvalue_upddt
            )
            VALUES (:id, :ulbId, :defId, :entityId, :numVal, :insBy, :updBy, SYSDATE)
          `;
          binds = {
            id: nextId,
            ulbId: ulbId, // adjust or take from req
            defId: num_propertyvalue_propertydefid,
            entityId,
            numVal: value,
            insBy: "admin",
            updBy: "admin"
          };
          break;

        case "boolean": // BOOLEAN
          sql = `
            INSERT INTO aoin_propertyvalue_mas (
              num_propertyvalue_id, num_propertyvalue_ulbid,
              num_propertyvalue_propertydefid, num_propertyvalue_entityid,
              var_propertyvalue_valuebool, var_propertyvalue_insby,
              var_propertyvalue_updby, dat_propertyvalue_upddt
            )
            VALUES (:id, :ulbId, :defId, :entityId, :boolVal, :insBy, :updBy, SYSDATE)
          `;
          binds = {
            id: nextId,
            ulbId: ulbId,
            defId: num_propertyvalue_propertydefid,
            entityId,
            boolVal: value ? "Y" : "N",
            insBy: "admin",
            updBy: "admin"
          };
          break;

        case "string": // STRING or DATE
          if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            // DATE
            sql = `
              INSERT INTO aoin_propertyvalue_mas (
                num_propertyvalue_id, num_propertyvalue_ulbid,
                num_propertyvalue_propertydefid, num_propertyvalue_entityid,
                dat_propertyvalue_valuedate, var_propertyvalue_insby,
                var_propertyvalue_updby, dat_propertyvalue_upddt
              )
              VALUES (:id, :ulbId, :defId, :entityId, TO_DATE(:dateVal, 'YYYY-MM-DD'), :insBy, :updBy, SYSDATE)
            `;
            binds = {
              id: nextId,
              ulbId: ulbId,
              defId: num_propertyvalue_propertydefid,
              entityId,
              dateVal: value,
              insBy: insBy,
              updBy: updBy
            };
          } else {
            // STRING
            sql = `
              INSERT INTO aoin_propertyvalue_mas (
                num_propertyvalue_id, num_propertyvalue_ulbid,
                num_propertyvalue_propertydefid, num_propertyvalue_entityid,
                var_propertyvalue_valuestring, var_propertyvalue_insby,
                var_propertyvalue_updby, dat_propertyvalue_upddt
              )
              VALUES (:id, :ulbId, :defId, :entityId, :strVal, :insBy, :updBy, SYSDATE)
            `;
            binds = {
              id: nextId,
              ulbId: ulbId,
              defId: num_propertyvalue_propertydefid,
              entityId,
              strVal: value,
              insBy: "admin",
              updBy: "admin"
            };
          }
          break;

        default:
          // fallback JSON (clob)
          sql = `
            INSERT INTO aoin_propertyvalue_mas (
              num_propertyvalue_id, num_propertyvalue_ulbid,
              num_propertyvalue_propertydefid, num_propertyvalue_entityid,
              clob_propertyvalue_valuejson, var_propertyvalue_insby,
              var_propertyvalue_updby, dat_propertyvalue_upddt
            )
            VALUES (:id, :ulbId, :defId, :entityId, :jsonVal, :insBy, :updBy, SYSDATE)
          `;
          binds = {
            id: nextId,
            ulbId: ulbId,
            defId: num_propertyvalue_propertydefid,
            entityId,
            jsonVal: JSON.stringify(value),
            insBy: "admin",
            updBy: "admin"
          };
      }

      await connection.execute(sql, binds, { autoCommit: false });
    }

    await connection.commit();
    res.json({ message: "Property values saved successfully" });
  } catch (err) {
    console.error("Error inserting property values:", err);
    res.status(500).json({ error: "Failed to save property values" });
  } finally {
    if (connection) await connection.close();
  }
};


module.exports = {savePropertyDefinition,
  getPropertyDefinitions,
  savePropertyValues,
};
