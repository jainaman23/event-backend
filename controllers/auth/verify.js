const { Member, Registration, Plan } = require("@models");
const { PAYMENT_ORDER_STATUS } = require("@constant");

module.exports = async (req, res, next) => {
  const { countryCode, mobileNumber } = req.body;
  const isRegistered = false;
  let isMember = false;

  try {
    const registeredUser = await isAlreadyRegistered({
      countryCode,
      mobileNumber,
    });

    if (registeredUser) {
      return res.status(200).send({
        message: "Member already registered",
        data: {
          isRegistered: true,
          member: registeredUser,
        },
      });
    }

    const member = await isAlreadyMember({ countryCode, mobileNumber });

    if (member) {
      isMember = true;
      return res.status(200).send({
        message: "Member not registered",
        data: {
          isRegistered,
          isMember,
          member,
        },
      });
    }

    return res.status(200).send({
      message: "You are not registered, Please enter details and proceed",
      data: {
        isRegistered,
        isMember,
      },
    });
  } catch (err) {
    next(err);
  }
};

const isAlreadyRegistered = async ({ countryCode, mobileNumber }) => {
  return await Registration.findOne({
    countryCode,
    mobileNumber,
    paymentStatus: PAYMENT_ORDER_STATUS.PAID,
  });
};

const isAlreadyMember = async ({ countryCode, mobileNumber }) => {
  return await Member.findOne({
    countryCode,
    mobileNumber,
  });
};
