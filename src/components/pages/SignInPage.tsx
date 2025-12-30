// src/components/pages/SignInPage.tsx
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Lock, Loader2, AlertTriangle, Monitor} from "lucide-react";
import {useToast} from "@/components/ui/use-toast";
import {useNavigate} from "react-router-dom";
import {useAuth, getDeviceInfo} from "@/context/AuthContext"; // ✅ Updated import
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const BASE_URL = import.meta.env.VITE_API_URL;

interface SignInResponse {
	ok: boolean;
	allowed: boolean;
	error?: string;
	code?: string;
	sessionToken?: string;
	activeSeats?: number;
	maxSeats?: number;
	email?: string;
}

const SignInPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		general?: string;
	}>({});
	const [isLoading, setIsLoading] = useState(false);
	const [seatLimitError, setSeatLimitError] = useState<{
		activeSeats: number;
		maxSeats: number;
	} | null>(null);

	const {signIn} = useAuth();
	const {toast} = useToast();
	const navigate = useNavigate();

	const validateForm = () => {
		const newErrors: {email?: string; password?: string} = {};
		if (!email) {
			newErrors.email = "Email can't be empty";
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = "Email is invalid";
		}
		if (!password) {
			newErrors.password = "Password can't be empty";
		}
		return newErrors;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setErrors({});
		setSeatLimitError(null);

		const formErrors = validateForm();
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}

		setIsLoading(true);

		try {
			const deviceInfo = getDeviceInfo();

			const response = await fetch(`${BASE_URL}/api/auth/signin`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
					deviceInfo,
				}),
			});

			const data: SignInResponse = await response.json();

			if (!response.ok || !data.ok) {
				setErrors({general: data.error || "An error occurred during sign in"});
				toast({
					title: "Sign In Failed",
					description: data.error || "An error occurred during sign in",
					variant: "destructive",
				});
				setIsLoading(false);
				return;
			}

			if (!data.allowed) {
				if (data.code === "SEAT_LIMIT_REACHED") {
					setSeatLimitError({
						activeSeats: data.activeSeats || 0,
						maxSeats: data.maxSeats || 1,
					});
					toast({
						title: "Seat Limit Reached",
						description: data.error,
						variant: "destructive",
					});
				} else {
					setErrors({general: data.error || "Invalid email or password"});
					toast({
						title: "Access Denied",
						description: data.error || "Invalid email or password",
						variant: "destructive",
					});
				}
				setIsLoading(false);
				return;
			}

			// Success
			signIn({
				email: data.email!,
				sessionToken: data.sessionToken!,
				activeSeats: data.activeSeats!,
				maxSeats: data.maxSeats!,
			});

			toast({
				title: "Sign In Successful",
				description: `Welcome back! Using ${data.activeSeats} of ${
					data.maxSeats
				} seat${data.maxSeats! > 1 ? "s" : ""}.`,
			});

			setTimeout(() => {
				navigate("/");
				setIsLoading(false);
			}, 500);
		} catch (error) {
			console.error("Sign in error:", error);
			setErrors({
				general: "Unable to connect to the server. Please try again.",
			});
			toast({
				title: "Connection Error",
				description: "Unable to connect to the server. Please try again.",
				variant: "destructive",
			});
			setIsLoading(false);
		}
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		if (errors.email || errors.general) {
			setErrors((prev) => ({...prev, email: undefined, general: undefined}));
		}
		setSeatLimitError(null);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		if (errors.password || errors.general) {
			setErrors((prev) => ({...prev, password: undefined, general: undefined}));
		}
		setSeatLimitError(null);
	};

	return (
		<div className="flex flex-col min-h-screen bg-gray-900">
			<Header />

			<main className="flex-1 flex items-center justify-center px-4 py-12">
				<Card className="w-full max-w-md bg-gray-800 border-gray-700">
					<CardHeader className="text-center">
						<div className="flex justify-center mb-4">
							<Lock className="h-10 w-10 text-blue-400" />
						</div>
						<CardTitle className="text-2xl font-bold text-white">
							Sign In to CodePark
						</CardTitle>
						<CardDescription className="text-gray-300">
							Enter your credentials to access the developer database.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* General error */}
							{errors.general && (
								<div className="bg-red-500/10 border border-red-500 rounded-md p-3">
									<p className="text-sm text-red-500">{errors.general}</p>
								</div>
							)}

							{/* Seat limit error */}
							{seatLimitError && (
								<div className="bg-amber-500/10 border border-amber-500 rounded-md p-4">
									<div className="flex items-start gap-3">
										<AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
										<div className="flex-1">
											<p className="text-sm font-medium text-amber-500">
												Seat Limit Reached
											</p>
											<p className="text-sm text-amber-400 mt-1">
												You have reached your maximum of{" "}
												{seatLimitError.maxSeats} allowed seat
												{seatLimitError.maxSeats > 1 ? "s" : ""}. All{" "}
												{seatLimitError.activeSeats} seat
												{seatLimitError.activeSeats > 1 ? "s are" : " is"}{" "}
												currently in use.
											</p>
											<div className="flex items-center gap-2 mt-3 text-xs text-amber-400/80">
												<Monitor className="h-4 w-4" />
												<span>
													Please log out from another device to continue.
												</span>
											</div>
										</div>
									</div>
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="email" className="text-gray-300">
									Email Address
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="your@company.com"
									value={email}
									onChange={handleEmailChange}
									className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 ${
										errors.email ? "border-red-500" : ""
									}`}
									disabled={isLoading}
								/>
								{errors.email && (
									<p className="text-sm text-red-500">{errors.email}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="password" className="text-gray-300">
									Password
								</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={handlePasswordChange}
									className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 ${
										errors.password ? "border-red-500" : ""
									}`}
									disabled={isLoading}
								/>
								{errors.password && (
									<p className="text-sm text-red-500">{errors.password}</p>
								)}
							</div>

							<Button
								type="submit"
								className="w-full bg-blue-600 hover:bg-blue-700 text-white"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Signing In...
									</>
								) : (
									"Sign In"
								)}
							</Button>
						</form>
					</CardContent>
				</Card>
			</main>

			<Footer />
		</div>
	);
};

export default SignInPage;
