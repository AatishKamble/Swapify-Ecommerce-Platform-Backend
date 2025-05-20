import orderService from "../services/order.service.js"

async function createOrder(req, res) {
  const user = req.user
  try {
    const order = await orderService.createOrder(user._id, req.body)
    return res.status(201).send(order)
  } catch (error) {
    console.error("Error in createOrder controller:", error)
    return res.status(500).send({ error: error.message })
  }
}

async function getOrderById(req, res) {
  try {
    const order = await orderService.getOrderById(req.params.id)
    return res.status(200).send(order)
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
}

const orderHistory = async (req, res) => {
  try {
    const orders = await orderService.userOrderHistory(req.user._id)
    return res.status(200).send(orders)
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
}

async function cancelOrder(req, res) {
  const orderId = req.params.Id
  try {
    const orders = await orderService.cancelOrder(orderId)
    return res.status(200).send(orders)
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
}

async function placeOrder(req, res) {
  try {
    const order = await orderService.placeOrder(req.params.id)
    return res.status(200).send(order)
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
}

export default {
  createOrder,
  getOrderById,
  orderHistory,
  placeOrder,
  cancelOrder,
}