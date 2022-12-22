const { Registration } = require("@models");
const { PAYMENT_ORDER_STATUS } = require("@constant");

module.exports = async (req, res, next) => {
  try {
    const users = await getRegisteredUsers();

    res.status(200).send(
      Object.freeze({
        data: {
          users,
        },
      })
    );
  } catch (err) {
    next(err);
  }
};

async function getRegisteredUsers() {
  return await Registration.find({
    paymentStatus: PAYMENT_ORDER_STATUS.PAID,
  }).sort({ createdAt: -1 });
}
