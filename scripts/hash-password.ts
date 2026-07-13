/**
 * Generate a bcrypt hash for the ADMIN_PASSWORD_HASH env variable.
 *
 * Usage: npm run hash-password -- "your-password-here"
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "your-password-here"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
// In local .env files Next.js expands $VAR references, so every $ in the
// hash must be escaped. Vercel's dashboard takes the raw value.
const escaped = hash.replace(/\$/g, "\\$");

console.log("\nFor .env (escaped for Next.js env loading):\n");
console.log(`ADMIN_PASSWORD_HASH=${escaped}\n`);
console.log("For the Vercel env dashboard, use the raw value:\n");
console.log(`${hash}\n`);
