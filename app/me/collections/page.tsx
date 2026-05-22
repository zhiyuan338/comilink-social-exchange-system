import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import {
  getCollectionFilterEvents,
  getCollectionItemsForUser,
  normalizeCollectionEventId,
  resolveCollectionEventId,
} from "@/app/lib/collections";

type CollectionsPageProps = {
  searchParams: Promise<{
    eventId?: string | string[];
  }>;
};

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatCollectedAt(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function CollectionsPage({
  searchParams,
}: CollectionsPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?returnTo=/me/collections");
  }

  const params = await searchParams;
  const requestedEventId = normalizeCollectionEventId(
    getSearchParamValue(params.eventId),
  );
  const [events, selectedEventId] = await Promise.all([
    getCollectionFilterEvents(),
    resolveCollectionEventId(requestedEventId),
  ]);
  const items = await getCollectionItemsForUser(user.id, selectedEventId);

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-6 text-zinc-950">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">ComiLink</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Collections</h1>
              <p className="mt-1 text-sm text-zinc-500">
                View collected stamps by event.
              </p>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
              href="/me"
            >
              Profile
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            action="/me/collections"
          >
            <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-zinc-700">
              Event
              <select
                className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950"
                defaultValue={selectedEventId ?? ""}
                name="eventId"
              >
                <option value="">All events</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                    {event.isActive ? " (active)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:ml-auto sm:shrink-0"
              type="submit"
            >
              Apply
            </button>
          </form>
          {requestedEventId && !selectedEventId ? (
            <p className="mt-3 rounded-md bg-zinc-50 px-3 py-2 text-sm text-zinc-500">
              Event not found. Showing all events.
            </p>
          ) : null}
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Collected users</h2>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              {items.length}
            </span>
          </div>

          {items.length === 0 ? (
            <p className="mt-4 rounded-md bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500">
              No collection records yet.
            </p>
          ) : (
            <div className="mt-4 grid gap-3">
              {items.map((item) => (
                <article
                  className="flex gap-3 rounded-md border border-zinc-200 p-3"
                  key={item.collectionId}
                >
                  {item.user.stampImageUrl ? (
                    <Image
                      alt={`${item.user.username} stamp`}
                      className="aspect-[3/4] w-20 shrink-0 rounded-md border border-zinc-200 bg-zinc-50 object-cover"
                      height={800}
                      src={item.user.stampImageUrl}
                      width={600}
                    />
                  ) : (
                    <div className="flex aspect-[3/4] w-20 shrink-0 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-2 text-center text-xs text-zinc-500">
                      No stamp
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-zinc-950">
                      {item.user.username}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {item.event?.name ?? "No event"}
                    </p>
                    <p className="mt-3 text-xs text-zinc-500">
                      Collected at {formatCollectedAt(item.collectedAt)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
