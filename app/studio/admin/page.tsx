"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import styles from "./studio-admin.module.css";
interface Template {
  id: string;
  title: string;
  category: string;
  previewImage: string;
  isFree: boolean;
  price: number;
  featured: boolean;
  isPublished: boolean;
  downloadCount: number;
  createdAt: string;
  _count?: {
    purchases: number;
    reviews: number;
  };
}
const CATEGORIES = ["Portfolio", "Business", "Landing Page", "Blog", "E-Commerce", "SaaS"];
const emptyForm = {
  title: "",
  description: "",
  category: "Portfolio",
  previewImage: "",
  previewImages: "",
  tags: "",
  isFree: true,
  price: 0,
  downloadUrl: "",
  featured: false
};
export default function StudioAdminPage() {
  const {
    user,
    isLoaded
  } = useUser();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!isLoaded || !user) return setIsAdmin(false);
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/is-admin');
        const data = await res.json();
        if (mounted) setIsAdmin(!!data.isAdmin);
      } catch (_) {
        if (mounted) setIsAdmin(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isLoaded, user]);
  useEffect(() => {
    if (isAdmin) fetchTemplates();else if (isLoaded) setLoading(false);
  }, [isAdmin, isLoaded]);
  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/studio/templates?all=true");
      const data = await res.json();
      setTemplates(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const payload = {
        ...form,
        previewImages: form.previewImages.split(",").map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
        price: form.isFree ? 0 : Number(form.price)
      };
      const res = await fetch("/api/studio/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({
        type: "success",
        text: `Template "${data.title}" created successfully!`
      });
      setForm(emptyForm);
      setShowForm(false);
      fetchTemplates();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to create template"
      });
    } finally {
      setSubmitting(false);
    }
  };
  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/studio/templates/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          featured: !current
        })
      });
      setTemplates(prev => prev.map(t => t.id === id ? {
        ...t,
        featured: !current
      } : t));
    } catch {}
  };
  const deleteTemplate = async (id: string) => {
    if (!confirm("Delete this template? This cannot be undone.")) return;
    try {
      await fetch(`/api/studio/templates/${id}`, {
        method: "DELETE"
      });
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch {}
  };
  if (!isLoaded || loading) {
    return <div className={styles.loading}>
        <div className={styles.loadingBox}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading…</p>
        </div>
      </div>;
  }
  if (!isAdmin) {
    return <div className={styles.error}>
        <div className={styles.errorIcon}>🔒</div>
        <h2 className={styles.errorTitle}>Admin Access Only</h2>
        <p className={styles.errorText}>You don&apos;t have permission to access this page.</p>
        <Link href="/studio" className={styles.backLink}>← Back to Studio</Link>
      </div>;
  }
  return <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/studio" className={styles.backLink}>← Studio</Link>
            <h1 className={styles.title}>Template Admin</h1>
            <p className={styles.count}>{templates.length} templates total</p>
          </div>
          <button onClick={() => {
          setShowForm(!showForm);
          setMessage(null);
        }} className={styles.addBtn}>
            {showForm ? "✕ Cancel" : "+ New Template"}
          </button>
        </div>

        {/* Feedback */}
        {message && <div className={`${styles.message} ${message.type === "error" ? styles.messageError : ""}`}>
            {message.text}
          </div>}

        {/* Create Form */}
        {showForm && <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.formTitle}>Create New Template</h2>

            <div className={styles.formRow}>
              <FormField label="Title *">
                <input required value={form.title} onChange={e => setForm({
              ...form,
              title: e.target.value
            })} placeholder="Modern Portfolio Template" className={styles.input} />
              </FormField>
              <FormField label="Category *">
                <select value={form.category} onChange={e => setForm({
              ...form,
              category: e.target.value
            })} className={styles.input}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </FormField>
            </div>

            <FormField label="Description *" style={{
          marginBottom: 20
        }}>
              <textarea required value={form.description} onChange={e => setForm({
            ...form,
            description: e.target.value
          })} placeholder="A clean, modern portfolio template perfect for creatives and developers." rows={3} className={`${styles.input} ${styles.textarea}`} />
            </FormField>

            <div className={styles.formRow}>
              <FormField label="Preview Image URL *">
                <input required value={form.previewImage} onChange={e => setForm({
              ...form,
              previewImage: e.target.value
            })} placeholder="https://res.cloudinary.com/..." className={styles.input} />
              </FormField>
              <FormField label="Additional Preview URLs (comma-separated)">
                <input value={form.previewImages} onChange={e => setForm({
              ...form,
              previewImages: e.target.value
            })} placeholder="https://..., https://..." className={styles.input} />
              </FormField>
            </div>

            <div className={styles.formRowThree}>
              <FormField label="Tags (comma-separated)">
                <input value={form.tags} onChange={e => setForm({
              ...form,
              tags: e.target.value
            })} placeholder="React, Tailwind, Dark mode" className={styles.input} />
              </FormField>
              <FormField label="Pricing">
                <div className={styles.pricingRow}>
                  <label className={styles.freeLabel}>
                    <input type="checkbox" checked={form.isFree} onChange={e => setForm({
                  ...form,
                  isFree: e.target.checked
                })} />
                    Free
                  </label>
                  {!form.isFree && <input type="number" min={0} value={form.price} onChange={e => setForm({
                ...form,
                price: Number(e.target.value)
              })} placeholder="Price (KES)" className={styles.input} />}
                </div>
              </FormField>
              <FormField label="Download URL">
                <input value={form.downloadUrl} onChange={e => setForm({
              ...form,
              downloadUrl: e.target.value
            })} placeholder="https://drive.google.com/..." className={styles.input} />
              </FormField>
            </div>

            <div className={styles.featuredRow}>
              <label className={styles.freeLabel}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm({
              ...form,
              featured: e.target.checked
            })} />
                Mark as Featured
              </label>
            </div>

            <div className={styles.formActions}>
              <button type="submit" disabled={submitting} className={styles.saveBtn}>
                {submitting ? "Creating…" : "Create Template"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>}

        {/* Template List */}
        {templates.length === 0 ? <div className={styles.empty}>
            <div className={styles.emptyIcon}>🎨</div>
            <p>No templates yet. Create your first one above.</p>
          </div> : <div className={styles.templateList}>
            {templates.map(t => <div key={t.id} className={styles.templateCard}>
                <div className={styles.previewWrapper}>
                  <Image src={t.previewImage || "/placeholder.svg"} alt={t.title} fill style={{
              objectFit: "cover"
            }} />
                </div>
                <div className={styles.templateInfo}>
                  <div className={styles.templateHeader}>
                    <span className={styles.templateTitle}>{t.title}</span>
                    {t.featured && <span className={`${styles.badge} ${styles.featuredBadge}`}>FEATURED</span>}
                    {!t.isPublished && <span className={`${styles.badge} ${styles.draftBadge}`}>DRAFT</span>}
                  </div>
                  <p className={styles.templateMeta}>
                    {t.category} · {t.isFree ? "Free" : `KES ${t.price.toLocaleString()}`} · {t.downloadCount} downloads · {t._count?.purchases || 0} purchases
                  </p>
                </div>
                <div className={styles.templateActions}>
                  <Link href={`/studio/${t.id}`} target="_blank" className={`${styles.actionBtn} ${styles.viewBtn}`}>View</Link>
                  <button onClick={() => toggleFeatured(t.id, t.featured)} className={`${styles.actionBtn} ${t.featured ? styles.featureBtnActive : styles.featureBtn}`}>
                    {t.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button onClick={() => deleteTemplate(t.id)} className={`${styles.actionBtn} ${styles.deleteBtn}`}>Delete</button>
                </div>
              </div>)}
          </div>}
      </div>
    </div>;
}
function FormField({
  label,
  children,
  style
}: {
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return <div style={style}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>;
}