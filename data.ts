
import { QuoteRequest, User, Quotation } from './types';

export const DUMMY_QUOTES: QuoteRequest[] = [
  {
    id: 'QR-001',
    status: 'New Request',
    formData: {
      first_name: 'Alice',
      last_name: 'Johnson',
      input_company: 'Crafty Creations Co.',
      email: 'merchant@example.com', // Matched to merchant user
      url: 'https://craftycreations.com',
      ecommerce_platform: 'Shopify',
      product_category: 'Arts and craft',
      warehouse_location: 'USA',
      B2C_orders: '501-1,000/month',
      SKUcount: '150',
      pick_count: '2.5',
    },
    submittedAt: new Date('2024-07-20T10:30:00Z'),
    communications: [],
  },
  {
    id: 'QR-002',
    status: 'New Request',
    formData: {
      first_name: 'Bob',
      last_name: 'Williams',
      input_company: 'Gadget Grove',
      email: 'merchant@example.com', // Matched to merchant user
      url: 'https://gadgetgrove.com',
      ecommerce_platform: 'WooCommerce',
      product_category: 'Other',
      product_category_OTHER: 'Consumer Electronics',
      warehouse_location: 'Germany',
      B2C_orders: '1,001-2,500/month',
      SKUcount: '500',
      pick_count: '1.2',
    },
    submittedAt: new Date('2024-07-20T09:15:00Z'),
    communications: [],
  },
  {
    id: 'QR-003',
    status: 'Viewed',
    formData: {
      first_name: 'Charlie',
      last_name: 'Brown',
      input_company: 'Fashion Forward',
      email: 'merchant@example.com', // Matched to merchant user
      url: 'https://fashionforward.com',
      ecommerce_platform: 'Magento',
      product_category: 'Apparel',
      warehouse_location: 'United Kingdom',
      B2C_orders: '251-500/month',
      SKUcount: '2000',
      pick_count: '3',
    },
    submittedAt: new Date('2024-07-19T16:45:00Z'),
    communications: [
        { id: 'msg-1', senderId: 'user-003', text: 'Hi Charlie, thanks for your request. Could you clarify the average weight of your apparel items?', timestamp: new Date('2024-07-19T17:05:00Z'), isUnread: true },
    ],
  },
  {
    id: 'QR-004',
    status: 'Quoted',
    formData: {
      first_name: 'Diana',
      last_name: 'Miller',
      input_company: 'Vino Vault',
      email: 'merchant@example.com', // Matched to merchant user
      url: 'https://vinovault.com',
      ecommerce_platform: 'Other',
      ecommerce_platform_OTHER: 'Custom Built',
      product_category: 'Alcohol and soft drinks',
      warehouse_location: 'France',
      B2C_orders: '101-250/month',
      SKUcount: '50',
      pick_count: '6',
    },
    submittedAt: new Date('2024-07-18T11:00:00Z'),
    communications: [
        { id: 'msg-2', senderId: 'user-003', text: 'The quote for Vino Vault has been submitted.', timestamp: new Date('2024-07-18T14:01:00Z'), isUnread: false },
        { id: 'msg-3', senderId: 'user-002', text: 'Thanks, reviewing it now.', timestamp: new Date('2024-07-18T14:05:00Z'), isUnread: false },
    ],
  },
];


export const DUMMY_USERS: User[] = [
    {
        id: 'user-001',
        email: 'admin@waredock.ai',
        name: 'Admin User',
        authMethod: 'email',
        role: 'superuser',
        status: 'active'
    },
    {
        id: 'user-002',
        email: 'merchant@example.com',
        name: 'Test Merchant',
        authMethod: 'email',
        role: 'merchant',
        status: 'active'
    },
    {
        id: 'user-003',
        email: '3pl-active@example.com',
        name: 'Active 3PL',
        authMethod: 'email',
        role: '3pl',
        status: 'active'
    },
    {
        id: 'user-004',
        email: '3pl-pending@example.com',
        name: 'Pending 3PL',
        authMethod: 'email',
        role: '3pl',
        status: 'pending'
    },
    {
        id: 'user-005',
        email: 'merchant-suspended@example.com',
        name: 'Suspended Merchant',
        authMethod: 'email',
        role: 'merchant',
        status: 'suspended'
    }
];

export const DUMMY_QUOTATIONS: Quotation[] = [
  {
    id: 'QTN-001',
    quoteRequestId: 'QR-004', // Linked to Diana Miller's request
    submittedBy: 'user-003', // Submitted by Active 3PL
    submittedAt: new Date('2024-07-18T14:00:00Z'),
    pricing: {
      storageFee: 30.00,
      inboundFee: 15.00,
      pickPackFirst: 3.50,
      pickPackAdditional: 1.00,
      packagingFee: 1.50,
      accountFee: 150.00,
    },
    quoteExpiry: '2024-08-18',
    notes: 'Special handling required for fragile items. Rate includes insurance coverage up to $100 per shipment.',
    status: 'Pending',
  },
    {
    id: 'QTN-002',
    quoteRequestId: 'QR-003', // Linked to Charlie Brown's request, status will still be "Viewed" until updated
    submittedBy: 'user-003',
    submittedAt: new Date('2024-07-20T11:00:00Z'),
    pricing: {
      storageFee: 22.50,
      inboundFee: 8.00,
      pickPackFirst: 2.20,
      pickPackAdditional: 0.45,
      packagingFee: 0.80,
      accountFee: 0,
    },
    quoteExpiry: '2024-08-20',
    notes: 'Volume discounts available for over 1000 orders/month.',
    status: 'Pending'
  }
];
