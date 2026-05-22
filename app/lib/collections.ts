import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/app/lib/prisma";

const collectionUserSelect = {
  id: true,
  username: true,
  stampImageUrl: true,
} as const;

export type CollectionListItem = {
  collectionId: string;
  user: {
    id: string;
    username: string;
    stampImageUrl: string | null;
  };
  event: {
    id: string;
    name: string;
  } | null;
  collectedAt: string;
};

export function normalizeCollectionEventId(value: string | null | undefined) {
  const trimmedValue = value?.trim();

  if (!trimmedValue || trimmedValue === "null") {
    return null;
  }

  return trimmedValue;
}

export async function resolveCollectionEventId(
  eventId: string | null | undefined,
) {
  const normalizedEventId = normalizeCollectionEventId(eventId);

  if (!normalizedEventId) {
    return null;
  }

  const event = await prisma.event.findUnique({
    where: { id: normalizedEventId },
    select: { id: true },
  });

  return event?.id ?? null;
}

export async function getCollectionItemsForUser(
  userId: string,
  eventId?: string | null,
): Promise<CollectionListItem[]> {
  const where: Prisma.CollectionWhereInput = {
    OR: [{ userAId: userId }, { userBId: userId }],
  };

  if (eventId) {
    where.eventId = eventId;
  }

  const collections = await prisma.collection.findMany({
    where,
    orderBy: { collectedAt: "desc" },
    select: {
      id: true,
      collectedAt: true,
      event: {
        select: {
          id: true,
          name: true,
        },
      },
      userA: {
        select: collectionUserSelect,
      },
      userB: {
        select: collectionUserSelect,
      },
    },
  });

  return collections.map((collection) => {
    const otherUser =
      collection.userA.id === userId ? collection.userB : collection.userA;

    return {
      collectionId: collection.id,
      user: otherUser,
      event: collection.event,
      collectedAt: collection.collectedAt.toISOString(),
    };
  });
}

export async function getCollectionFilterEvents() {
  return prisma.event.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  });
}
