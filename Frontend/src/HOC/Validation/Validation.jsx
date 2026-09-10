import * as Yup from "yup";
import { getValidationRules } from "./rules";

export const ValidationSchemas = () => {
  const validationRules = getValidationRules();

  return {
    FrmItemMaster: Yup.object({
      code: Yup.string().required("Item code is required"),
      name: Yup.string().required("Item name is required"),
      category: Yup.string().required("Category is required"),
      unit: Yup.string().required("Unit is requried"),
      type: Yup.string().required("Type is requried"),
      flag: Yup.string().required("Flag is required"),
      subCategory: Yup.string().required("Sub Category is required"),
      rate: Yup.string().required("Rate is required"),
    }),
    FrmCategoryMaster: Yup.object({
      categoryName: Yup.string().required("Category name is required"),
      // parentCategoryId: Yup.string().required("Parent category is required"),
      flag: Yup.string().required("Flag is required"),
    }),
    FrmFacilityMaster: Yup.object({
      facilityName: Yup.string().required("Facility name is required"),
      facilityType: Yup.string().required("Facility type is required"),
      facilityLoc: Yup.string().required("Facility Loc is required"),
      // parentFacilityId: Yup.string().required("Parent Facility ID is required"),
      flag: Yup.string().required("Flag is required"),
    }),
    FrmDepartmentMaster: Yup.object({
      facilityId: Yup.string().required("Facility Id is required"),
      departmentName: Yup.string().required("Department name is required"),
      departmentType: Yup.string().required("Department type is required"),
      flag: Yup.string().required("Flag is required"),
    }),
    FrmVendorMaster: Yup.object({
      vendorCode: Yup.string().required("Vendor code is required"),
      vendorName: Yup.string().required("Vendor name is required"),
      contactPerson: Yup.string().required("Contact person is required"),
      phone: validationRules.phone,
      email: Yup.string()
        .required("Email is required")
        .email("Please enter a valid email address"),
      paymentTerms: Yup.string().required("Payment terms is required"),
      creditLimit: Yup.number()
        .typeError("Credit limit must be a number")
        .required("Credit limit is required")
        .min(0, "Credit limit cannot be negative"),
      rating: Yup.number()
        .typeError("Rating must be a number")
        .required("Rating is required")
        .integer("Rating must be a whole number")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5"),
      vendorAddress: Yup.string().required("Vendor address is required"),
      flag: Yup.string().required("Flag is required"),
    }),
    FrmMedicineForm: Yup.object({
      medicineName: Yup.string().required("Medicine name is required"),
      genericName: Yup.string().required("Generic name is required"),
      dosageForm: Yup.string().required("Dosage form is required"),
      strength: Yup.number()
        .typeError("Strength field must be a number")
        .required("Strength is required"),
      unitOfMeasure: Yup.string().required("Unit of measure is required"),
      manufacturer: Yup.string().required("Manufacturer is required"),
      primarySupplier: Yup.string().required("Primary supplier is required"),
      minStock: Yup.number()
        .typeError("No. of days must be in number")
        .required("No. of days is required")
        .min(1, "No. of days cannot be zero"),
      maxStock: Yup.number()
        .typeError("Max stock must be in number")
        .required("Max stock is required")
        .min(1, "Max stock cannot be zero"),
      expiry: Yup.number()
        .typeError("No. of days must be in number")
        .required("No. of days is required")
        .min(1, "No. of days cannot be zero"),
      shelfLife: Yup.number()
        .typeError("Shelf life must be in number")
        .required("Shelf life name is required")
        .min(0, "Shelf life cannot be zero"),
      storageConditions: Yup.string().required("Storage condition is required"),
    }),
    FrmEquipmentForm: Yup.object({
      equipmentName: Yup.string().required("Equipment name is required"),
      model: Yup.string().required("Mode is required"),
      serialNumber: Yup.string().required("Serial number is required"),
      category: Yup.string().required("Category is required"),
      manufacturer: Yup.string().required("Manufacture is required"),
      supplier: Yup.string().required("Supplier is required"),
      location: Yup.string().required("Location is required"),
      status: Yup.string().required("Status is required"),
      notes: Yup.string().required("Notes is required"),
      totalStocks: Yup.number()
        .typeError("Total stocks must be a number")
        .required("Total Stocks is required"),
      alertNotificationStock: Yup.number()
        .typeError("Stocks must be a number")
        .required("Stocks is required"),
      alertNotificationDay: Yup.number()
        .typeError("Day must be a number")
        .required("Day is required"),
    }),
    FrmReturnAdjustment: Yup.object({
      stockBatchId: Yup.string().required("Item is required"),
      deptId: Yup.string().required("Department is required"),
      type: Yup.string().required("Type is required"),
      quantity: Yup.number()
        .typeError("Quantity must be a number")
        .required("Quantity is required"),
      reason: Yup.string().required("Reason is required"),
      remarks: Yup.string().required("Remark is required"),
    }),
    FrmCurrentStocks: Yup.object({
      issuedStocks: Yup.number()
        .typeError("Used stocks must be number")
        .required("Used stocks is required"),
    }),
    FrmRequisitionMaster: Yup.object({
      requisitionDate: Yup.string().required("Requisition date is required"),
      lastIssueDate: Yup.string().required("Last Issue date is required"),
      remarks: Yup.string().required("Remark is required"),
    }),

    // Generice inventory validation
    FrmLocationMaster: Yup.object({
      locationCode: Yup.string().required("Location code is required"),
      locationName: Yup.string().required("Location name is required"),
      locationType: Yup.string().required("Location type is required"),
      address: Yup.string().required("Address is required"),
      contactPerson: Yup.string().required("Contact person is required"),
      status: Yup.string().required("Status is required"),
    }),
    FrmUnitMeasureCategoryMaster: Yup.object({
      categoryCode: Yup.string().required("Category code is required"),
      categoryName: Yup.string().required("Category name is required"),
      description: Yup.string(),
      status: Yup.string().required("Status is required"),
    }),
    FrmUnitMeasureMaster: Yup.object({
      nos: Yup.string().required("Nos is required"),
      kg: Yup.string().required("Kg is required"),
      gram: Yup.string().required("Gram is required"),
      liter: Yup.string().required("Liter is required"),
      meter: Yup.string().required("Meter is required"),
      box: Yup.string().required("Box is required"),
      packet: Yup.string().required("Packet is required"),
      piece: Yup.string().required("Piece is required"),
      dozen: Yup.string().required("Dozen is required"),
      set: Yup.string().required("Set is required"),
    }),
    FrmStoresMaster: Yup.object({
      storeCode: Yup.string().required("Store code is required"),
      storeName: Yup.string().required("Store name is required"),
      location: Yup.string().required("Location is required"),
      storeType: Yup.string().required("Store type is required"),
    }),
    FrmBinMaster: Yup.object({
      binCode: Yup.string().required("Bin Code is required"),
      binName: Yup.string().required("Bin Name is required"),
      storeId: Yup.string().required("Store ID is required"),
      rackNumber: Yup.string().required("Rack Number is required"),
      capacity: Yup.string().required("Capacity is required"),
    }),
    FrmMaterialTypeMaster: Yup.object({
      consumable: Yup.string().required("Consumable is required"),
      stationery: Yup.string().required("Stationery is required"),
      electrical: Yup.string().required("Electrical is required"),
      hardware: Yup.string().required("Hardware is required"),
      furniture: Yup.string().required("Furniture is required"),
      itEquipment: Yup.string().required("IT Equipment is required"),
      cleaningMaterial: Yup.string().required("Cleaning Material is required"),
      rawMaterial: Yup.string().required("Raw Material is required"),
      finishedGoods: Yup.string().required("Finished Goods is required"),
      mappedStore: Yup.string().required("Mapped Store is required"),
    }),
    FrmMaterialMaster: Yup.object({
      materialCode: Yup.string().required("Material Code is required"),
      materialName: Yup.string().required("Material Name is required"),
      materialType: Yup.string().required("Material Type is required"),
      category: Yup.string().required("Category is required"),
      subCategory: Yup.string().required("Sub Category is required"),
      uom: Yup.string().required("UOM is required"),
      manufacturer: Yup.string().required("Manufacturer is required"),
      brand: Yup.string().required("Brand is required"),
      specification: Yup.string().required("Specification is required"),
      description: Yup.string().required("Description is required"),
      hsnCode: Yup.string().required("HSN Code is required"),
      reorderLevel: Yup.string().required("Reorder Level is required"),
      minimumStock: Yup.string().required("Minimum Stock is required"),
      maximumStock: Yup.string().required("Maximum Stock is required"),
      status: Yup.string().required("Status is required"),
    }),
    FrmSupplierMaster: Yup.object({
      supplierCode: Yup.string().required("Supplier Code is required"),
      supplierName: Yup.string().required("Supplier Name is required"),
      address: Yup.string().required("Address is required"),
      contactPerson: Yup.string().required("Contact Person is required"),
      mobile: Yup.string().required("Mobile is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      gstNumber: Yup.string().required("GST Number is required"),
      pan: Yup.string().required("PAN is required"),
      bankDetails: Yup.string().required("Bank Details is required"),
      status: Yup.string().required("Status is required"),
    }),
    FrmSupplierMaterialMapping: Yup.object({
      supplierId: Yup.string().required("Supplier ID is required"),
      materialId: Yup.string().required("Material ID is required"),
      supplierMaterialCode: Yup.string().required(
        "Supplier Material Code is required",
      ),
      purchaseRate: Yup.string().required("Purchase Rate is required"),
      minOrderQty: Yup.string().required("Minimum Order Quantity is required"),
      leadTime: Yup.string().required("Lead Time is required"),
      effectiveFrom: Yup.string().required("Effective From date is required"),
      effectiveTo: Yup.string().required("Effective To date is required"),
      status: Yup.string().required("Status is required"),
    }),
    FrmRateContract: Yup.object({
      rateContractNo: Yup.string().required("Rate Contract No is required"),
      supplier: Yup.string().required("Supplier is required"),
      material: Yup.string().required("Material is required"),
      uom: Yup.string().required("UOM is required"),
      rate: Yup.string().required("Rate is required"),
      tax: Yup.string().required("Tax is required"),
      effectiveFrom: Yup.string().required("Effective From date is required"),
      effectiveTo: Yup.string().required("Effective To date is required"),
      status: Yup.string().required("Status is required"),
    }),
    FrmMaterialOpeningBalanceEntry: Yup.object({
      material: Yup.string().required("Material is required"),
      store: Yup.string().required("Store is required"),
      bin: Yup.string().required("Bin is required"),
      openingQty: Yup.string().required("Opening Qty is required"),
      rate: Yup.string().required("Rate is required"),
      openingValue: Yup.string().required("Opening Value is required"),
    }),
    FrmMaterialReceiptNote: Yup.object({
      mrnNumber: Yup.string().required("MRN Number is required"),
      poNumber: Yup.string().required("PO Number is required"),
      supplier: Yup.string().required("Supplier is required"),
      store: Yup.string().required("Store is required"),
      material: Yup.string().required("Material is required"),
      orderedQty: Yup.string().required("Ordered Qty is required"),
      receivedQty: Yup.string().required("Received Qty is required"),
      rejectedQty: Yup.string().required("Rejected Qty is required"),
      acceptedQty: Yup.string().required("Accepted Qty is required"),
      rate: Yup.string().required("Rate is required"),
      batchLot: Yup.string(),
      expiry: Yup.string(),
      remarks: Yup.string(),
    }),
    FrmNonIndentMaterialIssueNote: Yup.object({
      storeOperator: Yup.string().required("Store Operator is required"),
      createDirectIssue: Yup.string().required(
        "Create Direct Issue is required",
      ),
      departmentUser: Yup.string().required("Department/User is required"),
      material: Yup.string().required("Material is required"),
      quantity: Yup.string().required("Quantity is required"),
      issue: Yup.string().required("Issue is required"),
    }),
    FrmMaterialTransferIndent: Yup.object({
      sourceStoreStock: Yup.string().required("Source Store Stock is required"),
      transferredQty: Yup.string().required("Transferred Qty is required"),
      destinationStoreStock: Yup.string().required(
        "Destination Store Stock is required",
      ),
      receivedQty: Yup.string().required("Received Qty is required"),
    }),
    FrmAdvanceRequisitionForm: Yup.object({
      requisitionNo: Yup.string().required("Requisition No is required"),
      department: Yup.string().required("Department is required"),
      requiredDate: Yup.string().required("Required Date is required"),
      purpose: Yup.string().required("Purpose is required"),
      material: Yup.string().required("Material is required"),
      quantity: Yup.string().required("Quantity is required"),
      estimatedRate: Yup.string().required("Estimated Rate is required"),
      estimatedAmount: Yup.string().required("Estimated Amount is required"),
      remarks: Yup.string(), // Optional
      approvalStatus: Yup.string().required("Approval Status is required"),
    }),
    FrmSupplierBill: Yup.object({
      material: Yup.string().required("Material is required"),
      quantity: Yup.string().required("Quantity is required"),
      rate: Yup.string().required("Rate is required"),
      receivedQuantity: Yup.string().required("Received Quantity is required"),
      acceptedQuantity: Yup.string().required("Accepted Quantity is required"),
      billingQuantity: Yup.string().required("Billing Quantity is required"),
      billingRate: Yup.string().required("Billing Rate is required"),
    }),
    FrmDeadStockDisposal: Yup.object({
      disposalNo: Yup.string().required("Disposal No. is required"),
      date: Yup.string().required("Date is required"),
      material: Yup.string().required("Material is required"),
      batchNo: Yup.string(),
      qty: Yup.string().required("Quantity is required"),
      reason: Yup.string().required("Reason is required"),
      storeLocation: Yup.string().required("Store Location is required"),
      approvedBy: Yup.string().required("Approved By is required"),
      disposalMethod: Yup.string().required("Disposal Method is required"),
      disposalValue: Yup.string().required("Disposal Value is required"),
      remarks: Yup.string(),
    }),
    FrmMiscellaneousMaterialReceiptNote: Yup.object({
      createMiscReceipt: Yup.string().required(
        "Create Misc Receipt is required",
      ),
      material: Yup.string().required("Material is required"),
      quantity: Yup.string().required("Quantity is required"),
      storeBin: Yup.string().required("Store/Bin is required"),
      approval: Yup.string().required("Approval is required"),
      stockIncrease: Yup.string().required("Stock Increase is required"),
    }),
  };
};
