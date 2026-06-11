const serviceNames = {
  shelter: "Emergency shelter",
  housing: "Housing",
  food: "Food and meals",
  healthcare: "Healthcare",
  mental_health: "Mental health",
  employment: "Employment and training",
  legal: "Legal aid",
  addiction: "Addiction services",
  children: "Children and family services"
};

const specialNames = {
  disability: "Accessibility needs",
  lgbtq: "LGBTQ+ affirming",
  women_staff: "Women-only staff",
  indigenous: "Indigenous-specific",
  language: "Language support",
  fleeing_violence: "Fleeing violence",
  pets: "Pets welcome"
};

const partnershipGoals = [
  { value: "housing", label: "Housing placement" },
  { value: "mental_health", label: "Mental health support" },
  { value: "employment", label: "Employment pathways" },
  { value: "legal", label: "Legal and benefits navigation" },
  { value: "healthcare", label: "Healthcare access" },
  { value: "children", label: "Children and family supports" },
  { value: "addiction", label: "Addiction and harm reduction" }
];

const profileExtras = {
  1: {
    contactName: "Maya Robinson, Partnership Lead",
    email: "partnerships@ysb-demo.ca",
    populationServed: ["Youth 16-24", "2SLGBTQ+ youth", "Youth leaving care"],
    referralRequirements: ["Client consent", "Photo ID if available", "Warm handoff preferred for urgent shelter"],
    partnerships: ["Wabano Centre for Aboriginal Health", "Covenant House Toronto", "Canadian Mental Health Association Ottawa"],
    grantsReceived: [
      { name: "Youth Homelessness Prevention Fund", year: "2025", amount: "$180K" },
      { name: "Skills Link Readiness Pilot", year: "2024", amount: "$75K" }
    ],
    grantsApplied: [
      { name: "Community Housing Innovation Stream", status: "Submitted" }
    ],
    currentProjects: ["Youth diversion intake map", "Peer navigator training cohort", "After-hours warm referral protocol"],
    collaborationNeeds: ["healthcare", "legal", "employment"]
  },
  2: {
    contactName: "Aisha Patel, Referral Coordinator",
    email: "referrals@cornerstone-demo.ca",
    populationServed: ["Women", "Gender-diverse people by consult", "Children fleeing violence"],
    referralRequirements: ["Safety screen", "Do not share confidential location", "Immediate phone consult for crisis referrals"],
    partnerships: ["Women's Community House", "Interval House", "Legal Aid Ontario"],
    grantsReceived: [
      { name: "Gender-Based Violence Response Fund", year: "2025", amount: "$220K" }
    ],
    grantsApplied: [
      { name: "Family Rehousing Support Grant", status: "In review" }
    ],
    currentProjects: ["Legal clinic referral day", "Children's trauma support group"],
    collaborationNeeds: ["legal", "children", "housing"]
  },
  3: {
    contactName: "Daniel Wright, Community Services Manager",
    email: "community@mission-demo.ca",
    populationServed: ["Adult men", "Seniors", "People with complex health needs"],
    referralRequirements: ["Intake call before arrival", "Medication list for clinic connection", "No active warrants disclosure required"],
    partnerships: ["Shepherd of Good Hope", "Canadian Mental Health Association Ottawa"],
    grantsReceived: [
      { name: "Integrated Shelter Health Pilot", year: "2025", amount: "$310K" }
    ],
    grantsApplied: [
      { name: "Recovery Housing Readiness Fund", status: "Drafting" }
    ],
    currentProjects: ["Bed flow coordination dashboard", "On-site addictions clinic"],
    collaborationNeeds: ["healthcare", "addiction", "housing"]
  },
  4: {
    contactName: "Noah Commanda, Community Liaison",
    email: "liaison@wabano-demo.ca",
    populationServed: ["First Nations", "Inuit", "Metis", "Families"],
    referralRequirements: ["Client consent", "Self-identification optional", "Elder support available by request"],
    partnerships: ["Youth Services Bureau (YSB)", "Na-Me-Res (Native Men's Residence)", "Ottawa Mission"],
    grantsReceived: [
      { name: "Indigenous Wellness Partnership Fund", year: "2025", amount: "$260K" }
    ],
    grantsApplied: [
      { name: "Culturally Safe Housing Navigation Fund", status: "Submitted" }
    ],
    currentProjects: ["Cultural safety training series", "Mobile wellness outreach"],
    collaborationNeeds: ["housing", "food", "mental_health"]
  },
  5: {
    contactName: "Claire Nguyen, Outreach Supervisor",
    email: "outreach@sgh-demo.ca",
    populationServed: ["Adults", "Chronically homeless residents", "People using substances"],
    referralRequirements: ["Phone intake for shelter", "Harm reduction supplies accepted", "Accessibility needs noted before arrival"],
    partnerships: ["Ottawa Mission", "Canadian Mental Health Association Ottawa", "Wabano Centre for Aboriginal Health"],
    grantsReceived: [
      { name: "Harm Reduction Housing Bridge", year: "2025", amount: "$145K" }
    ],
    grantsApplied: [
      { name: "Low Barrier Shelter Modernization", status: "In review" }
    ],
    currentProjects: ["24-hour drop-in coordination", "Shared case conference pilot"],
    collaborationNeeds: ["healthcare", "mental_health", "legal"]
  },
  6: {
    contactName: "Renee Brooks, Community Partnerships",
    email: "partners@interval-demo.ca",
    populationServed: ["Women", "Children", "Survivors of intimate partner violence"],
    referralRequirements: ["Confidential intake call", "Safety plan", "Legal documents helpful but not required"],
    partnerships: ["Cornerstone Women's Shelter", "Street Haven", "Women's Community House"],
    grantsReceived: [
      { name: "Survivor Housing Stability Grant", year: "2025", amount: "$195K" }
    ],
    grantsApplied: [
      { name: "Economic Security for Survivors Fund", status: "Submitted" }
    ],
    currentProjects: ["Employment readiness for survivors", "Court support navigation pathway"],
    collaborationNeeds: ["employment", "legal", "children"]
  },
  7: {
    contactName: "Jordan Lee, Youth Partnership Manager",
    email: "collaborate@covenant-demo.ca",
    populationServed: ["Youth 16-24", "Youth in crisis", "Newcomer youth"],
    referralRequirements: ["Youth consent", "Same-day crisis intake available", "Education records optional"],
    partnerships: ["Youth Services Bureau (YSB)", "Fred Victor", "The Scott Mission"],
    grantsReceived: [
      { name: "Youth Transition Housing Fund", year: "2025", amount: "$340K" }
    ],
    grantsApplied: [
      { name: "Digital Employment Pathways Grant", status: "Drafting" }
    ],
    currentProjects: ["Youth employment bridge", "Family reconnection referral script"],
    collaborationNeeds: ["employment", "healthcare", "mental_health"]
  },
  8: {
    contactName: "Samira Chen, Housing Access Lead",
    email: "housing@fredvictor-demo.ca",
    populationServed: ["Adults", "Seniors", "People with complex needs"],
    referralRequirements: ["Consent to coordinate", "Housing history if available", "Complex case consults on Thursdays"],
    partnerships: ["Covenant House Toronto", "Street Haven", "The Scott Mission"],
    grantsReceived: [
      { name: "Complex Needs Housing Coordination", year: "2025", amount: "$285K" }
    ],
    grantsApplied: [
      { name: "Supportive Housing Data Exchange", status: "In review" }
    ],
    currentProjects: ["Shared landlord engagement list", "Complex needs case conference"],
    collaborationNeeds: ["healthcare", "legal", "employment"]
  }
};

