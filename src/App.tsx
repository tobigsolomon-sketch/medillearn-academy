import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Layout } from './components/Layout'
import { InstallPrompt } from './components/InstallPrompt'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Home } from './pages/Home'
import { Courses } from './pages/Courses'
import { CourseDetail } from './pages/CourseDetail'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { StudentDashboard } from './pages/StudentDashboard'
import { VerifyCertificate } from './pages/VerifyCertificate'
import { AdminDashboard } from './pages/AdminDashboard'
import { StudentResources } from './pages/StudentResources'
import { About, Contact, FAQ, Privacy, Terms, NotFound } from './pages/StaticPages'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/verify-certificate" element={<VerifyCertificate />} />
            <Route path="/verify-certificate/:id" element={<VerifyCertificate />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <StudentResources />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <InstallPrompt />
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}
