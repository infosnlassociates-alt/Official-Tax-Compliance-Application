import { TaxFiling } from '../types';

let audioCtx: AudioContext | null = null;

/**
 * Play a pleasant synthesized chime using Web Audio API
 */
export function playNotificationSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // First tone (E5 ~ 659.25 Hz)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.15, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second harmonious tone (G#5 ~ 830.61 Hz)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(830.61, now + 0.12);
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.18, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (e) {
    console.warn('Audio synthesis could not play:', e);
  }
}

/**
 * Request Browser Notification Permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Send Browser Notification with fallbacks
 */
export function sendDeadlinePushNotification(title: string, body: string, tag?: string): void {
  playNotificationSound();

  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/vite.svg',
        tag: tag || 'tax-deadline-reminder',
      });
    } catch (e) {
      console.warn('Browser notification trigger failed:', e);
    }
  }
}

export interface DeadlineAlert {
  filing: TaxFiling;
  daysRemaining: number;
  urgency: 'OVERDUE' | 'DUE_TODAY' | 'DUE_3_DAYS' | 'DUE_7_DAYS';
  message: string;
}

/**
 * Calculate upcoming deadlines and categorize urgency
 */
export function scanUpcomingDeadlines(filings: TaxFiling[]): DeadlineAlert[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const alerts: DeadlineAlert[] = [];

  for (const filing of filings) {
    if (filing.status === 'FILED') continue;

    const targetDateStr = filing.extensionDate || filing.dueDate;
    const targetDate = new Date(targetDateStr);
    targetDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      alerts.push({
        filing,
        daysRemaining: diffDays,
        urgency: 'OVERDUE',
        message: `${filing.returnForm} for ${filing.clientName} is OVERDUE by ${Math.abs(diffDays)} day(s)!`
      });
    } else if (diffDays === 0) {
      alerts.push({
        filing,
        daysRemaining: 0,
        urgency: 'DUE_TODAY',
        message: `${filing.returnForm} for ${filing.clientName} is due TODAY (${targetDateStr})!`
      });
    } else if (diffDays <= 3) {
      alerts.push({
        filing,
        daysRemaining: diffDays,
        urgency: 'DUE_3_DAYS',
        message: `${filing.returnForm} for ${filing.clientName} is due in ${diffDays} day(s) on ${targetDateStr}.`
      });
    } else if (diffDays <= 7) {
      alerts.push({
        filing,
        daysRemaining: diffDays,
        urgency: 'DUE_7_DAYS',
        message: `${filing.returnForm} for ${filing.clientName} is due in ${diffDays} days.`
      });
    }
  }

  // Sort by urgency: overdue first, then due today, then closest
  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}
