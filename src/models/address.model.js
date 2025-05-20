import mongoose from "mongoose"

const AddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: (props) => `${props.value} is not a valid 10-digit phone number!`,
      },
    },
    pincode: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^\d{6}$/.test(v),
        message: (props) => `${props.value} is not a valid 6-digit pincode!`,
      },
    },
    locality: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    addressType: {
      type: String,
      enum: ["home", "work"],
      default: "home",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    // Work address specific fields
    openSaturday: {
      type: Boolean,
      default: false,
    },
    openSunday: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const Address = mongoose.model("address", AddressSchema)

export default Address
