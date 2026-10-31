import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Official WhatsApp Icon (Authentic Green & White)
 */
export const WhatsAppLogo: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <circle cx="12" cy="12" r="11" fill="#25D366" />
    <path
      d="M17.5 14.5c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.89-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.09 4.49.71.31 1.26.49 1.7.63.71.23 1.36.19 1.88.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * Official Telegram Icon (Sky Blue & White Paper Plane)
 */
export const TelegramLogo: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <circle cx="12" cy="12" r="11" fill="#229ED9" />
    <path
      d="M6.8 11.9l8.6-3.6c.4-.2.8.1.7.5l-1.5 6.9c-.1.5-.4.6-.8.4l-2.2-1.6-1.1 1c-.1.1-.2.2-.4.2l.2-2.3 4.2-3.8c.2-.2 0-.3-.3-.1l-5.2 3.3-2.2-.7c-.5-.1-.5-.5 0-.7z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * Official Facebook Icon (Royal Blue & White 'f')
 */
export const FacebookLogo: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <circle cx="12" cy="12" r="11" fill="#1877F2" />
    <path
      d="M13.5 8.5H15V6H13C10.8 6 9.5 7.3 9.5 9.8V11.5H7.5V14.5H9.5V20.5H12.5V14.5H15L15.5 11.5H12.5V10C12.5 9.1 12.8 8.5 13.5 8.5Z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * Official Instagram Icon (Signature Gradient & Camera Glyph)
 */
export const InstagramLogo: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <defs>
      <radialGradient id="instaGrad" cx="20%" cy="100%" r="130%">
        <stop offset="0%" stopColor="#ffda65" />
        <stop offset="25%" stopColor="#f98938" />
        <stop offset="50%" stopColor="#e1306c" />
        <stop offset="75%" stopColor="#c13584" />
        <stop offset="100%" stopColor="#833ab4" />
      </radialGradient>
    </defs>
    <rect width="22" height="22" x="1" y="1" rx="6" fill="url(#instaGrad)" />
    <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="#FFFFFF" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3.2" stroke="#FFFFFF" strokeWidth="1.5" />
    <circle cx="15.8" cy="8.2" r="0.9" fill="#FFFFFF" />
  </svg>
);

/**
 * Official YouTube Icon (Red & White Play Button)
 */
export const YouTubeLogo: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect width="22" height="16" x="1" y="4" rx="4" fill="#FF0000" />
    <polygon points="10,8 16,12 10,16" fill="#FFFFFF" />
  </svg>
);

/**
 * Official X / Twitter Icon (Clean Black & Modern Stylized X)
 */
export const XTwitterLogo: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <circle cx="12" cy="12" r="11" fill="#000000" />
    <path
      d="M16.5 6.5h-1.8l-3.9 4.8-3.4-4.8H5l4.8 6.9-4.8 5.6h1.8l4.3-5 3.7 5h2.4l-5.1-7.2 4.4-5.3Zm-2.5 11.2l-6.8-9.9h1.1l6.8 9.9h-1.1Z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * Official LinkedIn Icon (Business Blue 'in')
 */
export const LinkedInLogo: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect width="22" height="22" x="1" y="1" rx="5" fill="#0A66C2" />
    <path
      d="M6.5 9h2v8h-2V9Zm1-3a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM10 9h1.9v1.1h.03c.26-.5.9-1.1 1.9-1.1 2 0 2.4 1.3 2.4 3.1V17h-2v-4.3c0-1-.02-2.3-1.4-2.3-1.4 0-1.6 1.1-1.6 2.2V17h-2V9Z"
      fill="#FFFFFF"
    />
  </svg>
);
