export enum SocialPlatform {
  Facebook = 'Facebook',
  TikTok = 'TikTok',
  YouTube = 'YouTube',
  Twitter = 'Twitter / X',
  Instagram = 'Instagram',
  Telegram = 'Telegram',
  WhatsApp = 'WhatsApp',
  Discord = 'Discord',
  Website = 'Website',
}

export interface SocialActionConfig {
  id: string;
  platform: SocialPlatform;
  url: string;
}

export enum ContentType {
  Text = 'text',
  URL = 'url',
}

export interface LogoConfig {
  type: 'text' | 'url';
  value: string;
}

export interface LockConfig {
  contentType: ContentType;
  contentValue: string;
  title: string;
  subtitle?: string;
  actions: SocialActionConfig[];
  logo?: LogoConfig;
}

export interface VisitorActionState extends SocialActionConfig {
  isClicked: boolean;
  isConfirmed: boolean;
}