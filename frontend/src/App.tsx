import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import ActionsPage from './pages/ActionsPage'
import AdminPage from './pages/AdminPage'
import ChatPage from './pages/ChatPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import RecyclingPage from './pages/RecyclingPage'
import ResponsibleAIPage from './pages/ResponsibleAIPage'
import SchemesPage from './pages/SchemesPage'
import SustainablePage from './pages/SustainablePage'
import TravelPage from './pages/TravelPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="sustainable" element={<SustainablePage />} />
          <Route path="recycling" element={<RecyclingPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="schemes" element={<SchemesPage />} />
          <Route path="travel" element={<TravelPage />} />
          <Route path="actions" element={<ActionsPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="responsible-ai" element={<ResponsibleAIPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
