/**
 * Disposable & Fake Email Validation Service
 * Identifies and blocks temporary, burner, and disposable email addresses
 * while allowing genuine public providers (Gmail, Outlook, Yahoo, etc.) and
 * legitimate custom business / organization domains.
 */

// Comprehensive blocklist of known disposable, temporary, and burner email providers
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // Popular temporary email services
  "10minutemail.com",
  "10minutemail.net",
  "10minutemail.org",
  "10minemail.com",
  "20minutemail.com",
  "20minutemail.it",
  "mailinator.com",
  "mailinator2.com",
  "mailin8r.com",
  "tempmail.com",
  "temp-mail.org",
  "temp-mail.io",
  "tempmail.net",
  "tempmail.ninja",
  "tempmailaddress.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.biz",
  "guerrillamailblock.com",
  "sharklasers.com",
  "grr.la",
  "pokemail.net",
  "spam4.me",
  "trashmail.com",
  "trashmail.net",
  "trashmail.org",
  "trashmail.me",
  "trashmail.at",
  "trashmail.io",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "cool.fr.nf",
  "jetable.fr.nf",
  "nospam.ze.tc",
  "nomail.xl.cx",
  "mega.zik.dj",
  "speed.1s.fr",
  "courriel.fr.nf",
  "moncourrier.fr.nf",
  "monemail.fr.nf",
  "monmail.fr.nf",
  "dispostable.com",
  "disposablemail.com",
  "throwawaymail.com",
  "getairmail.com",
  "airmail.cc",
  "fakemailgenerator.com",
  "fakeinbox.com",
  "burnermail.io",
  "burneremail.com",
  "crazymailing.com",
  "mohmal.im",
  "mohmal.in",
  "mohmal.com",
  "nada.ltd",
  "nada.email",
  "getnada.com",
  "inboxbear.com",
  "emailondeck.com",
  "generator.email",
  "mytemp.email",
  "mytempemail.com",
  "mintemail.com",
  "mytempmail.com",
  "throwaway.email",
  "throwawayemail.com",
  "tempail.com",
  "tempinbox.com",
  "tempemail.co",
  "tempemail.net",
  "tempemailgen.com",
  "tmpmail.net",
  "tmpmail.org",
  "emailfake.com",
  "crazymail.com",
  "dropmail.me",
  "disposable.com",
  "trash-mail.com",
  "maildrop.cc",
  "harakirimail.com",
  "byom.de",
  "dayrep.com",
  "teleworm.us",
  "armyspy.com",
  "cuvox.de",
  "fleckens.hu",
  "gustr.com",
  "jourrapide.com",
  "rhyta.com",
  "superrito.com",
  "einrot.com",
  "chacuo.net",
  "0-mail.com",
  "0815.ru",
  "0clickemail.com",
  "10mail.org",
  "20mail.it",
  "33mail.com",
  "anonaddy.me",
  "anonaddy.com",
  "simplelogin.co",
  "duck.com",
  "spambox.us",
  "spamevader.com",
  "spamex.com",
  "spamfree24.org",
  "spamgourmet.com",
  "spamhole.com",
  "spaml.com",
  "spamspot.com",
  "trashymail.com",
  "zoemail.org",
  "bugmenot.com",
  "deadaddress.com",
  "emailmiser.com",
  "emailsensei.com",
  "emailtemporario.com.br",
  "ephemail.net",
  "filzmail.com",
  "front14.org",
  "getonemail.com",
  "haltospam.com",
  "incognitomail.org",
  "jetable.org",
  "kasmail.com",
  "mailcatch.com",
  "mailexpire.com",
  "mailforspam.com",
  "mailmoat.com",
  "mailnesia.com",
  "mailnull.com",
  "mailscrap.com",
  "messagebeamer.de",
  "mysptmail.com",
  "mytrashmail.com",
  "nepwk.com",
  "nobulk.com",
  "nodisposable.com",
  "nomail.pl",
  "noclickemail.com",
  "nogmailhere.biz",
  "no-spam.ws",
  "oneoffmail.com",
  "owlymail.com",
  "pookmail.com",
  "privacymail.com",
  "quickinbox.com",
  "rcpt.at",
  "safe-mail.net",
  "sendmail.to",
  "shiftmail.com",
  "slopsbox.com",
  "sneakemail.com",
  "sofort-mail.de",
  "sogetthis.com",
  "soodonims.com",
  "spamavert.com",
  "spambob.com",
  "spambog.com",
  "spamblocked.com",
  "spamcannibal.org",
  "spamcon.org",
  "spamcorptastic.com",
  "spamcowboy.com",
  "spamday.com",
  "spameater.org",
  "spamex.biz",
  "spamfree.eu",
  "spaminator.de",
  "spaml.de",
  "spamobox.com",
  "spamoff.de",
  "spampal.org",
  "spamprefix.com",
  "spamserver.org",
  "spamthis.co.uk",
  "superstachel.de",
  "suremail.info",
  "tafmail.com",
  "tagyourself.com",
  "tempemail.biz",
  "tempmail.us",
  "tempmail2.com",
  "temppmail.com",
  "thecloudmail.com",
  "trash-mail.at",
  "trash-mail.ch",
  "trash-mail.de",
  "trash-mail.info",
  "trash-mail.me",
  "trash-mail.net",
  "trash-mail.org",
  "trash2.net",
  "trashbox.eu",
  "trashcanmail.com",
  "trashemail.net",
  "trashmail.at",
  "trashmail.ch",
  "trashmail.de",
  "trashmail.ws",
  "trashmailer.com",
  "trashmails.com",
  "trillianpro.com",
  "uggsrock.com",
  "valuehost.ru",
  "valupin.com",
  "vefsida.com",
  "veloxmail.com",
  "veryrealemail.com",
  "viditag.com",
  "viewcastmedia.com",
  "vomoto.com",
  "vp4.net",
  "vpn.st",
  "vsimail.com",
  "vubby.com",
  "walala.org",
  "warpcave.com",
  "watchfull.com",
  "webhostgear.com",
  "webm4il.in",
  "webmail7.info",
  "wegwerfadresse.de",
  "wegwerfemail.de",
  "wegwerfmail.de",
  "wegwerfmail.net",
  "wegwerfmail.org",
  "wetrainbayarea.com",
  "whatpaas.com",
  "whatpaas.org",
  "whyspam.me",
  "willselfdestruct.com",
  "wimpm.com",
  "windowslive.biz",
  "winemart.com",
  "wolfsmail.com",
  "wr.ath.cx",
  "wrongmail.com",
  "wuzup.net",
  "wuzupmail.net",
  "wwwnew.eu",
  "x.ip6.im",
  "xagloo.com",
  "xemaps.com",
  "xents.com",
  "xmaily.com",
  "xmms.org",
  "xomail.info",
  "yapped.net",
  "yep.it",
  "yertle.com",
  "yhg.biz",
  "yopmail.gq",
  "youpymail.com",
  "yourdomain.com",
  "yours.org",
  "youvegotmail.com",
  "yspam.com",
  "yuurok.com",
  "z1p.biz",
  "za10.org",
  "zehnminutenmail.de",
  "zippymail.info",
  "zoemail.com",
  "zomg.info",
  "zxcv.com",
  "zzrgg.com",
]);

