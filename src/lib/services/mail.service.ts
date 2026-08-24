import nodemailer from "nodemailer";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Creates and returns a Nodemailer transporter configured for Mailtrap
 */
function getTransporter() {
  const host = process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io";
  const port = Number(process.env.MAILTRAP_PORT) || 2525;
  const user = process.env.MAILTRAP_USER || "";
  const pass = process.env.MAILTRAP_PASS || "";

  return nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass,
    },
  });
}

const FROM_EMAIL =
  process.env.MAIL_FROM || "ATENIER Real Estate <no-reply@atenier.com>";
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://atenier.com";

/**
 * Generic send email function via Mailtrap
 */
export async function sendEmail({ to, subject, html, text }: SendMailOptions) {
  try {
    const transporter = getTransporter();

    // Check if credentials are placeholders in development
    const isMock =
      !process.env.MAILTRAP_USER ||
      process.env.MAILTRAP_USER.includes("your_mailtrap") ||
      !process.env.MAILTRAP_PASS ||
      process.env.MAILTRAP_PASS.includes("your_mailtrap");

    if (isMock && process.env.NODE_ENV === "development") {
      console.log("--------------------------------------------------");
      console.log(`📧 [MAILTRAP DEV FALLBACK] Email to: ${to}`);
      console.log(`📧 Subject: ${subject}`);
      console.log(`📧 Preview text:\n${text || "HTML Email sent"}`);
      console.log("--------------------------------------------------");
    }

    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ""),
      html,
    });

    console.log(`✅ Mailtrap email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ Mailtrap sendEmail error:", error);
    // In dev, don't crash if Mailtrap credentials aren't configured yet
    if (process.env.NODE_ENV === "development") {
      return { success: true, warning: "Mailtrap credentials not configured yet, simulated in console" };
    }
    throw new Error(error.message || "Failed to send email via Mailtrap");
  }
}

/**
 * Sends an email verification link and 6-digit OTP code to the user
 */
export async function sendVerificationEmail({
  to,
  name,
  token,
  otp,
}: {
  to: string;
  name: string;
  token: string;
  otp: string;
}) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}&email=${encodeURIComponent(to)}`;

  const html = `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>আপনার ইমেইল ভেরিফাই করুন - ATENIER</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 580px; margin: 30px auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; }
    .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 35px 30px; text-align: center; color: white; }
    .logo { font-size: 26px; font-weight: 800; letter-spacing: 1px; }
    .logo-sub { font-size: 13px; opacity: 0.9; margin-top: 4px; }
    .content { padding: 36px 30px; }
    .greeting { font-size: 18px; font-weight: 700; margin-bottom: 16px; color: #f8fafc; }
    .text { font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px; }
    .button-wrap { text-align: center; margin: 32px 0; }
    .button { display: inline-block; background: #10b981; color: #ffffff !important; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 34px; border-radius: 10px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); }
    .otp-card { background: #0f172a; border: 2px dashed #059669; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 8px; }
    .otp-code { font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #34d399; font-family: monospace; }
    .footer { background: #0f172a; padding: 24px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155; }
    .link-alt { word-break: break-all; color: #38bdf8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ATENIER</div>
      <div class="logo-sub">Enterprise Real Estate Cloud Platform</div>
    </div>
    <div class="content">
      <div class="greeting">স্বাগতম, ${name || "ইউজার"}!</div>
      <p class="text">
        ATENIER প্ল্যাটফর্মে আপনার এজেন্সি একাউন্ট রেজিস্ট্রেশনের জন্য ধন্যবাদ। আপনার একাউন্টের নিরাপত্তা নিশ্চিত করতে অনুগ্রহ করে নিচের বাটনে ক্লিক করে ইমেইল ভেরিফাই করুন:
      </p>

      <div class="button-wrap">
        <a href="${verifyUrl}" class="button" target="_blank">✓ ইমেইল ভেরিফাই করুন (Verify Email)</a>
      </div>

      <div class="otp-card">
        <div class="otp-label">অথবা ৬-সংখ্যার ভেরিফিকেশন ওটিপি (OTP) কোড ব্যবহার করুন:</div>
        <div class="otp-code">${otp}</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 8px;">(এই কোডটি আগামী ১৫ মিনিট পর্যন্ত কার্যকর থাকবে)</div>
      </div>

      <p class="text" style="font-size: 12px; color: #94a3b8;">
        যদি উপরের বাটনটি কাজ না করে, নিচের লিংকটি কপি করে আপনার ব্রাউজারে পেস্ট করুন:<br>
        <a href="${verifyUrl}" class="link-alt">${verifyUrl}</a>
      </p>
    </div>
    <div class="footer">
      নিরাপত্তা সতর্কতা: আপনি যদি এই একাউন্ট তৈরি না করে থাকেন, তবে এই ইমেইলটি উপেক্ষা করুন।<br>
      © ${new Date().getFullYear()} ATENIER. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;

  const text = `
স্বাগতম ${name || "ইউজার"},

ATENIER প্ল্যাটফর্মে আপনার ইমেইল ভেরিফাই করতে নিচের লিংকে প্রবেশ করুন:
${verifyUrl}

আপনার ৬-সংখ্যার ভেরিফিকেশন OTP কোড: ${otp}
(কোডটির মেয়াদ ১৫ মিনিট)

ধন্যবাদ,
ATENIER Real Estate Cloud Platform
  `;

  return sendEmail({
    to,
    subject: "আপনার ইমেইল ভেরিফাই করুন - ATENIER Real Estate",
    html,
    text,
  });
}

/**
 * Sends a password reset link and 6-digit OTP code to the user
 */
export async function sendPasswordResetEmail({
  to,
  name,
  token,
  otp,
}: {
  to: string;
  name: string;
  token: string;
  otp: string;
}) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(to)}`;

  const html = `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>পাসওয়ার্ড রিসেট করুন - ATENIER</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 580px; margin: 30px auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; }
    .header { background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); padding: 35px 30px; text-align: center; color: white; }
    .logo { font-size: 26px; font-weight: 800; letter-spacing: 1px; }
    .logo-sub { font-size: 13px; opacity: 0.9; margin-top: 4px; }
    .content { padding: 36px 30px; }
    .greeting { font-size: 18px; font-weight: 700; margin-bottom: 16px; color: #f8fafc; }
    .text { font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px; }
    .button-wrap { text-align: center; margin: 32px 0; }
    .button { display: inline-block; background: #f43f5e; color: #ffffff !important; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 34px; border-radius: 10px; box-shadow: 0 4px 14px rgba(244, 63, 94, 0.4); }
    .otp-card { background: #0f172a; border: 2px dashed #f43f5e; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 8px; }
    .otp-code { font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #fb7185; font-family: monospace; }
    .footer { background: #0f172a; padding: 24px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155; }
    .link-alt { word-break: break-all; color: #38bdf8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ATENIER</div>
      <div class="logo-sub">Account Security & Password Reset</div>
    </div>
    <div class="content">
      <div class="greeting">প্রিয় ${name || "ইউজার"},</div>
      <p class="text">
        আমরা আপনার ATENIER একাউন্টের জন্য একটি পাসওয়ার্ড রিসেট রিকোয়েস্ট পেয়েছি। পাসওয়ার্ড পরিবর্তন করতে নিচের বাটনে ক্লিক করুন:
      </p>

      <div class="button-wrap">
        <a href="${resetUrl}" class="button" target="_blank">পাসওয়ার্ড রিসেট করুন (Reset Password)</a>
      </div>

      <div class="otp-card">
        <div class="otp-label">অথবা ৬-সংখ্যার পাসওয়ার্ড রিসেট ওটিপি কোড ব্যবহার করুন:</div>
        <div class="otp-code">${otp}</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 8px;">(এই কোডটি আগামী ১ ঘণ্টা পর্যন্ত কার্যকর থাকবে)</div>
      </div>

      <p class="text" style="font-size: 12px; color: #94a3b8;">
        যদি উপরের বাটনটি কাজ না করে, নিচের লিংকটি কপি করে আপনার ব্রাউজারে পেস্ট করুন:<br>
        <a href="${resetUrl}" class="link-alt">${resetUrl}</a>
      </p>
    </div>
    <div class="footer">
      নিরাপত্তা সতর্কতা: আপনি যদি এই পাসওয়ার্ড রিসেট রিকোয়েস্ট না করে থাকেন, তবে দ্রুত আমাদের জানান অথবা আপনার একাউন্ট নিরাপদ রাখুন।<br>
      © ${new Date().getFullYear()} ATENIER. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;

  const text = `
প্রিয় ${name || "ইউজার"},

আপনার ATENIER একাউন্টের পাসওয়ার্ড রিসেট করতে নিচের লিংকে যান:
${resetUrl}

আপনার ৬-সংখ্যার রিসেট কোড: ${otp}
(কোডটির মেয়াদ ১ ঘণ্টা)

যদি আপনি এই রিকোয়েস্ট না করে থাকেন তবে এই ইমেইলটি উপেক্ষা করুন।

ধন্যবাদ,
ATENIER Security Team
  `;

  return sendEmail({
    to,
    subject: "আপনার পাসওয়ার্ড রিসেট করুন - ATENIER Real Estate",
    html,
    text,
  });
}
