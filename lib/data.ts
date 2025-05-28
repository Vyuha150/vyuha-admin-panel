// Mock data store and functions
let newClubApplications: Club[] = [
  {
    id: "club1",
    collegeName: "ABC University",
    clubName: "Tech Club",
    phone: "9876543210",
    vision: "Promote technology and innovation.",
    document: "techclub.pdf",
  },
  {
    id: "club2",
    collegeName: "XYZ College",
    clubName: "Art Society",
    phone: "9123456780",
    vision: "Foster creativity and art.",
    document: "artsociety.pdf",
  },
];

let clubCollaborations: Collaboration[] = [
  {
    id: "collab1",
    clubName: "Tech Club",
    collegeName: "ABC University",
    phone: "9876543210",
    collaborationDetails: "Joint hackathon event.",
    document: "hackathon.pdf",
    status: "pending", // Add this line
  },
  {
    id: "collab2",
    clubName: "Art Society",
    collegeName: "XYZ College",
    phone: "9123456780",
    collaborationDetails: "Art exhibition partnership.",
    document: "artexhibit.pdf",
    status: "accepted", // Add this line
  },
];

let centralTeamApplications: Member[] = [
  {
    id: "member1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "9876543210",
    skills: "Leadership, Communication",
    document: "alice_resume.pdf",
  },
  {
    id: "member2",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "9123456780",
    skills: "Design, UI/UX",
    document: "bob_portfolio.pdf",
  },
];

let companies: Company[] = [
  {
    id: "company1",
    name: "Tech Solutions",
    industry: "IT",
    location: "Bangalore",
    description: "Software development and consulting.",
    jobOpenings: [
      {
        id: "job1",
        title: "Frontend Developer",
        department: "Engineering",
        type: "Full-time",
      },
      {
        id: "job2",
        title: "Backend Developer",
        department: "Engineering",
        type: "Full-time",
      },
    ],
    logo: "techsolutions.png",
    contact: "hr@techsolutions.com",
  },
  {
    id: "company2",
    name: "Creative Minds",
    industry: "Design",
    location: "Mumbai",
    description: "Creative design agency.",
    jobOpenings: [
      {
        id: "job3",
        title: "Graphic Designer",
        department: "Design",
        type: "Part-time",
      },
    ],
    logo: "creativeminds.png",
    contact: "jobs@creativeminds.com",
  },
];

let enquiries: Application[] = [
  {
    id: "enq1",
    name: "John Doe",
    email: "john@example.com",
    subject: "Membership Query",
    message: "How do I become a member?",
    createdAt: "2024-05-01T10:00:00Z",
  },
  {
    id: "enq2",
    name: "Jane Smith",
    email: "jane@example.com",
    subject: "Event Collaboration",
    message: "Interested in collaborating for an event.",
    createdAt: "2024-05-02T12:30:00Z",
  },
];

let coreTeamApplications: CoreTeamApplication[] = [
  {
    id: "core1",
    roleId: "role1",
    name: "Emily Clark",
    email: "emily@example.com",
    message: "I want to join the core team as a coordinator.",
    createdAt: "2024-05-03T09:15:00Z",
  },
  {
    id: "core2",
    roleId: "role2",
    name: "David Lee",
    email: "david@example.com",
    message: "Looking to contribute as a tech lead.",
    createdAt: "2024-05-04T14:45:00Z",
  },
];

let courses: Course[] = [
  {
    _id: "course1",
    title: "Full Stack Web Development",
    instructor: "Jane Doe",
    instructorPhoto: "jane.jpg",
    coursePhoto: "fullstack.jpg",
    description: "Learn to build modern web applications from scratch.",
    details: "Covers HTML, CSS, JavaScript, React, Node.js, and databases.",
    prerequisites: ["Basic computer knowledge"],
    learningObjectives: [
      "Build responsive websites",
      "Develop REST APIs",
      "Deploy full stack apps",
    ],
    assessments: "Project work, quizzes, and final exam",
    price: "₹4999",
    format: "Online",
    level: "Intermediate",
    duration: "12 weeks",
    rating: "4.8",
    reviews: "120",
    enrollLink: "https://example.com/enroll/fullstack",
    userReviews: [
      "Great course for beginners!",
      "Very comprehensive and practical.",
    ],
  },
  {
    _id: "course2",
    title: "UI/UX Design Fundamentals",
    instructor: "John Smith",
    instructorPhoto: "john.jpg",
    coursePhoto: "uiux.jpg",
    description:
      "Master the basics of user interface and user experience design.",
    details: "Includes Figma, prototyping, and usability testing.",
    prerequisites: ["Interest in design"],
    learningObjectives: [
      "Understand design principles",
      "Create wireframes and prototypes",
      "Conduct usability tests",
    ],
    assessments: "Assignments and a capstone project",
    price: "₹2999",
    format: "Offline",
    level: "Beginner",
    duration: "8 weeks",
    rating: "4.6",
    reviews: "80",
    enrollLink: "https://example.com/enroll/uiux",
    userReviews: [
      "Loved the hands-on approach.",
      "Helped me land my first design job!",
    ],
  },
];

