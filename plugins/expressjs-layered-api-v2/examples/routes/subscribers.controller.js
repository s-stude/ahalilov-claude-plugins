const subscribersService = require('../../entities/subscribers/subscribers.service');

const createSubscriber = async (req, res, next) => {
  try {
    const logger = res.locals.logger.child({ module: 'subscribers' });
    const { email, userAgent, pageUrl, referrer } = req.body;
    const capturedUserAgent = userAgent || req.headers['user-agent'];
    const capturedReferrer = referrer || req.headers['referer'] || req.headers['referrer'];

    logger.info('Creating new subscriber', { email, pageUrl, referrer: capturedReferrer });

    const subscriber = await subscribersService.createSubscriber(
      email,
      capturedUserAgent,
      pageUrl,
      capturedReferrer
    );

    logger.info('Subscriber created successfully', { subscriberId: subscriber.id });

    res.status(201).json({
      success: true,
      data: subscriber,
    });
  } catch (error) {
    next(error);
  }
};

const getSubscriber = async (req, res, next) => {
  try {
    const logger = res.locals.logger.child({ module: 'subscribers' });
    const { id } = req.params;

    logger.info('Fetching subscriber', { subscriberId: id });

    const subscriber = await subscribersService.getSubscriberById(id);

    res.status(200).json({
      success: true,
      data: subscriber,
    });
  } catch (error) {
    next(error);
  }
};

const getAllSubscribers = async (req, res, next) => {
  try {
    const logger = res.locals.logger.child({ module: 'subscribers' });
    logger.info('Fetching all subscribers');

    const subscribers = await subscribersService.getAllSubscribers();

    res.status(200).json({
      success: true,
      data: subscribers,
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscriber = async (req, res, next) => {
  try {
    const logger = res.locals.logger.child({ module: 'subscribers' });
    const { id } = req.params;
    const updates = req.body;

    logger.info('Updating subscriber', { subscriberId: id, updates });

    const subscriber = await subscribersService.updateSubscriber(id, updates);

    logger.info('Subscriber updated successfully', { subscriberId: subscriber.id });

    res.status(200).json({
      success: true,
      data: subscriber,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSubscriber = async (req, res, next) => {
  try {
    const logger = res.locals.logger.child({ module: 'subscribers' });
    const { id } = req.params;

    logger.info('Deleting subscriber', { subscriberId: id });

    const result = await subscribersService.deleteSubscriber(id);

    logger.info('Subscriber deleted successfully', { subscriberId: id });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubscriber,
  getSubscriber,
  getAllSubscribers,
  updateSubscriber,
  deleteSubscriber,
};
