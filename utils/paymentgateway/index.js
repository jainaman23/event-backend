const Razorpay = require("razorpay");
const { PAYMENT_GATEWAY } = require("@config");
const { promisify } = require("util");

let instance = null;

function paymentGateway() {
  if (!instance) {
    instance = new Razorpay({
      key_id: PAYMENT_GATEWAY.KEY_ID,
      key_secret: PAYMENT_GATEWAY.KEY_SECRET,
    });
  }

  return {
    /**
     * @param {number} amount [amount=100000]
     * @param {string} currency [currency=INR]
     * @param {string} receipt
     * @param {object=} notes
     * @param {string=} partial_payment
     */
    createOrder: async (options) => {
      try {
        const { amount, currency, receipt } = options;
        const defaultOrderOptions = {
          amount: 1000000,
          currency: "INR",
        };

        if (!amount || isNaN(amount)) {
          throw { status: 400, message: "Invalid amount" };
        }

        if (!currency) {
          throw { status: 400, message: "Invalid amount" };
        }

        if (!receipt) {
          throw { status: 400, message: "Invalid amount" };
        }

        const orderOptions = {
          ...defaultOrderOptions,
          ...options,
        };

        const create = promisify(instance.orders.create);
        return await create(orderOptions);
      } catch (error) {
        throw { status: 400, message: error.error.description };
      }
    },

    getPaymentGatewayConfig: () => {
      return {
        ...PAYMENT_GATEWAY,
      };
    },
  };
}

module.exports = paymentGateway();
