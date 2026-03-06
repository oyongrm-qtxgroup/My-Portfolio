import jsPDF from "jspdf";
import type {
  Profile,
  Education,
  Experience,
  Skill,
  Certification,
  Award,
} from "@/types";

/* ── Colour palette (Harvard classic B&W) ─────────── */
const BLACK = [0, 0, 0] as const;
const DARK = [30, 30, 30] as const;
const GRAY = [100, 100, 100] as const;

/* ── Layout constants (A4 in mm) ──────────────────── */
const PAGE_W = 210;
const PAGE_H = 297;
const ML = 20;
const MR = 20;
const MT = 18;
const MB = 22;
const CONTENT_W = PAGE_W - ML - MR;
const CENTER_X = PAGE_W / 2;
const FOOTER_Y = PAGE_H - 12;

/* ── Helpers ──────────────────────────────────────── */
type RGB = readonly [number, number, number];

function setColor(doc: jsPDF, rgb: RGB) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}

function setDrawColor(doc: jsPDF, rgb: RGB) {
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth) as string[];
}

/** Thin horizontal rule spanning full content width. */
function drawRule(doc: jsPDF, y: number, weight = 0.3) {
  setDrawColor(doc, BLACK);
  doc.setLineWidth(weight);
  doc.line(ML, y, PAGE_W - MR, y);
}

/** Draw page footer: name | email | page number. */
function drawFooter(
  doc: jsPDF,
  profile: Profile,
  pageNum: number,
  totalPages: number,
) {
  drawRule(doc, FOOTER_Y - 3, 0.2);
  setColor(doc, GRAY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(profile.full_name, ML, FOOTER_Y);
  doc.text(profile.email ?? "", CENTER_X, FOOTER_Y, { align: "center" });
  doc.text(`${pageNum} / ${totalPages}`, PAGE_W - MR, FOOTER_Y, {
    align: "right",
  });
}

/** Ensure enough room; add a new page if needed. */
function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H - MB) {
    doc.addPage();
    return MT;
  }
  return y;
}

