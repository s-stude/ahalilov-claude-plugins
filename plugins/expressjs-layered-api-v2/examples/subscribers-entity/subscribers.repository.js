const { db } = require('../../config/database');

const TABLE_NAME = 'subscribers';

const createSubscriber = async (subscriberData) => {
  const [subscriber] = await db(TABLE_NAME)
    .insert(subscriberData)
    .returning('*');
  return subscriber;
};

const findSubscriberByEmail = async (email) => {
  return db(TABLE_NAME)
    .where({ email, is_deleted: false })
    .first();
};

const findSubscriberById = async (id) => {
  return db(TABLE_NAME)
    .where({ id, is_deleted: false })
    .first();
};

const getAllSubscribers = async () => {
  return db(TABLE_NAME)
    .select('*')
    .where({ is_deleted: false })
    .orderBy('created_at', 'desc');
};

const updateSubscriber = async (id, updates) => {
  const [subscriber] = await db(TABLE_NAME)
    .where({ id, is_deleted: false })
    .update({
      ...updates,
      updated_at: new Date(),
    })
    .returning('*');
  return subscriber;
};

const deleteSubscriber = async (id) => {
  const [subscriber] = await db(TABLE_NAME)
    .where({ id, is_deleted: false })
    .update({
      is_deleted: true,
      updated_at: new Date(),
    })
    .returning('*');
  return subscriber;
};

module.exports = {
  createSubscriber,
  findSubscriberByEmail,
  findSubscriberById,
  getAllSubscribers,
  updateSubscriber,
  deleteSubscriber,
};