const forumThreads = [
  {
    id: 1,
    title: "Shared bed availability updates during extreme heat alerts",
    category: "Operations",
    region: "Ontario-wide",
    author: "Shepherd of Good Hope",
    replies: 14,
    views: 238,
    lastActive: "Today",
    summary: "Teams are comparing lightweight ways to report cooling spaces, overflow beds, and transportation options."
  },
  {
    id: 2,
    title: "Referral checklist for youth leaving hospital discharge",
    category: "Referral Practice",
    region: "Ottawa",
    author: "Youth Services Bureau (YSB)",
    replies: 8,
    views: 126,
    lastActive: "Yesterday",
    summary: "Looking for examples of consent language, warm handoff steps, and after-hours escalation contacts."
  },
  {
    id: 3,
    title: "Who is coordinating legal clinics for survivors this summer?",
    category: "Programs",
    region: "Toronto",
    author: "Interval House",
    replies: 6,
    views: 91,
    lastActive: "2 days ago",
    summary: "Several shelters want to align clinic calendars and avoid duplicate outreach to the same partners."
  },
  {
    id: 4,
    title: "Reporting template for federal housing grants",
    category: "Funding",
    region: "Ontario-wide",
    author: "Fred Victor",
    replies: 11,
    views: 184,
    lastActive: "3 days ago",
    summary: "Members are sharing output measures, outcome language, and anonymized dashboard screenshots."
  }
];

