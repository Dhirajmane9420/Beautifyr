import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useCart } from './context/CartContext'

const Home = lazy(() => import('./pages/Home'))
const BestSellers = lazy(() => import('./pages/BestSellers'))
const NewArrivals = lazy(() => import('./pages/NewArrivals'))
const About = lazy(() => import('./pages/About'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Profile = lazy(() => import('./pages/Profile'))
const Categories = lazy(() => import('./pages/Categories'))
const CategoryViewAll = lazy(() => import('./pages/CategoryViewAll'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Cart = lazy(() => import('./pages/Cart'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const Contact = lazy(() => import('./pages/Contact'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Checkout = lazy(() => import('./pages/Checkout'))
const BuyNow = lazy(() => import('./pages/BuyNow'))
const Orders = lazy(() => import('./pages/Orders'))

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function App() {
  const { toast, dismissToast } = useCart()

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/best-sellers" element={<BestSellers />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/view-all" element={<CategoryViewAll />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/buy-now" element={<ProtectedRoute><BuyNow /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </Suspense>

      {toast ? (
        <button
          type="button"
          onClick={dismissToast}
          className="fixed bottom-6 right-6 z-70 rounded-xl bg-[#2d2219] px-4 py-3 text-sm font-medium text-[#fff7ee] shadow-lg"
        >
          {toast.message}
        </button>
      ) : null}
    </>
  )
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <RouteLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fffaf2] text-[#7a522f]">
      Loading page...
    </div>
  )
}

export default App
