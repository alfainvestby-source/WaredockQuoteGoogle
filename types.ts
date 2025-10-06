
export interface FormField {
  element: string;
  attributes: {
    name: string;
    type?: string;
    value?: any;
    placeholder?: string;
    class?: string;
  };
  settings: {
    label: string;
    help_message?: string;
    admin_field_label?: string;
    container_class?: string;
    validation_rules?: {
      required?: {
        value: boolean;
        message: string;
      };
      [key: string]: any;
    };
    conditional_logics?: {
      status: boolean;
      type: 'any' | 'all';
      conditions: {
        field: string;
        operator: string;
        value: string;
      }[];
    };
    advanced_options?: {
      label: string;
      value: string;
    }[];
    html_codes?: string;
    [key: string]: any;
  };
  fields?: {
    [key: string]: FormField;
  };
  [key: string]: any;
}

export interface Step {
  title: string;
  fields: FormField[];
}

export interface FormDefinition {
  id: number;
  title: string;
  form_fields: {
    fields: any[];
    stepsWrapper: {
      stepStart: {
        settings: {
          step_titles: string[];
        }
      }
    }
    [key: string]: any;
  };
  [key: string]: any;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isUnread: boolean;
}

export interface Document {
  id: string;
  fileName: string;
  url: string;
  uploadedAt: Date;
}

export interface QuoteRequest {
    id: string;
    status: 'New Request' | 'Viewed' | 'Quoted';
    formData: Record<string, any>;
    submittedAt: Date;
    communications?: Message[];
    documents?: Document[];
}

export type UserRole = 'merchant' | '3pl' | 'superuser';
export type UserStatus = 'active' | 'pending' | 'suspended';

export interface User {
  id: string;
  email: string;
  name?: string;
  authMethod: 'google' | 'email';
  role: UserRole;
  status: UserStatus;
}

export interface Quotation {
  id: string;
  quoteRequestId: string;
  submittedBy: string; // User ID of the 3PL
  submittedAt: Date;
  pricing: {
    storageFee: number;
    inboundFee: number;
    pickPackFirst: number;
    pickPackAdditional: number;
    packagingFee?: number;
    accountFee?: number;
  };
  quoteExpiry: string; // Date string
  notes?: string;
  shareableUrl?: string;
  status: 'Pending' | 'Accepted' | 'Declined';
}