/** Centered, uppercase section heading with a rule beneath. */
function sectionHeading(doc: jsPDF, title: string, y: number): number {
  y = ensureSpace(doc, y, 12);
  setColor(doc, BLACK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(title.toUpperCase(), CENTER_X, y, { align: "center" });
  drawRule(doc, y + 2);
  return y + 7;
}

/** Bullet item with hanging indent. */
function bulletItem(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
): number {
  y = ensureSpace(doc, y, 5);
  setColor(doc, DARK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("\u2022", x, y);
  const lines = wrapText(doc, text, maxWidth - 4);
  doc.text(lines, x + 4, y);
  return y + lines.length * 3.8 + 1;
}

/* ── Main generator ──────────────────────────────── */
export interface CVData {
  profile: Profile;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  awards: Award[];
}

export function generateCV(data: CVData): jsPDF {
  const { profile, education, experience, skills, certifications, awards } =
    data;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MT;

  /* ═══════════════════════ HEADER (centered) ═══════════════════ */
  setColor(doc, BLACK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(profile.full_name.toUpperCase(), CENTER_X, y + 4, {
    align: "center",
  });
  y += 10;

  // Contact line: address • email • phone
  const contactParts: string[] = [];
  if (profile.address) contactParts.push(profile.address);
  if (profile.email) contactParts.push(profile.email);
  if (profile.phone) contactParts.push(profile.phone);
  if (contactParts.length) {
    setColor(doc, DARK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(contactParts.join("  \u2022  "), CENTER_X, y, {
      align: "center",
    });
    y += 5;
  }

  drawRule(doc, y, 0.5);
  y += 6;

  /* ═══════════════════════ SUMMARY ═════════════════════════════ */
  if (profile.summary) {
    y = sectionHeading(doc, "Summary", y);
    setColor(doc, DARK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const lines = wrapText(doc, profile.summary, CONTENT_W);
    for (const line of lines) {
      y = ensureSpace(doc, y, 4);
      doc.text(line, ML, y);
      y += 3.8;
    }
    y += 4;
  }

  /* ═══════════════════════ EDUCATION ═══════════════════════════ */
  if (education.length > 0) {
    y = sectionHeading(doc, "Education", y);
    for (const edu of education) {
      y = ensureSpace(doc, y, 14);

      // Line 1: Institution (bold) … Location (right)
      setColor(doc, BLACK);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(edu.institution, ML, y);
      if (edu.location) {
        setColor(doc, DARK);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(edu.location, PAGE_W - MR, y, { align: "right" });
      }
      y += 4.5;

      // Line 2: Degree (italic) … Period (right)
      setColor(doc, DARK);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text(edu.degree, ML, y);
      if (edu.period) {
        doc.setFont("helvetica", "normal");
        doc.text(edu.period, PAGE_W - MR, y, { align: "right" });
      }
      y += 5;

      // Highlights
      for (const h of edu.highlights) {
        y = bulletItem(doc, h, ML + 3, y, CONTENT_W - 3);
      }
      y += 3;
    }
  }

  /* ═══════════════════════ EXPERIENCE ══════════════════════════ */
  if (experience.length > 0) {
    y = sectionHeading(doc, "Professional Experience", y);

    // Group roles by company (preserving insertion order)
    const companyMap = new Map<string, Experience[]>();
    for (const exp of experience) {
      const existing = companyMap.get(exp.company);
      if (existing) {
        existing.push(exp);
      } else {
        companyMap.set(exp.company, [exp]);
      }
    }

    for (const [company, roles] of companyMap) {
      y = ensureSpace(doc, y, 14);

      // Company name (bold) … Location (right, from first role)
      setColor(doc, BLACK);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(company, ML, y);
      const loc = roles[0]?.location;
      if (loc) {
        setColor(doc, DARK);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(loc, PAGE_W - MR, y, { align: "right" });
      }
      y += 5;

      for (const role of roles) {
        y = ensureSpace(doc, y, 10);

        // Role title (italic) … Period (right)
        setColor(doc, DARK);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.text(role.role, ML, y);
        if (role.period) {
          doc.setFont("helvetica", "normal");
          doc.text(role.period, PAGE_W - MR, y, { align: "right" });
        }
        y += 4.5;

        // Highlights
        for (const h of role.highlights) {
          y = bulletItem(doc, h, ML + 3, y, CONTENT_W - 3);
        }
        y += 2;
      }
      y += 2;
    }
  }

  /* ═══════════════════════ SKILLS ══════════════════════════════ */
  if (skills.length > 0) {
    y = sectionHeading(doc, "Technical Skills", y);

    // Group by category → inline comma-separated list
    const categoryMap = new Map<string, string[]>();
    for (const s of skills) {
      const list = categoryMap.get(s.category) ?? [];
      list.push(s.name);
      categoryMap.set(s.category, list);
    }

    for (const [category, names] of categoryMap) {
      const label = `${category}: `;
      const value = names.join(", ");

      // Measure label width so value wraps correctly
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      const labelW = doc.getTextWidth(label);

      y = ensureSpace(doc, y, 6);
      setColor(doc, BLACK);
      doc.text(label, ML, y);

      setColor(doc, DARK);
      doc.setFont("helvetica", "normal");
      const valueLines = wrapText(doc, value, CONTENT_W - labelW);
      // First line continues after the bold label
      if (valueLines.length > 0) {
        doc.text(valueLines[0], ML + labelW, y);
      }
      // Subsequent wrapped lines align to the left margin
      for (let i = 1; i < valueLines.length; i++) {
        y += 3.8;
        y = ensureSpace(doc, y, 4);
        doc.text(valueLines[i], ML, y);
      }
      y += 5;
    }
  }

  /* ═══════════════════════ CERTIFICATIONS ══════════════════════ */
  if (certifications.length > 0) {
    y = sectionHeading(doc, "Certifications", y);
    for (const cert of certifications) {
      y = ensureSpace(doc, y, 10);

      // Name (bold) … Date (right)
      setColor(doc, BLACK);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text(cert.name, ML, y);
      if (cert.earned_date) {
        setColor(doc, GRAY);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        const dateStr = new Date(cert.earned_date).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        doc.text(dateStr, PAGE_W - MR, y, { align: "right" });
      }
      y += 4;

      // Issuer (italic)
      setColor(doc, DARK);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text(cert.issuer, ML, y);
      y += 4;

      // Credential ID
      if (cert.credential_id) {
        setColor(doc, GRAY);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`Credential ID: ${cert.credential_id}`, ML, y);
        y += 4;
      }
      y += 1;
    }
    y += 2;
  }

  /* ═══════════════════════ AWARDS ══════════════════════════════ */
  if (awards.length > 0) {
    y = sectionHeading(doc, "Awards", y);
    for (const award of awards) {
      y = ensureSpace(doc, y, 12);

      // Title (bold)
      setColor(doc, BLACK);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(award.title, ML, y);
      y += 4.5;

      // Issuer (italic)
      setColor(doc, DARK);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text(award.issuer, ML, y);
      y += 4.5;

      // Description
      if (award.description) {
        setColor(doc, DARK);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const descLines = wrapText(doc, award.description, CONTENT_W);
        for (const line of descLines) {
          y = ensureSpace(doc, y, 4);
          doc.text(line, ML, y);
          y += 3.8;
        }
        y += 1;
      }

      // Highlights
      for (const h of award.highlights) {
        y = bulletItem(doc, h, ML + 3, y, CONTENT_W - 3);
      }
      y += 3;
    }
  }

  /* ═══════════════════════ FOOTERS ═════════════════════════════ */
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(doc, profile, p, totalPages);
  }

  return doc;
}
