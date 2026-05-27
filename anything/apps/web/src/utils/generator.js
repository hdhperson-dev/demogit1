// Fake identity generator utilities
import { COUNTRIES, COUNTRY_CODES } from "../data/countries";

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const formatPattern = (pattern) => {
  return pattern
    .split("")
    .map((ch) => {
      if (ch === "#") return Math.floor(Math.random() * 10).toString();
      if (ch === "A")
        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
      return ch;
    })
    .join("");
};

const OCCUPATIONS = [
  "Software Engineer",
  "Product Designer",
  "Data Scientist",
  "Marketing Manager",
  "Financial Analyst",
  "Graphic Designer",
  "Project Manager",
  "Sales Executive",
  "Civil Engineer",
  "Architect",
  "Photographer",
  "Writer",
  "Teacher",
  "Nurse",
  "Doctor",
  "Lawyer",
  "Accountant",
  "Chef",
  "Pilot",
  "Musician",
  "Researcher",
  "Consultant",
  "UX Researcher",
  "DevOps Engineer",
  "Content Creator",
];

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const AVATAR_COLORS = [
  ["#FB923C", "#EA580C"],
  ["#FDBA74", "#F97316"],
  ["#FACC15", "#D97706"],
  ["#FCA5A5", "#DC2626"],
  ["#F472B6", "#DB2777"],
  ["#A78BFA", "#7C3AED"],
  ["#60A5FA", "#2563EB"],
  ["#22D3EE", "#0891B2"],
  ["#4ADE80", "#16A34A"],
  ["#34D399", "#059669"],
];

const randomDate = (minAge = 18, maxAge = 70) => {
  const now = new Date();
  const year =
    now.getFullYear() -
    minAge -
    Math.floor(Math.random() * (maxAge - minAge + 1));
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  const d = new Date(year, month, day);
  return d;
};

const formatDate = (d) => {
  const pad = (n) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const computeAge = (birth) => {
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
};

const generateSSN = (countryCode) => {
  // Country-flavored fake national ID
  if (countryCode === "US") return formatPattern("###-##-####");
  if (countryCode === "VN") return formatPattern("############");
  if (countryCode === "UK") return formatPattern("AA ## ## ## A");
  if (countryCode === "CA") return formatPattern("### ### ###");
  if (countryCode === "DE") return formatPattern("##########");
  if (countryCode === "FR") return formatPattern("# ## ## ## ### ### ##");
  if (countryCode === "JP") return formatPattern("####-####-####");
  if (countryCode === "KR") return formatPattern("######-#######");
  if (countryCode === "CN") return formatPattern("##################");
  return formatPattern("##########");
};

const generateIBAN = (countryCode) => {
  // Fake IBAN-style account number
  const prefix = countryCode.slice(0, 2);
  const check = formatPattern("##");
  const bban = formatPattern("####################");
  return `${prefix}${check}${bban}`;
};

// Helper: build a single address block from a country code
const buildAddress = (countryCode) => {
  const country = COUNTRIES[countryCode];
  if (!country) return null;
  const cityData = pick(country.cities);
  const street = pick(country.streets);
  const houseNumber = Math.floor(Math.random() * 9999) + 1;
  const useFixedZip = Math.random() > 0.5;
  const zip = useFixedZip ? cityData.zip : formatPattern(country.zipFormat);
  return {
    countryCode,
    country: country.name,
    flag: country.flag,
    streetAddress: `${houseNumber} ${street}`,
    city: cityData.city,
    state: cityData.state,
    zipCode: zip,
    formatted: `${houseNumber} ${street}, ${cityData.city}, ${cityData.state} ${zip}`,
  };
};

const WORK_PREFIXES = ["Suite", "Floor", "Office", "Unit", "Bldg"];

const buildWorkAddress = (countryCode) => {
  const base = buildAddress(countryCode);
  if (!base) return null;
  const prefix = pick(WORK_PREFIXES);
  const num = Math.floor(Math.random() * 200) + 1;
  const enhanced = `${prefix} ${num}, ${base.streetAddress}`;
  return {
    ...base,
    streetAddress: enhanced,
    formatted: `${enhanced}, ${base.city}, ${base.state} ${base.zipCode}`,
  };
};

export const generateIdentity = (countryCode, gender = "random") => {
  const country = COUNTRIES[countryCode];
  if (!country) return null;

  const resolvedGender =
    gender === "random" ? (Math.random() > 0.5 ? "male" : "female") : gender;

  const firstName = pick(country.firstNames[resolvedGender]);
  const lastName = pick(country.lastNames);

  // Home address (primary, same country)
  const homeAddress = buildAddress(countryCode);

  // Work address (same country, with suite/floor)
  const workAddress = buildWorkAddress(countryCode);

  // Shipping address: 60% same country, 40% different country (international shipping)
  const useDifferentCountry = Math.random() < 0.4;
  let shippingCountryCode = countryCode;
  if (useDifferentCountry) {
    const others = COUNTRY_CODES.filter((c) => c !== countryCode);
    shippingCountryCode = others[Math.floor(Math.random() * others.length)];
  }
  const shippingAddress = buildAddress(shippingCountryCode);

  const phone = formatPattern(country.phoneFormat);

  let fullName;
  if (
    countryCode === "VN" ||
    countryCode === "JP" ||
    countryCode === "KR" ||
    countryCode === "CN"
  ) {
    fullName = `${lastName} ${firstName}`;
  } else {
    fullName = `${firstName} ${lastName}`;
  }

  const birth = randomDate();
  const age = computeAge(birth);

  const initials =
    (firstName[0] || "").toUpperCase() + (lastName[0] || "").toUpperCase();
  const avatarColor = pick(AVATAR_COLORS);

  const emailDomain = pick([
    "example.com",
    "mail.test",
    "dev.local",
    "fixture.io",
    "seed.app",
  ]);

  const emailUser = `${firstName.toLowerCase().replace(/[^a-z]/g, "")}.${lastName.toLowerCase().replace(/[^a-z]/g, "")}`;

  const username = `${firstName.toLowerCase().replace(/[^a-z]/g, "")}${Math.floor(Math.random() * 9999)}`;

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    country: country.name,
    countryCode,
    flag: country.flag,
    gender: resolvedGender,
    firstName,
    lastName,
    fullName,
    initials,
    avatarColor,
    // Primary address (kept flat for backward compatibility)
    streetAddress: homeAddress.streetAddress,
    city: homeAddress.city,
    state: homeAddress.state,
    zipCode: homeAddress.zipCode,
    // Structured addresses
    homeAddress,
    workAddress,
    shippingAddress,
    phone,
    email: `${emailUser}@${emailDomain}`,
    username,
    birthday: formatDate(birth),
    age,
    occupation: pick(OCCUPATIONS),
    bloodType: pick(BLOOD_TYPES),
    nationalId: generateSSN(countryCode),
    iban: generateIBAN(countryCode),
    createdAt: Date.now(),
  };
};

