import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Compass, FileText, Users } from 'lucide-react'
import HeroShapes from '../components/HeroShapes'
import crudApi from '../services/crudApi'

const TERRACOTTA = 'oklch(45% 0.15 25)'
const TERRACOTTA_DEEP = 'oklch(35% 0.12 15)'
const TEXT_PRIMARY = 'oklch(25% 0.015 15)'
const TEXT_SECONDARY = 'oklch(35% 0.02 15)'
const TEXT_TERTIARY = 'oklch(45% 0.02 15)'
const SURFACE = 'oklch(99% 0.005 85)'
const SURFACE_ALT = 'oklch(96% 0.008 85)'
const BORDER_LIGHT = 'oklch(90% 0.01 85)'
const HEADING_FONT = "'Space Grotesk', 'Inter', sans-serif"

const QUICK_PROMPTS = [
  'Weekend bazaars in Jakarta',
  'Food festivals under Rp 5 million',
  'Sponsorship opportunities',
  'Booths with electricity',
]

const HOW_IT_WORKS = [
  {
    icon: Compass,
    title: 'Discover events that fit',
    body: 'Search in plain language. We surface bazaars, festivals, and markets that match your booth size, budget, and schedule.',
  },
  {
    icon: FileText,
    title: 'Apply with an AI proposal',
    body: 'Pick an event, fill three fields, and let the assistant draft a vendor proposal grounded in your business profile.',
  },
  {
    icon: Users,
    title: 'Track every application',
    body: 'See submitted, under review, and approved applications in one place. Manage your booths and sponsorships without spreadsheets.',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [events, setEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)

  useEffect(() => {
    let active = true
    crudApi
      .listEvents()
      .then((res) => {
        if (!active) return
        const list = res?.data || res || []
        setEvents(Array.isArray(list) ? list.slice(0, 6) : [])
      })
      .catch(() => active && setEvents([]))
      .finally(() => active && setLoadingEvents(false))
    return () => {
      active = false
    }
  }, [])

  const handleSearch = (text) => {
    const q = (text ?? query).trim()
    if (!q) return navigate('/events')
    navigate(`/events?q=${encodeURIComponent(q)}`)
  }

  return (
    <main style={{ background: 'oklch(97% 0.008 85)' }}>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <HeroShapes />
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
          <p
            className="text-sm font-semibold tracking-wider uppercase mb-5"
            style={{ color: TERRACOTTA, letterSpacing: '0.12em' }}
          >
            For SMEs and event organizers
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            style={{
              fontFamily: HEADING_FONT,
              letterSpacing: '-0.03em',
              color: TEXT_PRIMARY,
              lineHeight: 1.05,
            }}
          >
            Find the bazaar your{' '}
            <span style={{ color: TERRACOTTA }}>booth belongs in.</span>
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto mb-10"
            style={{ color: TEXT_SECONDARY, lineHeight: 1.6 }}
          >
            Ambatuwin Cendikiawan matches food vendors and SMEs with the right
            events. Search by what you actually care about, apply with an
            AI-assisted proposal, and skip the spreadsheet hunt.
          </p>

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
            className="max-w-2xl mx-auto"
          >
            <div
              className="flex items-center rounded-full pl-6 pr-2 py-2 shadow-sm"
              style={{
                background: SURFACE,
                border: `1px solid ${BORDER_LIGHT}`,
                boxShadow: '0 1px 3px oklch(0% 0 0 / 0.06)',
              }}
            >
              <Search size={20} style={{ color: TEXT_TERTIARY }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try: weekend bazaar in Jakarta with electricity"
                className="flex-1 bg-transparent outline-none px-3 py-3 text-base"
                style={{ color: TEXT_PRIMARY }}
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full font-semibold text-sm transition-transform"
                style={{
                  background: TERRACOTTA,
                  color: SURFACE,
                  letterSpacing: '-0.01em',
                  boxShadow: '0 2px 8px oklch(45% 0.15 25 / 0.25)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                Search
              </button>
            </div>

            {/* Quick prompts */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setQuery(p)
                    handleSearch(p)
                  }}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{
                    background: SURFACE,
                    border: `1px solid ${BORDER_LIGHT}`,
                    color: TEXT_SECONDARY,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = SURFACE_ALT
                    e.currentTarget.style.color = TEXT_PRIMARY
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = SURFACE
                    e.currentTarget.style.color = TEXT_SECONDARY
                  }}
                >
                  ↳ {p}
                </button>
              ))}
            </div>
          </form>

          <Link
            to="/apply"
            className="inline-flex items-center gap-2 mt-12 px-7 py-3 rounded-full font-semibold text-sm"
            style={{
              background: TEXT_PRIMARY,
              color: SURFACE,
              letterSpacing: '-0.01em',
            }}
          >
            Apply as a vendor
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ---------- DARK FEATURE PANEL ---------- */}
      <section className="px-6 py-12">
        <div
          className="max-w-6xl mx-auto rounded-3xl px-8 py-14 sm:px-14 sm:py-20 relative overflow-hidden"
          style={{
            background: TERRACOTTA_DEEP,
            color: SURFACE,
          }}
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.025em' }}
            >
              How Ambatuwin works
            </h2>
            <p
              style={{
                color: 'oklch(85% 0.01 85)',
                lineHeight: 1.6,
                fontSize: '1.0625rem',
              }}
            >
              Three steps. No demos to schedule, no sales calls, no marketplace
              fees. Just the matching engine and the application flow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="rounded-2xl p-7 flex flex-col"
                style={{
                  background: 'oklch(28% 0.04 20)',
                  border: '1px solid oklch(38% 0.06 20)',
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: 'oklch(55% 0.18 35)',
                    color: SURFACE,
                  }}
                >
                  <Icon size={20} />
                </div>
                <p
                  className="text-xs font-semibold uppercase mb-2"
                  style={{
                    color: 'oklch(75% 0.08 35)',
                    letterSpacing: '0.1em',
                  }}
                >
                  Step {i + 1}
                </p>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{
                    fontFamily: HEADING_FONT,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: 'oklch(82% 0.01 85)',
                    lineHeight: 1.55,
                    fontSize: '0.9375rem',
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
              style={{ background: SURFACE, color: TEXT_PRIMARY }}
            >
              Explore events
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- EVENT CARDS ---------- */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{
                  fontFamily: HEADING_FONT,
                  letterSpacing: '-0.025em',
                  color: TEXT_PRIMARY,
                }}
              >
                Upcoming events
              </h2>
              <p style={{ color: TEXT_TERTIARY }}>
                A snapshot of bazaars accepting vendor applications.
              </p>
            </div>
            <Link
              to="/events"
              className="text-sm font-semibold inline-flex items-center gap-1"
              style={{ color: TERRACOTTA }}
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          {loadingEvents ? (
            <div
              className="text-center py-16 rounded-2xl"
              style={{
                background: SURFACE,
                border: `1px solid ${BORDER_LIGHT}`,
                color: TEXT_TERTIARY,
              }}
            >
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div
              className="text-center py-16 rounded-2xl"
              style={{
                background: SURFACE,
                border: `1px solid ${BORDER_LIGHT}`,
                color: TEXT_TERTIARY,
              }}
            >
              No events yet. Once organizers publish events they show up here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((ev) => (
                <Link
                  key={ev.bazaar_id || ev.id}
                  to={`/apply?event=${ev.bazaar_id || ev.id}`}
                  className="group rounded-2xl overflow-hidden flex flex-col transition-transform"
                  style={{
                    background: SURFACE,
                    border: `1px solid ${BORDER_LIGHT}`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {/* Card top accent block (no photo needed) */}
                  <div
                    className="h-32 relative"
                    style={{
                      background:
                        'linear-gradient(135deg, oklch(55% 0.18 35) 0%, oklch(45% 0.15 25) 100%)',
                    }}
                  >
                    <span
                      className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: SURFACE,
                        color: TERRACOTTA_DEEP,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {ev.event_type || 'Bazaar'}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3
                      className="text-base font-bold mb-1.5 line-clamp-2"
                      style={{
                        fontFamily: HEADING_FONT,
                        color: TEXT_PRIMARY,
                        letterSpacing: '-0.015em',
                      }}
                    >
                      {ev.event_name}
                    </h3>
                    <p
                      className="text-sm mb-4"
                      style={{ color: TEXT_TERTIARY }}
                    >
                      {ev.location || ev.venue_name || 'Location TBC'} ·{' '}
                      {ev.event_date || 'Date TBC'}
                    </p>
                    <p
                      className="text-sm line-clamp-3 mb-5"
                      style={{ color: TEXT_SECONDARY, lineHeight: 1.55 }}
                    >
                      {ev.event_description ||
                        'Details coming soon. Click to view available booths and start your application.'}
                    </p>
                    <span
                      className="mt-auto text-sm font-semibold inline-flex items-center gap-1"
                      style={{ color: TERRACOTTA }}
                    >
                      Apply
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- CTA STRIP ---------- */}
      <section className="px-6 pb-24">
        <div
          className="max-w-6xl mx-auto rounded-3xl px-8 py-12 sm:px-14 sm:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ background: SURFACE, border: `1px solid ${BORDER_LIGHT}` }}
        >
          <div className="max-w-xl">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{
                fontFamily: HEADING_FONT,
                letterSpacing: '-0.02em',
                color: TEXT_PRIMARY,
              }}
            >
              Ready to apply for your next event?
            </h2>
            <p style={{ color: TEXT_SECONDARY, lineHeight: 1.55 }}>
              Set up your business profile once, then send polished proposals
              to as many events as you like.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/register"
              className="px-6 py-3 rounded-full font-semibold text-sm"
              style={{ background: TERRACOTTA, color: SURFACE }}
            >
              Create account
            </Link>
            <Link
              to="/apply"
              className="px-6 py-3 rounded-full font-semibold text-sm"
              style={{
                background: 'transparent',
                color: TEXT_PRIMARY,
                border: `1px solid ${BORDER_LIGHT}`,
              }}
            >
              Browse to apply
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
