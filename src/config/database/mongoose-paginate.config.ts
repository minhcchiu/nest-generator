import * as mongoosePaginateV2 from 'mongoose-paginate-v2';

const customLabels = {
  docs: 'data',
  limit: 'limit',
  page: 'page',
  totalPages: 'totalPages',
  totalDocs: 'totalData',
  meta: 'pageInfo',
};

mongoosePaginateV2.paginate.options = {
  lean: true,
  leanWithId: false,
  customLabels,
};

export { mongoosePaginateV2 };
