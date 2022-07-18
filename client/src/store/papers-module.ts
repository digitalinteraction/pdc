import { env } from '@/plugins/env-plugin'
import { DeconfApiClient } from '@openlab/deconf-ui-toolkit'
import { Module } from 'vuex'

export interface PaperRecord {
  id: string
  title: string
  keywords: string[]
  authors: string[]
  themes: string[]
  files: string[]
  sessionId: string | null
  content: string
}

export interface PapersModuleState {
  papers: null | PaperRecord[]
}

export type PapersStoreModule = Module<PapersModuleState, unknown>

export function papersModule(): PapersStoreModule {
  const api = new DeconfApiClient(env.SERVER_URL.href)

  return {
    namespaced: true,
    state: {
      papers: [],
    },
    mutations: {
      papers(state, papers: PaperRecord[]) {
        state.papers = papers
      },
    },
    actions: {
      async fetch(ctx) {
        const papers = await api.fetchJson('papers')
        ctx.commit('papers', papers)
      },
    },
  }
}
