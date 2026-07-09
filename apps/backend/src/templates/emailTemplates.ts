import { emailLayout } from './emailLayout';

export function complaintCreatedTemplate(name: string, ticketNumber: string, title: string, ctaUrl: string) {
  return emailLayout({
    title: 'Complaint Received',
    preheader: `Your complaint ${ticketNumber} has been logged`,
    bodyHtml: `
      <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Hi ${name}, we've received your complaint</h2>
      <p style="margin:0 0 8px;">Your complaint has been successfully logged with the following details:</p>
      <table style="width:100%;margin:16px 0;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#6b7280;">Ticket Number</td><td style="padding:8px 0;font-weight:600;">${ticketNumber}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Title</td><td style="padding:8px 0;font-weight:600;">${title}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Status</td><td style="padding:8px 0;"><span style="background:#e0e7ff;color:#4338ca;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;">OPEN</span></td></tr>
      </table>
      <p style="margin:0;color:#6b7280;">Our team will review it shortly. You can track progress anytime from your dashboard.</p>
    `,
    ctaText: 'View Complaint',
    ctaUrl,
  });
}

export function statusChangedTemplate(
  name: string,
  ticketNumber: string,
  title: string,
  oldStatus: string,
  newStatus: string,
  ctaUrl: string
) {
  return emailLayout({
    title: 'Complaint Status Updated',
    preheader: `Complaint ${ticketNumber} status changed to ${newStatus}`,
    bodyHtml: `
      <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Hi ${name}, your complaint status has changed</h2>
      <table style="width:100%;margin:16px 0;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#6b7280;">Ticket Number</td><td style="padding:8px 0;font-weight:600;">${ticketNumber}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Title</td><td style="padding:8px 0;font-weight:600;">${title}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Status Change</td><td style="padding:8px 0;font-weight:600;">${oldStatus} → ${newStatus}</td></tr>
      </table>
    `,
    ctaText: 'View Complaint',
    ctaUrl,
  });
}

export function complaintResolvedTemplate(name: string, ticketNumber: string, title: string, ctaUrl: string) {
  return emailLayout({
    title: 'Complaint Resolved',
    preheader: `Great news! Complaint ${ticketNumber} has been resolved`,
    bodyHtml: `
      <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Hi ${name}, your complaint has been resolved ✅</h2>
      <table style="width:100%;margin:16px 0;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#6b7280;">Ticket Number</td><td style="padding:8px 0;font-weight:600;">${ticketNumber}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Title</td><td style="padding:8px 0;font-weight:600;">${title}</td></tr>
      </table>
      <p style="margin:0;color:#6b7280;">Thank you for your patience. If the issue persists, feel free to reopen or create a new complaint.</p>
    `,
    ctaText: 'View Complaint',
    ctaUrl,
  });
}

export function noticePostedTemplate(name: string, title: string, content: string, ctaUrl: string) {
  return emailLayout({
    title: 'New Notice Posted',
    preheader: title,
    bodyHtml: `
      <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Hi ${name}, a new notice has been posted 📢</h2>
      <h3 style="margin:0 0 8px;font-size:16px;color:#111827;">${title}</h3>
      <p style="margin:0;color:#6b7280;">${content.slice(0, 200)}${content.length > 200 ? '…' : ''}</p>
    `,
    ctaText: 'View Notice Board',
    ctaUrl,
  });
}

export function passwordResetTemplate(name: string, ctaUrl: string) {
  return emailLayout({
    title: 'Reset Your Password',
    preheader: 'Reset your Society Maintenance Tracker password',
    bodyHtml: `
      <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Hi ${name}, reset your password</h2>
      <p style="margin:0;color:#6b7280;">We received a request to reset your password. This link will expire in 1 hour. If you did not request this, you can safely ignore this email.</p>
    `,
    ctaText: 'Reset Password',
    ctaUrl,
  });
}
