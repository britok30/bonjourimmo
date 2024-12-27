import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Configure the transporter for sending emails
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL for secure connection
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your app password (generated in your email provider's settings)
  },
});

// API handler for the contact form
export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  // Validate required fields
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    // Send the email
    await transporter.sendMail({
      from: `"${name}"`, // Sender's name and email
      to: process.env.EMAIL_RECEIVER, // Receiver's email address
      subject: "New Contact Us Message",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br>${message}</p>`, // HTML formatted email
    });

    // Respond with success
    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);

    // Respond with failure
    return NextResponse.json(
      { error: "Failed to send the email." },
      { status: 500 }
    );
  }
}
