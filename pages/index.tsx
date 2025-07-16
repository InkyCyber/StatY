import Head from 'next/head'
import { useState, useEffect } from 'react'

interface Stats {
  id: number
  goals: number
  assists: number
  games: number
}

interface Player {
  id: number
  name: string
  stats: Stats
}

interface Team {
  id: number
  name: string
  players: Player[]
}

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([])
  const [teamName, setTeamName] = useState('')

  async function load() {
    const res = await fetch('/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `query { teams { id name players { id name stats { goals assists games } } } }` }),
    })
    const json = await res.json()
    setTeams(json.data.teams)
  }

  useEffect(() => { load() }, [])

  async function addTeam() {
    await fetch('/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `mutation($name:String!){ addTeam(name:$name){ id } }`, variables: { name: teamName } }),
    })
    setTeamName('')
    load()
  }

  return (
    <>
      <Head>
        <title>Hockey Stats</title>
      </Head>
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Hockey Stats</h1>
        <div className="mb-4">
          <input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team name"
            className="border p-2 mr-2"
          />
          <button onClick={addTeam} className="bg-blue-500 text-white px-3 py-2">Add Team</button>
        </div>
        <div>
          {teams.map((team) => (
            <div key={team.id} className="border p-2 mb-2">
              <h2 className="font-semibold">{team.name}</h2>
              <ul className="ml-4 list-disc">
                {team.players.map((p) => (
                  <li key={p.id}>
                    {p.name} - {p.stats.goals}G / {p.stats.assists}A / {p.stats.games}GP
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
