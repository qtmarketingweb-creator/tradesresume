'use client'
import { useState } from 'react'

const TRADES = [
  'Plumber', 'Electrician', 'HVAC Technician', 'Welder', 'Pipefitter',
  'Carpenter', 'Roofer', 'Ironworker', 'Heavy Equipment Operator',
  'CDL Truck Driver', 'Masonry / Bricklayer', 'Painter', 'Drywall / Framer',
  'Concrete / Flatwork', 'Sprinkler Fitter', 'Sheet Metal Worker',
  'Steamfitter', 'General Laborer', 'Other'
]

const STEPS = [
  { id: 'trade', label: 'What is your trade?', type: 'select', options: TRADES },
  { id: 'name', label: 'Full name', type: 'text', placeholder: 'John Smith' },
  { id: 'phone', label: 'Phone number', type: 'text', placeholder: '(801) 555-0100' },
  { id: 'email', label: 'Email address', type: 'text', placeholder: 'john@email.com' },
  { id: 'location', label: 'City and state', type: 'text', placeholder: 'Salt Lake City, UT' },
  { id: 'experience', label: 'Years of experience', type: 'select', options: ['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '11–20 years', '20+ years'] },
  { id: 'jobs', label: 'List your last 1–3 jobs (company name, job title, rough dates)', type: 'textarea', placeholder: 'ABC Plumbing – Journeyman Plumber – 2020 to present\nXYZ Mechanical – Apprentice – 2018 to 2020' },
  { id: 'certs', label: 'Licenses and certifications (if any)', type: 'textarea', placeholder: 'Utah Journeyman Plumber License\nOSHA 10\nBackflow certification' },
  { id: 'skills', label: 'Top skills or specialties', type: 'textarea', placeholder: 'Rough-in, trim-out, water heater replacement, commercial pipefitting, blueprint reading' },
  { id: 'goal', label: 'What type of job are you looking for?', type: 'text', placeholder: 'Journeyman plumber at a commercial contractor' },
]

type FormData = Record<string, string>
type ResumeType = 'resume' | 'cover'

export default function Home() {
  const [step, setStep] = useState(-1) // -1 = landing
  const [form, setForm] = useState<FormData>({})
  const [loading, setLoading] = useState(false)
  const [resume, setResume] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [activeTab, setActiveTab] = useState<ResumeType>('resume')
  const [error, setError] = useState('')

  const current = STEPS[step]
  const progress = step >= 0 ? Math.round(((step + 1) / STEPS.length) * 100) : 0

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      generate()
    }
  }

  function handleBack() {
    if (step > 0) setStep(s => s - 1)
    else setStep(-1)
  }

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate')
      setResume(data.resume)
      setCoverLetter(data.coverLetter)
      setStep(STEPS.length) // done
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setStep(STEPS.length - 1)
    } finally {
      setLoading(false)
    }
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text)
  }

  function downloadText(text: string, filename: string) {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Landing page
  if (step === -1) {
    return (
      <main className="min-h-screen bg-gray-950 text-white">
        {/* Hero */}
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 text-orange-400 text-sm font-medium mb-8">
            🔨 Built for the trades
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Get a professional resume<br />
            <span className="text-orange-400">in 60 seconds</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Answer 10 quick questions. AI writes a polished resume and cover letter tailored to your trade. No fluff, no office jargon — just real experience, presented right.
          </p>
          <button
            onClick={() => setStep(0)}
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold text-lg px-10 py-4 rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
          >
            Build My Resume — Free
          </button>
          <p className="text-gray-500 text-sm mt-4">No account needed. Takes about 2 minutes.</p>
        </div>

        {/* Trades grid */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <p className="text-center text-gray-500 text-sm mb-6 uppercase tracking-wider">Works for every trade</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Plumbers', 'Electricians', 'Welders', 'HVAC Techs', 'Pipefitters', 'Carpenters', 'Roofers', 'CDL Drivers', 'Heavy Equipment Operators', 'Sheet Metal Workers', 'Ironworkers', 'Painters', 'and more...'].map(t => (
              <span key={t} className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-sm">{t}</span>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '1', title: 'Answer 10 questions', desc: 'Tell us your trade, experience, and jobs. No writing required.' },
              { num: '2', title: 'AI builds your resume', desc: 'Claude AI writes a professional resume and cover letter in seconds.' },
              { num: '3', title: 'Copy or download', desc: 'Grab your resume as plain text, paste it anywhere, send it out.' },
            ].map(s => (
              <div key={s.num} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-lg mb-4">{s.num}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  // Done / Resume display
  if (step === STEPS.length) {
    const text = activeTab === 'resume' ? resume : coverLetter
    const filename = activeTab === 'resume'
      ? `${form.name?.replace(/\s+/g, '_') || 'resume'}_resume.txt`
      : `${form.name?.replace(/\s+/g, '_') || 'cover'}_cover_letter.txt`

    return (
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Your Documents</h1>
            <button
              onClick={() => { setStep(-1); setResume(''); setCoverLetter(''); setForm({}) }}
              className="text-gray-400 hover:text-white text-sm"
            >
              ← Start over
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(['resume', 'cover'] as ResumeType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === tab ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                {tab === 'resume' ? '📄 Resume' : '✉️ Cover Letter'}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => copyText(text)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              📋 Copy
            </button>
            <button
              onClick={() => downloadText(text, filename)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              ⬇️ Download
            </button>
          </div>

          {/* Resume text */}
          <div className="bg-white text-gray-900 rounded-xl p-8 font-mono text-sm leading-relaxed whitespace-pre-wrap shadow-xl">
            {text}
          </div>

          <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-xl">
            <p className="text-gray-400 text-sm">
              💡 <strong className="text-white">Pro tip:</strong> Paste this into Google Docs or Word to format it, adjust fonts, and save as PDF before sending.
            </p>
          </div>
        </div>
      </main>
    )
  }

  // Question steps
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 pt-10 pb-20 flex-1">

        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Question {step + 1} of {STEPS.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full">
            <div
              className="h-1.5 bg-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">{current.label}</h2>

          {current.type === 'select' && (
            <div className="grid gap-2">
              {current.options!.map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    setForm(f => ({ ...f, [current.id]: opt }))
                    setTimeout(handleNext, 150)
                  }}
                  className={`text-left px-5 py-3.5 rounded-xl border transition-all font-medium ${
                    form[current.id] === opt
                      ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                      : 'border-gray-700 bg-gray-900 hover:border-gray-500 text-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {current.type === 'text' && (
            <input
              type="text"
              value={form[current.id] || ''}
              onChange={e => setForm(f => ({ ...f, [current.id]: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && form[current.id] && handleNext()}
              placeholder={current.placeholder}
              autoFocus
              className="w-full bg-gray-900 border border-gray-700 focus:border-orange-500 rounded-xl px-5 py-4 text-lg outline-none transition-all placeholder-gray-600"
            />
          )}

          {current.type === 'textarea' && (
            <textarea
              value={form[current.id] || ''}
              onChange={e => setForm(f => ({ ...f, [current.id]: e.target.value }))}
              placeholder={current.placeholder}
              autoFocus
              rows={5}
              className="w-full bg-gray-900 border border-gray-700 focus:border-orange-500 rounded-xl px-5 py-4 text-base outline-none transition-all placeholder-gray-600 resize-none"
            />
          )}

          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handleBack}
            className="px-5 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-all font-medium"
          >
            ← Back
          </button>
          {current.type !== 'select' && (
            <button
              onClick={handleNext}
              disabled={!form[current.id] || loading}
              className="flex-1 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all"
            >
              {loading ? '✨ Generating your resume...' : step === STEPS.length - 1 ? '✨ Generate My Resume' : 'Next →'}
            </button>
          )}
        </div>

        {/* Skip for optional fields */}
        {(current.id === 'certs') && (
          <button
            onClick={handleNext}
            className="w-full mt-3 text-gray-500 hover:text-gray-300 text-sm py-2 transition-all"
          >
            Skip (no certifications)
          </button>
        )}
      </div>
    </main>
  )
}
