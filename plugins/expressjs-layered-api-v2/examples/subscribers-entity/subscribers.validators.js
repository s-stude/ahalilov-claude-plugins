const { z } = require('zod');

const createSubscriberSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  userAgent: z.string().optional(),
  pageUrl: z.string().optional(),
  referrer: z.string().optional(),
});

const updateSubscriberSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).optional(),
});

const subscriberIdSchema = z.object({
  id: z.string().min(1, { message: "Subscriber ID is required" }),
});

const validate = (schema) => (req, res, next) => {
  try {
    if (req.body && Object.keys(req.body).length > 0) {
      req.body = schema.parse(req.body);
    } else if (req.params && Object.keys(req.params).length > 0) {
      req.params = schema.parse(req.params);
    } else if (req.query && Object.keys(req.query).length > 0) {
      req.query = schema.parse(req.query);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubscriberSchema,
  updateSubscriberSchema,
  subscriberIdSchema,
  validate,
};
