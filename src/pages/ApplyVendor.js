import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Sparkles,
  Copy,
  Send,
  Calendar,
  MapPin,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import crudApi from '../services/crudApi'
import { useAuth } from '../context/AuthContext'

const TERRACOTTA = 'oklch(45% 0.15 25)'
const TERRACOTTA_DEEP = 'oklch(35% 0.12 15)'
const TEXT_PRIMARY = 'oklch(25% 0.015 15)'
const TEXT_SECONDARY = 'oklch(35% 0.02 15)'
const TEXT_TERTIARY = 'oklch(45% 0.02 15)'
const SURFACE = 'oklch(99% 0.005 85)'
const SURFACE_ALT = 'oklch(96% 0.008 85)'
const BORDER = 'oklch(88% 0.01 85)'
const BORDER_LIGHT = 'oklch(90% 0.01 85)'
const HEADING_FONT = "'Space Grotesk', 'Inter', sans-serif"

export default function ApplyVendor() {
  const { user, isAuthed } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const preselectedEvent = params.get('event')

  const [events, setEvents] = useState([])
  const [eventId, setEventId] = useState(preselectedEvent || '')
  const [profile, setProfile] = useState(null)
  const [booths, setBooths] = useState([])
  const [sponsorships, setSponsorships] = useState([])

  const [boothId, setBoothId] = useState('')
  const [sponsorshipId, setSponsorshipId] = useState('')
  const [applicationType, setApplicationType] = useState('Vendor')
  const [notes, setNotes] = useState('')
  const [proposal, setProposal] = useState('')

  // Lightweight inline profile used as a fallback when the user has no saved
  // sme_profile yet. Anything they type here is folded into the proposal.
  const [draftProfile, setDraftProfile] = useState({
    business_name: '',
    business_type: 'food_beverage',
    business_description: '',
    location: '',
  })

  const [loadingEvents, setLoadingEvents] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [proposalError, setProposalError] = useState(null)
  const [submittedId, setSubmittedId] = useState(null)
  const [copied, setCopied] = useState(false)

  // Load events list
  useEffect(() => {
    let active = true
    crudApi
      .listEvents()
      .then((res) => {
        const list = res?.data || res || []
        if (active) setEvents(Array.isArray(list) ? list : [])
      })
      .catch(() => active && setEvents([]))
      .finally(() => active && setLoadingEvents(false))
    return () => {
      active = false
    }
  }, [])

  // Load profile when authed
  useEffect(() => {
    if (!user?.id) return
    crudApi
      .getSme(user.id)
      .then((res) => setProfile(res?.data || null))
      .catch(() => setProfile(null))
  }, [user])

  // Load booths + sponsorships when event changes
  useEffect(() => {
    if (!eventId) {
      setBooths([])
      setSponsorships([])
      setBoothId('')
      setSponsorshipId('')
      return
    }
    Promise.all([
      crudApi.listBooths(eventId).catch(() => ({ data: [] })),
      crudApi.listSponsorships(eventId).catch(() => ({ data: [] })),
    ]).then(([b, s]) => {
      setBooths(b?.data || [])
      setSponsorships(s?.data || [])
    })
  }, [eventId])

  const selectedEvent = useMemo(
    () => events.find((e) => (e.bazaar_id || e.id) === eventId),
    [events, eventId],
  )

  const selectedBooth = useMemo(
    () => booths.find((b) => b.booth_id === boothId) || null,
    [booths, boothId],
  )

  const selectedSponsorship = useMemo(
    () => sponsorships.find((s) => s.sponsorship_id === sponsorshipId) || null,
    [sponsorships, sponsorshipId],
  )

  // Use the saved profile when available, otherwise fall back to whatever
  // the user typed into the inline draft profile fields.
  const effectiveProfile = useMemo(() => {
    if (profile?.business_name) return profile
    if (draftProfile.business_name.trim()) {
      return {
        business_name: draftProfile.business_name.trim(),
        business_type: draftProfile.business_type,
        business_description: draftProfile.business_description.trim() || null,
        location: draftProfile.location.trim() || null,
        email: user?.email || null,
      }
    }
    return null
  }, [profile, draftProfile, user])

  const generateProposal = async () => {
    setError(null)
    setProposalError(null)
    if (!selectedEvent) {
      setProposalError('Pick an event in step 1 first.')
      return
    }
    if (!effectiveProfile) {
      setProposalError(
        'Add a business name in the sidebar so the AI can personalize the proposal.',
      )
      return
    }

    setGenerating(true)
    try {
      const res = await crudApi.generateProposal({
        profile: effectiveProfile,
        event: selectedEvent,
        booth: selectedBooth,
        sponsorship: selectedSponsorship,
        application_type: applicationType,
        notes,
      })
      const text = (res?.data?.proposal || res?.proposal || '').trim()
      if (!text) {
        setProposalError('The AI returned an empty response. Try again.')
        return
      }
      setProposal(text)
    } catch (err) {
      setProposalError(err.message || 'Could not generate proposal.')
    } finally {
      setGenerating(false)
    }
  }

  const submitApplication = async (e) => {
    e.preventDefault()
    setError(null)
    if (!isAuthed) {
      navigate('/login', { state: { from: '/apply' } })
      return
    }
    if (!selectedEvent) return setError('Pick an event first.')

    setSubmitting(true)
    try {
      const res = await crudApi.submitApplication({
        sme_id: user.id,
        event_id: selectedEvent.bazaar_id || selectedEvent.id,
        application_type: applicationType,
        bazaar_booth_id: boothId || null,
        sponsorship_package_id: sponsorshipId || null,
        business_documents: {
          proposal: proposal || null,
          notes: notes || null,
          draft_profile: !profile && effectiveProfile ? effectiveProfile : null,
        },
      })
      const created = Array.isArray(res?.data) ? res.data[0] : res?.data
      setSubmittedId(created?.application_id || 'submitted')
    } catch (err) {
      setError(err.message || 'Could not submit application.')
    } finally {
      setSubmitting(false)
    }
  }

  const copyProposal = async () => {
    if (!proposal) return
    try {
      await navigator.clipboard.writeText(proposal)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch (_) {}
  }

  // Success state
  if (submittedId) {
    return (
      <main
        className="min-h-[calc(100vh-72px)] flex items-center justify-center px-6 py-16"
        style={{ background: 'oklch(97% 0.008 85)' }}
      >
        <div
          className="max-w-lg w-full rounded-2xl p-10 text-center"
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            boxShadow: '0 1px 3px oklch(0% 0 0 / 0.06)',
          }}
        >
          <div
            className="w-14 h-14 mx-auto mb-5 rounded-full flex items-center justify-center"
            style={{
              background: 'oklch(95% 0.05 145)',
              color: 'oklch(45% 0.18 145)',
            }}
          >
            <CheckCircle2 size={28} />
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: HEADING_FONT,
              letterSpacing: '-0.02em',
              color: TEXT_PRIMARY,
            }}
          >
            Application submitted
          </h1>
          <p className="text-sm mb-8" style={{ color: TEXT_TERTIARY }}>
            We sent your proposal to the event organizer. You can track status
            in your profile.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/profile"
              className="px-5 py-2.5 rounded-full font-semibold text-sm"
              style={{ background: TERRACOTTA, color: SURFACE }}
            >
              View profile
            </Link>
            <Link
              to="/events"
              className="px-5 py-2.5 rounded-full font-semibold text-sm"
              style={{
                background: 'transparent',
                color: TEXT_PRIMARY,
                border: `1px solid ${BORDER}`,
              }}
            >
              More events
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="px-6 py-12" style={{ background: 'oklch(97% 0.008 85)' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p
            className="text-xs font-semibold uppercase mb-3"
            style={{ color: TERRACOTTA, letterSpacing: '0.12em' }}
          >
            Vendor application
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{
              fontFamily: HEADING_FONT,
              letterSpacing: '-0.025em',
              color: TEXT_PRIMARY,
            }}
          >
            Apply to a bazaar
          </h1>
          <p
            className="text-base max-w-2xl"
            style={{ color: TEXT_SECONDARY, lineHeight: 1.55 }}
          >
            Choose the event, pick a booth or sponsorship tier, and let the
            assistant draft your proposal. Edit anything you like before
            submitting.
          </p>
        </div>

        {!isAuthed && (
          <div
            className="mb-6 px-5 py-4 rounded-xl flex items-center justify-between flex-wrap gap-3"
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER_LIGHT}`,
            }}
          >
            <p className="text-sm" style={{ color: TEXT_SECONDARY }}>
              Sign in to submit your application. You can still draft a proposal
              while signed out.
            </p>
            <Link
              to="/login"
              state={{ from: '/apply' }}
              className="px-4 py-2 rounded-full font-semibold text-sm"
              style={{ background: TEXT_PRIMARY, color: SURFACE }}
            >
              Sign in
            </Link>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-6 px-5 py-4 rounded-xl text-sm"
            style={{
              background: 'oklch(95% 0.05 25)',
              color: 'oklch(35% 0.08 25)',
              border: '1px solid oklch(85% 0.06 25)',
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={submitApplication}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6"
        >
          {/* LEFT column: form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Event picker */}
            <Card title="1. Pick an event">
              <SelectField
                label="Event"
                name="event"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
              >
                <option value="">
                  {loadingEvents ? 'Loading events...' : 'Select an event'}
                </option>
                {events.map((ev) => {
                  const id = ev.bazaar_id || ev.id
                  return (
                    <option key={id} value={id}>
                      {ev.event_name} ({ev.event_date || 'TBC'})
                    </option>
                  )
                })}
              </SelectField>

              {selectedEvent && (
                <div
                  className="mt-4 p-4 rounded-xl text-sm space-y-2"
                  style={{
                    background: SURFACE_ALT,
                    border: `1px solid ${BORDER_LIGHT}`,
                  }}
                >
                  <p
                    className="font-semibold text-base"
                    style={{ color: TEXT_PRIMARY, fontFamily: HEADING_FONT }}
                  >
                    {selectedEvent.event_name}
                  </p>
                  <p
                    className="flex items-center gap-2"
                    style={{ color: TEXT_TERTIARY }}
                  >
                    <MapPin size={14} />
                    {selectedEvent.location}
                    {selectedEvent.venue_name
                      ? ` · ${selectedEvent.venue_name}`
                      : ''}
                  </p>
                  <p
                    className="flex items-center gap-2"
                    style={{ color: TEXT_TERTIARY }}
                  >
                    <Calendar size={14} />
                    {selectedEvent.event_date || 'Date to be confirmed'}
                  </p>
                  {selectedEvent.event_description && (
                    <p
                      className="pt-2"
                      style={{ color: TEXT_SECONDARY, lineHeight: 1.55 }}
                    >
                      {selectedEvent.event_description}
                    </p>
                  )}
                </div>
              )}
            </Card>

            {/* Application type + booth/sponsorship */}
            <Card title="2. What are you applying for?">
              <div className="flex flex-wrap gap-2 mb-5">
                {['Vendor', 'Sponsorship', 'Both'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setApplicationType(opt)}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                    style={{
                      background: applicationType === opt ? TERRACOTTA : SURFACE,
                      color: applicationType === opt ? SURFACE : TEXT_SECONDARY,
                      border: `1px solid ${
                        applicationType === opt ? TERRACOTTA : BORDER
                      }`,
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {(applicationType === 'Vendor' || applicationType === 'Both') && (
                <SelectField
                  label="Booth"
                  name="booth"
                  value={boothId}
                  onChange={(e) => setBoothId(e.target.value)}
                >
                  <option value="">No specific booth</option>
                  {booths
                    .filter((b) => b.is_available !== false)
                    .map((b) => (
                      <option key={b.booth_id} value={b.booth_id}>
                        Booth {b.booth_number || b.booth_id.slice(0, 6)} ·{' '}
                        {b.price ? `Rp ${Number(b.price).toLocaleString()}` : 'Price TBC'}
                      </option>
                    ))}
                </SelectField>
              )}

              {(applicationType === 'Sponsorship' || applicationType === 'Both') && (
                <div className="mt-4">
                  <SelectField
                    label="Sponsorship tier"
                    name="sponsorship"
                    value={sponsorshipId}
                    onChange={(e) => setSponsorshipId(e.target.value)}
                  >
                    <option value="">No sponsorship</option>
                    {sponsorships.map((s) => (
                      <option key={s.sponsorship_id} value={s.sponsorship_id}>
                        {s.package_name || s.tier_level} ·{' '}
                        {s.price ? `Rp ${Number(s.price).toLocaleString()}` : 'Price TBC'}
                      </option>
                    ))}
                  </SelectField>
                </div>
              )}
            </Card>

            {/* AI Proposal */}
            <Card
              title="3. Draft your proposal"
              accent={
                <button
                  type="button"
                  onClick={generateProposal}
                  disabled={generating || !selectedEvent}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    background: TERRACOTTA,
                    color: SURFACE,
                    opacity: generating || !selectedEvent ? 0.5 : 1,
                  }}
                >
                  {generating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  {generating ? 'Drafting...' : 'Generate with AI'}
                </button>
              }
            >
              {proposalError && (
                <div
                  role="alert"
                  className="mb-4 px-4 py-3 rounded-lg text-sm"
                  style={{
                    background: 'oklch(95% 0.05 25)',
                    color: 'oklch(35% 0.08 25)',
                    border: '1px solid oklch(85% 0.06 25)',
                  }}
                >
                  {proposalError}
                </div>
              )}
              {generating && !proposal && (
                <div
                  className="mb-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
                  style={{
                    background: SURFACE_ALT,
                    color: TEXT_SECONDARY,
                    border: `1px solid ${BORDER_LIGHT}`,
                  }}
                >
                  <Loader2 size={14} className="animate-spin" />
                  Calling Bedrock. This usually takes 5-15 seconds.
                </div>
              )}
              <label
                className="block text-xs font-semibold mb-2 uppercase"
                style={{ color: TEXT_TERTIARY, letterSpacing: '0.08em' }}
              >
                Notes for the AI (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="E.g. We specialize in Padang street food, can serve 200 covers/hour, need a booth with electricity."
                className="w-full px-4 py-3 rounded-xl outline-none text-sm mb-4"
                style={{
                  background: SURFACE_ALT,
                  border: `2px solid ${BORDER}`,
                  color: TEXT_PRIMARY,
                }}
                onFocus={(e) => (e.target.style.borderColor = TERRACOTTA)}
                onBlur={(e) => (e.target.style.borderColor = BORDER)}
              />

              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-xs font-semibold uppercase"
                  style={{ color: TEXT_TERTIARY, letterSpacing: '0.08em' }}
                >
                  Proposal
                </label>
                <button
                  type="button"
                  onClick={copyProposal}
                  disabled={!proposal}
                  className="text-xs font-semibold inline-flex items-center gap-1.5"
                  style={{
                    color: proposal ? TERRACOTTA : TEXT_TERTIARY,
                    opacity: proposal ? 1 : 0.5,
                  }}
                >
                  <Copy size={12} />
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <textarea
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                rows={12}
                placeholder="Click 'Generate with AI' to draft a proposal, or write your own here."
                className="w-full px-4 py-3 rounded-xl outline-none text-sm leading-relaxed"
                style={{
                  background: SURFACE,
                  border: `2px solid ${BORDER}`,
                  color: TEXT_PRIMARY,
                  minHeight: '320px',
                }}
                onFocus={(e) => (e.target.style.borderColor = TERRACOTTA)}
                onBlur={(e) => (e.target.style.borderColor = BORDER)}
              />
            </Card>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !selectedEvent}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm"
                style={{
                  background: TERRACOTTA_DEEP,
                  color: SURFACE,
                  opacity: submitting || !selectedEvent ? 0.5 : 1,
                }}
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {submitting ? 'Submitting...' : 'Submit application'}
              </button>
            </div>
          </div>

          {/* RIGHT column: profile sidebar */}
          <aside className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-5">
              <Card title="Your business profile">
                {profile ? (
                  <dl className="space-y-3 text-sm">
                    <Row label="Business" value={profile.business_name} />
                    <Row label="Type" value={profile.business_type} />
                    <Row label="Location" value={profile.location} />
                    <Row label="Email" value={profile.email} />
                    <Row label="Phone" value={profile.phone} />
                    {profile.business_description && (
                      <div>
                        <p
                          className="text-xs font-semibold uppercase mb-1"
                          style={{
                            color: TEXT_TERTIARY,
                            letterSpacing: '0.08em',
                          }}
                        >
                          About
                        </p>
                        <p style={{ color: TEXT_SECONDARY, lineHeight: 1.55 }}>
                          {profile.business_description}
                        </p>
                      </div>
                    )}
                  </dl>
                ) : (
                  <>
                    <p
                      className="text-sm mb-4"
                      style={{ color: TEXT_TERTIARY, lineHeight: 1.55 }}
                    >
                      No saved profile yet. Fill these quick details so the AI
                      can personalize your proposal. You can save the full
                      profile later.
                    </p>
                    <DraftField
                      label="Business name"
                      value={draftProfile.business_name}
                      onChange={(v) =>
                        setDraftProfile({ ...draftProfile, business_name: v })
                      }
                      placeholder="e.g. Warung Padang Sederhana"
                    />
                    <div className="mt-3">
                      <DraftSelect
                        label="Type"
                        value={draftProfile.business_type}
                        onChange={(v) =>
                          setDraftProfile({ ...draftProfile, business_type: v })
                        }
                        options={[
                          ['food_beverage', 'Food & Beverage'],
                          ['retail', 'Retail'],
                          ['services', 'Services'],
                          ['fashion', 'Fashion'],
                          ['health_wellness', 'Health & Wellness'],
                          ['entertainment', 'Entertainment'],
                          ['other', 'Other'],
                        ]}
                      />
                    </div>
                    <div className="mt-3">
                      <DraftField
                        label="Location"
                        value={draftProfile.location}
                        onChange={(v) =>
                          setDraftProfile({ ...draftProfile, location: v })
                        }
                        placeholder="City, region"
                      />
                    </div>
                    <div className="mt-3">
                      <DraftTextarea
                        label="What you sell / your edge"
                        value={draftProfile.business_description}
                        onChange={(v) =>
                          setDraftProfile({
                            ...draftProfile,
                            business_description: v,
                          })
                        }
                        placeholder="One or two sentences about your business: signature items, capacity, what makes you a good fit."
                      />
                    </div>
                  </>
                )}
                <Link
                  to="/profile"
                  className="inline-block mt-4 text-sm font-semibold"
                  style={{ color: TERRACOTTA }}
                >
                  {profile ? 'Edit profile →' : 'Save full profile →'}
                </Link>
              </Card>

              <Card title="Tip">
                <p
                  className="text-sm"
                  style={{ color: TEXT_SECONDARY, lineHeight: 1.6 }}
                >
                  The AI proposal uses your business details, the event, and
                  any booth or sponsorship you picked. Add specifics in the
                  notes field for the strongest draft.
                </p>
              </Card>
            </div>
          </aside>
        </form>
      </div>
    </main>
  )
}

function Card({ title, accent, children }) {
  return (
    <section
      className="rounded-2xl p-6 sm:p-7"
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER_LIGHT}`,
        boxShadow: '0 1px 3px oklch(0% 0 0 / 0.04)',
      }}
    >
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <h2
          className="text-lg font-bold"
          style={{
            fontFamily: HEADING_FONT,
            letterSpacing: '-0.02em',
            color: TEXT_PRIMARY,
          }}
        >
          {title}
        </h2>
        {accent}
      </div>
      {children}
    </section>
  )
}

