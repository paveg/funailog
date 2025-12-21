#!/usr/bin/env tsx
/**
 * CV Generator CLI Script
 *
 * Usage:
 *   pnpm cv            # Generate Japanese CV (default: last 2 years, max 2 roles)
 *   pnpm cv:en         # Generate English CV
 *   pnpm cv --en       # Generate English CV
 *   pnpm cv --years=3  # Include last 3 years of experience
 *   pnpm cv --roles=3  # Show max 3 roles per company
 *
 * Environment variables (from .env):
 *   CV_ADDRESS - Your address (private)
 *   CV_PHONE - Your phone number (private)
 *   CV_EMAIL - Your email (private)
 *   CV_BIRTH_DATE - Your birth date (private)
 *   CV_GITHUB - Your GitHub username
 *   CV_LINKEDIN - Your LinkedIn profile URL or username
 *   CV_PORTFOLIO - Your portfolio URL
 */

import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { config } from 'dotenv';
import yaml from 'yaml';

import {
  generateCV,
  type CVOptions,
  type PrivateData,
} from '../src/lib/cv-generator';

import type { PortfolioData } from '../src/schemas/portfolio-collection';

// Load environment variables
config();

function parseArgs(): CVOptions {
  const args = process.argv.slice(2);
  const options: CVOptions = {};

  for (const arg of args) {
    if (arg === '--en' || arg === '-e') {
      options.lang = 'en';
    } else if (arg.startsWith('--years=')) {
      const years = parseInt(arg.split('=')[1], 10);
      if (!isNaN(years) && years > 0) {
        options.recentYears = years;
      }
    } else if (arg.startsWith('--roles=')) {
      const roles = parseInt(arg.split('=')[1], 10);
      if (!isNaN(roles) && roles > 0) {
        options.maxRoles = roles;
      }
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();
  const isEnglish = options.lang === 'en';
  const years = options.recentYears ?? 3;
  const maxRoles = options.maxRoles ?? 3;

  console.log(`📄 Generating ${isEnglish ? 'English' : 'Japanese'} CV...\n`);
  console.log(
    `📅 Including last ${years} years, max ${maxRoles} roles per company\n`,
  );

  // Read portfolio data (use appropriate language file)
  const profileFileName = isEnglish ? 'profile-en.yml' : 'profile.yml';
  const profilePath = resolve(
    import.meta.dirname,
    `../src/content/portfolio/${profileFileName}`,
  );
  const { readFile } = await import('node:fs/promises');
  const profileYaml = await readFile(profilePath, 'utf-8');
  const portfolioData = yaml.parse(profileYaml) as PortfolioData;

  // Get private data from environment
  const privateData: PrivateData = {
    address: process.env.CV_ADDRESS,
    phone: process.env.CV_PHONE,
    email: process.env.CV_EMAIL,
    birthDate: process.env.CV_BIRTH_DATE,
    github: process.env.CV_GITHUB,
    linkedin: process.env.CV_LINKEDIN,
    portfolio: process.env.CV_PORTFOLIO,
  };

  // Log what private data is available
  const privateFields = Object.entries(privateData)
    .filter(([, v]) => v)
    .map(([k]) => k);

  if (privateFields.length > 0) {
    console.log(`✓ Private data loaded: ${privateFields.join(', ')}`);
  } else {
    console.log(
      '⚠ No private data found. Create a .env file with CV_* variables.',
    );
  }

  // Generate PDF
  console.log('\n⏳ Generating PDF...');
  const pdfBuffer = await generateCV(portfolioData, privateData, options);

  // Save to file with language suffix
  const langSuffix = isEnglish ? '_EN' : '';
  const outputPath = resolve(
    import.meta.dirname,
    `../CV_${portfolioData.profile.name.replace(/\s+/g, '_')}${langSuffix}.pdf`,
  );
  await writeFile(outputPath, pdfBuffer);

  console.log(`\n✅ CV generated successfully!`);
  console.log(`📁 Output: ${outputPath}`);
}

main().catch((error) => {
  console.error('❌ CV generation failed:', error);
  process.exit(1);
});