const fundingResources = [
  {
    id: 1,
    title: "Community Housing Innovation Stream",
    type: "Funding",
    focus: "Housing",
    deadline: "2026-07-15",
    amount: "$50K-$350K",
    source: "Demo Federal Program",
    description: "Supports cross-agency pilots that reduce shelter cycling and improve warm referrals into stable housing.",
    reporting: ["Quarterly outputs", "Client outcome summary", "Partnership letters"],
    tags: ["housing", "partnership", "pilot"]
  },
  {
    id: 2,
    title: "Low Barrier Shelter Modernization Checklist",
    type: "Guide",
    focus: "Operations",
    deadline: "Rolling",
    amount: "Free",
    source: "ConnectCare Library",
    description: "A practical planning guide for intake, accessibility, pets, harm reduction, and privacy changes.",
    reporting: ["No funder reporting", "Internal implementation tracker"],
    tags: ["shelter", "operations", "accessibility"]
  },
  {
    id: 3,
    title: "Youth Employment Pathways Grant",
    type: "Funding",
    focus: "Employment",
    deadline: "2026-08-02",
    amount: "Up to $125K",
    source: "Demo Provincial Program",
    description: "Funds training, mentorship, and job placement partnerships for youth experiencing homelessness.",
    reporting: ["Monthly participant counts", "Employer partner list", "Final outcomes report"],
    tags: ["youth", "employment", "training"]
  },
  {
    id: 4,
    title: "Shared Referral MOU Template",
    type: "Template",
    focus: "Partnerships",
    deadline: "Rolling",
    amount: "Free",
    source: "ConnectCare Library",
    description: "Editable memorandum of understanding for service providers sharing referral workflows and case conferences.",
    reporting: ["Review every 12 months", "Privacy lead sign-off"],
    tags: ["referrals", "privacy", "partnership"]
  },
  {
    id: 5,
    title: "Indigenous Wellness Partnership Fund",
    type: "Funding",
    focus: "Healthcare",
    deadline: "2026-09-10",
    amount: "$25K-$250K",
    source: "Demo Community Foundation",
    description: "Supports culturally safe outreach, Elder-led wellness programming, and health navigation partnerships.",
    reporting: ["Community-defined outcomes", "Spending report", "Story-based impact summary"],
    tags: ["Indigenous", "healthcare", "wellness"]
  },
  {
    id: 6,
    title: "Grant Reporting KPI Starter Pack",
    type: "Guide",
    focus: "Funding",
    deadline: "Rolling",
    amount: "Free",
    source: "ConnectCare Library",
    description: "Sample indicators for housing stability, service navigation, client consent, and partnership activity.",
    reporting: ["Adapt to funder requirements", "Keep client data anonymized"],
    tags: ["reporting", "metrics", "funding"]
  }
];

function formatCity(city) {
  return city ? city.charAt(0).toUpperCase() + city.slice(1) : "Ontario-wide";
}

function getServiceName(value) {
  return serviceNames[value] || value;
}

function getSpecialName(value) {
  return specialNames[value] || value;
}

function getCapacityClass(capacity) {
  if (capacity === "Available") return "cap-available";
  if (capacity === "Limited") return "cap-limited";
  return "cap-full";
}

function profileForOrganization(org) {
  const extra = profileExtras[org.id] || {};
  const serviceLabels = org.services.map(getServiceName);
  const populationServed = extra.populationServed || [
    org.ageGroups.map(formatCity).join(", "),
    org.genders.length === 3 ? "All genders" : org.genders.map(formatCity).join(", ")
  ];

  return {
    contactName: extra.contactName || "Intake and referral team",
    email: extra.email || `referrals-${org.city}@connectcare-demo.ca`,
    serviceArea: extra.serviceArea || [formatCity(org.city), "Nearby communities by referral"],
    populationServed,
    referralRequirements: extra.referralRequirements || [
      "Client consent to share referral details",
      "Phone intake recommended before arrival",
      "Accessibility and safety needs noted in advance"
    ],
    partnerships: extra.partnerships || ["Local shelter network", "Municipal housing access team"],
    grantsReceived: extra.grantsReceived || [
      { name: "Community Service Coordination Grant", year: "2025", amount: "$80K" }
    ],
    grantsApplied: extra.grantsApplied || [
      { name: "Partnership Capacity Fund", status: "Exploring fit" }
    ],
    currentProjects: extra.currentProjects || [
      `${formatCity(org.city)} referral pathway refresh`,
      `${serviceLabels[0] || "Service"} access improvement pilot`
    ],
    collaborationNeeds: extra.collaborationNeeds || org.services.slice(0, 3)
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
