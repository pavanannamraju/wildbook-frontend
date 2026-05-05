import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  X as XIcon,
  ArrowRight as ArrowRightIcon,
  BookmarkSimple as BookmarkSimpleIcon,
  FunnelSimple as FunnelSimpleIcon,
  GlobeHemisphereWest as GlobeHemisphereWestIcon,
  HouseSimple as HouseSimpleIcon,
  MagnifyingGlass as MagnifyingGlassIcon,
  MapPin as MapPinIcon,
  ShareNetwork as ShareNetworkIcon,
  SignInIcon,
} from "@phosphor-icons/react";

import heroImage from "../assets/explore-experts-hero.png";
import { addBookmark, removeBookmark } from "../api/bookmarks";
import { useAuth } from "../auth/AuthProvider";
import { LoginModalContent } from "../components/auth/LoginModalContent";
import Navbar from "../components/Navbar";
import { PageLoader } from "../components/PageLoader";
import { ShareLinkModal } from "../components/common/ShareLinkModal";
import { StickyHeader } from "../components/StickyHeader";
import { StarRating } from "../components/common/StarRating";
import { useScrollPastRef } from "../hooks/useScrollPastRef";
import { useExperts } from "../hooks/useExperts";

const FIRST_FREE_EXPERT_KEY = "wildbook_guest_first_expert_detail";

function areSetsEqual(left: Set<string>, right: Set<string>): boolean {
  if (left.size !== right.size) return false;
  for (const value of left) {
    if (!right.has(value)) return false;
  }
  return true;
}

function roleLabel(role: string): string {
  if (role === "guide") return "FOREST GUIDE";
  if (role === "naturalist") return "NATURALIST";
  return role.toUpperCase();
}

