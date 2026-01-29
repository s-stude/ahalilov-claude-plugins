const mapToJobCategory = (category) => ({
  slug: category.slug,
  name: category.name,
  description: category.description,
  jobCount: category.jobs ? category.jobs.length : 0,
});

module.exports = { mapToJobCategory };
