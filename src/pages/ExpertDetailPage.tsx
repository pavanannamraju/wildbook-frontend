import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkSimpleIcon,
  CalendarDotsIcon,
  CaretDownIcon,
  GlobeHemisphereWestIcon,
  HouseSimpleIcon,
  MapPinIcon,
  ShareNetworkIcon,
  StarIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { addBookmark, fetchBookmarkStatuses, removeBookmark } from "../api/bookmarks";
import { fetchExpertById, type ExpertDetail, type ExperienceDetail } from "../api/experts";
import { useAuth } from "../auth/AuthProvider";
import { createInquiry } from "../api/inquiries";
import { PageLoader } from "../components/PageLoader";
import { PageErrorState } from "../components/common/PageErrorState";
import { ShareLinkModal } from "../components/common/ShareLinkModal";
import { StarRating } from "../components/common/StarRating";
import { StickyTopNavbar } from "../components/common/StickyTopNavbar";

function roleLabel(role: string): string {
  if (role === "guide") return "FOREST GUIDE";
  if (role === "naturalist") return "PRIVATE NATURALIST";
  return role.toUpperCase();
}

function durationLabel(experience: ExperienceDetail): string {
  const duration = experience.duration;
  if (!duration) return "Custom";
  const unit = duration.unit === "hours" ? "Hours" : duration.unit === "days" ? "Days" : duration.unit;
  return `${duration.value} ${unit}`;
}

