import Head from 'next/head'
import { useEffect, useState } from 'react'

type Player = {
  id: number
  name: string
  goals: number
  assists: number
  penaltyMinutes: number
}

type Team = {
  id: number
  name: string
  players: Player[]
}

async function graphqlFetch(query: string, variables?: any) {
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  })
  const { data } = await res.json()
  return data
}

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([])
  const [newTeam, setNewTeam] = useState('')
  const [playerNameByTeam, setPlayerNameByTeam] = useState<Record<number, string>>({})

  const load = async () => {
    const data = await graphqlFetch(`query { teams { id name players { id name goals assists penaltyMinutes } } }`)
    setTeams(data.teams)
  }

  useEffect(() => { load() }, [])

  const createTeam = async () => {
    if (!newTeam) return
    await graphqlFetch(`mutation ($name:String!){ createTeam(name:$name){ id } }`, { name: newTeam })
    setNewTeam('')
    load()
  }

  const deleteTeam = async (id: number) => {
    await graphqlFetch(`mutation ($id:Int!){ deleteTeam(id:$id){ id } }`, { id })
    load()
  }

  const addPlayer = async (teamId: number) => {
    const name = playerNameByTeam[teamId]
    if (!name) return
    await graphqlFetch(`mutation ($teamId:Int!,$name:String!){ addPlayer(teamId:$teamId,name:$name){ id } }`, { teamId, name })
    setPlayerNameByTeam({ ...playerNameByTeam, [teamId]: '' })
    load()
  }

  const removePlayer = async (id: number) => {
    await graphqlFetch(`mutation ($id:Int!){ removePlayer(id:$id){ id } }`, { id })
    load()
  }

  const statMutation = async (mutation: string, playerId: number) => {
    await graphqlFetch(`mutation ($id:Int!){ ${mutation}(playerId:$id){ id } }`, { id: playerId })
    load()
  }

  return (
    <>
      <Head><title>StatY Teams</title></Head>
      <main className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Teams</h1>
        <div className="space-x-2">
          <input className="border p-1" value={newTeam} onChange={e => setNewTeam(e.target.value)} placeholder="New team name" />
          <button className="bg-blue-500 text-white px-2" onClick={createTeam}>Create Team</button>
        </div>
        <div className="space-y-4">
          {teams.map(team => (
            <div key={team.id} className="border p-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{team.name}</h2>
                <button className="text-red-500" onClick={() => deleteTeam(team.id)}>Delete</button>
              </div>
              <div className="mt-2 space-y-2">
                {team.players.map(p => (
                  <div key={p.id} className="flex justify-between items-center border p-2">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm">G:{p.goals} A:{p.assists} PIM:{p.penaltyMinutes}</div>
                    </div>
                    <div className="space-x-1">
                      <button className="px-1 bg-green-200" onClick={() => statMutation('addGoal', p.id)}>+G</button>
                      <button className="px-1 bg-yellow-200" onClick={() => statMutation('removeGoal', p.id)}>-G</button>
                      <button className="px-1 bg-green-200" onClick={() => statMutation('addAssist', p.id)}>+A</button>
                      <button className="px-1 bg-yellow-200" onClick={() => statMutation('removeAssist', p.id)}>-A</button>
                      <button className="px-1 bg-green-200" onClick={() => statMutation('addPenaltyMinutes', p.id)}>+PIM</button>
                      <button className="px-1 bg-yellow-200" onClick={() => statMutation('removePenaltyMinutes', p.id)}>-PIM</button>
                      <button className="text-red-500" onClick={() => removePlayer(p.id)}>Remove</button>
                    </div>
                  </div>
                ))}
                <div className="space-x-2">
                  <input className="border p-1" value={playerNameByTeam[team.id] || ''} onChange={e => setPlayerNameByTeam({ ...playerNameByTeam, [team.id]: e.target.value })} placeholder="Player name" />
                  <button className="bg-blue-500 text-white px-2" onClick={() => addPlayer(team.id)}>Add Player</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
