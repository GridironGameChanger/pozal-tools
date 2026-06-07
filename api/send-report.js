export const config = { runtime: 'edge' };

const FROM_EMAIL = 'blaz@pozal.ai';
const FROM_NAME  = 'Blaz at Pozal';

function fmt(n) {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2).replace(/\.?0+$/, '') + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1).replace(/\.?0+$/, '') + 'k';
  return '$' + Math.round(n).toLocaleString();
}

function buildHtml({ email, proposals, acv, winRate, hoursPerProposal, hourlyCost,
                     currentRevenue, projectedRevenue, hoursSaved,
                     timeSavingsMonthly, totalValue }) {

  const revUplift      = projectedRevenue - currentRevenue;
  const timeSavedAnnual = timeSavingsMonthly * 12;

  const row = (label, value) => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#444;">${label}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;font-weight:700;color:#14171f;text-align:right;">${value}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Your Proposal ROI Report — Pozal.ai</title></head>
<body style="margin:0;padding:0;background:#f0f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f3;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#14171f;padding:32px 40px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#4b9cd3;">Pozal.ai</p>
            <h1 style="margin:0;font-size:26px;font-weight:800;color:#fff;line-height:1.2;">Your Proposal ROI Report</h1>
            <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.6);">Personalized numbers based on your inputs</p>
          </td>
        </tr>

        <!-- Inputs summary -->
        <tr>
          <td style="padding:32px 40px 0;">
            <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#999;">Your Current Setup</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #f0f0f0;border-radius:10px;overflow:hidden;">
              ${row('Proposals per month', proposals)}
              ${row('Average contract value', fmt(acv))}
              ${row('Current win rate', winRate + '%')}
              ${row('Hours per proposal', hoursPerProposal + ' hrs')}
              ${row('Hourly staff cost', '$' + hourlyCost + '/hr')}
            </table>
          </td>
        </tr>

        <!-- Results -->
        <tr>
          <td style="padding:28px 40px 0;">
            <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#999;">Your Projected Impact with Pozal</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #f0f0f0;border-radius:10px;overflow:hidden;">
              ${row('Current annual revenue', fmt(currentRevenue))}
              ${row('Projected annual revenue (+15% win rate)', fmt(projectedRevenue))}
              ${row('Revenue uplift', fmt(revUplift))}
              ${row('Hours saved per month', Math.round(hoursSaved) + ' hrs')}
              ${row('Time savings value per month', fmt(timeSavingsMonthly))}
              ${row('Annual time savings value', fmt(timeSavedAnnual))}
            </table>
          </td>
        </tr>

        <!-- Total value banner -->
        <tr>
          <td style="padding:24px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8e8;border:1.5px solid #f5d87a;border-radius:10px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#b07d00;">Total 12-Month Value</p>
                  <p style="margin:0 0 4px;font-size:32px;font-weight:800;color:#7a5500;line-height:1;">${fmt(totalValue)}</p>
                  <p style="margin:0;font-size:12px;color:#a08030;">vs. $3,588 in Pozal costs</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:32px 40px 40px;text-align:center;">
            <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.5;">Ready to see how Pozal helps you win more proposals in less time?</p>
            <a href="https://www.pozal.ai" style="display:inline-block;background:#4b9cd3;color:#fff;font-size:15px;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:0.01em;">See how Pozal gets you there →</a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#bbb;">© ${new Date().getFullYear()} Pozal.ai &nbsp;·&nbsp; <a href="https://www.pozal.ai" style="color:#4b9cd3;text-decoration:none;">pozal.ai</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const { email, proposals, acv, winRate, hoursPerProposal, hourlyCost,
          currentRevenue, projectedRevenue, hoursSaved,
          timeSavingsMonthly, totalValue } = body;

  // Basic validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'SendGrid not configured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  const html = buildHtml({ email, proposals, acv, winRate, hoursPerProposal, hourlyCost,
                            currentRevenue, projectedRevenue, hoursSaved,
                            timeSavingsMonthly, totalValue });

  const payload = {
    personalizations: [{ to: [{ email }] }],
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: 'Your Proposal ROI Report — Pozal.ai',
    content: [{ type: 'text/html', value: html }],
  };

  let sgRes;
  try {
    sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[send-report] SendGrid fetch error:', err);
    return new Response(JSON.stringify({ error: 'Failed to reach SendGrid' }), {
      status: 502, headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!sgRes.ok) {
    const detail = await sgRes.text();
    console.error('[send-report] SendGrid error:', sgRes.status, detail);
    return new Response(JSON.stringify({ error: 'SendGrid rejected the request' }), {
      status: 502, headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
}
