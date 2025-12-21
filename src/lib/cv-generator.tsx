import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from '@react-pdf/renderer';
import React from 'react';

import type {
  PortfolioData,
  RoleEntry,
  Star,
} from '@/schemas/portfolio-collection';

export interface PrivateData {
  address?: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface CVOptions {
  lang?: 'ja' | 'en';
  /** Only show roles from the last N years (default: 3) */
  recentYears?: number;
  /** Maximum number of roles to show per company (default: 3) */
  maxRoles?: number;
}

// i18n translations for CV labels
const translations = {
  ja: {
    birthDate: '生年月日',
    professionalSummary: 'SUMMARY',
    workExperience: 'EXPERIENCE',
    skills: 'SKILLS',
    education: 'EDUCATION',
    links: 'LINKS',
    present: '現在',
    technologies: '技術',
    generatedOn: '生成日',
  },
  en: {
    birthDate: 'DOB',
    professionalSummary: 'SUMMARY',
    workExperience: 'EXPERIENCE',
    skills: 'SKILLS',
    education: 'EDUCATION',
    links: 'LINKS',
    present: 'Present',
    technologies: 'Tech',
    generatedOn: 'Generated',
  },
} as const;

Font.register({
  family: 'NotoSansJP',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosansjp/v55/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/notosansjp/v55/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk75s.ttf',
      fontWeight: 700,
    },
  ],
});

// Professional "Refined Editorial" CV design
// Accent color: Deep Navy (#1a365d) for trust and professionalism
const ACCENT_COLOR = '#1a365d';
const TEXT_PRIMARY = '#1a1a1a';
const TEXT_SECONDARY = '#4a5568';
const TEXT_MUTED = '#718096';
const BORDER_COLOR = '#e2e8f0';

const styles = StyleSheet.create({
  page: {
    padding: 32,
    paddingTop: 28,
    paddingBottom: 24,
    fontFamily: 'NotoSansJP',
    fontSize: 9.5,
    lineHeight: 1.45,
    color: TEXT_PRIMARY,
    backgroundColor: '#ffffff',
  },
  // Header - prominent name with professional styling
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: ACCENT_COLOR,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
    marginBottom: 8,
    lineHeight: 1.2,
  },
  title: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    marginBottom: 10,
    fontWeight: 'bold',
    lineHeight: 1.2,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    fontSize: 8.5,
    color: TEXT_SECONDARY,
  },
  contactItem: {
    marginRight: 12,
  },
  contactSeparator: {
    marginHorizontal: 4,
    color: TEXT_MUTED,
  },
  // ATS-friendly single column layout
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1.5,
    borderBottomColor: ACCENT_COLOR,
  },
  // Summary with refined typography
  summary: {
    fontSize: 9.5,
    color: TEXT_SECONDARY,
    lineHeight: 1.55,
  },
  // Skills - compact pill-like display
  skillCategory: {
    fontSize: 9,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    marginBottom: 3,
    marginTop: 6,
  },
  skillItems: {
    fontSize: 8.5,
    color: TEXT_SECONDARY,
    lineHeight: 1.5,
  },
  skillsInline: {
    fontSize: 8.5,
    color: TEXT_SECONDARY,
    lineHeight: 1.5,
  },
  skillLine: {
    fontSize: 9,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  skillCategoryLabel: {
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
  },
  skillItemsText: {
    color: TEXT_SECONDARY,
  },
  // Experience - clear hierarchy
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  companyRole: {
    fontSize: 11,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
  },
  period: {
    fontSize: 8.5,
    color: TEXT_MUTED,
    fontWeight: 'bold',
  },
  roleContainer: {
    marginTop: 6,
    marginLeft: 0,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: BORDER_COLOR,
  },
  roleItem: {
    marginBottom: 10,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  roleTitle: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
  },
  description: {
    fontSize: 9,
    color: TEXT_SECONDARY,
    marginTop: 2,
    lineHeight: 1.45,
  },
  technologies: {
    fontSize: 8.5,
    color: TEXT_MUTED,
    marginTop: 4,
  },
  // Achievements - bullet points with emphasis
  achievement: {
    marginTop: 5,
    paddingLeft: 2,
  },
  achievementBullet: {
    fontSize: 8.5,
    color: TEXT_PRIMARY,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  // Education
  educationItem: {
    marginBottom: 6,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  educationInstitution: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
  },
  educationDetails: {
    fontSize: 8.5,
    color: TEXT_SECONDARY,
    marginTop: 1,
  },
  // Links
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  linkItem: {
    fontSize: 8.5,
    color: ACCENT_COLOR,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 32,
    right: 32,
    textAlign: 'center',
    fontSize: 7,
    color: TEXT_MUTED,
    borderTopWidth: 0.5,
    borderTopColor: BORDER_COLOR,
    paddingTop: 6,
  },
});

function filterRecentRoles(
  roles: RoleEntry[],
  recentYears: number,
): RoleEntry[] {
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - recentYears);

  return roles.filter((role) => {
    if (role.period.end === null) return true;
    const endDate = new Date(role.period.end);
    return endDate >= cutoffDate;
  });
}

function isRoleRecent(
  period: { start: string; end: string | null },
  recentYears: number,
): boolean {
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - recentYears);

  if (period.end === null) return true;
  const endDate = new Date(period.end);
  return endDate >= cutoffDate;
}

function formatPeriod(
  period: { start: string; end: string | null },
  lang: 'ja' | 'en',
): string {
  const t = translations[lang];
  const formatDate = (d: string) => {
    const [year, month] = d.split('-');
    return `${year}/${month}`;
  };
  const start = formatDate(period.start);
  const end = period.end ? formatDate(period.end) : t.present;
  return `${start} - ${end}`;
}

