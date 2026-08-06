import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice';
import { Car, LogOut, LayoutDashboard, ShieldAlert, Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const { user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu whenever location/route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    await dispatch(logoutUser());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'My Account', path: '/account', icon: <Car size={18} /> },
  ];

  if (role === 'admin') {
    navLinks.push({ name: 'Admin Panel', path: '/admin/dashboard', icon: <ShieldAlert size={18} /> });
  }

  const displayName = user?.userName || user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2.5 text-white hover:opacity-90 transition-opacity"
            >
              <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                <Car className="text-white" size={22} />
              </div>
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-white tracking-tight">
                AutoElite
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop User Info & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-slate-300 text-sm bg-slate-800/60 py-1.5 px-3 rounded-xl border border-slate-700/50">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                {displayName[0]?.toUpperCase()}
              </div>
              <span>
                Hello, <span className="font-semibold text-white">{displayName}</span>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 px-3.5 py-2 rounded-xl text-sm font-medium transition-all border border-slate-700 hover:border-red-500/30 shadow-sm"
              title="Sign out"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="text-slate-300 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-2xl border-b border-slate-800 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-3 pb-2 space-y-1.5">
            {/* User Profile Header on Mobile */}
            <div className="flex items-center space-x-3 p-3 mb-2 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-base">
                {displayName[0]?.toUpperCase() || <User size={18} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                <p className="text-sm font-bold text-white truncate">{displayName}</p>
                {role === 'admin' && (
                  <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Administrator
                  </span>
                )}
              </div>
            </div>

            {/* Mobile Nav Links */}
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                  }`}
                >
                  <div className={isActive ? 'text-blue-400' : 'text-slate-400'}>{link.icon}</div>
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Mobile Logout Button */}
            <div className="pt-2 pb-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
