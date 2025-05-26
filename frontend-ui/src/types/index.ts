export enum AuthStep {
  ACCESS_CODE = 'ACCESS_CODE',
  TELEGRAM_USERNAME = 'TELEGRAM_USERNAME',
  OTP_VERIFICATION = 'OTP_VERIFICATION',
  SUBSCRIPTION_SETTINGS = 'SUBSCRIPTION_SETTINGS',
  SUCCESS = 'SUCCESS',
  CANCEL = 'CANCEL',
  CANCEL_CONFIRMED = 'CANCEL_CONFIRMED'
}

export interface Subscription {
  telegramUsername: string;
  expiryDate: Date | null; // null means infinite
  active: boolean;
}