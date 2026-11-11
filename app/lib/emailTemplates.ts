/**
 * Monochromatic Email Design System for FitCheck AI
 * 
 * Strict specifications:
 * - Clean off-white background (#F6F8FA)
 * - Pure white container card (#FFFFFF) with 1px border (#E5E7EB)
 * - Text: Monochromatic black (#000000 / #111111) and dark charcoal (#333333 / #555555)
 * - Links: Explicitly styled dark text with underlines to prevent client blue injection
 * - CTA Button: Solid black (#000000), white text (#FFFFFF), 6px border-radius
 * - Client Compatibility: Semantic table wrappers with inline CSS
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface InquiryEmailProps {
  senderEmail: string;
  title: string;
  message: string;
  timestamp?: string;
}

export function renderInquiryEmailHtml({
  senderEmail,
  title,
  message,
  timestamp,
}: InquiryEmailProps): string {
  const safeEmail = escapeHtml(senderEmail);
  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);
  const formattedDate = timestamp || new Date().toLocaleString("en-US", {
    timeZone: "Asia/Manila",
    dateStyle: "medium",
    timeStyle: "short",
  }) + " (PHT)";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${safeTitle}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    a { color: #000000 !important; text-decoration: underline !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100% !important; background-color: #F6F8FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <!-- Canvas Table -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F6F8FA; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <!-- Container Card (Max-width 600px) -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
          <!-- Top Header Section -->
          <tr>
            <td style="padding: 36px 36px 24px 36px; border-bottom: 1px solid #E5E7EB;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left">
                    <span style="display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; color: #555555; margin-bottom: 6px;">
                      FITCHECK AI &middot; INCOMING INQUIRY
                    </span>
                    <h1 style="margin: 6px 0 0 0; font-size: 22px; font-weight: 700; line-height: 1.3; color: #000000; letter-spacing: -0.02em;">
                      ${safeTitle}
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Metadata Grid / Table -->
          <tr>
            <td style="padding: 24px 36px; background-color: #FAFAFA; border-bottom: 1px solid #E5E7EB;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; line-height: 1.6; color: #333333;">
                <tr>
                  <td width="100" style="padding: 4px 0; font-weight: 600; color: #111111; vertical-align: top;">
                    From:
                  </td>
                  <td style="padding: 4px 0; color: #111111; vertical-align: top;">
                    <a href="mailto:${safeEmail}" style="color: #000000 !important; font-weight: 600; text-decoration: underline;">${safeEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td width="100" style="padding: 4px 0; font-weight: 600; color: #111111; vertical-align: top;">
                    Date &amp; Time:
                  </td>
                  <td style="padding: 4px 0; color: #555555; vertical-align: top;">
                    ${formattedDate}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body Section -->
          <tr>
            <td style="padding: 32px 36px 36px 36px;">
              <span style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #555555; margin-bottom: 12px;">
                Message Content
              </span>
              <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 6px; padding: 20px 24px; font-size: 14px; line-height: 1.65; color: #111111; white-space: pre-wrap; word-break: break-word;">${safeMessage}</div>

              <!-- High-Contrast Monochromatic Action Button -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 32px;">
                <tr>
                  <td align="left">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#000000" style="border-radius: 6px;">
                          <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(title)}" target="_blank" style="display: inline-block; padding: 14px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 600; color: #FFFFFF !important; text-decoration: none !important; border-radius: 6px; text-transform: none; letter-spacing: 0.02em;">
                            Reply to ${safeEmail} &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="padding: 24px 36px; border-top: 1px solid #E5E7EB; background-color: #FAFAFA;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-size: 12px; line-height: 1.5; color: #777777;">
                    <p style="margin: 0 0 6px 0; color: #555555; font-weight: 500;">
                      FitCheck AI &middot; Digital Wardrobe &amp; Virtual Try-On Platform
                    </p>
                    <p style="margin: 0; color: #888888; font-size: 11px;">
                      This notification was delivered automatically via verified SMTP to <a href="mailto:fitcheckai0@gmail.com" style="color: #555555 !important; text-decoration: underline;">fitcheckai0@gmail.com</a>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <!-- End Container Card -->
      </td>
    </tr>
  </table>
  <!-- End Canvas Table -->
</body>
</html>`;
}

