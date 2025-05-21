export enum AuthStep {
  ACCESS_CODE = 'ACCESS_CODE',
  TELEGRAM_USERNAME = 'TELEGRAM_USERNAME',
  OTP_VERIFICATION = 'OTP_VERIFICATION',
  SUBSCRIPTION_SETTINGS = 'SUBSCRIPTION_SETTINGS',
  SUCCESS = 'SUCCESS',
  CANCEL = 'CANCEL',
  CANCELLED = 'CANCELLED',
}

export interface Subscription {
  telegramUsername: string;
  expiryDate: Date | null; // null means infinite
  active: boolean;
}