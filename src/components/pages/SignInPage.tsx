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
import {Lock, Loader2} from "lucide-react";
import {useToast} from "@/components/ui/use-toast";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../layout/Header"; // Adjust the import path if necessary
import Header from "../layout/Header"; // Adjust the import path if necessary
import Footer from "../layout/Footer"; // Adjust the import path if necessary
const BASE_URL = import.meta.env.VITE_API_URL;
const SignInPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		general?: string;
	}>({});
	const [isLoading, setIsLoading] = useState(false);

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

		setErrors((prev) => ({...prev, general: undefined}));

		const formErrors = validateForm();
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(`${BASE_URL}/api/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({email, password}), // ← CHANGED: Added password
			});

			const data = await response.json();

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
				setErrors({general: "Invalid email or password"}); // ← CHANGED: Better message
				toast({
					title: "Access Denied",
					description: "Invalid email or password",
					variant: "destructive",
				});
				setIsLoading(false);
				return;
			}

			console.log("Sign in successful for:", email);
			signIn(email);

			toast({
				title: "Sign In Successful",
				description: "Welcome back! You are now being redirected.",
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
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		if (errors.password || errors.general) {
			setErrors((prev) => ({...prev, password: undefined, general: undefined}));
		}
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
							{/* General error message (e.g., unauthorized email) */}
							{errors.general && (
								<div className="bg-destructive/10 border border-destructive rounded-md p-3">
									<p className="text-sm text-destructive">{errors.general}</p>
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
										errors.email ? "border-destructive" : ""
									}`}
									aria-invalid={!!errors.email}
									disabled={isLoading}
								/>
								{errors.email && (
									<p className="text-sm text-destructive">{errors.email}</p>
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
										errors.password ? "border-destructive" : ""
									}`}
									aria-invalid={!!errors.password}
									disabled={isLoading}
								/>
								{errors.password && (
									<p className="text-sm text-destructive">{errors.password}</p>
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
