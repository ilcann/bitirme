import enCommon from './en/common.json';
import trCommon from './tr/common.json';
import enHome from './en/home.json';
import trHome from './tr/home.json';
import enErrors from './en/errors.json';
import trErrors from './tr/errors.json';
import enAnnouncements from './en/announcements.json';
import trAnnouncements from './tr/announcements.json';
import enCourses from './en/courses.json';
import trCourses from './tr/courses.json';
import enHelp from './en/help.json';
import trHelp from './tr/help.json';
import enMe from './en/me.json';
import trMe from './tr/me.json';

export const resources = {
  en: { 
    common: enCommon,
    home: enHome,
    errors: enErrors,
    announcements: enAnnouncements,
    courses: enCourses,
    help: enHelp,
    me: enMe
  },
  tr: { 
    common: trCommon,
    home: trHome,
    errors: trErrors,
    announcements: trAnnouncements,
    courses: trCourses,
    help: trHelp,
    me: trMe
  }
} as const;

export const ns = ['common', 'home', 'errors', 'announcements', 'courses', 'help', 'me'] as const;
export type Namespace = typeof ns[number];