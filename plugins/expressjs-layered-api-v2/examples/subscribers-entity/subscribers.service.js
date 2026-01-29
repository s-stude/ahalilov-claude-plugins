const subscribersRepository = require('./subscribers.repository');
const { subscriberDto, subscriberDetailDto } = require('./subscribers.dtos');
const { generateShortUID } = require('../../utils/id-generator');

const createSubscriber = async (email, userAgent, pageUrl, referrer) => {
  // Business rule: Check for existing subscriber
  const existingSubscriber = await subscribersRepository.findSubscriberByEmail(email);

  if (existingSubscriber) {
    return subscriberDto(existingSubscriber);
  }

  // Business rule: Normalize email to lowercase
  const subscriberData = {
    id: generateShortUID('sub'),
    email: email.toLowerCase(),
    user_agent: userAgent || null,
    page_url: pageUrl || null,
    referrer: referrer || null,
  };

  const subscriber = await subscribersRepository.createSubscriber(subscriberData);
  return subscriberDto(subscriber);
};

const getSubscriberById = async (id) => {
  const subscriber = await subscribersRepository.findSubscriberById(id);

  if (!subscriber) {
    throw new Error('Subscriber not found');
  }

  return subscriberDetailDto(subscriber);
};

const getAllSubscribers = async () => {
  const subscribers = await subscribersRepository.getAllSubscribers();
  return subscribers.map(subscriberDto);
};

const updateSubscriber = async (id, updates) => {
  const existingSubscriber = await subscribersRepository.findSubscriberById(id);

  if (!existingSubscriber) {
    throw new Error('Subscriber not found');
  }

  // Business rule: Normalize email if being updated
  const updateData = {
    ...updates,
    email: updates.email ? updates.email.toLowerCase() : existingSubscriber.email,
  };

  const subscriber = await subscribersRepository.updateSubscriber(id, updateData);
  return subscriberDetailDto(subscriber);
};

const deleteSubscriber = async (id) => {
  const existingSubscriber = await subscribersRepository.findSubscriberById(id);

  if (!existingSubscriber) {
    throw new Error('Subscriber not found');
  }

  await subscribersRepository.deleteSubscriber(id);
  return { success: true };
};

module.exports = {
  createSubscriber,
  getSubscriberById,
  getAllSubscribers,
  updateSubscriber,
  deleteSubscriber,
};
