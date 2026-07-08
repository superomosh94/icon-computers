import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

function getTransporter() {
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  // In development, log emails instead of sending
  return {
    sendMail: async (mail) => {
      console.log('\n=== EMAIL (dev mode) ===');
      console.log(`To: ${mail.to}`);
      console.log(`Subject: ${mail.subject}`);
      console.log(`Body: ${mail.text || mail.html}`);
      console.log('========================\n');
    },
  };
}

const transporter = getTransporter();
const shopEmail = process.env.SHOP_EMAIL || 'shop@iconshop.co.ke';

export async function sendReservationNotification({ customerName, customerPhone, customerEmail, laptopName }) {
  await transporter.sendMail({
    from: shopEmail,
    to: shopEmail,
    subject: `New Reservation: ${laptopName}`,
    text: `New reservation request:\n\nLaptop: ${laptopName}\nName: ${customerName}\nPhone: ${customerPhone}\nEmail: ${customerEmail || 'Not provided'}\n\nPlease contact the customer to confirm.`,
    html: `<h2>New Reservation</h2>
      <p><strong>Laptop:</strong> ${laptopName}</p>
      <p><strong>Name:</strong> ${customerName}</p>
      <p><strong>Phone:</strong> ${customerPhone}</p>
      <p><strong>Email:</strong> ${customerEmail || 'Not provided'}</p>
      <p>Please contact the customer to confirm.</p>`,
  });
}

export async function sendReservationConfirmation({ customerName, customerEmail, laptopName }) {
  if (!customerEmail) return;
  await transporter.sendMail({
    from: shopEmail,
    to: customerEmail,
    subject: `Your reservation for ${laptopName} is confirmed`,
    text: `Hi ${customerName},\n\nThank you for reserving the ${laptopName} with ICON.\n\nWe will hold this laptop for 24 hours. Please visit our shop to test and purchase.\n\nShop: Moi Avenue, Nairobi, Kenya\nPhone: +254 700 123 456\n\nSee you soon!\nICON Team`,
    html: `<h2>Reservation Confirmed</h2>
      <p>Hi ${customerName},</p>
      <p>Thank you for reserving the <strong>${laptopName}</strong> with ICON.</p>
      <p>We will hold this laptop for <strong>24 hours</strong>. Please visit our shop to test and purchase.</p>
      <p><strong>Shop:</strong> Moi Avenue, Nairobi, Kenya<br>
      <strong>Phone:</strong> +254 700 123 456</p>
      <p>See you soon!<br>ICON Team</p>`,
  });
}

export async function sendContactNotification({ name, email, message }) {
  await transporter.sendMail({
    from: shopEmail,
    to: shopEmail,
    subject: `New Contact Message from ${name}`,
    text: `New message from ${name} (${email}):\n\n${message}`,
    html: `<h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>`,
  });
}
