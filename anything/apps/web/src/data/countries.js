export const COUNTRIES = {
  US: {
    name: "United States",
    flag: "🇺🇸",
    firstNames: {
      male: [
        "James",
        "John",
        "Robert",
        "Michael",
        "William",
        "David",
        "Richard",
        "Joseph",
      ],
      female: [
        "Mary",
        "Patricia",
        "Jennifer",
        "Linda",
        "Elizabeth",
        "Barbara",
        "Susan",
        "Jessica",
      ],
    },
    lastNames: [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
    ],
    streets: [
      "Main St",
      "Oak Ave",
      "Maple Dr",
      "Cedar Ln",
      "Pine Rd",
      "Elm St",
    ],
    cities: [
      { city: "New York", state: "NY", zip: "10001" },
      { city: "Los Angeles", state: "CA", zip: "90001" },
      { city: "Chicago", state: "IL", zip: "60601" },
    ],
    phoneFormat: "+1 (###) ###-####",
    zipFormat: "#####",
  },
  VN: {
    name: "Vietnam",
    flag: "🇻🇳",
    firstNames: {
      male: ["Anh", "Bình", "Cường", "Dũng", "Đức", "Hải", "Hùng", "Long"],
      female: ["Anh", "Bích", "Chi", "Dung", "Hà", "Hằng", "Hương", "Lan"],
    },
    lastNames: ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ"],
    streets: [
      "Đường Lê Lợi",
      "Đường Nguyễn Huệ",
      "Đường Trần Hưng Đạo",
      "Đường Pasteur",
    ],
    cities: [
      { city: "Hà Nội", state: "Hà Nội", zip: "100000" },
      { city: "TP. Hồ Chí Minh", state: "TP.HCM", zip: "700000" },
      { city: "Đà Nẵng", state: "Đà Nẵng", zip: "550000" },
    ],
    phoneFormat: "+84 ## #### ####",
    zipFormat: "######",
  },
  JP: {
    name: "Japan",
    flag: "🇯🇵",
    firstNames: {
      male: ["Haruto", "Yuto", "Sota", "Yuki", "Hayato"],
      female: ["Yui", "Aoi", "Rin", "Hina", "Yuna"],
    },
    lastNames: ["Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe"],
    streets: ["Sakura-dori", "Ginza-dori", "Omotesando"],
    cities: [
      { city: "Tokyo", state: "Tokyo", zip: "100-0001" },
      { city: "Osaka", state: "Osaka", zip: "530-0001" },
    ],
    phoneFormat: "+81 ##-####-####",
    zipFormat: "###-####",
  },
  UK: {
    name: "United Kingdom",
    flag: "🇬🇧",
    firstNames: {
      male: ["Oliver", "George", "Harry", "Jack", "Jacob"],
      female: ["Olivia", "Amelia", "Isla", "Ava", "Mia"],
    },
    lastNames: ["Smith", "Jones", "Taylor", "Brown", "Williams"],
    streets: ["High Street", "Station Road", "Church Lane"],
    cities: [
      { city: "London", state: "England", zip: "SW1A 1AA" },
      { city: "Manchester", state: "England", zip: "M1 1AE" },
    ],
    phoneFormat: "+44 ## #### ####",
    zipFormat: "AA# #AA",
  },
};

export const COUNTRY_CODES = Object.keys(COUNTRIES);
