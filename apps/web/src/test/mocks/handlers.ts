import { http, HttpResponse } from 'msw';

import { API_BASE_URL } from '@/shared/constants/config';

const mockUsers = Array.from({ length: 100 }, (_, i) => ({
  id: `usr_${String(i).padStart(8, '0')}`,
  email: `user${i}@example.com`,
  name: `User ${i}`,
  role: 'analyst',
  department: 'Engineering',
  status: 'active',
  createdAt: '2024-01-01T00:00:00.000Z',
  lastLoginAt: '2025-01-01T00:00:00.000Z',
  country: 'US',
}));

export const handlers = [
  http.get(`${API_BASE_URL}/health`, () =>
    HttpResponse.json({
      status: 'ok',
      recordCounts: { users: 272727, orders: 363636, transactions: 363637 },
    }),
  ),

  http.get(`${API_BASE_URL}/users`, ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? 50);
    const search = url.searchParams.get('search');
    let data = mockUsers;
    if (search) {
      data = mockUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));
    }
    return HttpResponse.json({
      data: data.slice(0, limit),
      pagination: { nextCursor: null, hasMore: false, total: data.length },
      meta: { requestId: 'test', took: 5 },
    });
  }),

  http.get(`${API_BASE_URL}/meta/fields/users`, () =>
    HttpResponse.json({
      data: {
        entity: 'users',
        fields: [
          { key: 'id', label: 'ID', type: 'string', sortable: true, filterable: true, searchable: true },
          { key: 'name', label: 'Name', type: 'string', sortable: true, filterable: true, searchable: true },
        ],
      },
    }),
  ),
];
