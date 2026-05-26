export type EmailJsConfig = {
  serviceId: string;
  publicKey: string;
  templateNotif: string;
  templateClient: string;
};

const emailJsEnv = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  templateNotif: import.meta.env.VITE_EMAILJS_TEMPLATE_NOTIF,
  templateClient: import.meta.env.VITE_EMAILJS_TEMPLATE_CLIENT,
};

const envKeyNames: Record<keyof typeof emailJsEnv, string> = {
  serviceId: 'VITE_EMAILJS_SERVICE_ID',
  publicKey: 'VITE_EMAILJS_PUBLIC_KEY',
  templateNotif: 'VITE_EMAILJS_TEMPLATE_NOTIF',
  templateClient: 'VITE_EMAILJS_TEMPLATE_CLIENT',
};

export function getEmailJsConfig(): EmailJsConfig | null {
  const missingKeys = Object.entries(emailJsEnv)
    .filter(([, value]) => !value)
    .map(([key]) => envKeyNames[key as keyof typeof emailJsEnv]);

  if (missingKeys.length > 0) {
    console.error(`EmailJS configuration missing: ${missingKeys.join(', ')}`);
    return null;
  }

  return emailJsEnv;
}
