import "server-only";
import { fromUTCDate, toUTCDate, type ISODate } from "@/lib/domain/dates";
import { prisma } from "@/lib/prisma";

const memberSelect = {
  id: true,
  firstName: true,
  lastName: true,
  role: true,
  isOwner: true,
  weeklyMinutes: true,
  color: true,
  email: true,
} as const;

export function getTeam(companyId: string) {
  return prisma.user.findMany({
    where: { companyId },
    select: memberSelect,
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });
}

export async function getShifts(companyId: string, from: ISODate, to: ISODate, userId?: string) {
  const rows = await prisma.shift.findMany({
    where: { companyId, date: { gte: toUTCDate(from), lte: toUTCDate(to) }, ...(userId ? { userId } : {}) },
    select: { id: true, userId: true, date: true, start: true, end: true, note: true },
    orderBy: [{ date: "asc" }, { start: "asc" }],
  });
  return rows.map((s) => ({ ...s, date: fromUTCDate(s.date) }));
}

/** Negozi dell'organizzazione con persone e turni dell'intervallo, per il riepilogo dell'Amministrazione. */
export async function getOrganizationOverview(organizationId: string, from: ISODate, to: ISODate) {
  const companies = await prisma.company.findMany({
    where: { organizationId },
    select: {
      id: true,
      name: true,
      code: true,
      users: { select: { id: true, weeklyMinutes: true } },
      shifts: {
        where: { date: { gte: toUTCDate(from), lte: toUTCDate(to) } },
        select: { userId: true, date: true, start: true, end: true },
      },
    },
    orderBy: { name: "asc" },
  });
  return companies.map((c) => ({ ...c, shifts: c.shifts.map((s) => ({ ...s, date: fromUTCDate(s.date) })) }));
}

export function getCompaniesOverview() {
  return prisma.company.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      createdAt: true,
      organization: { select: { name: true } },
      _count: { select: { users: true, shifts: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function getCompanyForSuperAdmin(id: string) {
  return prisma.company.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      code: true,
      createdAt: true,
      users: { select: memberSelect, orderBy: [{ firstName: "asc" }, { lastName: "asc" }] },
    },
  });
}

/** Ultimi `limit` messaggi dell'azienda, in ordine cronologico. */
export async function getMessages(companyId: string, limit: number) {
  const rows = await prisma.message.findMany({
    where: { companyId },
    select: {
      id: true,
      body: true,
      createdAt: true,
      fromOrganization: true,
      author: { select: { id: true, firstName: true, lastName: true, color: true } },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
  });
  return { messages: rows.slice(0, limit).reverse(), hasMore: rows.length > limit };
}

export function countUnreadMessages(companyId: string, since: Date) {
  return prisma.message.count({ where: { companyId, createdAt: { gt: since } } });
}
