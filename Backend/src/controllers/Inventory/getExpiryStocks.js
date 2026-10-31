const oracledb = require("oracledb");
const { getConnection } = require("../../config/database.js");

const getNearExpiryList = async (req, res) => {
  let connection;
  try {
    const { ulbid } = req.body; // user gives ulbid

    connection = await getConnection();

    const query = `
   WITH expiry_data AS (
    SELECT 
        a.num_propertyvalue_ulbid        AS ulbid,
        a.num_propertyvalue_entityid     AS entity_id,
        a.num_propertyvalue_attributeid  AS attribute_id,
        pd.var_property_entitytype       AS entity_type,
        pd.var_property_name, 
        a.var_propertyvalue_valuestring,
        a.num_propertyvalue_valuenumber,
        a.dat_propertyvalue_valuedate,
        a.dat_propertyvalue_insdt,

        -- Expiry / Warranty
        CASE 
            WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'shelf_life'
            THEN ADD_MONTHS(a.dat_propertyvalue_insdt, a.num_propertyvalue_valuenumber)
        END AS medicine_expiry_date,

        CASE 
            WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'warranty_until'
            THEN a.dat_propertyvalue_valuedate
        END AS equipment_expiry_date,

        -- Alert Days
        CASE 
            WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'expiry_alert'
            THEN a.num_propertyvalue_valuenumber
        END AS medicine_alert_days,

        CASE 
            WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'warranty_alert'
            THEN a.num_propertyvalue_valuenumber
        END AS equipment_alert_days,

        -- Shopkeeper Stock + Alerts
        CASE WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'max_stock' THEN a.num_propertyvalue_valuenumber END AS medicine_initial_stock,
        CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'total_stocks' THEN a.num_propertyvalue_valuenumber END AS equipment_initial_stock,
        CASE WHEN pd.var_property_entitytype = 'MEDICINE' AND pd.var_property_name = 'min_stock' THEN a.num_propertyvalue_valuenumber END AS medicine_alert_stocks,
        CASE WHEN pd.var_property_entitytype = 'EQUIPMENT' AND pd.var_property_name = 'stocks_alert' THEN a.num_propertyvalue_valuenumber END AS equipment_alert_stocks
    FROM aoin_propertyvalue_mas a
    JOIN aoin_propertydef_mas pd 
      ON a.num_propertyvalue_propertyid = pd.num_propertydef_id
    WHERE a.num_propertyvalue_ulbid = :ulbid
      AND pd.var_property_entitytype IN ('MEDICINE','EQUIPMENT')
)
SELECT 
    e.ulbid,
    e.attribute_id,
    e.entity_type,
    MAX(CASE WHEN e.var_property_name = 'medicine_name' THEN e.var_propertyvalue_valuestring END) AS medicine_name,
    MAX(CASE WHEN e.var_property_name = 'equipment_name' THEN e.var_propertyvalue_valuestring END) AS equipment_name,
    MAX(e.medicine_expiry_date) AS medicine_expiry_date,
    MAX(e.equipment_expiry_date) AS equipment_expiry_date,
    MAX(e.medicine_alert_days) AS medicine_alert_days,
    MAX(e.equipment_alert_days) AS equipment_alert_days,
    MAX(e.medicine_initial_stock) AS medicine_initial_stock,
    MAX(e.equipment_initial_stock) AS equipment_initial_stock,
    MAX(iid.num_issueitem_qtyissued) AS current_stock_pharmacist,
    MAX(e.medicine_alert_stocks) AS medicine_alert_stocks,
    MAX(e.equipment_alert_stocks) AS equipment_alert_stocks,

    CASE 
        WHEN MAX(e.medicine_expiry_date) IS NOT NULL THEN TRUNC(MAX(e.medicine_expiry_date) - SYSDATE)
        WHEN MAX(e.equipment_expiry_date) IS NOT NULL THEN TRUNC(MAX(e.equipment_expiry_date) - SYSDATE)
    END AS days_remaining,

    im.var_issue_issuedby   AS shopkeeper_user,
    im.num_issue_deptid     AS shopkeeper_dept,
    iid.var_issueitem_name  AS pharmacist_item,
    NVL(iid.num_issueitem_qtyissued, 0) AS pharmacist_qty,

    -- 💡 Identify Alert Type
    CASE 
        WHEN (e.entity_type = 'MEDICINE' AND MAX(e.medicine_initial_stock) <= MAX(e.medicine_alert_stocks))
          OR (e.entity_type = 'EQUIPMENT' AND MAX(e.equipment_initial_stock) <= MAX(e.equipment_alert_stocks))
        THEN 'Shopkeeper Stock Alert'
        
        WHEN MAX(iid.num_issueitem_qtyissued) <= 10
        THEN 'Pharmacist Stock Alert'

        WHEN (e.entity_type = 'MEDICINE' AND MAX(e.medicine_expiry_date) BETWEEN SYSDATE AND SYSDATE + NVL(MAX(e.medicine_alert_days),0))
          OR (e.entity_type = 'EQUIPMENT' AND MAX(e.equipment_expiry_date) BETWEEN SYSDATE AND SYSDATE + NVL(MAX(e.equipment_alert_days),0))
        THEN 'Expiry/Warranty Alert'

        ELSE 'No Alert'
    END AS alert_for

FROM expiry_data e
JOIN aoin_issueitem_det iid
  ON iid.num_issueitem_attributeid = e.attribute_id
  AND iid.num_issueitem_ulbid = e.ulbid
JOIN aoin_issue_mas im
  ON iid.num_issueitem_issueid = im.num_issue_id 
GROUP BY 
    e.ulbid, e.entity_type, e.attribute_id, 
    im.var_issue_issuedby, im.num_issue_deptid, 
    iid.var_issueitem_name, iid.num_issueitem_qtyissued
HAVING (
       (e.entity_type = 'MEDICINE' AND MAX(e.medicine_expiry_date) BETWEEN SYSDATE AND SYSDATE + NVL(MAX(e.medicine_alert_days),0))
    OR (e.entity_type = 'EQUIPMENT' AND MAX(e.equipment_expiry_date) BETWEEN SYSDATE AND SYSDATE + NVL(MAX(e.equipment_alert_days),0))
    OR (e.entity_type = 'MEDICINE' AND (MAX(e.medicine_initial_stock) <= MAX(e.medicine_alert_stocks)))
    OR (e.entity_type = 'EQUIPMENT' AND (MAX(e.equipment_initial_stock) <= MAX(e.equipment_alert_stocks)))
    OR MAX(iid.num_issueitem_qtyissued) <= 10
)
ORDER BY e.entity_type, e.attribute_id

`;

    const result = await connection.execute(
      query,
      { ulbid },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json({
      success: true,
      data: result.rows || []
    });

  } catch (err) {
    console.error("Error fetching near expiry list:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
};


module.exports = {getNearExpiryList};