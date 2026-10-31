const express = require("express");
const {
  categoryIns,
  getCategoryActiveList,
  getCategoryListByUlb,
  getCategoryById,
  subcategoryIns,
  getSingleSubcategory,
  getSubcategoryList,
  getActiveSubcategories

} = require("../../controllers/Inventory/aoinCategIns");

const router = express.Router();

router.post("/CategoryIns", categoryIns);
router.post("/GetCategoryActiveList", getCategoryActiveList);
router.post("/GetCategoryListByUlb", getCategoryListByUlb);
router.post("/GetCategoryById", getCategoryById);
router.post ("/SubcategoryIns",subcategoryIns)
router.post("/SubcategorybyID", getSingleSubcategory);
router.post("/Subcategorylist", getSubcategoryList);
router.post("/SubcategoryActivelist", getActiveSubcategories);

module.exports = router;