export function ExploreExpertsPage() {
  const heroRef = useRef<HTMLElement>(null);
  const isPastHero = useScrollPastRef(heroRef);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roleFilter, setRoleFilter] = useState<"all" | "guide" | "naturalist">("all");
  const [search, setSearch] = useState("");
  const [showExploreLoginGate, setShowExploreLoginGate] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingExpertPath, setPendingExpertPath] = useState<string | null>(null);
  const [bookmarkedExpertIds, setBookmarkedExpertIds] = useState<Set<string>>(new Set());
  const [bookmarkingExpertIds, setBookmarkingExpertIds] = useState<Set<string>>(new Set());
  const [sharePath, setSharePath] = useState<string | null>(null);
  const { status, data, error, nextPage, prevPage, goToPage, stats } = useExperts({
    role: roleFilter,
    search,
    includeBookmark: Boolean(user),
  });

  const totalPages = stats.totalPages;
  const currentPage = stats.currentPage;
  const paged = data;

  const handleViewDetails = (expertPath: string) => {
    if (user) {
      navigate(expertPath);
      return;
    }

    const nextExpertId = expertPath.replace("/experts/", "");
    const firstViewedExpert = window.localStorage.getItem(FIRST_FREE_EXPERT_KEY);
    if (!firstViewedExpert) {
      window.localStorage.setItem(FIRST_FREE_EXPERT_KEY, nextExpertId);
      navigate(expertPath);
      return;
    }

    if (firstViewedExpert === nextExpertId) {
      navigate(expertPath);
      return;
    }

    setPendingExpertPath(expertPath);
    setShowExploreLoginGate(true);
  };

  useEffect(() => {
    if (data.length === 0) {
      setBookmarkedExpertIds((prev) => (prev.size === 0 ? prev : new Set()));
      return;
    }
    const nextBookmarkedExpertIds = new Set(
      data.filter((item) => item.is_bookmarked === true).map((item) => item.id),
    );
    setBookmarkedExpertIds((prev) =>
      areSetsEqual(prev, nextBookmarkedExpertIds) ? prev : nextBookmarkedExpertIds,
    );
  }, [data]);

  const toggleBookmark = async (expertId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (bookmarkingExpertIds.has(expertId)) return;
    const isBookmarked = bookmarkedExpertIds.has(expertId);

    setBookmarkingExpertIds((prev) => new Set(prev).add(expertId));
    setBookmarkedExpertIds((prev) => {
      const next = new Set(prev);
      if (isBookmarked) {
        next.delete(expertId);
      } else {
        next.add(expertId);
      }
      return next;
    });

    try {
      if (isBookmarked) {
        await removeBookmark("expert", expertId);
      } else {
        await addBookmark("expert", expertId);
      }
    } catch {
      setBookmarkedExpertIds((prev) => {
        const next = new Set(prev);
        if (isBookmarked) {
          next.add(expertId);
        } else {
          next.delete(expertId);
        }
        return next;
      });
    } finally {
      setBookmarkingExpertIds((prev) => {
        const next = new Set(prev);
        next.delete(expertId);
        return next;
      });
    }
  };

  return (
    <main className="mx-auto max-w-[1920px]">
      <StickyHeader visible={isPastHero} />
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-[#2f2b28]"
        style={{
          backgroundImage: `url('${heroImage}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,43,40,0.72)_0%,rgba(47,43,40,0.30)_28%,rgba(47,43,40,0)_58%)]" />
        <div className="absolute inset-x-0 top-0 h-[155px] bg-[linear-gradient(180deg,rgba(47,43,40,0.48)_0%,rgba(47,43,40,0)_100%)] mix-blend-multiply" />
        <div className="absolute inset-x-0 bottom-0 h-[220px] bg-[linear-gradient(180deg,rgba(47,43,40,0)_0%,rgba(47,43,40,0.72)_100%)] mix-blend-multiply" />

        <div className="relative z-10">
          <Navbar variant="light" />
        </div>

        <div className="relative z-10 min-h-[520px] px-6 pt-16 pb-12 md:min-h-[640px] md:px-16 md:pt-28 lg:min-h-[800px] lg:px-40 lg:pt-[248px]">
          <div className="max-w-[452px]">
            <h1
              className="text-[38px] leading-[1.07] text-[rgba(232,226,220,0.9)] drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)] md:text-[46px] lg:text-[52px]"
              style={{ fontFamily: '"Cocogoose Pro"', fontWeight: 300 }}
            >
              Meet India&apos;s Guardians of Coexistence
            </h1>
            <p className="mt-4 text-[16px] leading-[1.35] font-bold text-[#9bcdb2] md:text-[18px] lg:text-[20px]">
              A curated network of India&apos;s most knowledgeable guides and naturalists, offering
              rare access to local expertise across diverse landscapes.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F6F4F0] page-px py-12 md:py-16">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <h2 className="text-[24px] leading-[1.43] font-bold text-[#2F2B28]">
            Explore Verified Forest Guides &amp; Naturalists
          </h2>
          <p className="pt-2 text-[12px] leading-loose font-light text-[#73706C]">
            Showing ({paged.length} of {stats.totalCount} experts)
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setRoleFilter("all");
                void goToPage(1);
              }}
              className={`h-12 rounded px-6 text-[14px] font-medium ${
                roleFilter === "all"
                  ? "bg-[#0B6E66] text-[#FAFAFA]"
                  : "border border-[#d0ceca] bg-[#F6F4F0] text-[#73706C]"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => {
                setRoleFilter("guide");
                void goToPage(1);
              }}
              className={`h-12 rounded px-6 text-[14px] font-medium ${
                roleFilter === "guide"
                  ? "bg-[#0B6E66] text-[#FAFAFA]"
                  : "border border-[#d0ceca] bg-[#F6F4F0] text-[#73706C]"
              }`}
            >
              Guides
            </button>
            <button
              type="button"
              onClick={() => {
                setRoleFilter("naturalist");
                void goToPage(1);
              }}
              className={`h-12 rounded px-6 text-[14px] font-medium ${
                roleFilter === "naturalist"
                  ? "bg-[#0B6E66] text-[#FAFAFA]"
                  : "border border-[#d0ceca] bg-[#F6F4F0] text-[#73706C]"
              }`}
            >
              Naturalists
            </button>
          </div>

          <div className="flex w-full max-w-[520px] gap-3">
            <div className="flex h-12 flex-1 items-center rounded border border-[#ddd] bg-[#ecebea] px-6">
              <MagnifyingGlassIcon size={16} className="mr-2 text-[#8a8a8a]" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  void goToPage(1);
                }}
                placeholder="Search"
                className="h-10 w-full bg-transparent text-[12px] outline-none"
              />
            </div>
            <button
              type="button"
              className="inline-flex h-12 items-center gap-2 rounded border border-[#ddd] bg-[#ecebea] px-6 text-[12px] text-[#666]"
            >
              <FunnelSimpleIcon size={14} />
              Filter
            </button>
          </div>
        </div>

        {status === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
        )}

        {status === "loading" && data.length === 0 ? (
          <PageLoader />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {paged.map((expert) => {
              const expertPath = `/experts/${expert.slug || expert.id}`;
              const isBookmarked = bookmarkedExpertIds.has(expert.id);
              const isBookmarkPending = bookmarkingExpertIds.has(expert.id);
              const primaryRole = expert.roles[0] ? roleLabel(expert.roles[0]) : "NATURALIST";
              const location =
                expert.location_name ?? expert.location_primary_location_id ?? "India Wildlife Reserve";
              const languageValues = expert.language_names.length > 0 ? expert.language_names : expert.language_ids;
              const languages = languageValues
                .slice(0, 4)
                .join(", ");
              const tagValues = expert.expertise_names.length > 0 ? expert.expertise_names : expert.expertise_ids;
              const tags = tagValues
                .slice(0, 3);
              const reviewCount = expert.experience_snapshots[0]?.reviews_count ?? 0;

              return (
                <article key={expert.id} className="flex gap-6 rounded-2xl border border-[#e5e3df] bg-[#F3EEE9] p-6">
                  <div className="relative h-[312px] w-[272px] shrink-0 overflow-hidden rounded-xl bg-[#0B6E66]/20">
                    {expert.profile_image_url ? (
                      <img
                        src={expert.profile_image_url}
                        alt={expert.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[44px] font-semibold text-[#0B6E66]">
                        {expert.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[20px] leading-[1.33] font-bold text-[#2F2B28]">{expert.name}</h3>
                      <div className="flex items-center gap-4 pr-1 pt-1 text-[#6f6f6f]">
                        <button
                          type="button"
                          onClick={() => void toggleBookmark(expert.id)}
                          disabled={isBookmarkPending}
                          className="inline-flex items-center justify-center disabled:opacity-50"
                          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                        >
                          <BookmarkSimpleIcon size={22} weight={isBookmarked ? "fill" : "regular"} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSharePath(expertPath)}
                          className="inline-flex items-center justify-center"
                          aria-label="Share expert"
                        >
                          <ShareNetworkIcon size={22} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-[12px] leading-normal font-medium uppercase tracking-[0.04em] text-[#73706C]">
                      {primaryRole}
                      <span className="mx-2">•</span>
                      <span className="inline-flex items-center gap-1 text-[#0B6E66]">
                        <HouseSimpleIcon size={13} />
                        HOMESTAY HOST
                      </span>
                    </div>
                    <p className="mt-2 inline-flex items-center gap-2 text-[14px] leading-[1.33] text-[#2F2B28]">
                      <MapPinIcon size={16} /> {location}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-2 text-[14px] leading-[1.33] text-[#2F2B28]">
                      <GlobeHemisphereWestIcon size={16} /> {languages || "English, Hindi"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-sm bg-[#9BCDB2]/50 px-4 py-2 text-[14px] leading-[1.33] text-[#2F2B28]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[14px] leading-[1.33] text-[#e5b95a]">
                      <StarRating
                        rating={expert.experience_rating_max ?? 0}
                        size={24}
                        className="inline-flex gap-1"
                      />
                      <span className="pt-1 text-[14px] font-light text-[#73706C]">({reviewCount})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleViewDetails(expertPath)}
                      className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#0B6E66] text-[14px] leading-none font-medium text-[#FAFAFA] hover:bg-[#074A46]"
                    >
                      View Details
                      <ArrowRightIcon size={20} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3 text-[10px] text-[#808080]">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => void prevPage()}
              className="rounded border border-[#ddd] px-2 py-1 disabled:opacity-40"
            >
              ‹
            </button>
            {Array.from({ length: Math.min(10, totalPages) }).map((_, i) => {
              const value = i + 1;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => void goToPage(value)}
                  className={`h-7 min-w-7 rounded px-2 ${
                    currentPage === value
                      ? "border border-[#b5b5b5] bg-[#ecebea] text-[#2f2f2f]"
                      : "text-[#808080]"
                  }`}
                >
                  {value}
                </button>
              );
            })}
            {totalPages > 10 && <span>...</span>}
            {totalPages > 10 && (
              <>
                <button
                  type="button"
                  onClick={() => void goToPage(totalPages - 1)}
                  className="h-7 min-w-7 rounded px-2 text-[#808080]"
                >
                  {totalPages - 1}
                </button>
                <button
                  type="button"
                  onClick={() => void goToPage(totalPages)}
                  className="h-7 min-w-7 rounded px-2 text-[#808080]"
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => void nextPage()}
              className="rounded border border-[#ddd] px-2 py-1 disabled:opacity-40"
            >
              ›
            </button>
          </div>
        )}
      </section>
      {showExploreLoginGate
        ? createPortal(
            <div className="fixed inset-0 z-1200 flex items-center justify-center bg-black/55 p-4">
              <div className="w-full max-w-[760px] rounded-[16px] border border-white/20 bg-[#2f2d2a] px-8 py-9 text-white shadow-2xl">
                <div className="flex items-start justify-between gap-6">
                  <div className="max-w-[620px]">
                    <h2
                      className="text-[24px] leading-none tracking-[-0.02em]"
                      style={{ fontFamily: '"Cocogoose Pro"', fontWeight: 300 }}
                    >
                      <span aria-hidden="true" className="mr-3 inline-block align-middle">
                        <SignInIcon />
                      </span>
                      Discover more about our experts
                    </h2>
                    <p className="mt-5 text-[22px] leading-[1.55] text-white/90 md:text-[20px]">
                      Log in or create an account to explore detailed profiles, experience offerings, and
                      availability of wildlife guides and naturalists.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10"
                    onClick={() => {
                      setShowExploreLoginGate(false);
                      setPendingExpertPath(null);
                    }}
                    aria-label="Close access prompt"
                  >
                    <XIcon size={22} />
                  </button>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    type="button"
                    className="rounded-md border border-white/45 px-4 py-2 text-[12px] leading-none"
                    style={{ fontFamily: '"Cocogoose Pro"', fontWeight: 300 }}
                    onClick={() => {
                      setShowExploreLoginGate(false);
                      setPendingExpertPath(null);
                    }}
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-3 rounded-md bg-[#0B6E66] px-4 py-2 text-[12px] leading-none"
                    style={{ fontFamily: '"Cocogoose Pro"', fontWeight: 300 }}
                    onClick={() => {
                      setShowExploreLoginGate(false);
                      setShowLoginModal(true);
                    }}
                  >
                    Login / Sign Up
                    <ArrowRightIcon size={24} />
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
      {showLoginModal
        ? createPortal(
            <div className="fixed inset-0 z-1200 flex items-center justify-center bg-black/50 p-4">
              <div className="absolute inset-0" onClick={() => setShowLoginModal(false)} />
              <div className="relative z-1 w-full max-w-[1120px]">
                <LoginModalContent
                  onClose={() => setShowLoginModal(false)}
                  onSuccess={() => {
                    setShowLoginModal(false);
                    if (pendingExpertPath) {
                      navigate(pendingExpertPath);
                      setPendingExpertPath(null);
                    }
                  }}
                />
              </div>
            </div>,
            document.body,
          )
        : null}
      <ShareLinkModal
        isOpen={sharePath !== null}
        path={sharePath ?? "/experts"}
        title="Share expert profile"
        onClose={() => setSharePath(null)}
      />
    </main>
  );
}

