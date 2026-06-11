export const DATA_TAGS = {
  Users: 'Users',
  Orders: 'Orders',
  Transactions: 'Transactions',
  User: 'User',
  Order: 'Order',
  Transaction: 'Transaction',
} as const;

export type DataTag = (typeof DATA_TAGS)[keyof typeof DATA_TAGS];
