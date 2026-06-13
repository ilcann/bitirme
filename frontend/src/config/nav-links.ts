type NavLinks = {
    title: string;
    href: string;
    description: string;
}


const coursesMenuItems: NavLinks[] = [
  {
    title: 'nav.courses.elements.catalog.title',
    href: '/courses/catalog',
    description: 'nav.courses.elements.catalog.description',
  },
  {
    title: 'nav.courses.elements.info.title',
    href: '/courses/info',
    description: 'nav.courses.elements.info.description',
  },
  {
    title: 'nav.courses.elements.materials.title',
    href: '/courses/materials',
    description: 'nav.courses.elements.materials.description',
  },
];

const myAreaMenuItems: NavLinks[] = [
  {
    title: 'nav.my_area.elements.notes.title',
    href: '/my-area/notes',
    description: 'nav.my_area.elements.notes.description',
  },
  {
    title: 'nav.my_area.elements.attendance.title',
    href: '/my-area/attendance',
    description: 'nav.my_area.elements.attendance.description',
  },
  {
    title: 'nav.my_area.elements.registered_courses.title',
    href: '/my-area/registered-courses',
    description: 'nav.my_area.elements.registered_courses.description',
  },
];

export { coursesMenuItems, myAreaMenuItems };