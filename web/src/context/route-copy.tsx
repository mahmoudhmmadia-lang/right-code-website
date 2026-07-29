/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from "react"

export type RouteCopy = Record<string, string>

const RouteCopyContext = createContext<RouteCopy | undefined>(undefined)

export function RouteCopyProvider({ copy, children }: { copy?: RouteCopy; children: ReactNode }) {
  return <RouteCopyContext.Provider value={copy}>{children}</RouteCopyContext.Provider>
}

export function useRouteCopy() {
  return useContext(RouteCopyContext)
}
