
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import nodemailer from "nodemailer"
import { z } from "zod"

import sanitizeHtml from "sanitize-html"

const prisma = new PrismaClient()

const jobApplicationSchema = z.object({
  jobId: z.string().min(1),
  jobTitle: z.string().min(1),
  jobCompany: z.string().min(1),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  phone: z.string().min(1).max(20),
  linkedIn: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
  coverLetter: z.string().min(1).max(2000),
  experience: z.string().min(1).max(2000),
  availability: z.string().min(1).max(100),
  salaryExpectation: z.string().max(100).optional().or(z.literal("")),
  additionalInfo: z.string().max(1000).optional().or(z.literal("")),
  resumeUrl: z.string().url().optional().or(z.literal("")),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = jobApplicationSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data


    // Sanitize text inputs
    const sanitizedCoverLetter = sanitizeHtml(validatedData.coverLetter)
    const sanitizedExperience = sanitizeHtml(validatedData.experience)
    const sanitizedAdditionalInfo = sanitizeHtml(validatedData.additionalInfo || "")
    // Save to database
    const jobApplication = await prisma.jobApplication.create({
      data: {
        jobId: validatedData.jobId,
        jobTitle: validatedData.jobTitle,
        jobCompany: validatedData.jobCompany,
        firstName: validatedData.firstName.trim(),
        lastName: validatedData.lastName.trim(),
        email: validatedData.email.trim(),
        phone: validatedData.phone.trim(),
        linkedIn: validatedData.linkedIn || null,
        portfolio: validatedData.portfolio || null,
        coverLetter: sanitizedCoverLetter,
        experience: sanitizedExperience,
        availability: validatedData.availability,
        salaryExpectation: validatedData.salaryExpectation || null,
        additionalInfo: sanitizedAdditionalInfo || null,
        resumeUrl: validatedData.resumeUrl || null,
      },
    })

    // Send email notification to admin
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await transporter.sendMail({
        from: `"Lumyn Careers" <${process.env.SMTP_USER}>`,
        replyTo: validatedData.email,
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        subject: `New Job Application: ${validatedData.jobTitle} at ${validatedData.jobCompany}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 30px; margin: 20px 0;">
              <h2 style="color: #333; text-align: center; margin-bottom: 30px; border-bottom: 2px solid #8eb69b; padding-bottom: 10px;">
                New Job Application Received
              </h2>

              <div style="margin-bottom: 25px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                  Position Details
                </h3>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #8eb69b;">
                  <p style="margin: 8px 0;"><strong>Position:</strong> ${validatedData.jobTitle}</p>
                  <p style="margin: 8px 0;"><strong>Company:</strong> ${validatedData.jobCompany}</p>
                  <p style="margin: 8px 0;"><strong>Applied:</strong> ${new Date().toLocaleString()}</p>
                </div>
              </div>

              <div style="margin-bottom: 25px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                  Applicant Information
                </h3>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #8eb69b;">
                  <p style="margin: 8px 0;"><strong>Name:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
                  <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${validatedData.email}" style="color: #8eb69b;">${validatedData.email}</a></p>
                  <p style="margin: 8px 0;"><strong>Phone:</strong> ${validatedData.phone}</p>
                  ${validatedData.linkedIn ? `<p style="margin: 8px 0;"><strong>LinkedIn:</strong> <a href="${validatedData.linkedIn}" target="_blank" style="color: #8eb69b;">${validatedData.linkedIn}</a></p>` : ''}
                  ${validatedData.portfolio ? `<p style="margin: 8px 0;"><strong>Portfolio:</strong> <a href="${validatedData.portfolio}" target="_blank" style="color: #8eb69b;">${validatedData.portfolio}</a></p>` : ''}
                  ${validatedData.resumeUrl ? `<p style="margin: 8px 0;"><strong>Resume:</strong> <a href="${validatedData.resumeUrl}" target="_blank" style="color: #8eb69b;">View Resume</a></p>` : ''}
                </div>
              </div>

              <div style="margin-bottom: 25px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                  Professional Details
                </h3>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #8eb69b;">
                  <p style="margin: 8px 0;"><strong>Availability:</strong> ${validatedData.availability}</p>
                  ${validatedData.salaryExpectation ? `<p style="margin: 8px 0;"><strong>Salary Expectation:</strong> ${validatedData.salaryExpectation}</p>` : ''}
                </div>
              </div>

              <div style="margin-bottom: 25px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                  Cover Letter
                </h3>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #8eb69b;">
                  <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${sanitizedCoverLetter.replace(/\n/g, '<br>')}</p>
                </div>
              </div>

              <div style="margin-bottom: 25px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                  Experience & Background
                </h3>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #8eb69b;">
                  <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${sanitizedExperience.replace(/\n/g, '<br>')}</p>
                </div>
              </div>

              ${sanitizedAdditionalInfo ? `
              <div style="margin-bottom: 25px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                  Additional Information
                </h3>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #8eb69b;">
                  <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${sanitizedAdditionalInfo.replace(/\n/g, '<br>')}</p>
                </div>
              </div>
              ` : ''}

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <div style="text-align: center;">
                <a href="mailto:${validatedData.email}?subject=Re: ${validatedData.jobTitle} Application" 
                   style="background-color: #8eb69b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px;">
                  Reply to Applicant
                </a>
              </div>
              <p style="text-align: center; color: #666; font-size: 14px; margin-top: 20px;">
                <em>Application ID: ${jobApplication.id}</em>
              </p>
            </div>
          </div>
        `,
      })

      // Send confirmation email to applicant
      await transporter.sendMail({
        from: `"Lumyn Careers" <${process.env.SMTP_USER}>`,
        to: validatedData.email,
        subject: `Application Received - ${validatedData.jobTitle} at ${validatedData.jobCompany}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 30px; margin: 20px 0;">
              <h2 style="color: #333; text-align: center; margin-bottom: 30px; border-bottom: 2px solid #8eb69b; padding-bottom: 10px;">
                Application Received Successfully!
              </h2>

              <div style="margin-bottom: 25px;">
                <p style="font-size: 16px; line-height: 1.6; color: #555;">
                  Dear ${validatedData.firstName},
                </p>
                <p style="font-size: 16px; line-height: 1.6; color: #555;">
                  Thank you for your interest in the <strong>${validatedData.jobTitle}</strong> position at <strong>${validatedData.jobCompany}</strong>.
                </p>
                <p style="font-size: 16px; line-height: 1.6; color: #555;">
                  We have successfully received your application and our team will review it carefully. We'll be in touch soon with next steps.
                </p>
              </div>

              <div style="margin-bottom: 25px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px;">Application Summary</h3>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #8eb69b;">
                  <p style="margin: 8px 0;"><strong>Position:</strong> ${validatedData.jobTitle}</p>
                  <p style="margin: 8px 0;"><strong>Company:</strong> ${validatedData.jobCompany}</p>
                  <p style="margin: 8px 0;"><strong>Applied:</strong> ${new Date().toLocaleString()}</p>
                  <p style="margin: 8px 0;"><strong>Application ID:</strong> ${jobApplication.id}</p>
                </div>
              </div>

              <div style="margin-bottom: 25px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px;">What's Next?</h3>
                <ul style="color: #555; line-height: 1.6;">
                  <li>Our hiring team will review your application</li>
                  <li>You may receive a follow-up email within 1-2 weeks</li>
                  <li>Qualified candidates will be contacted for interviews</li>
                  <li>We'll keep you updated throughout the process</li>
                </ul>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666; font-size: 14px;">
                  If you have any questions, please don't hesitate to contact us.
                </p>
              </div>

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="text-align: center; color: #666; font-size: 14px; margin: 0;">
                Best regards,<br>
                <strong>The Lumyn Team</strong>
              </p>
            </div>
          </div>
        `,
      })

    } catch (emailError) {
      console.error("Error sending application emails:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(jobApplication, { status: 201 })
  } catch (error) {
    console.error("Error creating job application:", error)
    return NextResponse.json({ error: "Failed to submit job application" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const jobApplications = await prisma.jobApplication.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(jobApplications)
  } catch (error) {
    console.error("Error fetching job applications:", error)
    return NextResponse.json({ error: "Failed to fetch job applications" }, { status: 500 })
  }
}

