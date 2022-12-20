const { isValidObjectId } = require("@services");
const { Registration } = require("@models");

module.exports = async (req, res, next) => {
  try {
    const { registrationId } = req.params;
    const user = await getRegisteredUsers(registrationId);

    res.status(200).send(
      Object.freeze({
        data: {
          user,
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
  });
  if (!user) {
    throw { status: 400, message: "Invalid registration id" };
  }
  return user;
}
