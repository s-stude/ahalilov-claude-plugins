const express = require('express');
const subscribersController = require('./subscribers.controller');
const {
  createSubscriberSchema,
  updateSubscriberSchema,
  subscriberIdSchema,
  validate,
} = require('../../entities/subscribers/subscribers.validators');

const router = express.Router();

// POST /api/v1/subscribers
router.post(
  '/',
  validate(createSubscriberSchema),
  subscribersController.createSubscriber
);

// GET /api/v1/subscribers
router.get('/', subscribersController.getAllSubscribers);

// GET /api/v1/subscribers/:id
router.get(
  '/:id',
  validate(subscriberIdSchema),
  subscribersController.getSubscriber
);

// PATCH /api/v1/subscribers/:id
router.patch(
  '/:id',
  validate(subscriberIdSchema),
  validate(updateSubscriberSchema),
  subscribersController.updateSubscriber
);

// DELETE /api/v1/subscribers/:id
router.delete(
  '/:id',
  validate(subscriberIdSchema),
  subscribersController.deleteSubscriber
);

module.exports = router;
