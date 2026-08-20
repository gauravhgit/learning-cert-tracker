import { CourseInput } from '../pages/CoursesPage';
import { CertInput } from '../pages/CertsPage';

export const COURSES: Record<string, CourseInput> = {
  cloudBasics: {
    name: 'AWS Cloud Practitioner Essentials',
    provider: 'AWS Training',
    category: 'Cloud',
    status: 'in-progress',
    progress: 50,
    hours: 12,
  },
  mlCrash: {
    name: 'Machine Learning Crash Course',
    provider: 'Google',
    category: 'Data & AI',
    status: 'completed',
    progress: 100,
    hours: 20,
  },
  securityPrep: {
    name: 'CompTIA Security+ Prep',
    provider: 'Udemy',
    category: 'Security',
    status: 'not-started',
    progress: 0,
    dueDate: '2026-12-01',
    hours: 40,
  },
  minimal: {
    name: 'Minimal Course',
  },
};

export const CERTS: Record<string, CertInput> = {
  awsCcp: {
    name: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    category: 'Cloud',
    earnedDate: '2025-01-15',
    expiryDate: '2028-01-15',
  },
  expiredCert: {
    name: 'Expired Certification',
    issuer: 'Test Org',
    category: 'Security',
    earnedDate: '2020-01-01',
    expiryDate: '2021-01-01',
  },
  expiringCert: {
    name: 'Expiring Soon Cert',
    issuer: 'Test Org',
    category: 'DevOps',
    earnedDate: '2024-01-01',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],  // 30 days from now
  },
  withUrl: {
    name: 'Certified With Link',
    issuer: 'Credly',
    category: 'Cloud',
    earnedDate: '2025-06-01',
    url: 'https://credly.com/badges/example',
  },
  minimal: {
    name: 'Minimal Cert',
  },
};
