export type TransactionType = 'payment' | 'refund' | 'chargeback' | 'adjustment';

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'reversed';

export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'paypal' | 'crypto';

export interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  method: PaymentMethod;
  createdAt: string;
  reference: string;
}