// CRUD operations
export const deleteItem = (type: string, id: string) => {
  switch (type) {
    case "newClubApplications":
      newClubApplications = newClubApplications.filter(
        (club) => club.id !== id
      );
      break;
    case "clubCollaborations":
      clubCollaborations = clubCollaborations.filter(
        (collab) => collab.id !== id
      );
      break;
    case "centralTeamApplications":
      centralTeamApplications = centralTeamApplications.filter(
        (member) => member.id !== id
      );
      break;
    case "companies":
      companies = companies.filter((company) => company.id !== id);
      break;
    case "enquiries":
      enquiries = enquiries.filter((app) => app.id !== id);
      break;
    case "coreTeamApplications":
      coreTeamApplications = coreTeamApplications.filter(
        (app) => app.id !== id
      );
      break;
  }
};

export const updateItem = (type: string, id: string, data: any) => {
  switch (type) {
    case "newClubApplications":
      newClubApplications = newClubApplications.map((club) =>
        club.id === id ? { ...club, ...data } : club
      );
      break;
    case "clubCollaborations":
      clubCollaborations = clubCollaborations.map((collab) =>
        collab.id === id ? { ...collab, ...data } : collab
      );
      break;
    case "centralTeamApplications":
      centralTeamApplications = centralTeamApplications.map((member) =>
        member.id === id ? { ...member, ...data } : member
      );
      break;
    case "companies":
      companies = companies.map((company) =>
        company.id === id ? { ...company, ...data } : company
      );
      break;
    case "enquiries":
      enquiries = enquiries.map((app) =>
        app.id === id ? { ...app, ...data } : app
      );
      break;
    case "coreTeamApplications":
      coreTeamApplications = coreTeamApplications.map((app) =>
        app.id === id ? { ...app, ...data } : app
      );
      break;
  }
};

// Export all data and interfaces
export interface Club {
  id: string;
  clubName: string;
  collegeName: string;
  phone: string;
  vision: string;
  document?: string;
  status?: "pending" | "accepted" | "rejected"; // Add this line
}

export interface Collaboration {
  id: string;
  clubName: string;
  collegeName: string;
  phone: string;
  collaborationDetails: string;
  document: string;
  status: "pending" | "accepted" | "rejected"; // Add this line
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string;
  document: string;
  status?: "pending" | "accepted" | "rejected"; // Add this line
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  description: string;
  jobOpenings: JobOpening[];
  logo: string;
  contact: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  type: string;
}

export interface Application {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status?: "pending" | "replied";
}

export interface CoreTeamApplication {
  id: string;
  roleId: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status?: "pending" | "accepted" | "rejected";
}

export interface CoreTeamRole {
  _id: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export interface Course {
  _id: string;
  title: string;
  instructor: string;
  instructorPhoto: string;
  coursePhoto: string;
  description: string;
  details: string;
  prerequisites: string[];
  learningObjectives: string[];
  assessments: string;
  price: string;
  format: string;
  level: string;
  duration: string;
  rating: string;
  reviews: string;
  enrollLink: string;
  userReviews: string[];
}

export interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  organizerBio?: string;
  organizerPhoto?: string;
  platformLink?: string;
  fees?: string;
  materials?: string;
  isRecorded?: boolean;
  image?: string;
  category: string;
  mode: string;
  targetAudience?: string;
  logo?: string;
}

// Example static data for core team roles
let coreTeamRoles: CoreTeamRole[] = [
  {
    _id: "role1",
    title: "Coordinator",
    description: "Leads the team and coordinates all activities.",
    responsibilities: [
      "Organize meetings",
      "Coordinate with other teams",
      "Report progress to management",
    ],
    requirements: [
      "Strong leadership skills",
      "Experience in team management",
      "Excellent communication",
    ],
  },
  {
    _id: "role2",
    title: "Tech Lead",
    description: "Oversees all technical aspects of the project.",
    responsibilities: [
      "Guide the development team",
      "Review code and architecture",
      "Ensure technical quality",
    ],
    requirements: [
      "Proficiency in relevant technologies",
      "Experience in software development",
      "Problem-solving skills",
    ],
  },
];

// Export all data
export {
  newClubApplications,
  clubCollaborations,
  centralTeamApplications,
  companies,
  enquiries,
  coreTeamApplications,
  coreTeamRoles,
  courses,
};

export const events: Event[] = [
  {
    _id: "1",
    name: "React Bootcamp",
    description:
      "A hands-on workshop on React fundamentals and building modern web apps.",
    date: "2025-06-10",
    time: "10:00 AM",
    location: "Online",
    organizer: "Jane Doe",
    organizerBio: "Senior Frontend Engineer at TechCorp",
    organizerPhoto: "/images/jane.jpg",
    platformLink: "https://zoom.us/xyz",
    fees: "Free",
    materials: "Slides, Source Code",
    isRecorded: true,
    image: "/images/react-bootcamp.jpg",
    category: "Workshop",
    mode: "Online",
    targetAudience: "Students, Developers",
    logo: "/images/react-logo.png",
  },
  {
    _id: "2",
    name: "AI in Everyday Life",
    description:
      "Explore how artificial intelligence is shaping our daily routines and future.",
    date: "2025-07-05",
    time: "2:00 PM",
    location: "Auditorium, City College",
    organizer: "Dr. John Smith",
    organizerBio: "AI Researcher and Professor",
    organizerPhoto: "/images/john.jpg",
    platformLink: "",
    fees: "₹200",
    materials: "Presentation, Q&A",
    isRecorded: false,
    image: "/images/ai-event.jpg",
    category: "Seminar",
    mode: "Offline",
    targetAudience: "General Public, Students",
    logo: "/images/ai-logo.png",
  },
];
