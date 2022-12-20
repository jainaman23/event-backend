const { Registration } = require("@models");

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
  return await Registration.find();
}
