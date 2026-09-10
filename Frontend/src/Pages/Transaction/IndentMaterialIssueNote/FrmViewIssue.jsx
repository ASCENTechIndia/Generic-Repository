import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import { Printer, ArrowLeft } from "lucide-react";

const FrmViewIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy issue data
  const issue = {
    issueNo: id,
    item: "Paracetamol 500mg",
    issuedTo: "John Doe",
    quantity: 20,
    date: "02-Sep-2025",
    status: "Completed",
    remarks: "For fever management",
  };

  return (
    <Layout
      title="Issue Details"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Issue Details",
      }}
    >
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Issue No: {issue.issueNo}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><strong>Item:</strong> {issue.item}</div>
          <div><strong>Issued To:</strong> {issue.issuedTo}</div>
          <div><strong>Quantity:</strong> {issue.quantity}</div>
          <div><strong>Date:</strong> {issue.date}</div>
          <div><strong>Status:</strong> {issue.status}</div>
          <div className="md:col-span-2"><strong>Remarks:</strong> {issue.remarks}</div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={() => navigate("/Transaction/FrmIssueDispense")}
            className="bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default FrmViewIssue;
