import { Github, Linkedin, Mail, Heart } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer
      style={{
        background: "var(--background)",
        borderTop: "1px solid var(--border)",
        padding: "3rem 1.5rem 2rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Top Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 800,
                fontSize: "1.5rem",
                background: "linear-gradient(135deg, #6c63ff 0%, #ff6584 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
              }}
            >
              Abhishek.dev
            </div>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: "280px" }}>
              {t("footer.description")}
            </p>
            {/* Social Links */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
              {/* ... same social links ... */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "var(--glass)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--muted-foreground)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/abhishek-chougale-573786268"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "var(--glass)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--muted-foreground)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:abhishekchougale038@gmail.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "var(--glass)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--muted-foreground)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              style={{
                color: "var(--foreground)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 700,
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "1.25rem",
              }}
            >
              {t("footer.quickLinks")}
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {["nav.home", "nav.about", "nav.education", "nav.skills", "nav.contact"].map((key) => (
                <li key={key}>
                  <a
                    href={`#${key.split(".")[1]}`}
                    style={{
                      color: "var(--muted-foreground)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      transition: "color 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#6c63ff", fontSize: "0.7rem" }}>▶</span>
                    {t(key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Education Snapshot */}
          <div>
            <h3
              style={{
                color: "var(--foreground)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 700,
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "1.25rem",
              }}
            >
              {t("nav.education")}
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {[
                { degree: t("edu.mca"), college: t("edu.dyp") },
                { degree: t("edu.bca"), college: t("edu.drm") },
                { degree: t("edu.12th"), college: t("edu.mhs") },
                { degree: t("edu.10th"), college: t("edu.dmp") },
              ].map((edu) => (
                <li key={edu.degree} style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                  <span
                    style={{
                      color: "var(--foreground)",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    {edu.degree}
                  </span>
                  <span style={{ color: "var(--muted-foreground)", fontSize: "0.8rem" }}>{edu.college}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <p
            style={{
              color: "var(--muted-foreground)",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            © {new Date().getFullYear()} Abhishek Vishnu Chougale. {t("footer.madeWith")}
            <Heart size={14} style={{ color: "#ff6584", fill: "#ff6584" }} /> {t("footer.in")}
          </p>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>
            Full Stack Developer
          </p>
        </div>
      </div>
    </footer>
  )
}
