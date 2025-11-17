export async function POST(request: Request) {
  try {
    const { sessions } = await request.json()

    // Your Python backend should receive sessions array and return a prediction.
    // For now, this calls a simple prediction function.
    const prediction = generateBasicPrediction(sessions)

    return Response.json({
      predictedMinutes: prediction,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Prediction error:', error)
    return Response.json({ error: 'Prediction failed' }, { status: 500 })
  }
}

// Example: fetch('http://localhost:5000/predict', { method: 'POST', body: JSON.stringify(sessions) })
function generateBasicPrediction(sessions: any[]) {
  const today = new Date()
  let totalMinutes = 0
  let daysWithStudy = 0

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString()
    const daySessions = sessions.filter((s: any) => s.date === dateStr)
    const dayMinutes = daySessions.reduce((acc: number, s: any) => acc + (s.duration || 0), 0)
    if (dayMinutes > 0) {
      totalMinutes += dayMinutes
      daysWithStudy++
    }
  }

  const average = daysWithStudy > 0 ? Math.round(totalMinutes / daysWithStudy) : 60
  const variance = Math.floor(average * 0.1 * Math.random()) - Math.floor(average * 0.05)
  return Math.max(30, average + variance)
}
