'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/prisma'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const legalDisclaimer = `This proposal is generated for internal sales evaluation purposes only. All financial projections, ROI estimates, and compliance assessments are AI-assisted estimates based on industry benchmarks and client-provided inputs. Lumyn Technologies does not guarantee specific financial outcomes. Final proposals must be reviewed and approved by authorized sales leadership before delivery to any client or prospect.`

const proposalSchema = z.object({
  executiveSummary: z.string(),
  financialProjections: z.object({
    annualSavings: z.string(),
    paybackPeriodMonths: z.number(),
    efficiencyMultiplier: z.string(),
  }),
  complianceMapping: z.object({
    gdprComplianceStatus: z.string(),
    dataIsolationProtocol: z.string(),
    securityCertifications: z.string(),
  }),
  implementationTimeline: z.array(
    z.object({
      phase: z.string(),
      duration: z.string(),
      deliverables: z.array(z.string()),
    })
  ),
})

export type ProposalInput = z.infer<typeof proposalSchema>

export async function generateBusinessCase(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: 'Unauthorized' }
  }

  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(',') || []
  if (!adminIds.includes(userId)) {
    return { success: false, error: 'Forbidden: Admin access required' }
  }

  const clientCompanyName = formData.get('clientCompanyName') as string
  const targetIndustry = formData.get('targetIndustry') as string
  const operationalBottleneck = formData.get('operationalBottleneck') as string

  if (!clientCompanyName || !targetIndustry || !operationalBottleneck) {
    return { success: false, error: 'Missing required fields' }
  }

  try {
    const result = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: proposalSchema,
      prompt: `You are a senior enterprise solutions architect at Lumyn Technologies. Generate a comprehensive B2B business case for a client in the ${targetIndustry} industry.

Client: ${clientCompanyName}
Operational Bottleneck: ${operationalBottleneck}

Generate a formal enterprise proposal with:
1. executiveSummary: A 2-3 sentence corporate pitch emphasizing quantifiable labor hour savings and operational efficiency gains specific to ${targetIndustry}.
2. financialProjections: 
   - annualSavings: Dollar estimate of yearly cost reduction (e.g., "$1.2M - $1.8M annually")
   - paybackPeriodMonths: Number (integer) representing ROI payback period in months
   - efficiencyMultiplier: Descriptive string like "3.2x operational throughput"
3. complianceMapping:
   - gdprComplianceStatus: "Fully Compliant" or detailed status
   - dataIsolationProtocol: Multi-tenant architecture description
   - securityCertifications: SOC 2 Type II, ISO 27001, etc.
4. implementationTimeline: Array of 4 phases with phase name, duration string, and deliverables array.

Use formal B2B language. Be specific to ${targetIndustry} pain points.`,
    })

    const enrichedPayload = {
      ...result.object,
      legalDisclaimer,
      generatedAt: new Date().toISOString(),
      generatedBy: userId,
    }

    const proposal = await prisma.internalSalesProposal.create({
      data: {
        createdById: userId,
        clientCompanyName,
        targetIndustry,
        proposalData: enrichedPayload,
      },
    })

    revalidatePath('/admin/proposals')

    return {
      success: true,
      proposal,
      data: enrichedPayload,
    }
  } catch (error: any) {
    console.error('Business case generation error:', error)
    return { success: false, error: error.message || 'Generation failed' }
  }
}

export async function getProposals() {
  const { userId } = await auth()

  if (!userId) {
    return []
  }

  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(',') || []
  if (!adminIds.includes(userId)) {
    return []
  }

  return prisma.internalSalesProposal.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function approveProposal(id: string) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: 'Unauthorized' }
  }

  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(',') || []
  if (!adminIds.includes(userId)) {
    return { success: false, error: 'Forbidden' }
  }

  await prisma.internalSalesProposal.update({
    where: { id },
    data: { isApprovedBySales: true },
  })

  revalidatePath('/admin/proposals')
  return { success: true }
}