export function ExpertDetailPage() {
  const { slugOrId } = useParams();
  const { user } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [expert, setExpert] = useState<ExpertDetail | null>(null);
  const [activeImage, setActiveImage] = useState<{ url: string; title: string } | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupSize, setGroupSize] = useState("2");
  const [customGroupSize, setCustomGroupSize] = useState("");
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [expandedExperienceIds, setExpandedExperienceIds] = useState<Set<string>>(new Set());
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkPending, setBookmarkPending] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (!slugOrId) {
      setStatus("error");
      setError("Missing expert identifier.");
      return;
    }
    const controller = new AbortController();
    setStatus("loading");
    setError(null);

    fetchExpertById(slugOrId, controller.signal)
      .then((result) => {
        setExpert(result);
        setStatus("success");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setStatus("error");
        setError(err instanceof Error ? err.message : "Failed to load expert details.");
      });

    return () => controller.abort();
  }, [slugOrId]);

  useEffect(() => {
    if (!activeImage) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveImage(null);
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [activeImage]);

  const locationLabel = useMemo(() => {
    return expert?.location_name || expert?.location?.primary_location_id || "India Wildlife Reserve";
  }, [expert?.location_name, expert?.location?.primary_location_id]);

  const languageLabel = useMemo(() => {
    if (!expert) return "English, Hindi";
    const values = expert.language_names.length > 0 ? expert.language_names : expert.language_ids;
    return values.join(", ") || "English, Hindi";
  }, [expert]);

  useEffect(() => {
    if (!user || !expert) {
      setIsBookmarked(false);
      return;
    }
    const controller = new AbortController();
    fetchBookmarkStatuses("expert", [expert.id], controller.signal)
      .then((bookmarked) => {
        setIsBookmarked(bookmarked.has(expert.id));
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setIsBookmarked(false);
      });
    return () => controller.abort();
  }, [expert, user]);

  if (status === "loading") {
    return <PageLoader />;
  }

  if (status === "error" || !expert) {
    return <PageErrorState message={error ?? "Expert not found."} className="bg-[#F0EDE9]" />;
  }

  const primaryRole = expert.roles[0] ? roleLabel(expert.roles[0]) : "PRIVATE NATURALIST";
  const expertiseTags = expert.expertise_names.length > 0 ? expert.expertise_names : expert.expertise_ids;
  const experiences = expert.experiences_full ?? [];
  const testimonials = expert.testimonials_full ?? [];
  const fieldEntries = (expert.field_entries_full ?? []).filter(
    (item) => item.media_type === "image" && item.media_url,
  );
  const reviewsCount = experiences[0]?.reviews_count ?? 0;
  const groupSizeValue = groupSize === "custom" ? customGroupSize.trim() : groupSize;

  const validationErrors = (() => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerName.trim()) errors.customerName = "Name is required.";
    if (!customerEmail.trim()) errors.customerEmail = "Email is required.";
    else if (!emailRegex.test(customerEmail.trim())) errors.customerEmail = "Enter a valid email.";
    if (!startDate) errors.startDate = "Start date is required.";
    if (!endDate) errors.endDate = "End date is required.";
    if (startDate && endDate && endDate < startDate) {
      errors.endDate = "End date must be on or after start date.";
    }
    if (!groupSizeValue) errors.groupSize = "Group size is required.";
    if (groupSize === "custom" && !/^\d+$/.test(groupSizeValue)) {
      errors.groupSize = "Enter a valid number of people.";
    }
    if (groupSize === "custom" && /^\d+$/.test(groupSizeValue) && Number(groupSizeValue) <= 0) {
      errors.groupSize = "People count must be greater than zero.";
    }
    if (!enquiryMessage.trim()) errors.enquiryMessage = "Enquiry is required.";
    else if (enquiryMessage.trim().length < 10) {
      errors.enquiryMessage = "Enquiry must be at least 10 characters.";
    }
    return errors;
  })();

  const isFormValid = Object.keys(validationErrors).length === 0;

  const handleSubmitInquiry = async () => {
    setSubmitAttempted(true);
    if (!isFormValid) {
      setSubmitStatus("error");
      setSubmitError("Please fix the form errors before submitting.");
      return;
    }
    setSubmitStatus("submitting");
    setSubmitError(null);
    try {
      await createInquiry({
        expert_id: expert.id,
        expert_name: expert.name,
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        travel_dates: `${startDate} to ${endDate}`,
        group_size: groupSizeValue,
        enquiry_message: enquiryMessage.trim(),
        source: "expert_detail_form",
      });
      setSubmitStatus("success");
      setCustomerName("");
      setCustomerEmail("");
      setStartDate("");
      setEndDate("");
      setGroupSize("2");
      setCustomGroupSize("");
      setEnquiryMessage("");
      setSubmitAttempted(false);
    } catch (err: unknown) {
      setSubmitStatus("error");
      setSubmitError(err instanceof Error ? err.message : "Failed to submit enquiry.");
    }
  };

  const toggleBookmark = async () => {
    if (!user || bookmarkPending) return;
    const nextBookmarked = !isBookmarked;
    setIsBookmarked(nextBookmarked);
    setBookmarkPending(true);
    try {
      if (nextBookmarked) {
        await addBookmark("expert", expert.id);
      } else {
        await removeBookmark("expert", expert.id);
      }
    } catch {
      setIsBookmarked(!nextBookmarked);
    } finally {
      setBookmarkPending(false);
    }
  };

  return (
    <main className="mx-auto max-w-[1920px] bg-[#F0EDE9]">
      <StickyTopNavbar />
      <div className="page-px py-6 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[364px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Link to="/experts" className="mb-4 inline-flex items-center gap-2 text-[10px] text-[#777370]">
              <ArrowLeftIcon size={16} />
              Back to all experts
            </Link>
            <div className="overflow-hidden rounded-xl bg-[#F3EEE9]">
              <div className="h-[440px] w-full bg-[#d7d3cf]">
                {expert.profile_image_url ? (
                  <img src={expert.profile_image_url} alt={expert.name} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="p-4">
                <h1
                  className="text-[20px] leading-[1.33] text-[#2F2B28]"
                  style={{ fontFamily: '"Cocogoose Pro"', fontWeight: 300 }}
                >
                  {expert.name}
                </h1>
                <p className="mt-1 text-[12px] leading-[1.36] tracking-wide text-[#73706C]">{primaryRole}</p>
              </div>
              <div className="bg-[#e8eeea] px-4 py-2">
                <div className="inline-flex items-center gap-1 text-[#6c6a67]">
                  <StarRating rating={expert.experience_rating_max ?? 0} size={16} className="text-[#e3bf5d]" />
                  <span className="text-[18px] leading-[1.27] text-[#2F2B28]">
                    {(expert.experience_rating_max ?? 0).toFixed(1)}
                  </span>
                  <span className="text-[18px] leading-[1.27] text-[#73706C]">({reviewsCount} Reviews)</span>
                </div>
              </div>
              <div className="p-4">
                <p className="inline-flex items-center gap-1 text-[12px] leading-normal text-[#0B6E66]">
                  <HouseSimpleIcon size={14} />
                  Homestay by {expert.name.split(" ")[0]}
                </p>
                <p className="mt-2 text-[18px] leading-[1.27] text-[#2b2a28]">
                  {expert.homestay?.tagline ?? `Stay at ${expert.name.split(" ")[0]}&apos;s home at the forest edge.`}
                </p>
                {expert.homestay?.accommodation_id ? (
                  <Link
                    to={`/accommodations/${encodeURIComponent(expert.homestay.accommodation_id)}`}
                    className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-[#0B6E66] text-[#FAFAFA]"
                  >
                    Explore the Homestay
                    <ArrowRightIcon size={18} />
                  </Link>
                ) : null}
              </div>
            </div>
          </aside>

          <section className="min-w-0 rounded-xl bg-[#F0EDE9] lg:pr-2">
            <div className="rounded-xl bg-[#F0EDE9] pb-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[24px] leading-[1.42] font-bold text-[#2F2B28]">About</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[#67635f]">
                    <span className="inline-flex items-center gap-1">
                      <MapPinIcon size={14} />
                      {locationLabel}
                    </span>
                    <span>|</span>
                    <span>{expert.experience_years ?? 0} Years Experience</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void toggleBookmark()}
                    disabled={!user || bookmarkPending}
                    className="text-[#666] disabled:opacity-50"
                    aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                  >
                    <BookmarkSimpleIcon size={18} weight={isBookmarked ? "fill" : "regular"} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(true)}
                    className="text-[#666]"
                    aria-label="Share expert profile"
                  >
                    <ShareNetworkIcon size={18} />
                  </button>
                </div>
              </div>

              <p className="mt-5 max-w-[980px] text-[18px] leading-[1.27] text-[#2F2B28]">
                {expert.bio?.summary ?? "No bio available."}
              </p>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-[18px] leading-[1.27] font-bold text-[#AB863F]">Expertise</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {expertiseTags.map((tag) => (
                      <span key={tag} className="rounded bg-[#d8eadf] px-3 py-1 text-[10px] text-[#395149]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[18px] leading-[1.27] font-bold text-[#AB863F]">Languages Known</h3>
                  <p className="mt-3 inline-flex items-center gap-2 text-[#2f2c29]">
                    <GlobeHemisphereWestIcon size={16} />
                    {languageLabel}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-[20px] leading-[1.33] font-bold text-[#AB863F]">Curated Experiences</h3>
                <p
                  className="text-[20px] leading-[1.66] text-[#73706C]"
                  style={{ fontFamily: '"Cocogoose Pro"', fontWeight: 300 }}
                >
                  Journeys with {expert.name.split(" ")[0]}
                </p>
                <div className="mt-4 space-y-4">
                  {experiences.map((item) => {
                    const description = item.description ?? "No description available.";
                    const isExpanded = expandedExperienceIds.has(item.id);
                    const canExpand = description.length > 180;

                    return (
                      <article key={item.id} className="rounded-2xl bg-[#FBF9F6] p-4 shadow-[0_0_0_1px_#ece8e3]">
                      <div className="flex flex-col gap-4 md:flex-row">
                        <div className="h-48 w-full overflow-hidden rounded-xl bg-[#E6E0D9] md:h-auto md:w-[260px] md:shrink-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm text-[#857f79]">
                              Experience image unavailable
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <h4
                              className="text-[20px] leading-[1.33] text-[#2F2B28]"
                              style={{ fontFamily: '"Cocogoose Pro"', fontWeight: 300 }}
                            >
                              {item.title}
                            </h4>
                            <ShareNetworkIcon size={16} className="text-[#6a6763]" />
                          </div>
                          <div
                            className="mt-1 overflow-hidden transition-all duration-300 ease-in-out"
                            style={{ maxHeight: isExpanded || !canExpand ? "360px" : "92px" }}
                          >
                            <p className="text-[16px] leading-[1.4] text-[#2F2B28]">{description}</p>
                          </div>
                          {canExpand ? (
                            <button
                              type="button"
                              onClick={() => {
                                setExpandedExperienceIds((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(item.id)) {
                                    next.delete(item.id);
                                  } else {
                                    next.add(item.id);
                                  }
                                  return next;
                                });
                              }}
                              className="mt-1 text-[14px] leading-[1.2] text-[#6a6763] underline underline-offset-4"
                            >
                              {isExpanded ? "Show Less" : "Show More"}
                            </button>
                          ) : null}
                          <div className="mt-3 flex flex-wrap gap-2 text-[#5b5855]">
                            <span className="rounded bg-[#f0eeeb] px-3 py-1">{durationLabel(item)}</span>
                            <span className="rounded bg-[#f0eeeb] px-3 py-1">
                              {item.group_size?.min ?? 1} - {item.group_size?.max ?? 1}
                            </span>
                            <span className="rounded bg-[#f0eeeb] px-3 py-1">
                              ₹ {item.pricing?.amount ?? 0} / {item.pricing?.per ?? "person"}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="mt-4 inline-flex h-10 items-center gap-2 rounded border border-[#bdbab6] px-4 text-[#2f2c29]"
                          >
                            View Details
                            <ArrowRightIcon size={16} />
                          </button>
                        </div>
                      </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-[20px] leading-[1.33] font-bold text-[#AB863F]">Testimonials</h3>
                <p className="text-[24px] leading-[1.42] font-bold text-[#73706C]">What travellers say</p>
                <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                  {testimonials.map((item) => (
                    <article
                      key={item.id}
                      className="w-[320px] shrink-0 rounded-xl bg-[#f8f3ef] p-4 md:w-[360px]"
                    >
                      <StarRating rating={5} size={16} className="mb-3 inline-flex gap-1 text-[#e3bf5d]" />
                      <p className="text-[#4a4642]">{item.content}</p>
                      <p className="mt-6 font-medium text-[#2f2c29]">{item.author_name}</p>
                      <p className="text-[10px] text-[#6a6763]">{item.author_location ?? ""}</p>
                    </article>
                  ))}
                </div>
              </div>

              {fieldEntries.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-[18px] leading-[1.27] font-bold text-[#AB863F]">From the Field</h3>
                  <p className="text-[20px] leading-[1.33] font-semibold text-[#73706C]">
                    Visual stories, sightings, and experiences from the ground
                  </p>
                  <div className="mt-4 grid grid-flow-col auto-cols-[180px] grid-rows-2 gap-3 overflow-x-auto pb-2 md:auto-cols-[220px]">
                    {fieldEntries.map((item) => (
                      <article
                        key={item.id}
                        className="h-[160px] overflow-hidden rounded-md bg-[#d8d4cf] md:h-[190px]"
                        title={item.title}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveImage({ url: item.media_url, title: item.title })}
                          className="h-full w-full"
                        >
                          <img
                            src={item.media_url}
                            alt={item.title}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              <section className="mt-10 rounded-[20px] bg-[#FBF9F6] p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-[20px] leading-[1.33] font-semibold text-[#2F2B28]">
                      Make an Enquiry via Wildbook
                    </h3>
                    <p className="mt-4 text-[18px] leading-[1.27] text-[#2F2B28]">
                      Not sure which experience is right for you? Have a question about timing, group
                      size, or what to expect?
                      <br />
                      Send {expert.name.split(" ")[0]} a message - Wildbook will forward your enquiry
                      within 24 hours.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-[14px] leading-[1.33] font-medium text-[#2F2B28]">
                          Your Name <span className="text-[#D34747]">*</span>
                        </span>
                        <input
                          type="text"
                          placeholder="Your full name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="h-[56px] w-full rounded bg-[#F6F4F0] px-4 text-[16px] text-[#2F2B28] placeholder:text-[#2F2B28]/40 outline-none"
                        />
                        {submitAttempted && validationErrors.customerName && (
                          <p className="mt-1 text-[10px] text-red-600">{validationErrors.customerName}</p>
                        )}
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[14px] leading-[1.33] font-medium text-[#2F2B28]">
                          Email <span className="text-[#D34747]">*</span>
                        </span>
                        <input
                          type="email"
                          placeholder="Email address"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="h-[56px] w-full rounded bg-[#F6F4F0] px-4 text-[16px] text-[#2F2B28] placeholder:text-[#2F2B28]/40 outline-none"
                        />
                        {submitAttempted && validationErrors.customerEmail && (
                          <p className="mt-1 text-[10px] text-red-600">{validationErrors.customerEmail}</p>
                        )}
                      </label>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-[14px] leading-[1.33] font-medium text-[#2F2B28]">
                          Start Date <span className="text-[#D34747]">*</span>
                        </span>
                        <div className="flex h-[56px] items-center justify-between rounded bg-[#F6F4F0] px-4">
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-transparent text-[16px] text-[#2F2B28] placeholder:text-[#2F2B28]/40 outline-none"
                          />
                          <CalendarDotsIcon size={24} className="text-[#343330]" />
                        </div>
                        {submitAttempted && validationErrors.startDate && (
                          <p className="mt-1 text-[10px] text-red-600">{validationErrors.startDate}</p>
                        )}
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[14px] leading-[1.33] font-medium text-[#2F2B28]">
                          End Date <span className="text-[#D34747]">*</span>
                        </span>
                        <div className="flex h-[56px] items-center justify-between rounded bg-[#F6F4F0] px-4">
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-transparent text-[16px] text-[#2F2B28] placeholder:text-[#2F2B28]/40 outline-none"
                          />
                          <CalendarDotsIcon size={24} className="text-[#343330]" />
                        </div>
                        {submitAttempted && validationErrors.endDate && (
                          <p className="mt-1 text-[10px] text-red-600">{validationErrors.endDate}</p>
                        )}
                      </label>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-[14px] leading-[1.33] font-medium text-[#2F2B28]">
                          Number of People <span className="text-[#D34747]">*</span>
                        </span>
                        <div className="flex h-[56px] items-center justify-between rounded bg-[#F6F4F0] px-4">
                          <select
                            value={groupSize}
                            onChange={(e) => setGroupSize(e.target.value)}
                            className="w-full appearance-none bg-transparent text-[16px] text-[#2F2B28] outline-none"
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6+">6+</option>
                            <option value="custom">Custom</option>
                          </select>
                          <CaretDownIcon size={24} className="text-[#343330]" />
                        </div>
                        {submitAttempted && validationErrors.groupSize && (
                          <p className="mt-1 text-[10px] text-red-600">{validationErrors.groupSize}</p>
                        )}
                      </label>
                      {groupSize === "custom" ? (
                        <label className="block">
                          <span className="mb-1 block text-[14px] leading-[1.33] font-medium text-[#2F2B28]">
                            Custom People Count <span className="text-[#D34747]">*</span>
                          </span>
                          <input
                            type="number"
                            min={1}
                            value={customGroupSize}
                            onChange={(e) => setCustomGroupSize(e.target.value)}
                            className="h-[56px] w-full rounded bg-[#F6F4F0] px-4 text-[16px] text-[#2F2B28] outline-none"
                          />
                        </label>
                      ) : (
                        <div />
                      )}
                    </div>

                    <label className="block">
                      <span className="mb-1 block text-[14px] leading-[1.33] font-medium text-[#2F2B28]">
                        Your Enquiry <span className="text-[#D34747]">*</span>
                      </span>
                      <textarea
                        placeholder={`Tell ${expert.name.split(" ")[0]} about your visit - your interests, what your hoping to see...`}
                        rows={4}
                        value={enquiryMessage}
                        onChange={(e) => setEnquiryMessage(e.target.value)}
                        className="w-full rounded bg-[#F6F4F0] px-4 py-3 text-[16px] text-[#2F2B28] placeholder:text-[#2F2B28]/40 outline-none"
                      />
                      {submitAttempted && validationErrors.enquiryMessage && (
                        <p className="mt-1 text-[10px] text-red-600">{validationErrors.enquiryMessage}</p>
                      )}
                    </label>
                  </div>

                  <div className="space-y-2 text-center">
                    <button
                      type="button"
                      onClick={() => void handleSubmitInquiry()}
                      disabled={submitStatus === "submitting" || !isFormValid}
                      className="h-12 w-full rounded bg-[#0B6E66] text-[14px] font-medium text-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitStatus === "submitting" ? "Submitting..." : "Submit Enquiry"}
                    </button>
                    {submitStatus === "success" && (
                      <p className="text-[12px] text-[#0B6E66]">
                        Enquiry submitted successfully. Our team will get back to you shortly.
                      </p>
                    )}
                    {submitStatus === "error" && submitError && (
                      <p className="text-[12px] text-red-600">{submitError}</p>
                    )}
                    <p className="text-[12px] text-[#73706C]">
                      This is an enquiry, not a booking. Once you connect, you can choose to reserve
                      directly through Wildbook.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
      {activeImage && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setActiveImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.title}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-black"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              onClick={() => setActiveImage(null)}
              aria-label="Close image preview"
            >
              <XIcon size={20} />
            </button>
            <img
              src={activeImage.url}
              alt={activeImage.title}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}
      <ShareLinkModal
        isOpen={isShareModalOpen}
        path={`/experts/${expert.slug || expert.id}`}
        title="Share expert profile"
        onClose={() => setIsShareModalOpen(false)}
      />
    </main>
  );
}

