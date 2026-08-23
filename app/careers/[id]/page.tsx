import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo"
import ApplyButton from "../apply-button"
import ShareButton from "@/components/ShareButton"
import Image from "next/image"
import styles from "./career-detail.module.css"

interface CareerDetailPageProps {
  params: { id: string }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  try {
    const career = await prisma.career.findUnique({
      where: { id: params.id },
      select: {
        title: true,
        company: true,
        description: true,
        location: true,
        type: true,
        createdAt: true,
      },
    })

    if (!career) {
      return { title: "Job not found | Lumyn Technologies" }
    }

    const description = `${career.title} at ${career.company} in ${career.location || "Kenya"}. ${career.description.replace(/<[^>]*>/g, "").substring(0, 150)}...`

    return pageMetadata({
      title: `${career.title} at ${career.company} | Lumyn Technologies Careers`,
      description,
      path: `/careers/${params.id}`,
      keywords: ["careers", "jobs", `${career.title}`, `${career.company}`, "hiring", "Lumyn Technologies"],
      breadcrumbs: [
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "Careers", url: "https://www.lumyn.co.ke/careers" },
        { name: `${career.title} at ${career.company}`, url: `https://www.lumyn.co.ke/careers/${params.id}` },
      ],
    })
  } catch {
    return { title: "Careers | Lumyn Technologies" }
  }
}

export default async function CareerDetailPage({
  params,
}: {
  params: { id: string }
}) {
  let career
  try {
    career = await prisma.career.findUnique({
      where: { id: params.id },
    })
  } catch {
    notFound()
  }

  if (!career) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.lumyn.co.ke"
  const shareUrl = `${baseUrl}/careers/${career.id}`
  const shareText = `Check out this job opportunity: ${career.title} at ${career.company}`

  return (
    <>
      {breadcrumbJsonLd([
        { name: "Home", url: "https://www.lumyn.co.ke" },
        { name: "Careers", url: "https://www.lumyn.co.ke/careers" },
        {
          name: `${career.title} at ${career.company}`,
          url: `https://www.lumyn.co.ke/careers/${params.id}`,
        },
      ])}

      <div className={styles.careerDetailPage}>
        <div className={styles.careerDetailHeader}>
          <div className={styles.careerDetailHeaderBg} />
          <div className={styles.careerDetailHeaderContent}>
            <div className={styles.careerDetailMeta}>
              <span className={styles.careerDetailType}>{career.type.replace("-", " ")}</span>
              {career.jobType && (
                <span className={styles.careerDetailJobType}>{career.jobType}</span>
              )}
              {career.featured && (
                <span className={styles.careerDetailFeatured}>Featured</span>
              )}
            </div>

            <h1 className={styles.careerDetailTitle}>{career.title}</h1>
            <p className={styles.careerDetailCompany}>
              {career.company} {career.location && <>• 📍 {career.location}</>}
            </p>

            <div className={styles.careerDetailActions}>
              <ApplyButton career={career} />
              <ShareButton
                title={shareText}
                text={shareText}
                url={shareUrl}
                className={styles.careerDetailShare}
              />
            </div>
          </div>
        </div>

        <div className={styles.careerDetailBody}>
          <div className={styles.careerDetailGrid}>
            <div className={styles.careerDetailMain}>
              {career.image && (
                <div className={styles.careerDetailImageWrapper}>
                  <Image
                    src={career.image}
                    alt={career.title}
                    width={1200}
                    height={600}
                    className={styles.careerDetailImage}
                  />
                </div>
              )}

              <div className={styles.careerDetailSection}>
                <h2>Job Description</h2>
                <div
                  className={styles.careerDetailDescription}
                  dangerouslySetInnerHTML={{ __html: career.description }}
                />
              </div>

              {career.requirements && (
                <div className={styles.careerDetailSection}>
                  <h2>Requirements</h2>
                  <div
                    className={styles.careerDetailRequirements}
                    dangerouslySetInnerHTML={{ __html: career.requirements }}
                  />
                </div>
              )}
            </div>

            <div className={styles.careerDetailSidebar}>
              <div className={styles.careerDetailCard}>
                <h3>Job Details</h3>
                <div className={styles.careerDetailInfoList}>
                  <div className={styles.careerDetailInfoItem}>
                    <span className={styles.careerDetailInfoLabel}>Company</span>
                    <span className={styles.careerDetailInfoValue}>{career.company}</span>
                  </div>
                  <div className={styles.careerDetailInfoItem}>
                    <span className={styles.careerDetailInfoLabel}>Location</span>
                    <span className={styles.careerDetailInfoValue}>
                      {career.location || "Not specified"}
                    </span>
                  </div>
                  <div className={styles.careerDetailInfoItem}>
                    <span className={styles.careerDetailInfoLabel}>Job Type</span>
                    <span className={styles.careerDetailInfoValue}>
                      {career.type.replace("-", " ")}
                    </span>
                  </div>
                  {career.salary && (
                    <div className={styles.careerDetailInfoItem}>
                      <span className={styles.careerDetailInfoLabel}>Salary</span>
                      <span className={styles.careerDetailInfoValue}>{career.salary}</span>
                    </div>
                  )}
                  {career.applicationDeadline && (
                    <div className={styles.careerDetailInfoItem}>
                      <span className={styles.careerDetailInfoLabel}>Deadline</span>
                      <span className={styles.careerDetailInfoValue}>
                        {new Date(career.applicationDeadline).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  {career.contactEmail && (
                    <div className={styles.careerDetailInfoItem}>
                      <span className={styles.careerDetailInfoLabel}>Contact</span>
                      <a
                        href={`mailto:${career.contactEmail}`}
                        className={styles.careerDetailInfoLink}
                      >
                        {career.contactEmail}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.careerDetailCard}>
                <h3>Application Type</h3>
                <p className={styles.careerDetailApplicationType}>
                  {career.jobType === "formal" || !career.jobType
                    ? "Formal application via our system or external link"
                    : "Informal application via WhatsApp or phone call"}
                </p>
                {career.whatsappNumber && (
                  <a
                    href={`https://wa.me/${career.whatsappNumber.replace(/\D/g, "")}`}
                    className={styles.careerDetailWhatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp: {career.whatsappNumber}
                  </a>
                )}
                {career.phoneNumber && (
                  <a href={`tel:${career.phoneNumber}`} className={styles.careerDetailPhoneLink}>
                    Call: {career.phoneNumber}
                  </a>
                )}
              </div>

              <div className={styles.careerDetailCard}>
                <h3>Share this job</h3>
                <ShareButton
                  title={shareText}
                  text={shareText}
                  url={shareUrl}
                  className={styles.careerDetailShareFull}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
