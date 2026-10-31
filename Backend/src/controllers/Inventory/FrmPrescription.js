const oracledb = require("oracledb");
const { getOPDDBConnection } = require("../../config/database");

const aopd_prescription_ins = async (req, res) => {
  let connection;

  try {
    const {
      In_userid,
      In_prescriptionid,
      In_consultationid,
      In_patientid,
      In_opdid,
      In_doctorid,
      In_prescrdate,
      In_language,
      In_status,
      In_str,
      In_ulbid,
      In_mode,
      in_priscflag,
      In_ipaddress,
      In_source,
    } = req.body;

    connection = await getOPDDBConnection();

    const result = await connection.execute(
      `BEGIN aopd_prescription_ins(
        :In_userid,
        :In_prescriptionid,
        :In_consultationid,
        :In_patientid,
        :In_opdid,
        :In_doctorid,
        :In_prescrdate,
        :In_language,
        :In_status,
        :In_str,
        :In_ulbid,
        :In_mode,
        :in_priscflag,
        :In_ipaddress,
        :In_source,
        :out_ErrorCode,
        :Out_ErrorMsg
      ); END;`,
      {
        In_userid,
        In_prescriptionid,
        In_consultationid,
        In_patientid,
        In_opdid,
        In_doctorid,
        In_prescrdate,
        In_language,
        In_status,
        In_str,
        In_ulbid,
        In_mode,
        in_priscflag,
        In_ipaddress,
        In_source,
        out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        Out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      },
      { autoCommit: true },
    );

    res.status(200).json({
      success: true,
      errorCode: result.outBinds.out_ErrorCode,
      errorMessage: result.outBinds.Out_ErrorMsg,
    });
  } catch (error) {
    console.error("Error calling procedure:", error);
    res.status(500).json({
      success: false,
      message: "Error executing procedure.",
      error: error.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

// const getPrescriptionDetails = async (req, res) => {
//   let connection;
//   try {
//     const { In_patientid } = req.body;

//     if (!In_patientid) {
//       return res.status(400).json({ error: "Missing required parameter: In_patientid" });
//     }

//     connection = await getConnection();

//     const query = `
//       SELECT *
//       FROM aopd_prescription_mas m
//       JOIN aopd_prescription_det d
//         ON m.num_prescription_id = d.num_prescription_prescriptionid
//       WHERE m.num_prescription_patientid = :In_patientid
//     `;

//     const result = await connection.execute(
//       query,
//       { In_patientid },
//       { outFormat: oracledb.OUT_FORMAT_OBJECT }
//     );

//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching prescription details:", err);
//     res.status(500).json({ error: err.message });
//   } finally {
//     if (connection) {
//       try {
//         await connection.close();
//       } catch (err) {
//         console.error("Error closing connection:", err);
//       }
//     }
//   }
// };

const getPrescriptionList = async (req, res) => {
  let connection;

  try {
    const { ulbid } = req.body;

    if (!ulbid) {
      return res
        .status(400)
        .json({ error: "Missing required parameter: ulbid" });
    }

    connection = await getOPDDBConnection();

    const query = `
     SELECT 
    p.num_prescription_id,
    p.num_prescription_consultationid,
    p.num_prescription_patientid,
    pat.var_patient_ename, 
    p.num_prescription_opdid,
    p.var_prescription_language,
    o.var_opd_name,
    o.var_opd_code,
    p.num_prescription_doctorid,
    d.var_doc_ename,
    p.dat_prescription_prescrdate,
    p.var_prescription_status,
    p.var_prescription_flag
FROM aopd_prescription_mas p
LEFT JOIN aopd_doctors_mas d 
    ON p.num_prescription_doctorid = d.num_doc_id
   AND d.var_doc_flag = 'Y'
LEFT JOIN aopd_opd_mas o 
    ON p.num_prescription_opdid = o.num_opd_id
LEFT JOIN aopd_patients_mas pat
    ON p.num_prescription_patientid = pat.num_patient_id
WHERE p.num_prescription_ulbid = :ulbid and p.var_prescription_flag='Y'
ORDER BY p.dat_prescription_prescrdate DESC
`;

    const result = await connection.execute(
      query,
      { ulbid }, // Named binding
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching prescriptions:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
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

const getConsultDataByPId = async (req, res) => {
  const { ulbid, consultId } = req.body;

  if (!ulbid || !consultId) {
    return res.status(400).json({ error: "ulbid and consultId are required" });
  }

  let connection;

  try {
    connection = await getOPDDBConnection();

    const query = `
      SELECT 
        num_consultation_id,
        num_consultation_patientid,
        num_consultation_doctortid,
        num_consultation_opdid
      FROM 
        aopd_consultation_mas
      WHERE 
        num_consultation_ulbid = :ulbid
        AND num_consultation_id = :consultId
      ORDER BY num_consultation_id DESC

      
    `;

    const result = await connection.execute(
      query,
      {
        ulbid: Number(ulbid),
        consultId: Number(consultId),
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching consultation list:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
};

const getPrescriptionDetails = async (req, res) => {
  let connection;

  try {
    const { ulbid, consultId } = req.body;

    if (!ulbid || !consultId) {
      return res.status(400).json({ error: "Missing ulbid or consultId" });
    }

    // Auto convert all CLOB columns to string
    oracledb.fetchAsString = [oracledb.CLOB];

    connection = await getOPDDBConnection();

    const query = `
  SELECT 
      c.NUM_CONSULTATION_ID              AS num_consultation_id,
      c.NUM_CONSULTATION_PATIENTID       AS num_consultation_patientid,
      c.NUM_CONSULTATION_DOCTORTID       AS num_consultation_doctortid,
      c.NUM_CONSULTATION_OPDID           AS num_consultation_opdid,
      c.DAT_CONSULTATION_VISITDATE       AS dat_consultation_visitdate,
      c.VAR_CONSULTATION_VITALS          AS var_consultation_vitals,
      c.NUM_CONSULTATION_DIAGNCODEID     AS num_consultation_diagngcodeid,
      dm.VAR_DIAGN_DIAGNCODE             As var_diagn_diagncode,
      c.VAR_CONSULTATION_CLINICALNOTES   AS var_consultation_clinicalnotes,
      c.VAR_CONSULTATION_TESTS           AS var_consultation_tests,
      c.VAR_CONSULTATION_REFERRAL        AS var_consultation_referral,
      c.VAR_CONSULTATION_STATUS          AS var_consultation_status,
      c.VAR_CONSULTATION_ATTACHMENT      AS var_consultation_attachment,
      c.NUM_CONSULTATION_ULBID           AS num_consultation_ulbid,
      c.VAR_CONSULTATION_INSBY           AS var_consultation_insby,
      c.DAT_CONSULTATION_INSDT           AS dat_consultation_insdt,
      c.VAR_CONSULTATION_UPDBY           AS var_consultation_updby,
      c.DAT_CONSULTATION_UPDT            AS dat_consultation_updt,

      p.NUM_PRESCRIPTION_ID              AS num_prescription_id,
      p.NUM_PRESCRIPTION_CONSULTATIONID  AS num_prescription_consultationid,
      p.NUM_PRESCRIPTION_PATIENTID       AS num_prescription_patientid,
      p.NUM_PRESCRIPTION_OPDID           AS num_prescription_opdid,
      p.NUM_PRESCRIPTION_DOCTORID        AS num_prescription_doctorid,
      p.DAT_PRESCRIPTION_PRESCRDATE      AS dat_prescription_prescrdate,
      p.VAR_PRESCRIPTION_LANGUAGE        AS var_prescription_language,
      p.VAR_PRESCRIPTION_STATUS          AS var_prescription_status,
      p.NUM_PRESCRIPTION_ULBID           AS num_prescription_ulbid,
      p.VAR_PRESCRIPTION_INSBY           AS var_prescription_insby,
      p.DAT_PRESCRIPTION_INSDT           AS dat_prescription_insdt,
      p.VAR_PRESCRIPTION_UPDBY           AS var_prescription_updby,
      p.DAT_PRESCRIPTION_UPDDT           AS dat_prescription_upddt,

      d.NUM_PRESCRIPTIONDET_ID           AS num_prescriptiondet_id,
      d.NUM_PRESCRIPTION_PRESCRIPTIONID  AS num_prescription_prescriptionid,
      d.VAR_PRESCRIPTION_MEDICINENAME    AS var_prescription_medicinename,
      d.VAR_PRESCRIPTION_DOSAGE          AS var_prescription_dosage,
      d.VAR_PRESCRIPTION_FREQUENCY       AS var_prescription_frequency,
      d.NUM_PRESCRIPTION_DURATIONDAYS    AS num_prescription_durationdays,
      d.VAR_PRESCRIPTION_INSTRUCTIONS    AS var_prescription_instructions,

      pat.NUM_PATIENT_ID                 AS num_patient_id,
      pat.VAR_PATIENT_ENAME               AS var_patient_ename,
      pat.VAR_PATIENT_MNAME               AS var_patient_mname,
      pat.NUM_PATIENT_CARDNO              AS num_patient_cardno,
      pat.DAT_PATIENT_DOB                 AS dat_patient_dob,
      pat.VAR_PATIENT_GENDER              AS var_patient_gender,
      pat.NUM_PATIENT_ADHAARNO            AS num_patient_adhaarno,
      pat.NUM_PATIENT_MOBILENO            AS num_patient_mobileno,
      pat.VAR_PATIENT_ADDRESS             AS var_patient_address,

      doc.NUM_DOC_ID                      AS num_doc_id,
      doc.VAR_DOC_ENAME                   AS var_doc_ename

  FROM 
      aopd_consultation_mas c
  JOIN 
      aopd_prescription_mas p 
      ON c.NUM_CONSULTATION_ID = p.NUM_PRESCRIPTION_CONSULTATIONID
  JOIN 
      aopd_prescription_det d 
      ON p.NUM_PRESCRIPTION_ID = d.NUM_PRESCRIPTION_PRESCRIPTIONID
  JOIN 
      aopd_patients_mas pat
      ON c.NUM_CONSULTATION_PATIENTID = pat.NUM_PATIENT_ID
  LEFT JOIN 
      aopd_doctors_mas doc
      ON c.NUM_CONSULTATION_DOCTORTID = doc.NUM_DOC_ID
      AND doc.VAR_DOC_FLAG = 'Y'
  JOIN 
      aopd_Diagnosis_mas dm
      ON c.NUM_CONSULTATION_DIAGNCODEID = dm.num_diagn_id
  WHERE 
      c.NUM_CONSULTATION_ULBID = :ulbid
      AND c.num_consultation_id = :consultId
`;

    const result = await connection.execute(
      query,
      { ulbid, consultId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching consultation prescriptions:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

module.exports = {
  aopd_prescription_ins,
  getPrescriptionList,
  getConsultDataByPId,
  getPrescriptionDetails,
};