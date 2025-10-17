import { Database, User, LogOut, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Simple auth state management
let authState = {
  isSignedIn: false,
  user: null as { email: string } | null,
  listeners: [] as Array<(state: typeof authState) => void>
};

export const useAuth = () => {
  const [state, setState] = useState(authState);

  useEffect(() => {
    const listener = (newState: typeof authState) => setState({ ...newState });
    authState.listeners.push(listener);
    return () => {
      authState.listeners = authState.listeners.filter(l => l !== listener);
    };
  }, []);

  return {
    ...state,
    // CHANGE: Accept 'email' as an argument
    signIn: (email: string) => {
      authState.isSignedIn = true;
      // CHANGE: Use the provided email
      authState.user = { email: email };
      authState.listeners.forEach(l => l(authState));
    },
    signOut: () => {
      authState.isSignedIn = false;
      authState.user = null;
      authState.listeners.forEach(l => l(authState));
    }
  };
};

const Header = () => {
  const { isSignedIn, user, signOut } = useAuth();

  const handleContactSupport = () => {
    window.location.href = '/contact-support';
  };

  return (
    <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Database className="h-8 w-8 text-blue-400" />
          <span className="text-xl font-bold text-white">CodePark</span>
        </Link>
        <div className="flex items-center space-x-6">
          {!isSignedIn && (
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors">Features</a>
              <a href="#value" className="text-gray-300 hover:text-blue-400 transition-colors">Value</a>
              <a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contact</a>
            </nav>
          )}
          {!isSignedIn ? (
            <Link to="/sign-in">
              <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900">
                Sign In
              </Button>
            </Link>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-blue-400 hover:bg-gray-800">
                  <User className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-gray-800 border-gray-700">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-gray-300">{user?.email}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleContactSupport}
                    className="justify-start text-gray-300 hover:bg-gray-700"
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="justify-start text-gray-300 hover:bg-gray-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;