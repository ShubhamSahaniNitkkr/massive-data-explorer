import { env } from './config/env.js';
import { getScaledTotalRecordCount } from './config/recordCounts.js';
import { createApp } from './app.js';

import { getDataStore, getRecordCounts } from './services/dataStore.js';

const app = createApp();

console.log(`Initializing data store (${getScaledTotalRecordCount().toLocaleString()} records)...`);
getDataStore();
const counts = getRecordCounts();
console.log(
  `Data store ready: ${counts.users.toLocaleString()} users, ${counts.orders.toLocaleString()} orders, ${counts.transactions.toLocaleString()} transactions.`,
);

app.listen(env.API_PORT, env.API_HOST, () => {
  console.log(`API server running at http://${env.API_HOST}:${env.API_PORT}`);
});
