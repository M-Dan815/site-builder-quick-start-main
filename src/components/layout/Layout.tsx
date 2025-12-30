import {useLocation} from "react-router-dom";
import Header from "./Header";
import {useAuth} from "@/context/AuthContext";
import Footer from "./Footer";
import DatabaseSearch from "../pages/DatabaseSearch";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = ({children}: LayoutProps) => {
	const {isSignedIn} = useAuth();
	const location = useLocation();

	const isHomePage = location.pathname === "/";

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<Header />
			<main>
				{/* ✅ Only show DatabaseSearch on home route */}
				{isSignedIn && isHomePage ? <DatabaseSearch /> : children}
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
