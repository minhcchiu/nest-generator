export const convertOneOfToOr = (filter: Record<string, any>) => {
  const orConditions = [];

  for (const key in filter) {
    if (key.startsWith("_oneOf.")) {
      const field = key.replace("_oneOf.", ""); // Get the second part of "_oneOf."
      orConditions.push({ [field]: filter[key] }); // Add object to array _oneOf.
      delete filter[key]; // Delete old key from filter
    }
  }

  if (orConditions.length > 0) {
    Object.assign(filter, { $or: (filter.$or || []).concat(orConditions) }); //Assign the new $or array to the filter
  }

  return filter;
};
