
import React, { useState } from 'react';
import { Wallet, Mail, Lock, LogIn, Github } from 'lucide-react';
import { signInWithGoogle, auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 pb-0 text-center">
          <div className="inline-flex p-3 bg-indigo-50 rounded-2xl mb-4">
            <Wallet className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Aapnaincom</h1>
          <p className="text-gray-500 mb-8 font-medium">Simplify your personal finance today.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2"
            >
              {loading ? <div className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full"></div> : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                </>
              )}
            </button>
          </form>

          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400 font-medium">Or continue with</span></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-3"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            <span>Google</span>
          </button>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-4"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
