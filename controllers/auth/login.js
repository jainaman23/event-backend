const { hashCompare, generateToken, isValidObjectId } = require("@services");
const { Employee } = require("@models");

module.exports = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const employee = await isEmployeeExist(email);
    await verifyPassword(password, employee.password);
    delete employee.password;

    const token = generateToken({
      companyId: isValidObjectId(employee.company._id),
      userId: isValidObjectId(employee._id),
    });

    res.status(200).send(
      Object.freeze({
        message: "Login successfully",
        data: {
          token: token,
          employee: employee,
        },
      })
    );
  } catch (err) {
    next(err);
  }
};

async function isEmployeeExist(email) {
  const employee = await Employee.findOne({ email, isActive: true })
    .populate({
      path: "company",
      populate: {
        path: "subscription",
      },
    })
    .populate("role")
    .lean();
  if (!employee) {
    throw { status: 400, message: "Email not exist" };
  }
  return employee;
}

async function verifyPassword(password, hash) {
  const isPasswordValid = hashCompare(password, hash);
  if (!isPasswordValid) {
    throw { status: 400, message: "Invalid credentials" };
  }
}
