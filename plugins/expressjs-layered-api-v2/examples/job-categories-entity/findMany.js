const { mapToJobCategory } = require('./mapTo');
const filesystemProvider = require('../filesystem-provider');

const findMany = async () => {
  const categories = await filesystemProvider.readJobCategories();
  return categories.map(mapToJobCategory);
};

module.exports = { findMany };
