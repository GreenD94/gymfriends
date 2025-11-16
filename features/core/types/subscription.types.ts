export type SubscriptionStatus = 'active' | 'expired' | 'pending' | 'cancelled';

export interface Subscription {
  _id?: string;
  customerId: string;
  planName: string;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatus;
  paymentScreenshot?: string; // URL or base64
  assignedBy: string; // adminId
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateSubscriptionInput {
  customerId: string;
  planName: string;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatus;
  paymentScreenshot?: string;
  assignedBy: string;
}

export interface UpdateSubscriptionInput {
  planName?: string;
  startDate?: Date;
  endDate?: Date;
  status?: SubscriptionStatus;
  paymentScreenshot?: string;
}

