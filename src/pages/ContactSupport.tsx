import {Mail, Phone, MessageCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import {useState} from "react";

const ContactSupport = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState<{
		success: boolean;
		message: string;
	} | null>(null);

	// Update form fields
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	// Submit form
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setStatus(null);

		try {
			const res = await fetch("http://localhost:3000/api/give-feedback", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (res.ok) {
				setStatus({
					success: true,
					message: "✅ Your message has been sent successfully!",
				});
				setFormData({name: "", email: "", subject: "", message: ""});
			} else {
				setStatus({
					success: false,
					message: data.message || "❌ Failed to send your message.",
				});
			}
		} catch (err) {
			console.error("Error sending message:", err);
			setStatus({
				success: false,
				message: "⚠️ Could not connect to the server.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Layout>
			<div className="min-h-screen bg-gray-900 text-white py-12">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold mb-4">Contact Support</h1>
						<p className="text-gray-400 text-lg">
							Need help? We're here to assist you. Get in touch with our support
							team.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Contact Form */}
						<Card className="bg-gray-800 border-gray-700">
							<CardHeader>
								<CardTitle className="text-white">Send us a message</CardTitle>
								<CardDescription className="text-gray-400">
									Fill out the form below and we'll get back to you as soon as
									possible.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="space-y-4">
									<Input
										name="name"
										placeholder="Your Name"
										value={formData.name}
										onChange={handleInputChange}
										className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
										required
									/>
									<Input
										name="email"
										type="email"
										placeholder="Your Email"
										value={formData.email}
										onChange={handleInputChange}
										className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
										required
									/>
									<Input
										name="subject"
										placeholder="Subject"
										value={formData.subject}
										onChange={handleInputChange}
										className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
										required
									/>
									<Textarea
										name="message"
										placeholder="Describe your issue or question..."
										value={formData.message}
										onChange={handleInputChange}
										className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-32"
										required
									/>
									<Button
										type="submit"
										className="w-full bg-blue-600 hover:bg-blue-700"
										disabled={loading}
									>
										{loading ? "Sending..." : "Send Message"}
									</Button>
								</form>

								{/* Feedback messages */}
								{status && (
									<p
										className={`mt-4 text-center ${
											status.success ? "text-green-400" : "text-red-400"
										}`}
									>
										{status.message}
									</p>
								)}
							</CardContent>
						</Card>

						{/* Contact Info */}
						<div className="space-y-6">
							<Card className="bg-gray-800 border-gray-700">
								<CardHeader>
									<CardTitle className="text-white flex items-center">
										<Mail className="h-5 w-5 mr-2 text-blue-400" />
										Email Support
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-400 mb-2">
										For general inquiries and support:
									</p>
									<a
										href="mailto:support@devsource.com"
										className="text-blue-400 hover:text-blue-300"
									>
										support@devsource.com
									</a>
								</CardContent>
							</Card>

							<Card className="bg-gray-800 border-gray-700">
								<CardHeader>
									<CardTitle className="text-white flex items-center">
										<Phone className="h-5 w-5 mr-2 text-blue-400" />
										Phone Support
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-400 mb-2">
										Available Monday - Friday, 9 AM - 5 PM PST:
									</p>
									<a
										href="tel:+1-555-123-4567"
										className="text-blue-400 hover:text-blue-300"
									>
										+1 (555) 123-4567
									</a>
								</CardContent>
							</Card>

							<Card className="bg-gray-800 border-gray-700">
								<CardHeader>
									<CardTitle className="text-white flex items-center">
										<MessageCircle className="h-5 w-5 mr-2 text-blue-400" />
										Live Chat
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-400 mb-4">
										Get instant help with our live chat support during business
										hours.
									</p>
									<Button
										variant="outline"
										className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900"
									>
										Start Live Chat
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default ContactSupport;
