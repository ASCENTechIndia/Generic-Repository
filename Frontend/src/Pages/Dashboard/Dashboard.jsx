import React, { useState, useEffect } from "react";
import Navbar from "../../HOC/Navbar/Navbar";
import HeaderLabel from "../../Components/HeaderLabel";
import Header from "../../HOC/Header/Header";
import { Link } from "react-router-dom";
import TableComponent from "../../Pages/Dashboard/TableComponent";
import PieChartCard from "./PieChaRTCard";
import Layout from "../../Components/Layout";
import {useAuth} from "../../Context/AuthContext"
import { Users, Stethoscope } from "lucide-react"; 
import apiService from "../../../apiService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FrmAlerts from "../Transaction/FrmAlerts/FrmAlerts";

const Dashboard = () => {
  const {user} = useAuth(); 
    const ulbId = user?.ulbId;
  const opdID=user?.opdid;

 const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);

  //   useEffect(() => {
  //     if(!ulbId && !opdID) return;
  //   const fetchCounts = async () => {
  //     try {
  //       // Patients API
  //       const patientsRes = await apiService.post("countPatients", {
  //         ulbid: ulbId,
  //         opdid: opdID,
  //       });
  //      setPatientCount(patientsRes?.data?.patients_count || 0);

  //       // Doctors API
  //       if(!ulbId) return;
  //       const doctorsRes = await apiService.post("activeDoctors", {
  //         ulbid: ulbId,
  //       });
  //       setDoctorCount(doctorsRes?.data?.data?.ACTIVE_DOCTORS || 0);
  //     } catch (error) {
  //       console.error("Error fetching counts:", error);
  //     }
  //   };

  //   fetchCounts();
  // }, [ulbId, opdID]);

  return (
 <Layout
      title=""
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "",
      }}
    >
      
   <ToastContainer position="top-right" autoClose={8000} />
    <div style={{ display: "none" }}>
        <FrmAlerts />
      </div>
   {/* <div className="flex flex-col md:flex-row gap-6 w-full">
  <div className="md:w-2/3 w-full">
    <TableComponent />
  </div>

<div className="md:w-1/3 w-full flex flex-col gap-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center gap-x-3">
      <Stethoscope className="w-8 h-10 text-blue-500" />
      <div className="flex flex-col text-center sm:text-left">
        <h3 className="text-sm font-medium text-gray-700">Doctors on Duty</h3>
        <p className="text-2xl font-bold text-blue-600">{doctorCount}</p>
      </div>
    </div>

    <div className="bg-white shadow-md rounded-lg p-4 flex items-center gap-x-3">
      <Users className="w-8 h-10 text-green-500" />
      <div className="flex flex-col text-center sm:text-left">
        <h3 className="text-sm font-medium text-gray-700">Patients Registered</h3>
        <p className="text-2xl font-bold text-green-600">{patientCount}</p>
      </div>
    </div>
  </div>

  <div className="bg-white shadow-md rounded-lg p-4 flex-1">
    <PieChartCard />
  </div>
</div>

</div> */}


   
   
 </Layout>
  );
};

export default Dashboard;