// `countries` can be a single string or array of country codes.
// If array: each identity randomly picks one country from the pool.
export const generateBatch = (countries, count, gender = "random") => {
  const out = [];
  let pool = [];
  if (Array.isArray(countries)) {
    pool = countries.filter((c) => COUNTRIES[c]);
    if (pool.length === 0) pool = COUNTRY_CODES;
  } else if (typeof countries === "string" && COUNTRIES[countries]) {
    pool = [countries];
  } else {
    pool = COUNTRY_CODES;
  }

  for (let i = 0; i < count; i++) {
    const code = pool[Math.floor(Math.random() * pool.length)];
    const identity = generateIdentity(code, gender);
    if (identity) out.push(identity);
  }
  return out;
};

export const formatAsCSV = (identities) => {
  const headers = [
    "Country",
    "Full Name",
    "First Name",
    "Last Name",
    "Username",
    "Gender",
    "Age",
    "Birthday",
    "Occupation",
    "Blood Type",
    "Home Address",
    "Home City",
    "Home State",
    "Home Zip",
    "Work Address",
    "Work City",
    "Work Zip",
    "Shipping Country",
    "Shipping Address",
    "Shipping City",
    "Shipping Zip",
    "Phone",
    "Email",
    "National ID",
    "IBAN",
  ];
  const rows = identities.map((i) => [
    i.country,
    i.fullName,
    i.firstName,
    i.lastName,
    i.username,
    i.gender,
    i.age,
    i.birthday,
    i.occupation,
    i.bloodType,
    i.homeAddress.streetAddress,
    i.homeAddress.city,
    i.homeAddress.state,
    i.homeAddress.zipCode,
    i.workAddress.streetAddress,
    i.workAddress.city,
    i.workAddress.zipCode,
    i.shippingAddress.country,
    i.shippingAddress.streetAddress,
    i.shippingAddress.city,
    i.shippingAddress.zipCode,
    i.phone,
    i.email,
    i.nationalId,
    i.iban,
  ]);
  return [headers, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
};
