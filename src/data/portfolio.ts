export const personal = {
  name: 'Akash Hivorkhede',
  firstName: 'Akash',
  title: 'Full-Stack Developer',
  preTitle: 'software engineer',
  heroSub: "Full-stack engineer building scalable systems and immersive interfaces for companies that shape the future.",
  about: "I'm a BCA graduate (2024) with hands-on experience in Full Stack .NET development. I completed my internship as a Junior Software Engineer at VHaaSh Technologies, where I worked on real-world web applications using .NET Core, ASP.NET MVC, Web API, and SQL Server. I enjoy building scalable backend systems and responsive user interfaces using modern web technologies. I'm also expanding into data science and analytics, applying statistical thinking and data-driven problem solving alongside my software engineering work. Currently, I am seeking an opportunity as a Junior Software Engineer / .NET Developer to grow and contribute in a professional environment.",
  email: 'sunny.hivarkhede@gmail.com',
  github: 'https://github.com/AkashHivarkhede',
  githubLabel: 'GitHub',
  linkedin: 'https://www.linkedin.com/in/akash-hivarkhede-5198b3359/',
  linkedinLabel: 'LinkedIn',
  resume: `${import.meta.env.BASE_URL}assets/Akash_Hivarkhede_Resume.pdf`,
  resumeLabel: 'Resume',
  footerYear: '2026',
};

export const stats = [
  { target: 1, label: 'Years Exp' },
  { target: 5, label: 'Projects' },
  { target: 1, label: 'Clients' },
];

export const skillGroups = [
  {
    ring: 1,
    skills: ['Angular', '.NET Core', 'C#', 'Web API'],
  },
  {
    ring: 2,
    skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Bootstrap', 'jQuery'],
  },
  {
    ring: 3,
    skills: ['LINQ', 'Entity Framework', 'SQL Server', 'MongoDB', 'Postman', 'Swagger UI', 'VS Code', 'CI/CD', 'Python', 'Django', 'Pandas', 'NumPy', 'SQL Queries', 'Data Visualization'],
  },
];

export const analyticsData = {
  skillBars: [
    { label: 'Python', value: 80 },
    { label: 'SQL', value: 85 },
    { label: 'Pandas', value: 75 },
    { label: 'NumPy', value: 70 },
    { label: 'Data Viz', value: 72 },
    { label: 'Statistics', value: 65 },
  ],
  radar: [
    { label: 'Data Analysis', value: 75 },
    { label: 'SQL / DB', value: 85 },
    { label: 'Python', value: 80 },
    { label: 'Visualization', value: 72 },
    { label: 'Statistics', value: 65 },
    { label: 'ML Basics', value: 55 },
  ],
  donut: [
    { label: 'Development', value: 55, color: 'var(--accent)' },
    { label: 'Data & Analytics', value: 25, color: 'var(--accent2)' },
    { label: 'Automation', value: 20, color: 'var(--accent2-light)' },
  ],
};

export const allSkills = skillGroups.flatMap((g) => g.skills);

export type Experience = {
  date: string;
  role: string;
  company: string;
  location: string;
  description: string;
  tags: string[];
};

export const experiences: Experience[] = [
  {
    date: '06/2026 — Present',
    role: 'Application Development Intern',
    company: 'NexaNova Pro Tech',
    location: 'Pune',
    description:
      'Developing web applications using Python and Django. Implementing assigned application functionality and working on application development tasks. Collaborating with team members, participating in development meetings and training, and delivering assigned tasks within defined deadlines while following company guidelines.',
    tags: ['Python', 'Django', 'Web Development', 'Application Development'],
  },
  {
    date: '06/2024 — 02/2025',
    role: 'Junior Software Engineer Intern',
    company: 'VHaaSh Technologies Pvt. Ltd',
    location: 'Pune',
    description:
      'Worked on real-world web applications using .NET Core, ASP.NET MVC, and Web API. Designed and developed RESTful APIs, handled database operations using SQL Server, and improved UI responsiveness using modern frontend technologies.',
    tags: ['.NET Core', 'Web API', 'SQL Server', 'Entity Framework', 'LINQ', 'JavaScript'],
  },
];

export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  icon: string;
  color: string;
  url?: string;
};

export const projects: Project[] = [
  {
    id: 'buslify',
    title: 'Buslify — Bus Booking System',
    description:
      'A web-based bus booking system that allows users to search routes, compare prices, select seats, and book tickets online. Includes secure booking flow and e-ticket generation.',
    tech: ['.NET Core', 'Web API', 'SQL Server', 'Entity Framework'],
    icon: 'bus',
    color: 'rgba(108,92,231,0.15)',
  },
  {
    id: 'database-mgmt',
    title: 'Database Management',
    description:
      'Designed and optimized relational databases using SQL Server. Implemented queries, stored procedures, and ensured efficient data handling.',
    tech: ['SQL Server', 'Stored Procedures', 'LINQ', 'DB Design'],
    icon: 'database',
    color: 'rgba(0,206,201,0.15)',
  },
  {
    id: 'placehub',
    title: 'PlaceHub — Student Placement Management System',
    description:
      'A web-based student placement management system that allows students to create profiles, manage education and projects, explore job opportunities, apply for jobs, and track their applications. Includes Google authentication, email OTP verification, password reset, and profile management.',
    tech: ['Python', 'Django', 'MySQL', 'HTML', 'CSS', 'Bootstrap', 'JavaScript'],
    icon: 'graduation',
    color: 'rgba(37,99,235,0.15)',
    url: 'https://akashhivorkhede.pythonanywhere.com/',
  },
  {
    id: 'rest-api',
    title: 'REST API Development',
    description:
      'Designed and developed RESTful APIs for handling data operations, authentication, and business logic using .NET Core and Entity Framework.',
    tech: ['.NET Core', 'Web API', 'Entity Framework', 'Postman'],
    icon: 'globe',
    color: 'rgba(253,121,168,0.15)',
  },
  {
    id: 'voice-assistant',
    title: 'Voice Assistant — Desktop Voice Automation System',
    description:
      'A Python-based desktop voice assistant that can recognize voice commands, open applications and projects, control system functions, manage windows and media, open websites, perform Google and YouTube searches, and interact through conversational AI. Includes wake-word activation, command classification, context-aware commands, and project management.',
    tech: ['Python', 'Speech Recognition', 'AI', 'Automation', 'System Control'],
    icon: 'mic',
    color: 'rgba(37,99,235,0.15)',
  },
  {
    id: 'internship-projects',
    title: 'Internship Projects',
    description:
      'Worked on real-world web applications during internship at VHaaSh Technologies. Built REST APIs, handled database operations, and improved UI responsiveness.',
    tech: ['.NET Core', 'ASP.NET MVC', 'SQL Server', 'LINQ', 'JavaScript'],
    icon: 'briefcase',
    color: 'rgba(116,185,255,0.15)',
  },
];

export const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];
