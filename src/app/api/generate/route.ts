import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
const client = new Anthropic()
export async function POST(req: NextRequest) {
  try {
    const form = await req.json()
    const { trade, name, phone, email, location, experience, jobs, certs, skills, goal } = form
    const prompt = `You are an expert resume writer specializing in blue-collar and trades resumes. Write a professional resume for a tradesperson.

RULES:
- Plain text only (no markdown, no asterisks, no pound signs)
- ALL CAPS for section headers
- Under 600 words
- Strong 2-3 sentence summary at top
- Action verbs: installed, completed, maintained, operated, inspected
- Format jobs as: Company | Title | Dates

Name: ${name}
Trade: ${trade}
Phone: ${phone}
Email: ${email}
Location: ${location}
Experience: ${experience}
Jobs: ${jobs}
Certs: ${certs || 'None'}
Skills: ${skills}
Goal: ${goal}

Write the complete resume now.`

    const coverPrompt = `Write a short professional cover letter for this tradesperson. Plain text, 3 paragraphs, confident tone.
Name: ${name}, Trade: ${trade}, Experience: ${experience}, Skills: ${skills}, Goal: ${goal}, Location: ${location}`

    const [resumeMsg, coverMsg] = await Promise.all([
      client.messages.create({ model: 'claude-sonnet-4-20250514', max_tokens: 1024, messages: [{ role: 'user', content: prompt }] }),
      client.messages.create({ model: 'claude-sonnet-4-20250514', max_tokens: 512, messages: [{ role: 'user', content: coverPrompt }] }),
    ])
    const resumeText = resumeMsg.content[0].type === 'text' ? resumeMsg.content[0].text : ''
    const coverText = coverMsg.content[0].type === 'text' ? coverMsg.content[0].text : ''
    return NextResponse.json({ resume: resumeText, coverLetter: coverText })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to generate resume.' }, { status: 500 })
  }
}