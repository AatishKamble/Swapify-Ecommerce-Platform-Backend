import addressService from "../services/address.service.js"

const createNewAddress = async (req, res) => {
    try {
        const user = req.user

        // Check if this is the first address and set it as default if it is
        const existingAddresses = await addressService.getAddressByUserId(user._id)
        if (existingAddresses.length === 0) {
            req.body.isDefault = true
        } else if (req.body.isDefault) {
            // If this new address is set as default, update all other addresses
            await addressService.unsetDefaultAddresses(user._id)
        }

        const address = await addressService.createAddress(user._id, req.body)
        res.status(200).send(address)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const getAddresses = async (req, res) => {
    try {
        const user = req.user
        const addresses = await addressService.getAddressByUserId(user._id)
        res.status(200).send(addresses)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const updateAddress = async (req, res) => {
    try {
        const user = req.user
        const addressId = req.params.id

        // If setting as default, unset all other addresses first
        if (req.body.isDefault) {
            await addressService.unsetDefaultAddresses(user._id)
        }

        const updatedAddress = await addressService.updateAddress(addressId, user._id, req.body)
        res.status(200).send(updatedAddress)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const deleteAddress = async (req, res) => {
    try {
        const user = req.user
        const addressId = req.params.id

        // Check if the address being deleted is the default one
        const address = await addressService.getAddressById(addressId)

        await addressService.deleteAddress(addressId, user._id)

        // If deleted address was default, set a new default if other addresses exist
        if (address.isDefault) {
            const remainingAddresses = await addressService.getAddressByUserId(user._id)
            if (remainingAddresses.length > 0) {
                await addressService.setDefaultAddress(remainingAddresses[0]._id, user._id)
            }
        }

        res.status(200).send({ message: "Address deleted successfully" })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const setDefaultAddress = async (req, res) => {
    try {
        const user = req.user
        const addressId = req.params.id

        // Unset all addresses as default first
        await addressService.unsetDefaultAddresses(user._id)

        // Set the specified address as default
        const updatedAddress = await addressService.setDefaultAddress(addressId, user._id)

        res.status(200).send(updatedAddress)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

export default {
    createNewAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
}
