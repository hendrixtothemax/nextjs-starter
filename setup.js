const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function runCommand(command, ignoreError = false) {
  try {
    // Change stdio to 'inherit' for the db reset to see the real error
    const stdioMode = ignoreError ? ["pipe", "pipe", "ignore"] : "inherit";
    return execSync(command, { 
      encoding: "utf8", 
      timeout: 120000, 
      stdio: stdioMode 
    });
  } catch (error) {
    if (ignoreError) return error.stdout || "";
    console.error(`\nDetailed error during: ${command}`);
    throw error;
  }
}

function setup() {
  console.log("Starting project setup...");

  console.log("Installing npm dependencies...");
  runCommand("npm install");

  console.log("Cleaning up existing containers...");
  runCommand("npx supabase stop --no-backup", true);

  console.log("Starting Supabase...");
  runCommand("npx supabase start");

  let startOutput = "";
  let attempts = 0;
  const maxAttempts = 15;

  console.log("Waiting for Supabase services to be healthy...");
  while (attempts < maxAttempts) {
    startOutput = runCommand("npx supabase status", true);
    if (startOutput.includes("Project URL")) break;
    
    attempts++;
    process.stdout.write(`Waiting for services... (Attempt ${attempts}/${maxAttempts})\r`);
    execSync("node -e \"setTimeout(() => {}, 4000)\"");
  }
  console.log("\nServices reported healthy.");

  console.log("Extracting credentials...");

  const urlMatch = startOutput.match(/Project URL\s*│\s*(https?:\/\/[^\s│]+)/);
  const keyMatch = startOutput.match(/Publishable\s*│\s*([^\s│]+)/);

  if (!urlMatch || !keyMatch) {
    console.error("Error: Could not extract credentials.");
    process.exit(1);
  }

  console.log("Extracted credentials successfully.");

  const sbUrl = urlMatch[1].trim();
  const sbKey = keyMatch[1].trim();

  // Update .env.local logic here...
  console.log("Updating .env.local with Supabase credentials...");
  const envPath = path.join(process.cwd(), ".env.local");
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const vars = { NEXT_PUBLIC_SUPABASE_URL: sbUrl, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: sbKey };
  Object.entries(vars).forEach(([key, value]) => {
    const regExp = new RegExp(`^${key}=.*`, "m");
    envContent = regExp.test(envContent) ? envContent.replace(regExp, `${key}=${value}`) : `${envContent}\n${key}=${value}`;
  });
  fs.writeFileSync(envPath, envContent.trim() + "\n");

  console.log("Setup complete!");
}

setup();