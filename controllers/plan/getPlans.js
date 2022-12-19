const { Plan } = require("@models");

module.exports = async (req, res, next) => {
  try {
    const plans = await getPlans();
    res.status(200).send(
      Object.freeze({
        data: {
          plans,
        },
      })
    );
  } catch (err) {
    next(err);
  }
};

async function getPlans() {
  return await Plan.find();
}
