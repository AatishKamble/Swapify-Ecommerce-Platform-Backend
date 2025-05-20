import express from "express"
import authenticate from "../middleware/authenticate.js"
import addressController from "../controller/userAddress.controller.js"

const router = express.Router()

// Create a new address
router.post("/create", authenticate, addressController.createNewAddress)

// Get all addresses for the current user
router.get("/", authenticate, addressController.getAddresses)

// Update an existing address
router.put("/:id", authenticate, addressController.updateAddress)

// Delete an address
router.delete("/:id", authenticate, addressController.deleteAddress)

// Set an address as default
router.put("/:id/default", authenticate, addressController.setDefaultAddress)

export default router;