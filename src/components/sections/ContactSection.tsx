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
import {Mail, Phone, MapPin} from "lucide-react";
import {useToast} from "@/components/ui/use-toast";
const BASE_URL = import.meta.env.VITE_API_URL;
const ContactSection = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const {toast} = useToast();

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim()) {
			toast({
				title: "Missing email",
				description: "Please enter a valid email address.",
				variant: "destructive",
			});
			return;
		}

		setLoading(true);
		try {
			const res = await fetch(`${BASE_URL}/api/request-demo`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({email}),
			});

			const data = await res.json();

			if (res.ok) {
				toast({
					title: "Request sent!",
					description: "We'll reach out shortly about your demo access.",
				});
				setEmail("");
			} else {
				toast({
					title: "Failed to send request",
					description: data.message || "Please try again later.",
					variant: "destructive",
				});
			}
		} catch (err) {
			console.error("Error sending request demo:", err);
			toast({
				title: "Network error",
				description: "Could not connect to the server.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<section id="contact" className="py-20 px-4 bg-gray-800/50">
			<div className="container mx-auto max-w-4xl">
				<h2 className="text-4xl font-bold text-center mb-12">
					Get Started Today
				</h2>
				<div className="grid md:grid-cols-2 gap-12">
					{/* Left Side */}
					<div>
						<h3 className="text-2xl font-semibold mb-6">
							Ready to Transform Your Recruitment?
						</h3>
						<p className="text-gray-300 mb-6">
							Join the leading tech recruiters who are already using our
							database to find exceptional developers faster and more
							efficiently.
						</p>
						<div className="space-y-4">
							<div className="flex items-center space-x-3">
								<Mail className="h-5 w-5 text-blue-400" />
								<span className="text-gray-300">contact@codepark.com</span>
							</div>
							<div className="flex items-center space-x-3">
								<Phone className="h-5 w-5 text-blue-400" />
								<span className="text-gray-300">(555) 123-4567</span>
							</div>
							<div className="flex items-center space-x-3">
								<MapPin className="h-5 w-5 text-blue-400" />
								<span className="text-gray-300">Victoria, BC</span>
							</div>
						</div>
					</div>

					{/* Right Side Form */}
					<Card className="bg-gray-800 border-gray-700">
						<CardHeader>
							<CardTitle className="text-white">Request Access</CardTitle>
							<CardDescription className="text-gray-300">
								Get in touch to learn more about our developer database
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubscribe} className="space-y-4">
								<div>
									<Label htmlFor="email" className="text-gray-300">
										Email Address
									</Label>
									<Input
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="your@company.com"
										className="bg-gray-700 border-gray-600 text-white"
										required
									/>
								</div>
								<Button
									type="submit"
									disabled={loading}
									className="w-full bg-blue-600 hover:bg-blue-700"
								>
									{loading ? "Sending..." : "Request Demo"}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
};

export default ContactSection;
