import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ISessionUser, UserRole } from "@/lib/types";

const COOKIE_NAME = "re_auth_session";
const AUTH_SECRET = process.env.AUTH_SECRET || "super_secure_antigravity_jwt_secret_key_minimum_32_characters_long_12345";
const key = new TextEncoder().encode(AUTH_SECRET);

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSessionToken(user: ISessionUser): Promise<string> {
  return new SignJWT({
    userId: user.userId,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId || null,
    organizationSlug: user.organizationSlug || null,
    organizationName: user.organizationName || null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifySessionToken(
  token: string
): Promise<ISessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as UserRole,
      organizationId: (payload.organizationId as string) || null,
      organizationSlug: (payload.organizationSlug as string) || null,
      organizationName: (payload.organizationName as string) || null,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: ISessionUser): Promise<void> {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION / 1000,
    expires: new Date(Date.now() + SESSION_DURATION),
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<ISessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
