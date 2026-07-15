import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './App'

export const createRoot = ViteReactSSG(
  { routes },
  ({ isClient, initialState }) => {
    if (isClient) {
      // Hydration: initialState is populated by SSG
    }
  },
)
