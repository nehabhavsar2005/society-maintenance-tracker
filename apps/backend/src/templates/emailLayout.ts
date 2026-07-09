export function emailLayout(opts: { title: string; preheader?: string; bodyHtml: string; ctaText?: string; ctaUrl?: string }): string {
  const { title, preheader = '', bodyHtml, ctaText, ctaUrl } = opts;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.02em;">
                    🏢 Society Maintenance Tracker
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;color:#1f2937;font-size:15px;line-height:1.6;">
              ${bodyHtml}
              ${
                ctaText && ctaUrl
                  ? `<table cellpadding="0" cellspacing="0" style="margin-top:28px;">
                  <tr>
                    <td style="border-radius:8px;background:#4f46e5;">
                      <a href="${ctaUrl}" style="display:inline-block;padding:12px 28px;color:#ffffff;font-weight:600;text-decoration:none;font-size:14px;border-radius:8px;">${ctaText}</a>
                    </td>
                  </tr>
                </table>`
                  : ''
              }
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:20px 32px;text-align:center;color:#9ca3af;font-size:12px;">
              © ${new Date().getFullYear()} Society Maintenance Tracker. All rights reserved.<br />
              This is an automated message, please do not reply.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
