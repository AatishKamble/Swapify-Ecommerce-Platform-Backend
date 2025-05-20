import Address from "../models/address.model.js"
import User from "../models/user.model.js"

async function createAddress(userId, reqData) {
    try {
        // Create the address object
        const newAddress = new Address({
            user: userId,
            fullName: reqData.fullName,
            phone: reqData.phone,
            pincode: reqData.pincode,
            locality: reqData.locality,
            address: reqData.address,
            city: reqData.city,
            state: reqData.state,
            addressType: reqData.addressType || "home",
            isDefault: reqData.isDefault || false,
            openSaturday: reqData.openSaturday || false,
            openSunday: reqData.openSunday || false,
        })

        await newAddress.save()

        // Add the address to the user's addresses array
        await User.findByIdAndUpdate(userId, { $push: { address: newAddress._id } })

        return newAddress
    } catch (error) {
        throw new Error(error.message)
    }
}

async function getAddressByUserId(userId) {
    try {
        const addresses = await Address.find({ user: userId })
        return addresses
    } catch (error) {
        throw new Error(error.message)
    }
}

async function getAddressById(addressId) {
    try {
        const address = await Address.findById(addressId)
        if (!address) {
            throw new Error("Address not found")
        }
        return address
    } catch (error) {
        throw new Error(error.message)
    }
}

async function updateAddress(addressId, userId, reqData) {
    try {
        // Verify the address belongs to the user
        const address = await Address.findOne({ _id: addressId, user: userId })
        if (!address) {
            throw new Error("Address not found or unauthorized")
        }

        // Update the address
        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            {
                fullName: reqData.fullName,
                phone: reqData.phone,
                pincode: reqData.pincode,
                locality: reqData.locality,
                address: reqData.address,
                city: reqData.city,
                state: reqData.state,
                addressType: reqData.addressType,
                isDefault: reqData.isDefault,
                openSaturday: reqData.openSaturday,
                openSunday: reqData.openSunday,
            },
            { new: true },
        )

        return updatedAddress
    } catch (error) {
        throw new Error(error.message)
    }
}

async function deleteAddress(addressId, userId) {
    try {
        // Verify the address belongs to the user
        const address = await Address.findOne({ _id: addressId, user: userId })
        if (!address) {
            throw new Error("Address not found or unauthorized")
        }

        // Delete the address
        await Address.findByIdAndDelete(addressId)

        // Remove the address from the user's addresses array
        await User.findByIdAndUpdate(userId, { $pull: { address: addressId } })

        return { message: "Address deleted successfully" }
    } catch (error) {
        throw new Error(error.message)
    }
}

async function unsetDefaultAddresses(userId) {
    try {
        await Address.updateMany({ user: userId }, { $set: { isDefault: false } })
        return { message: "All addresses unset as default" }
    } catch (error) {
        throw new Error(error.message)
    }
}

async function setDefaultAddress(addressId, userId) {
    try {
        // Verify the address belongs to the user
        const address = await Address.findOne({ _id: addressId, user: userId })
        if (!address) {
            throw new Error("Address not found or unauthorized")
        }

        // Set the address as default
        const updatedAddress = await Address.findByIdAndUpdate(addressId, { isDefault: true }, { new: true })

        return updatedAddress
    } catch (error) {
        throw new Error(error.message)
    }
}

export default {
    createAddress,
    getAddressByUserId,
    getAddressById,
    updateAddress,
    deleteAddress,
    unsetDefaultAddresses,
    setDefaultAddress,
}