import { redirect } from "next/navigation";
import { getSession } from "./session";
import { ISessionUser } from "@/lib/types";

export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 401) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

/**
 * Enforces that a user is authenticated.
 * If not authenticated, redirects to /login or throws AuthError.
 */
export async function requireAuth(shouldRedirect = true): Promise<ISessionUser> {
  const session = await getSession();

  if (!session) {
    if (shouldRedirect) {
      redirect("/login");
    }
    throw new AuthError("Unauthorized: Authentication required", 401);
  }

  return session;
}

/**
 * Enforces that the user has access to a specific organization.
 * System Admins bypass tenant checks.
 * Organization Owners & Agents can ONLY access their own organization.
 */
export async function requireOrganizationAccess(
  targetOrgId?: string | null,
  shouldRedirect = true
): Promise<ISessionUser> {
  const session = await requireAuth(shouldRedirect);

  if (session.role === "SYSTEM_ADMIN") {
    return session;
  }

  if (!session.organizationId) {
    if (shouldRedirect) {
      redirect("/register-organization");
    }
    throw new AuthError("Forbidden: User does not belong to an organization", 403);
  }

  if (targetOrgId && session.organizationId !== targetOrgId.toString()) {
    if (shouldRedirect) {
      redirect("/dashboard");
    }
    throw new AuthError(
      "Forbidden: Tenant boundary violation. You do not have access to this organization's data.",
      403
    );
  }

  return session;
}

/**
 * Enforces that the user is the OWNER of the organization or a SYSTEM_ADMIN.
 * Agents cannot perform organization-level actions (e.g. settings, deleting agency).
 */
export async function requireOrganizationOwner(
  targetOrgId?: string | null,
  shouldRedirect = true
): Promise<ISessionUser> {
  const session = await requireOrganizationAccess(targetOrgId, shouldRedirect);

  if (session.role === "SYSTEM_ADMIN") {
    return session;
  }

  if (session.role !== "OWNER") {
    if (shouldRedirect) {
      redirect("/dashboard");
    }
    throw new AuthError(
      "Forbidden: Only organization owners can perform this action",
      403
    );
  }

  return session;
}

/**
 * Enforces that the user has the SYSTEM_ADMIN role.
 */
export async function requireSystemAdmin(
  shouldRedirect = true
): Promise<ISessionUser> {
  const session = await requireAuth(shouldRedirect);

  if (session.role !== "SYSTEM_ADMIN") {
    if (shouldRedirect) {
      redirect("/dashboard");
    }
    throw new AuthError(
      "Forbidden: Platform administrator privileges required",
      403
    );
  }

  return session;
}

/**
 * Helper to get the current session safely without throwing or redirecting.
 */
export async function getCurrentSession(): Promise<ISessionUser | null> {
  try {
    return await getSession();
  } catch {
    return null;
  }
}
