import { defineCollection, z } from 'astro:content';

// STARメソッド（Situation, Task, Action, Result）スキーマ
const starSchema = z.object({
  situation: z.string(), // 状況・背景
  task: z.string(), // 課題・目標
  action: z.string(), // 実施したアクション
  result: z.string(), // 成果・数値
});

// リンクスキーマ（外部リンク）
const linkSchema = z.object({
  url: z.string().url(),
  label: z.string(),
});

// 役職変遷スキーマ（1社内での複数役職）
const roleEntrySchema = z.object({
  role: z.string(),
  period: z.object({
    start: z.string(),
    end: z.string().nullable(),
  }),
  project: z.string().optional(), // プロジェクト名
  description: z.string(),
  highlights: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  links: z.array(linkSchema).optional(), // 関連リンク
  star: z.array(starSchema).optional(),
});

const workExperienceSchema = z.object({
  company: z.string(),
  role: z.string(), // 代表的な役職（または最新の役職）
  period: z.object({
    start: z.string(),
    end: z.string().nullable(),
  }),
  description: z.string(),
  highlights: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  star: z.array(starSchema).optional(), // STARメソッド実績
  // 役職変遷（1社内で複数の役職を経験した場合）
  roles: z.array(roleEntrySchema).optional(),
});

const projectSchema = z.object({
  name: z.string(),
  type: z.enum(['work', 'personal', 'oss']),
  period: z.object({
    start: z.string(),
    end: z.string().nullable(),
  }),
  description: z.string(),
  role: z.string().optional(),
  techStack: z.array(z.string()),
  outcomes: z.array(z.string()).optional(),
  url: z.string().url().optional(),
  repository: z.string().url().optional(),
});

const skillSchema = z.object({
  category: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      level: z
        .enum(['beginner', 'intermediate', 'advanced', 'expert'])
        .optional(),
      yearsOfExperience: z.number().optional(),
    }),
  ),
});

const certificationSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
  url: z.string().url().optional(),
});

const educationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  period: z.object({
    start: z.string(),
    end: z.string().nullable(),
  }),
});

const profileSchema = z.object({
  name: z.string(),
  nameKana: z.string().optional(),
  title: z.string(),
  summary: z.string(),
  avatar: z.string().optional(),
});

const portfolioSchema = z.object({
  profile: profileSchema,
  workExperience: z.array(workExperienceSchema),
  projects: z.array(projectSchema),
  skills: z.array(skillSchema),
  certifications: z.array(certificationSchema).optional(),
  education: z.array(educationSchema).optional(),
});

export const portfolioCollection = defineCollection({
  type: 'data',
  schema: portfolioSchema,
});

export type Star = z.infer<typeof starSchema>;
export type RoleEntry = z.infer<typeof roleEntrySchema>;
export type Profile = z.infer<typeof profileSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Education = z.infer<typeof educationSchema>;
export type PortfolioData = z.infer<typeof portfolioSchema>;
