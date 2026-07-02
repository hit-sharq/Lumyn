"use client"

import { motion } from "framer-motion"
import { type GeneratedDesign } from "@/app/api/generate-template/route"

interface DynamicTemplatePreviewProps {
  configJson: GeneratedDesign
}

export default function DynamicTemplatePreview({
  configJson,
}: DynamicTemplatePreviewProps) {
  const { themeConfig, heroSection, sections } = configJson

  const getColorStyle = (color: string) => {
    if (!color) return {}
    if (color.startsWith("#")) {
      return { backgroundColor: color }
    }
    if (color.startsWith("bg-") || color.startsWith("text-")) {
      return {}
    }
    return { backgroundColor: color }
  }

  const getTextStyle = (color: string) => {
    if (!color) return {}
    if (color.startsWith("#")) {
      return { color }
    }
    if (color.startsWith("text-")) {
      return {}
    }
    return { color }
  }

  const getAccentStyle = (color: string) => {
    if (!color) return {}
    if (color.startsWith("#")) {
      return { backgroundColor: color, borderColor: color }
    }
    if (color.startsWith("bg-")) {
      return {}
    }
    return { backgroundColor: color, borderColor: color }
  }

  return (
    <div
      className="min-h-screen font-sans antialiased"
      style={getColorStyle(themeConfig.backgroundColor)}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            style={getTextStyle(themeConfig.textColor)}
          >
            {heroSection.heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8"
            style={{
              ...getTextStyle(themeConfig.textColor),
              opacity: 0.8,
            }}
          >
            {heroSection.subheading}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button
              type="button"
              className="mt-10 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              style={getAccentStyle(themeConfig.accentColor)}
            >
              {heroSection.ctaText}
            </button>
          </motion.div>
        </motion.section>

        {/* Dynamic Sections */}
        <div className="space-y-20">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.1 * index,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <h2
                className="mb-8 text-3xl font-bold tracking-tight"
                style={getTextStyle(themeConfig.accentColor)}
              >
                {section.sectionName}
              </h2>

              {section.layoutType === "GRID" && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {section.mockContent.map((item, i) => (
                    <motion.div
                      key={`${section.id}-${i}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i, duration: 0.4 }}
                      className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                      style={getTextStyle(themeConfig.textColor)}
                    >
                      <div className="mb-3 h-32 rounded-lg bg-gradient-to-br from-white/10 to-white/5" />
                      <p className="text-sm leading-relaxed">{item}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {section.layoutType === "FLEX_ROW" && (
                <div className="flex flex-col gap-6 md:flex-row">
                  {section.mockContent.map((item, i) => (
                    <motion.div
                      key={`${section.id}-${i}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i, duration: 0.4 }}
                      className="flex flex-1 flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
                      style={getTextStyle(themeConfig.textColor)}
                    >
                      <div className="mb-4 h-24 w-full rounded-lg bg-gradient-to-r from-white/10 to-white/5" />
                      <p className="text-sm leading-relaxed">{item}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {section.layoutType === "LIST" && (
                <div className="space-y-4">
                  {section.mockContent.map((item, i) => (
                    <motion.div
                      key={`${section.id}-${i}`}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 * i, duration: 0.4 }}
                      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                      style={getTextStyle(themeConfig.textColor)}
                    >
                      <div
                        className="h-3 w-3 rounded-full"
                        style={getAccentStyle(themeConfig.accentColor)}
                      />
                      <p className="text-sm leading-relaxed">{item}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer Accent */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-24 border-t border-white/10 pt-8 text-center"
          style={getTextStyle(themeConfig.accentColor)}
        >
          <p className="text-sm opacity-60">
            AI-Generated Design Preview • Lumyn Template Engine
          </p>
        </motion.footer>
      </div>
    </div>
  )
}