function SelectField({ label, name, children, ...rest }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-semibold mb-2 uppercase"
        style={{ color: TEXT_TERTIARY, letterSpacing: '0.08em' }}
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        {...rest}
        className="w-full px-4 py-3 rounded-xl outline-none text-sm"
        style={{
          background: SURFACE_ALT,
          border: `2px solid ${BORDER}`,
          color: TEXT_PRIMARY,
        }}
        onFocus={(e) => (e.target.style.borderColor = TERRACOTTA)}
        onBlur={(e) => (e.target.style.borderColor = BORDER)}
      >
        {children}
      </select>
    </div>
  )
}

function Row({ label, value }) {
  if (!value) return null
  return (
    <div>
      <dt
        className="text-xs font-semibold uppercase mb-0.5"
        style={{ color: TEXT_TERTIARY, letterSpacing: '0.08em' }}
      >
        {label}
      </dt>
      <dd style={{ color: TEXT_PRIMARY }}>{value}</dd>
    </div>
  )
}

function DraftField({ label, value, onChange, ...rest }) {
  return (
    <div>
      <label
        className="block text-xs font-semibold mb-2 uppercase"
        style={{ color: TEXT_TERTIARY, letterSpacing: '0.08em' }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
        className="w-full px-3 py-2.5 rounded-lg outline-none text-sm"
        style={{
          background: SURFACE_ALT,
          border: `2px solid ${BORDER}`,
          color: TEXT_PRIMARY,
        }}
        onFocus={(e) => (e.target.style.borderColor = TERRACOTTA)}
        onBlur={(e) => (e.target.style.borderColor = BORDER)}
      />
    </div>
  )
}

function DraftSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label
        className="block text-xs font-semibold mb-2 uppercase"
        style={{ color: TEXT_TERTIARY, letterSpacing: '0.08em' }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg outline-none text-sm"
        style={{
          background: SURFACE_ALT,
          border: `2px solid ${BORDER}`,
          color: TEXT_PRIMARY,
        }}
        onFocus={(e) => (e.target.style.borderColor = TERRACOTTA)}
        onBlur={(e) => (e.target.style.borderColor = BORDER)}
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  )
}

function DraftTextarea({ label, value, onChange, ...rest }) {
  return (
    <div>
      <label
        className="block text-xs font-semibold mb-2 uppercase"
        style={{ color: TEXT_TERTIARY, letterSpacing: '0.08em' }}
      >
        {label}
      </label>
      <textarea
        value={value}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
        className="w-full px-3 py-2.5 rounded-lg outline-none text-sm"
        style={{
          background: SURFACE_ALT,
          border: `2px solid ${BORDER}`,
          color: TEXT_PRIMARY,
        }}
        onFocus={(e) => (e.target.style.borderColor = TERRACOTTA)}
        onBlur={(e) => (e.target.style.borderColor = BORDER)}
      />
    </div>
  )
}
