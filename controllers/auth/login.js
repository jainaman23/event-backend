const { hashCompare, generateToken, isValidObjectId } = require("@services");
const { Coordinator } = require("@models");

module.exports = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const coordinator = await isCoordinatorExist(email);
    await verifyPassword(password, coordinator.password);
    delete coordinator.password;

    const token = generateToken({
      coordinatorId: isValidObjectId(coordinator._id),
    });

    res.status(200).send(
      Object.freeze({
        message: "Login successfully",
        data: {
          token: token,
          coordinator: coordinator,
        },
      })
    );
  } catch (err) {
    next(err);
  }
};

async function isCoordinatorExist(email) {
  const coordinator = await Coordinator.findOne({
    email,
    isActive: true,
  }).lean();
  if (!coordinator) {
    throw { status: 400, message: "Email not exist" };
  }
  return coordinator;
}

async function verifyPassword(password, hash) {
  // const isPasswordValid = hashCompare(password, hash);
  // if (!isPasswordValid) {
  //   throw { status: 400, message: "Invalid credentials" };
  // }
  if (String(password) !== String(hash)) {
    throw { status: 400, message: "Invalid credentials" };
  }
}
