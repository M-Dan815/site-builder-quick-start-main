// src/layout/Header.tsx (or wherever your Header is)
import {
	Database,
	User,
	LogOut,
	HelpCircle,
	Monitor,
	Loader2,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext";

const Header = () => {
	const {isSignedIn, user, signOut} = useAuth();
	const [isSigningOut, setIsSigningOut] = useState(false);
	const navigate = useNavigate();

	const handleContactSupport = () => {
		navigate("/contact-support");
	};

	const handleSignOut = async () => {
		setIsSigningOut(true);
		await signOut();
		setIsSigningOut(false);
		navigate("/sign-in");
	};

	return (
		<header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<Link
					to="/"
					className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
				>
					<Database className="h-8 w-8 text-blue-400" />
					<span className="text-xl font-bold text-white">CodePark</span>
				</Link>
				<div className="flex items-center space-x-6">
					{!isSignedIn && (
						<nav className="hidden md:flex space-x-6">
							<a
								href="#features"
								className="text-gray-300 hover:text-blue-400 transition-colors"
							>
								Features
							</a>
							<a
								href="#value"
								className="text-gray-300 hover:text-blue-400 transition-colors"
							>
								Value
							</a>
							<a
								href="#contact"
								className="text-gray-300 hover:text-blue-400 transition-colors"
							>
								Contact
							</a>
						</nav>
					)}
					{!isSignedIn ? (
						<Link to="/sign-in">
							<Button
								variant="outline"
								className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900"
							>
								Sign In
							</Button>
						</Link>
					) : (
						<div className="flex items-center space-x-3">
							{/* Seat indicator */}
							<div className="hidden md:flex items-center text-sm text-gray-400">
								<Monitor className="h-4 w-4 mr-1" />
								<span>
									{user?.activeSeats}/{user?.maxSeats} seats
								</span>
							</div>

							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="text-blue-400 hover:bg-gray-800"
									>
										<User className="h-5 w-5" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-64 bg-gray-800 border-gray-700">
									<div className="flex flex-col space-y-3">
										<div className="border-b border-gray-700 pb-3">
											<p className="text-sm font-medium text-white">
												{user?.email}
											</p>
											<p className="text-xs text-gray-400 mt-1">
												Using {user?.activeSeats} of {user?.maxSeats} seat
												{(user?.maxSeats ?? 0) > 1 ? "s" : ""}
											</p>
										</div>
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
											onClick={handleSignOut}
											disabled={isSigningOut}
											className="justify-start text-gray-300 hover:bg-gray-700"
										>
											{isSigningOut ? (
												<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											) : (
												<LogOut className="h-4 w-4 mr-2" />
											)}
											Sign Out
										</Button>
									</div>
								</PopoverContent>
							</Popover>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