// STAR形式の実績が有効かどうかをチェック（TODOプレースホルダーを除外）
function isValidStar(star: Star): boolean {
  return (
    !star.situation.startsWith('[TODO') &&
    !star.task.startsWith('[TODO') &&
    !star.action.startsWith('[TODO') &&
    !star.result.startsWith('[TODO')
  );
}

// STARからATS向けの実績文を生成（Result全行）
function formatStarAsAchievements(star: Star): string[] {
  return star.result
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => line.trim());
}

interface CVDocumentProps {
  data: PortfolioData;
  privateData: PrivateData;
  options: Required<CVOptions>;
}

const CVDocument: React.FC<CVDocumentProps> = ({
  data,
  privateData,
  options,
}) => {
  const { lang, recentYears, maxRoles } = options;
  const t = translations[lang];

  // Build contact line
  const contactParts: string[] = [];
  if (privateData.email) contactParts.push(privateData.email);
  if (privateData.phone) contactParts.push(privateData.phone);
  if (privateData.address) contactParts.push(privateData.address);
  if (privateData.birthDate)
    contactParts.push(`${t.birthDate}: ${privateData.birthDate}`);

  // Build links line
  const linkParts: string[] = [];
  if (privateData.github) linkParts.push(`GitHub: ${privateData.github}`);
  if (privateData.linkedin) linkParts.push(`LinkedIn: ${privateData.linkedin}`);
  if (privateData.portfolio)
    linkParts.push(`Portfolio: ${privateData.portfolio}`);

  // Filter work experience to recent years and limit roles
  const filteredWorkExperience = data.workExperience
    .filter((work) => isRoleRecent(work.period, recentYears))
    .map((work) => ({
      ...work,
      roles: work.roles
        ? filterRecentRoles(work.roles, recentYears).slice(0, maxRoles)
        : undefined,
    }))
    .filter((work) => !work.roles || work.roles.length > 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.profile.name}</Text>
          <Text style={styles.title}>{data.profile.title}</Text>
          {contactParts.length > 0 && (
            <View style={styles.contactInfo}>
              {contactParts.map((part, index) => (
                <React.Fragment key={index}>
                  <Text style={styles.contactItem}>{part}</Text>
                  {index < contactParts.length - 1 && (
                    <Text style={styles.contactSeparator}>|</Text>
                  )}
                </React.Fragment>
              ))}
            </View>
          )}
          {linkParts.length > 0 && (
            <View style={styles.contactInfo}>
              {linkParts.map((part, index) => (
                <React.Fragment key={index}>
                  <Text style={styles.contactItem}>{part}</Text>
                  {index < linkParts.length - 1 && (
                    <Text style={styles.contactSeparator}>|</Text>
                  )}
                </React.Fragment>
              ))}
            </View>
          )}
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.professionalSummary}</Text>
          <Text style={styles.summary}>{data.profile.summary}</Text>
        </View>

        {/* Skills - By category with line breaks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.skills}</Text>
          {data.skills.map((category, index) => (
            <Text key={index} style={styles.skillLine}>
              <Text style={styles.skillCategoryLabel}>
                {category.category}:{' '}
              </Text>
              <Text style={styles.skillItemsText}>
                {category.items.map((item) => item.name).join(', ')}
              </Text>
            </Text>
          ))}
        </View>

        {/* Work Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.workExperience}</Text>
          {filteredWorkExperience.map((work, index) => (
            <View key={index} style={styles.experienceItem}>
              <View style={styles.experienceHeader}>
                <Text style={styles.companyRole}>{work.company}</Text>
                <Text style={styles.period}>
                  {formatPeriod(work.period, lang)}
                </Text>
              </View>

              {work.roles && work.roles.length > 0 && (
                <View style={styles.roleContainer}>
                  {work.roles.map((role, roleIndex) => (
                    <View key={roleIndex} style={styles.roleItem}>
                      <View style={styles.roleHeader}>
                        <Text style={styles.roleTitle}>
                          {role.role}
                          {role.project ? ` - ${role.project}` : ''}
                        </Text>
                        <Text style={styles.period}>
                          {formatPeriod(role.period, lang)}
                        </Text>
                      </View>
                      <Text style={styles.description}>{role.description}</Text>
                      {role.star &&
                        role.star.filter(isValidStar).length > 0 && (
                          <View style={styles.achievement}>
                            {role.star.filter(isValidStar).flatMap((star, si) =>
                              formatStarAsAchievements(star).map((line, li) => (
                                <Text
                                  key={`${si}-${li}`}
                                  style={styles.achievementBullet}
                                >
                                  • {line}
                                </Text>
                              )),
                            )}
                          </View>
                        )}
                      {role.technologies && role.technologies.length > 0 && (
                        <Text style={styles.technologies}>
                          {t.technologies}: {role.technologies.join(', ')}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.education}</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  <Text style={styles.educationInstitution}>
                    {edu.institution}
                  </Text>
                  <Text style={styles.period}>
                    {formatPeriod(edu.period, lang)}
                  </Text>
                </View>
                <Text style={styles.educationDetails}>
                  {edu.degree}
                  {edu.field ? ` - ${edu.field}` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          {t.generatedOn}{' '}
          {new Date().toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US')}
        </Text>
      </Page>
    </Document>
  );
};

export async function generateCV(
  data: PortfolioData,
  privateData: PrivateData,
  options: CVOptions = {},
): Promise<Uint8Array> {
  const fullOptions: Required<CVOptions> = {
    lang: options.lang ?? 'ja',
    recentYears: options.recentYears ?? 3,
    maxRoles: options.maxRoles ?? 3,
  };

  return await renderToBuffer(
    <CVDocument data={data} privateData={privateData} options={fullOptions} />,
  );
}
