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

console.log("\nAdd this line to .env.local (and to Vercel env settings):\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
