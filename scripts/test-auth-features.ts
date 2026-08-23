import { isDisposableEmail, validateRegistrationEmail } from "../src/lib/utils/email-validator";
import { registerOrgSchema, resetPasswordSchema } from "../src/lib/validations/auth";
import { checkPasswordStrength } from "../src/components/auth/PasswordStrengthMeter";

console.log("==================================================");
console.log("🧪 TESTING DISPOSABLE EMAIL DETECTION");
console.log("==================================================");

const disposableTestEmails = [
  "test@mailinator.com",
  "fakeuser@10minutemail.com",
  "burner@tempmail.com",
  "temp@guerrillamail.com",
  "spammer@sharklasers.com",
  "user@trashmail.com",
  "dispo@dispostable.com",
  "anon@burnermail.io",
  "bot@fakeinbox.com",
  "throwaway@getairmail.com",
  "random@yopmail.com",
];

let allDisposableBlocked = true;
for (const email of disposableTestEmails) {
  const res = isDisposableEmail(email);
  if (res.isDisposable) {
    console.log(`✅ Correctly BLOCKED disposable email: ${email}`);
  } else {
    console.error(`❌ FAILED: Did not block disposable email: ${email}`);
    allDisposableBlocked = false;
  }
}

console.log("\n🧪 TESTING GENUINE EMAILS");
const genuineTestEmails = [
  "developer@gmail.com",
  "broker@outlook.com",
  "manager@yahoo.com",
  "founder@proton.me",
  "contact@icloud.com",
  "director@rahmanproperties.com",
  "sales@apexrealty.com.bd",
  "info@custom-corporate-firm.com",
];

let allGenuineAllowed = true;
for (const email of genuineTestEmails) {
  const res = validateRegistrationEmail(email);
  if (res.isValid) {
    console.log(`✅ Correctly ALLOWED genuine email: ${email}`);
  } else {
    console.error(`❌ FAILED: Blocked genuine email: ${email} (${res.error})`);
    allGenuineAllowed = false;
  }
}

console.log("\n==================================================");
console.log("🧪 TESTING STRONG PASSWORD VALIDATION");
console.log("==================================================");

const weakPasswords = [
  "short",               // too short
  "alllowercaseonly",    // no uppercase, number, symbol
  "ALLUPPERCASEONLY",    // no lowercase, number, symbol
  "1234567890",          // numbers only
  "NoSpecialSymbol123",  // no special character
  "NoNumberHere!@#$",    // no number
];

let allWeakRejected = true;
for (const pw of weakPasswords) {
  const strength = checkPasswordStrength(pw);
  if (!strength.isStrong) {
    console.log(`✅ Correctly identified WEAK password: "${pw}" (${strength.label})`);
  } else {
    console.error(`❌ FAILED: Weak password was marked strong: "${pw}"`);
    allWeakRejected = false;
  }
}

const strongPasswords = [
  "Atenier#Secure2026",
  "RealEstate$Pro99",
  "P@ssw0rd!Complex",
  "G00d#Str0ng!Key",
];

let allStrongAccepted = true;
for (const pw of strongPasswords) {
  const strength = checkPasswordStrength(pw);
  if (strength.isStrong) {
    console.log(`✅ Correctly identified STRONG password: "${pw}" (${strength.label})`);
  } else {
    console.error(`❌ FAILED: Strong password was rejected: "${pw}"`);
    allStrongAccepted = false;
  }
}

console.log("\n==================================================");
console.log("🧪 TESTING ZOD SCHEMAS (REGISTER & RESET)");
console.log("==================================================");

// Test 1: Register Org with disposable email -> should fail
const res1 = registerOrgSchema.safeParse({
  userName: "Test User",
  email: "fake@mailinator.com",
  password: "Password#123",
  confirmPassword: "Password#123",
  organizationName: "Test Agency",
  organizationSlug: "test-agency",
  city: "Dhaka",
  country: "BD",
});
console.log(
  res1.success ? "❌ FAILED: Allowed disposable email" : "✅ Register correctly rejected disposable email:",
  !res1.success && res1.error.flatten().fieldErrors.email
);

// Test 2: Register Org with mismatch password -> should fail
const res2 = registerOrgSchema.safeParse({
  userName: "Test User",
  email: "test@gmail.com",
  password: "Password#123",
  confirmPassword: "MismatchPassword#123",
  organizationName: "Test Agency",
  organizationSlug: "test-agency-2",
  city: "Dhaka",
  country: "BD",
});
console.log(
  res2.success ? "❌ FAILED: Allowed mismatched passwords" : "✅ Register correctly rejected mismatched confirmPassword:",
  !res2.success && res2.error.flatten().fieldErrors.confirmPassword
);

// Test 3: Register Org with valid strong data -> should succeed
const res3 = registerOrgSchema.safeParse({
  userName: "Test User",
  email: "test@gmail.com",
  password: "Password#123",
  confirmPassword: "Password#123",
  organizationName: "Test Agency",
  organizationSlug: "test-agency-3",
  city: "Dhaka",
  country: "BD",
});
console.log(
  res3.success ? "✅ Register schema successfully validated genuine input" : "❌ FAILED valid register schema"
);

console.log("\n==================================================");
if (allDisposableBlocked && allGenuineAllowed && allWeakRejected && allStrongAccepted && !res1.success && !res2.success && res3.success) {
  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
} else {
  console.log("⚠️ SOME TESTS FAILED. Please review output.");
}
console.log("==================================================");
