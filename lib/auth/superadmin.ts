import "server-only";
import { safeEqual } from "./crypto";

/** Credenziali del super admin da variabili d'ambiente; disattivato se mancano. */
export function checkSuperAdmin(email: string, password: string): boolean {
  const envEmail = process.env.SUPERADMIN_EMAIL;
  const envPassword = process.env.SUPERADMIN_PASSWORD;
  if (!envEmail || !envPassword) return false;
  const emailOk = safeEqual(email.trim().toLowerCase(), envEmail.trim().toLowerCase());
  const passwordOk = safeEqual(password, envPassword);
  return emailOk && passwordOk;
}
