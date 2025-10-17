
import Header, { useAuth } from "./Header";
import Footer from "./Footer";
import DatabaseSearch from "../pages/DatabaseSearch";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main>
        {isSignedIn ? <DatabaseSearch /> : children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
