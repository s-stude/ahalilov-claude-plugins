const { mapToJobCategory } = require('./mapTo');
const filesystemProvider = require('../filesystem-provider');

const findOne = async (slug) => {
  const categories = await filesystemProvider.readJobCategories();
  const category = categories.find(c => c.slug === slug);

  if (!category) {
    throw new Error('Category not found');
  }

  return mapToJobCategory(category);
};

module.exports = { findOne };
