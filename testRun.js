const { runFormAutomation } = require("./formAutomation");

// Test users
const users = [
  { name: "Luke Skywalker", company: "Jedi Council", employees: "51-500" },
  { name: "Leia Organa", company: "Rebel Alliance", employees: "11-50" },
  { name: "Han Solo", company: "Smugglers Inc.", employees: "1-10", emailInvalid: true },
  { name: "", company: "Rebel Base", employees: "1-10" },
  { name: "A".repeat(255), company: "Long Name Org", employees: "501-1000" },
];

function randomEmail(name, invalid = false) {
  const base = name.toLowerCase().replace(/\s+/g, "");
  return invalid
    ? `${base}force.com` // no "@"
    : `${base}${Math.floor(Math.random() * 1000)}@force.com`;
}

function randomPhone() {
  return "11" + Math.floor(10000000 + Math.random() * 90000000);
}

function buildTestData(user) {
  return {
    name: user.name,
    email: user.emailInvalid ? randomEmail(user.name, true) : randomEmail(user.name),
    phone: randomPhone(),
    company: user.company,
    employees: user.employees,
  };
}

(async () => {
  for (const user of users) {
    const data = buildTestData(user);
    console.log(`\nRunning test for: ${data.name || "(empty name)"} - Email: ${data.email}`);
    await runFormAutomation(data);
  }
})();
