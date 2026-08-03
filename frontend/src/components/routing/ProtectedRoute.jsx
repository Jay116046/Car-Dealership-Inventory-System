import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { checkAuth } from '../../store/authSlice';

const ProtectedRoute = () => {
  const { token, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        await dispatch(checkAuth());
      }
      setIsChecking(false);
    };
    verifyUser();
  }, [dispatch, token]);

  if (isChecking || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!token || status === 'failed') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
