import type { RouteRecord } from 'vite-react-ssg'
import { AuthProvider } from '@/contexts/AuthContext'
import { HelmetProvider } from 'react-helmet-async'
import Index from '@/pages/Index'
import CatalogPage from '@/pages/CatalogPage'
import PortfolioPage from '@/pages/PortfolioPage'
import AboutPage from '@/pages/AboutPage'
import ContactsPage from '@/pages/ContactsPage'
import CalculatorPage from '@/pages/CalculatorPage'
import AdminLoginPage from '@/pages/AdminLoginPage'
import AddProjectPage from '@/pages/AddProjectPage'
import EditProjectPage from '@/pages/EditProjectPage'
import NotFound from '@/pages/NotFound'
import { supabase } from '@/integrations/supabase/client'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <AuthProvider>{children}</AuthProvider>
    </HelmetProvider>
  )
}

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout><Index /></Layout>,
  },
  {
    path: '/catalog',
    element: <Layout><CatalogPage /></Layout>,
    loader: async () => {
      if (!import.meta.env.SSR) return null
      const { data } = await supabase
        .from('portfolio_categories')
        .select('*')
        .order('sort_order', { ascending: true })
      return { categories: data ?? [] }
    },
  },
  {
    path: '/portfolio',
    element: <Layout><PortfolioPage /></Layout>,
  },
  {
    path: '/about',
    element: <Layout><AboutPage /></Layout>,
  },
  {
    path: '/contacts',
    element: <Layout><ContactsPage /></Layout>,
  },
  {
    path: '/calculator',
    element: <Layout><CalculatorPage /></Layout>,
  },
  {
    path: '/admin',
    element: <Layout><AdminLoginPage /></Layout>,
  },
  {
    path: '/portfolio/add',
    element: <Layout><AddProjectPage /></Layout>,
  },
  {
    path: '/portfolio/edit/:id',
    element: <Layout><EditProjectPage /></Layout>,
  },
  {
    path: '*',
    element: <Layout><NotFound /></Layout>,
  },
]
