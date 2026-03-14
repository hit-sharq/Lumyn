import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"

interface PageProps {
  params: { username: string }
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const portfolio = await prisma.launchPortfolio.findUnique({
    where: { username: params.username },
    include: { projects: { orderBy: { order: "asc" } } },
  })

  if (!portfolio || !portfolio.isPublished) {
    notFound()
  }

  const socialLinks = (portfolio.socialLinks as any) || {}

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#1a3a5c", color: "#ffffe3", padding: "64px 32px", textAlign: "center" }}>
        {portfolio.avatarUrl ? (
          <img
            src={portfolio.avatarUrl}
            alt={portfolio.displayName}
            style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(255,255,227,0.3)", marginBottom: 20 }}
          />
        ) : (
          <div style={{
            width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,227,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, fontWeight: 800, color: "#ffffe3", margin: "0 auto 20px", border: "4px solid rgba(255,255,227,0.2)"
          }}>
            {portfolio.displayName.charAt(0)}
          </div>
        )}
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 8px" }}>{portfolio.displayName}</h1>
        {portfolio.title && (
          <p style={{ fontSize: 18, opacity: 0.8, margin: "0 0 20px" }}>{portfolio.title}</p>
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          {socialLinks.github && (
            <a href={socialLinks.github} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,227,0.7)", textDecoration: "none", fontSize: 14 }}>GitHub</a>
          )}
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,227,0.7)", textDecoration: "none", fontSize: 14 }}>LinkedIn</a>
          )}
          {socialLinks.twitter && (
            <a href={socialLinks.twitter} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,227,0.7)", textDecoration: "none", fontSize: 14 }}>Twitter</a>
          )}
          {socialLinks.website && (
            <a href={socialLinks.website} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,227,0.7)", textDecoration: "none", fontSize: 14 }}>Website</a>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "64px 32px" }}>
        {/* About */}
        {portfolio.about && (
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 16, paddingBottom: 12, borderBottom: "2px solid #f0f0f0" }}>
              About Me
            </h2>
            <p style={{ fontSize: 17, color: "#555", lineHeight: 1.8 }}>{portfolio.about}</p>
          </section>
        )}

        {/* Skills */}
        {portfolio.skills.length > 0 && (
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 16, paddingBottom: 12, borderBottom: "2px solid #f0f0f0" }}>
              Skills
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {portfolio.skills.map((skill) => (
                <span key={skill} style={{
                  background: "#f0f4ff", color: "#1a3a5c",
                  padding: "8px 18px", borderRadius: 100,
                  fontSize: 14, fontWeight: 600
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {portfolio.projects.length > 0 && (
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 24, paddingBottom: 12, borderBottom: "2px solid #f0f0f0" }}>
              Projects
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 24 }}>
              {portfolio.projects.map((project) => (
                <div key={project.id} style={{
                  background: "#fff", borderRadius: 16, overflow: "hidden",
                  border: "1px solid #eee", transition: "transform 0.2s, box-shadow 0.2s"
                }}>
                  {project.imageUrl && (
                    <div style={{ height: 180, overflow: "hidden", background: "#f5f5f5" }}>
                      <img src={project.imageUrl} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{project.title}</h3>
                    <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 16 }}>{project.description}</p>
                    {project.tags.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                        {project.tags.map(t => (
                          <span key={t} style={{ background: "#f0f0f0", color: "#666", padding: "2px 10px", borderRadius: 100, fontSize: 12 }}>{t}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 12 }}>
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{
                          padding: "8px 16px", background: "#1a3a5c", color: "#ffffe3",
                          borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600
                        }}>Live ↗</a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{
                          padding: "8px 16px", background: "#f0f0f0", color: "#333",
                          borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600
                        }}>GitHub</a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "32px", borderTop: "1px solid #eee", color: "#999", fontSize: 13 }}>
        Built with{" "}
        <a href="/launch" style={{ color: "#1a3a5c", fontWeight: 600, textDecoration: "none" }}>Lumyn Launch</a>
        {" "}by Lumyn Technologies
      </footer>
    </div>
  )
}
