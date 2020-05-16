/* eslint-disable no-param-reassign */
const { update } = require('../../operations');

const updateResolver = collection => async (_, args, context) => {
  if (args.locale) context.locale = args.locale;
  if (args.fallbackLocale) context.fallbackLocale = args.fallbackLocale;

  const options = {
    config: collection.config,
    Model: collection.Model,
    data: args.data,
    id: args.id,
    depth: 0,
    req: context,
  };

  const result = await update(options);

  return result;
};

module.exports = updateResolver;