export const LabCacheKeys = {
  categoryList: () => 'lab:categories',
  categoryById: (id: string) => `lab:category:${id}`,
  itemList: () => 'lab:items',
  itemById: (id: string) => `lab:item:${id}`,
  pattern: () => 'lab:*',
};
