const { isValidObjectId } = require("@services");
const { Registration } = require("@models");
const { PAYMENT_ORDER_STATUS } = require("@constant");

module.exports = async (req, res, next) => {
  try {
    const { registrationId, isAttended } = req.body;
    const user = await getRegisteredUsers(registrationId);

    if (user.isAttended) {
      throw { status: 400, message: "Member already attended" };
    }

    const userInfo = await verifyUser(registrationId, isAttended);

    res.status(200).send(
      Object.freeze({
        message: "Member verified successfully",
        data: {
          user: userInfo,
        },
      })
    );
  } catch (err) {
    next(err);
  }
};

async function getRegisteredUsers(registrationId) {
  const user = await Registration.findOne({
    _id: isValidObjectId(registrationId, "registrationId"),
    paymentStatus: PAYMENT_ORDER_STATUS.PAID,
  });
  if (!user) {
    throw { status: 400, message: "Invalid registration id" };
  }
  return user;
}

async function verifyUser(registrationId, isAttended) {
  const user = await Registration.findOneAndUpdate(
    { _id: isValidObjectId(registrationId, "registrationId") },
    {
      $set: {
        isAttended,
      },
    },
    {
      new: true,
    }
  );
  return user;
}
