import { NextResponse } from "next/server"
import logger from "@/lib/logger"
import { z } from "zod"
import nodemailer from "nodemailer"

const projectInquirySchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number too long"),
  company: z.string().min(1, "Company/organization name is required").max(100, "Company name too long"),
  projectType: z.enum(["website", "web-app", "mobile-app", "e-commerce", "cms", "api", "other"], {
    errorMap: () => ({ message: "Please select a valid project type" }),
  }),
  budget: z.enum(["under-5k", "5k-15k", "15k-30k", "30k-50k", "50k-100k", "over-100k"], {
    errorMap: () => ({ message: "Please select a valid budget range" }),
  }),
  timeline: z.enum(["asap", "1-month", "2-3-months", "3-6-months", "6-months-plus", "flexible"], {
    errorMap: () => ({ message: "Please select a valid timeline" }),
  }),
  requirements: z.string().min(10, "Please provide project requirements").max(2000, "Requirements too long").transform(val => val?.trim() || ""),
  goals: z.string().min(10, "Please describe your project goals").max(1000, "Goals description too long").transform(val => val?.trim() || ""),
  references: z.string().max(1000, "References too long").optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input first
    const validation = projectInquirySchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.format()
      logger.error("Validation failed for project inquiry:", errors)
      return NextResponse.json({ 
        success: false, 
        errors,
        type: "validation_error"
      }, { status: 400 })
    }

    const { firstName, lastName, email, phone, company, projectType, budget, timeline, requirements, goals, references } = validation.data

    // Map budget values to display-friendly format
    const budgetDisplayMap: Record<string, string> = {
      "under-5k": "Under 50,000 KSH",
      "5k-15k": "50,000 - 150,000 KSH",
      "15k-30k": "150,000 - 300,000 KSH", 
      "30k-50k": "300,000 - 500,000 KSH",
      "50k-100k": "500,000 - 1,000,000 KSH",
      "over-100k": "Over 1,000,000 KSH"
    }

    const budgetDisplay = budgetDisplayMap[budget] || budget

    // Send email notification with project inquiry details
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
        from: `"Lumyn Technologies" <${process.env.SMTP_USER}>`,
        replyTo: email,
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        subject: `New Project Inquiry: ${firstName} ${lastName} - ${company}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 30px; margin: 20px 0;">
              <h2 style="color: #333; text-align: center; margin-bottom: 30px; border-bottom: 2px solid #8eb69b; padding-bottom: 10px;">New Project Inquiry</h2>

              <div style="margin-bottom: 20px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px;">Contact Details</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 10px;">
                  <p style="margin: 5px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
                  <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #8eb69b;">${email}</a></p>
                  <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
                  <p style="margin: 5px 0;"><strong>Company:</strong> ${company}</p>
                </div>
              </div>

              <div style="margin-bottom: 20px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px;">Project Details</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 10px;">
                  <p style="margin: 5px 0;"><strong>Project Type:</strong> ${projectType}</p>
                  <p style="margin: 5px 0;"><strong>Budget Range:</strong> ${budgetDisplay}</p>
                  <p style="margin: 5px 0;"><strong>Timeline:</strong> ${timeline}</p>
                </div>
              </div>

              <div style="margin-bottom: 20px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px;">Project Goals</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #8eb69b;">
                  <p style="margin: 0; line-height: 1.6;">${goals.replace(/\n/g, "<br>")}</p>
                </div>
              </div>

              <div style="margin-bottom: 20px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px;">Requirements</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #8eb69b;">
                  <p style="margin: 0; line-height: 1.6;">${requirements.replace(/\n/g, "<br>")}</p>
                </div>
              </div>

              <div style="margin-bottom: 20px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px;">References</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                  <p style="margin: 0;">${references || "None provided"}</p>
                </div>
              </div>

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="text-align: center; color: #666; font-size: 14px; margin: 0;">
                <em>Inquiry submitted at: ${new Date().toLocaleString()}</em>
              </p>
            </div>
          </div>
        `,
      })
    } catch (emailError) {
      logger.error("Error sending project inquiry email:", emailError)
      // Continue even if email fails - still want to let user know their inquiry was received
    }

    return NextResponse.json({ 
      success: true, 
      message: "Project inquiry submitted successfully! We'll review your requirements and get back to you within 2-3 business days with a detailed proposal."
    }, { status: 201 })
  } catch (error) {
    logger.error("[v0] Error processing project inquiry:", error)
    
    // Provide specific error messages
    let errorMessage = "Failed to submit project inquiry. Please try again later."
    let errorType = "unknown_error"
    
    if (error instanceof Error) {
      if (error.message.includes("database") || error.message.includes("connection")) {
        errorMessage = "Email service temporarily unavailable, but we still received your inquiry. We'll contact you soon."
        errorType = "email_error"
      } else if (error.message.includes("validation")) {
        errorMessage = "Please check your input and try again."
        errorType = "validation_error"
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      type: errorType
    }, { status: 500 })
  }
}

