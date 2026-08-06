import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice';
import { Car, LogOut, LayoutDashboard, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
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

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
              <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                <Car className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                AutoElite
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center text-slate-300 text-sm">
              Welcome, <span className="font-semibold text-white ml-1">{user?.name || user?.username || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-slate-700 hover:border-red-500/30 shadow-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
