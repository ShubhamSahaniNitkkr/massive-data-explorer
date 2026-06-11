import { faker } from '@faker-js/faker';
import type { Order, Transaction, User } from '@mde/shared';
import { RECORD_COUNTS } from '@mde/shared';

faker.seed(42);

const USER_ROLES = ['admin', 'manager', 'analyst', 'viewer', 'developer'] as const;
const USER_STATUSES = ['active', 'inactive', 'pending', 'suspended'] as const;
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] as const;
const TX_TYPES = ['payment', 'refund', 'chargeback', 'adjustment'] as const;
const TX_STATUSES = ['completed', 'pending', 'failed', 'reversed'] as const;
const TX_METHODS = ['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'crypto'] as const;

const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Marketing',
  'Finance',
  'Operations',
  'Support',
  'HR',
  'Legal',
];

function generateUsers(count: number): User[] {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    const createdAt = faker.date.between({ from: '2020-01-01', to: '2025-06-01' });
    users.push({
      id: `usr_${String(i + 1).padStart(8, '0')}`,
      email: faker.internet.email().toLowerCase(),
      name: faker.person.fullName(),
      role: faker.helpers.arrayElement(USER_ROLES),
      department: faker.helpers.arrayElement(DEPARTMENTS),
      status: faker.helpers.arrayElement(USER_STATUSES),
      createdAt: createdAt.toISOString(),
      lastLoginAt: faker.date.between({ from: createdAt, to: new Date() }).toISOString(),
      country: faker.location.countryCode(),
    });
  }
  return users;
}

function generateOrders(count: number, userIds: string[]): Order[] {
  const orders: Order[] = [];
  for (let i = 0; i < count; i++) {
    const createdAt = faker.date.between({ from: '2021-01-01', to: '2025-06-01' });
    const status = faker.helpers.arrayElement(ORDER_STATUSES);
    const shipped = ['shipped', 'delivered'].includes(status)
      ? faker.date.between({ from: createdAt, to: new Date() }).toISOString()
      : null;
    orders.push({
      id: `ord_${String(i + 1).padStart(8, '0')}`,
      userId: faker.helpers.arrayElement(userIds),
      orderNumber: `ORD-${faker.string.alphanumeric(10).toUpperCase()}`,
      status,
      total: parseFloat(faker.commerce.price({ min: 10, max: 5000, dec: 2 })),
      currency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', 'CAD', 'AUD']),
      itemCount: faker.number.int({ min: 1, max: 20 }),
      createdAt: createdAt.toISOString(),
      shippedAt: shipped,
    });
  }
  return orders;
}

function generateTransactions(count: number, orderIds: string[], userIds: string[]): Transaction[] {
  const transactions: Transaction[] = [];
  for (let i = 0; i < count; i++) {
    transactions.push({
      id: `txn_${String(i + 1).padStart(8, '0')}`,
      orderId: faker.helpers.arrayElement(orderIds),
      userId: faker.helpers.arrayElement(userIds),
      type: faker.helpers.arrayElement(TX_TYPES),
      amount: parseFloat(faker.commerce.price({ min: 5, max: 3000, dec: 2 })),
      status: faker.helpers.arrayElement(TX_STATUSES),
      method: faker.helpers.arrayElement(TX_METHODS),
      createdAt: faker.date.between({ from: '2021-01-01', to: '2025-06-01' }).toISOString(),
      reference: `REF-${faker.string.alphanumeric(12).toUpperCase()}`,
    });
  }
  return transactions;
}

export function createSeedData() {
  console.log('Generating seed data...');
  const start = Date.now();

  const users = generateUsers(RECORD_COUNTS.users);
  const userIds = users.map((u) => u.id);
  const orders = generateOrders(RECORD_COUNTS.orders, userIds);
  const orderIds = orders.map((o) => o.id);
  const transactions = generateTransactions(RECORD_COUNTS.transactions, orderIds, userIds);

  console.log(
    `Generated ${users.length + orders.length + transactions.length} records in ${Date.now() - start}ms`,
  );

  return { users, orders, transactions };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const data = createSeedData();
  console.log('Record counts:', {
    users: data.users.length,
    orders: data.orders.length,
    transactions: data.transactions.length,
  });
}