// Suspicious patterns / keywords in domain names
const SUSPICIOUS_DOMAIN_PATTERNS = [
  /temp.*mail/i,
  /dispos.*mail/i,
  /fake.*mail/i,
  /trash.*mail/i,
  /throw.*away/i,
  /burner.*mail/i,
  /10.*minute/i,
  /20.*minute/i,
  /guerrilla.*mail/i,
  /sharklaser/i,
  /yopmail/i,
  /mailinator/i,
  /spam4/i,
  /spam.*box/i,
  /spamex/i,
  /wegwerf/i,
  /mohmal/i,
  /dispostable/i,
  /fakename/i,
];

// Major recognized genuine email providers
export const POPULAR_GENUINE_PROVIDERS = [
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.com.bd",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "zoho.com",
  "fastmail.com",
  "aol.com",
  "gmx.com",
  "gmx.net",
  "mail.com",
  "tutanota.com",
  "tuta.io",
];

/**
 * Validates if an email is from a temporary / disposable / fake domain.
 */
export function isDisposableEmail(email: string): {
  isDisposable: boolean;
  reason?: string;
} {
  if (!email || typeof email !== "string") {
    return { isDisposable: true, reason: "ইমেইল অ্যাড্রেস প্রদান করা আবশ্যক" };
  }

  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) {
    return { isDisposable: true, reason: "সঠিক ইমেইল ফরম্যাট প্রদান করুন" };
  }

  const domain = parts[1];

  // 1. Direct blocklist lookup
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      isDisposable: true,
      reason: "ডিসপোজেবল বা টেম্পোরারি ইমেইল গ্রহণযোগ্য নয়। অনুগ্রহ করে আপনার আসল ইমেইল ব্যবহার করুন। (Disposable emails are not allowed)",
    };
  }

  // 2. Suspicious domain pattern match
  for (const pattern of SUSPICIOUS_DOMAIN_PATTERNS) {
    if (pattern.test(domain)) {
      return {
        isDisposable: true,
        reason: "ডিসপোজেবল বা ফেক ইমেইল সার্ভিস গ্রহণযোগ্য নয়। অনুগ্রহ করে আসল জিমেইল, আউটলুক বা অফিশিয়াল ইমেইল ব্যবহার করুন।",
      };
    }
  }

  // 3. Domain validation (must have valid TLD >= 2 chars, not ending in invalid extensions)
  const domainParts = domain.split(".");
  if (domainParts.length < 2) {
    return { isDisposable: true, reason: "অবৈধ ইমেইল ডোমেইন" };
  }

  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || /^[0-9]+$/.test(tld)) {
    return { isDisposable: true, reason: "অবৈধ ইমেইল এক্সটেনশন" };
  }

  return { isDisposable: false };
}

/**
 * Validates email format and ensures it is genuine (not temporary/disposable)
 */
export function validateRegistrationEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      error: "অনুগ্রহ করে একটি সঠিক ইমেইল এড্রেস প্রদান করুন (Please enter a valid email address)",
    };
  }

  const check = isDisposableEmail(email);
  if (check.isDisposable) {
    return {
      isValid: false,
      error: check.reason || "ডিসপোজেবল বা ফেক ইমেইল গ্রহণযোগ্য নয়",
    };
  }

  return { isValid: true };
}
