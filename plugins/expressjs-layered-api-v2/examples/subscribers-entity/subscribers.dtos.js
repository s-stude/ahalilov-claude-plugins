const subscriberDto = (subscriberRecord) => ({
  id: subscriberRecord.id,
  email: subscriberRecord.email,
  createdAt: subscriberRecord.created_at,
  // Exclude sensitive/internal fields:
  // - user_agent
  // - page_url
  // - referrer
  // - updated_at
});

const subscriberDetailDto = (subscriberRecord) => ({
  id: subscriberRecord.id,
  email: subscriberRecord.email,
  userAgent: subscriberRecord.user_agent,
  pageUrl: subscriberRecord.page_url,
  referrer: subscriberRecord.referrer,
  createdAt: subscriberRecord.created_at,
  updatedAt: subscriberRecord.updated_at,
});

module.exports = {
  subscriberDto,
  subscriberDetailDto,
};
