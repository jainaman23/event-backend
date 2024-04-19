const { Member, Registration, Order, Plan } = require("@models");
const { PAYMENT_ORDER_STATUS, REGISTRATION_TYPE } = require("@constant");
const { paymentgateway } = require("@utils");
const { generateRandomId, isValidObjectId } = require("@services");

module.exports = async (req, res, next) => {
  const { name, email, countryCode, mobileNumber, batch, registrationType } =
    req.body;
  let isMember = false;

  try {
    const registeredUser = await isAlreadyRegistered({
      countryCode,
      mobileNumber,
    });

    let planInfo = await getPlanInfo({ type: "NON_MEMBER" });
    let amount = planInfo.amount * 100;

    if (REGISTRATION_TYPE.MEMBER === registrationType) {
      isMember = true;
      planInfo = await getPlanInfo({ type: "MEMBER" });
      amount = planInfo.amount * 100;
    }

    if (REGISTRATION_TYPE.MEMBERSHIP === registrationType) {
      planInfo = await getPlanInfo({ type: "MEMBERSHIP" });
      amount = planInfo.amount * 100;
      isMember = true;
    }

    if (REGISTRATION_TYPE.NEW_MEMBER === registrationType) {
      planInfo = await getPlanInfo({ type: "NEW_MEMBER" });
      amount = planInfo.amount * 100;
      isMember = true;
    }

    const paymentGatewayOrderInfo = await paymentgateway.createOrder({
      amount: amount,
      currency: "INR",
      receipt: generateRandomId(10),
    });

    if (!paymentGatewayOrderInfo) {
      throw {
        status: 400,
        message: "Not able to process payment gateway order",
      };
    }

    let newRegistration = {};
    if (!registeredUser) {
      newRegistration = await registerUser({
        name,
        email,
        countryCode,
        mobileNumber,
        batch,
        paymentStatus: PAYMENT_ORDER_STATUS.NOT_PAID,
        isMember,
        registrationType,
      });
    } else {
      newRegistration = await updateRegisterUserInfo({
        userId: registeredUser._id,
        email,
        countryCode,
        mobileNumber,
        batch,
        paymentStatus: PAYMENT_ORDER_STATUS.NOT_PAID,
        isMember,
        registrationType,
      });
    }

    let registeredOrderInfo = await createOrderInfo(
      newRegistration,
      paymentGatewayOrderInfo
    );

    registeredOrderInfo.keyId = paymentgateway.getPaymentGatewayConfig().KEY_ID;

    registeredOrderInfo = configurePaymentOptions(registeredOrderInfo);

    registeredOrderInfo = configureCustomerDetails(registeredOrderInfo, {
      name,
      email,
      contact: `+${countryCode}${mobileNumber}`,
    });

    registeredOrderInfo = configureNotifySetting(registeredOrderInfo);

    return res.status(200).send({
      message: "Member registered successfully",
      data: {
        member: newRegistration,
        order: registeredOrderInfo,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getPlanInfo = async ({ type }) => {
  const planInfo = await Plan.findOne({
    type,
  });
  if (!planInfo) {
    throw { status: 400, message: "Invalid plan id" };
  }
  return planInfo;
};

const createOrderInfo = async (newRegistration, paymentGatewayOrderInfo) => {
  const { id, entity, amount, currency, receipt, status, attempts, notes } =
    paymentGatewayOrderInfo;
  const orderStatus =
    String(status).toUpperCase() === PAYMENT_ORDER_STATUS.CREATED
      ? PAYMENT_ORDER_STATUS.CREATED
      : status;

  const orderInfo = await Order.create({
    registrationId: newRegistration._id,
    orderId: id,
    entity,
    amount,
    currency,
    receipt,
    status: orderStatus,
    attempts,
    notes,
  });
  return orderInfo;
};

const configurePaymentOptions = (updatedRegisteredOrderInfo) => {
  return Object.assign(updatedRegisteredOrderInfo, {
    options: {
      checkout: {
        method: {
          netbanking: "1",
          card: "1",
          upi: "1",
          wallet: "0",
        },
      },
    },
  });
};

const configureCustomerDetails = (updatedRegisteredOrderInfo, userInfo) => {
  const { name, contact, email } = userInfo;
  return Object.assign(updatedRegisteredOrderInfo, {
    customer: {
      name,
      contact,
      email,
    },
  });
};

const configureNotifySetting = (updatedRegisteredOrderInfo) => {
  return Object.assign(updatedRegisteredOrderInfo, {
    notify: {
      sms: false,
      email: false,
    },
  });
};

const isAlreadyRegistered = async ({ countryCode, mobileNumber }) => {
  const registered = await Registration.findOne({
    countryCode,
    mobileNumber,
  });
  if (registered && registered.paymentStatus === PAYMENT_ORDER_STATUS.PAID) {
    throw { status: 400, message: "Member already registered" };
  }
  return registered;
};

const isAlreadyMember = async ({ countryCode, mobileNumber }) => {
  return await Member.findOne({
    countryCode,
    mobileNumber,
  });
};

const registerUser = async ({
  name,
  email,
  countryCode,
  mobileNumber,
  batch,
  isMember,
  paymentStatus,
  registrationType,
}) => {
  const registered = await Registration.create({
    name,
    email,
    countryCode,
    mobileNumber,
    batch,
    isMember,
    paymentStatus,
    registrationType,
  });
  return registered;
};

const updateRegisterUserInfo = async ({
  userId,
  name,
  email,
  countryCode,
  mobileNumber,
  batch,
  isMember,
  paymentStatus,
  registrationType,
}) => {
  const registeredUser = await Registration.findOneAndUpdate(
    {
      _id: isValidObjectId(userId, "userId"),
    },
    {
      name,
      email,
      countryCode,
      mobileNumber,
      batch,
      isMember,
      paymentStatus,
      registrationType,
    }
  );
  return registeredUser;
};
