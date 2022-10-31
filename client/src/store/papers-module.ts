import { env } from '@/plugins/env-plugin'
import { DeconfApiClient } from '@openlab/deconf-ui-toolkit'
import { Module } from 'vuex'
import { pickApi } from './api-client'

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
  const apiClient = pickApi(env)

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
        const papers = await apiClient.getPapers()
        ctx.commit('papers', papers)
      },
    },
  }
}
