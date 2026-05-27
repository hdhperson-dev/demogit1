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
  "UX Researcher",
  "Content Creator",
];
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const AVATAR_COLORS = [
  ["#FB923C", "#EA580C"],
  ["#FDBA74", "#F97316"],
];

const randomDate = (minAge = 18, maxAge = 70) => {
  const now = new Date();
  const year =
    now.getFullYear() -
    minAge -
    Math.floor(Math.random() * (maxAge - minAge + 1));
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
};

const computeAge = (birth) => {
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
};

export const generateIdentity = (countryCode, gender = "random") => {
  const country = COUNTRIES[countryCode];
  if (!country) return null;

  const resolvedGender =
    gender === "random" ? (Math.random() > 0.5 ? "male" : "female") : gender;
  const firstName = pick(country.firstNames[resolvedGender]);
  const lastName = pick(country.lastNames);

  const cityData = pick(country.cities);
  const zip = formatPattern(country.zipFormat);

  const homeAddress = {
    streetAddress: `${Math.floor(Math.random() * 9999) + 1} ${pick(country.streets)}`,
    city: cityData.city,
    state: cityData.state,
    zipCode: zip,
    country: country.name,
    flag: country.flag,
  };

  const birth = randomDate();

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    country: country.name,
    countryCode,
    flag: country.flag,
    gender: resolvedGender,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    initials: (firstName[0] || "") + (lastName[0] || ""),
    avatarColor: pick(AVATAR_COLORS),
    homeAddress,
    phone: formatPattern(country.phoneFormat),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    age: computeAge(birth),
    occupation: pick(OCCUPATIONS),
    bloodType: pick(BLOOD_TYPES),
  };
};

export const generateBatch = (countries, count, gender = "random") => {
  const out = [];
  let pool = Array.isArray(countries) ? countries : [countries];
  if (pool.length === 0) pool = COUNTRY_CODES;

  for (let i = 0; i < count; i++) {
    const code = pool[Math.floor(Math.random() * pool.length)];
    const identity = generateIdentity(code, gender);
    if (identity) out.push(identity);
  }
  return out;
};
