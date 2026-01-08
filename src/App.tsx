// src/App.tsx
import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Index from "./pages/Index";
import ContactSupport from "./pages/ContactSupport";
import NotFound from "./pages/NotFound";
import SignInPage from "./components/pages/SignInPage";
import {AuthProvider} from "@/context/AuthContext";
import TermsAndPolicies from "./pages/TermsAndPolicies";

const queryClient = new QueryClient();

const App = () => (
	<AuthProvider>
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<Toaster />
				<Sonner />
				<BrowserRouter>
					<Routes>
						<Route index element={<Index />} />
						<Route path="/contact-support" element={<ContactSupport />} />
						<Route path="/sign-in" element={<SignInPage />} />
						<Route path="*" element={<NotFound />} />
						<Route path="/terms-and-policies" element={<TermsAndPolicies />} />
					</Routes>
				</BrowserRouter>
			</TooltipProvider>
		</QueryClientProvider>
	</AuthProvider>
);

export default App;
