import * as mongoosePaginateV2 from 'mongoose-paginate-v2';

const customLabels = {
  docs: 'data',
  limit: '_limit',
  page: '_page',
  totalPages: '_totalPages',
  totalDocs: '_totalData',
  meta: 'pageInfo',
  pagingCounter: '_pagingCounter',
  hasPrevPage: '_hasPrevPage',
  hasNextPage: '_hasNextPage',
  prevPage: '_prevPage',
  nextPage: '_nextPage',
};

mongoosePaginateV2.paginate.options = {
  lean: true,
  leanWithId: false,
  customLabels,
};

export { mongoosePaginateV2 };
