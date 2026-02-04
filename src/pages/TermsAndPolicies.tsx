import {useState} from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {useToast} from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import {FileText, Shield, Check} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_API_URL;
const TermsAndPolicies = () => {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [agreed, setAgreed] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const {toast} = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!fullName.trim() || !email.trim()) {
			toast({
				title: "Missing Information",
				description: "Please fill in your full legal name and email address.",
				variant: "destructive",
			});
			return;
		}

		if (!agreed) {
			toast({
				title: "Agreement Required",
				description: "You must agree to the terms and policies to continue.",
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch(`${BACKEND_URL}/api/terms-acceptance`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fullName: fullName.trim(),
					email: email.trim(),
				}),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				setIsSubmitted(true);
				toast({
					title: "Agreement Accepted",
					description: "Thank you for accepting the CodePark Terms & Policies.",
				});
			} else {
				throw new Error(data.message || "Failed to record acceptance");
			}
		} catch (error) {
			console.error("Error submitting acceptance:", error);
			toast({
				title: "Submission Failed",
				description: "Failed to record your acceptance. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Layout>
			<div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
				<div className="container mx-auto max-w-4xl">
					{/* Header */}
					<div className="text-center mb-10">
						<div className="flex justify-center mb-4">
							<div className="p-3 bg-blue-500/20 rounded-full">
								<FileText className="h-10 w-10 text-blue-400" />
							</div>
						</div>
						<h1 className="text-4xl font-bold text-white mb-2">
							CodePark Terms & Policies
						</h1>
						<p className="text-gray-400">
							Last Updated: January 30, 2026 • Version 1.1
						</p>
					</div>

					{/* Terms Content */}
					<Card className="bg-gray-800/50 border-gray-700 mb-8">
						<CardHeader className="border-b border-gray-700">
							<CardTitle className="text-white flex items-center gap-2">
								<Shield className="h-5 w-5 text-blue-400" />
								Terms & Policies Agreement
							</CardTitle>
							<p className="text-sm text-gray-400 mt-2">
								These Terms & Policies govern access to and use of the CodePark
								database and services. Please read them carefully before
								proceeding.
							</p>
						</CardHeader>
						<CardContent className="p-0">
							<ScrollArea className="h-[500px] p-6">
								{/* PART I */}
								<div className="space-y-6 text-gray-300">
									<section>
										<h2 className="text-xl font-bold text-blue-400 mb-4">
											PART I — DATABASE ACCESS & LICENSE AGREEMENT
										</h2>

										<div className="space-y-6">
											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													1. Parties
												</h3>
												<p className="text-sm leading-relaxed">
													1.1 This Database Access & License Agreement
													("Agreement") is entered into by and between CodePark,
													a business operated by Ashton Benning, an individual
													residing in Vancouver, British Columbia, Canada
													("CodePark," "Company," "we," "us"), and the
													individual or entity accepting this Agreement
													("Customer," "you").
												</p>
												<p className="text-sm leading-relaxed mt-2">
													1.2 This Agreement applies to access to and use of the
													CodePark website located at https://codepark.net, and
													any subdomains, applications, or services operated by
													CodePark.
												</p>
												<p className="text-sm leading-relaxed mt-2">
													1.3 By clicking "I Agree," submitting payment, or
													accessing the CodePark database or services, you
													confirm that you have read, understood, and agreed to
													be bound by this Agreement.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													2. Grant of Access (License, Not Sale)
												</h3>
												<p className="text-sm leading-relaxed">
													2.1 CodePark grants you a limited, revocable,
													non-exclusive, non-transferable, non-sublicensable
													license to access the CodePark database, platform, and
													related services (collectively, the "Database") solely
													for your internal use, subject to this Agreement.
												</p>
												<p className="text-sm leading-relaxed mt-2">
													2.2 This is a license, not a sale. All data, systems,
													software, methodologies, and content remain the
													exclusive property of CodePark and Ashton Benning.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													3. Term of Access
												</h3>
												<p className="text-sm leading-relaxed">
													3.1 Access is granted for the paid access term,
													typically twelve (12) months from the payment date,
													unless otherwise agreed in writing.
												</p>
												<p className="text-sm leading-relaxed mt-2">
													3.2 Access automatically expires at the end of the
													term unless renewed.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													4. Account Credentials & Responsibility
												</h3>
												<p className="text-sm leading-relaxed">
													4.1 Access is restricted to authorized users only.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													4.2 Login credentials must not be shared, transferred,
													or disclosed.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													4.3 You are responsible for all activity conducted
													under your account.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													4.4 You must notify CodePark immediately of any
													unauthorized access or security breach.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													5. Concurrent Usage & Seat Limits
												</h3>
												<p className="text-sm leading-relaxed">
													5.1 Access is subject to concurrent session limits
													based on the plan purchased.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													5.2 Single-seat plans allow one (1) active session at
													a time.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													5.3 Multi-seat plans allow a defined number of
													simultaneous sessions.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													5.4 Any attempt to bypass, evade, or manipulate
													concurrency limits or access controls constitutes a
													material breach of this Agreement.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													6. Prohibited Uses (Scraping, Automation & Misuse)
												</h3>
												<p className="text-sm leading-relaxed mb-2">
													6.1 You may not, directly or indirectly:
												</p>
												<ul className="text-sm space-y-1 ml-4 list-disc">
													<li>
														Scrape, crawl, harvest, or systematically extract
														data
													</li>
													<li>
														Use bots, scripts, automation tools, browser
														extensions, or headless browsers
													</li>
													<li>
														Mirror, cache, store, or replicate substantial
														portions of the Database
													</li>
													<li>
														Circumvent rate limits, session limits, or access
														controls
													</li>
													<li>
														Train AI or machine learning models using the
														Database or its outputs
													</li>
													<li>
														Enable third parties to access or derive value from
														the Database
													</li>
												</ul>
												<p className="text-sm leading-relaxed mt-2">
													6.2 Manual or automated data extraction at scale is
													strictly prohibited, regardless of method or intent.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													7. Monitoring, Logging & Audit Rights
												</h3>
												<p className="text-sm leading-relaxed mb-2">
													7.1 To protect its systems and intellectual property,
													CodePark may log:
												</p>
												<ul className="text-sm space-y-1 ml-4 list-disc">
													<li>IP addresses</li>
													<li>Device and browser information</li>
													<li>Session activity and timestamps</li>
												</ul>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													8. Suspension, Termination & No-Refund Policy
												</h3>
												<p className="text-sm leading-relaxed">
													8.1 CodePark reserves the absolute right, at its sole
													discretion, to suspend or terminate access at any
													time, with or without notice, and without refunds.
												</p>
												<p className="text-sm leading-relaxed mt-2 mb-2">
													8.2 Termination may occur for, but is not limited to:
												</p>
												<ul className="text-sm space-y-1 ml-4 list-disc">
													<li>
														Violation or suspected violation of this Agreement
													</li>
													<li>Account sharing or concurrency abuse</li>
													<li>Scraping, automation, or misuse of data</li>
													<li>Security, legal, or operational concerns</li>
													<li>Business necessity or platform integrity</li>
												</ul>
												<p className="text-sm leading-relaxed mt-2">
													8.3 All fees are non-refundable once access is
													granted, regardless of termination reason.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													9. Service Availability & Downtime Disclaimer
												</h3>
												<p className="text-sm leading-relaxed">
													9.1 The Database may experience downtime,
													interruptions, maintenance, or technical failures.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													9.2 CodePark does not guarantee uptime, availability,
													or uninterrupted access.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													9.3 Downtime does not entitle you to refunds, credits,
													or extensions.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													10. Fees, Payments & Chargebacks
												</h3>
												<p className="text-sm leading-relaxed">
													10.1 All fees are due in advance.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													10.2 Fees are non-refundable.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													10.3 Chargebacks or payment reversals may result in
													immediate termination of access.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													11. Disclaimer of Warranties
												</h3>
												<p className="text-sm leading-relaxed">
													11.1 The Database is provided "as is" and "as
													available."
												</p>
												<p className="text-sm leading-relaxed mt-1">
													11.2 CodePark disclaims all warranties, express or
													implied, including accuracy, fitness for a particular
													purpose, merchantability, and non-infringement.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													12. Limitation of Liability
												</h3>
												<p className="text-sm leading-relaxed">
													12.1 To the maximum extent permitted by law, CodePark
													and Ashton Benning shall not be liable for any
													indirect, incidental, consequential, special, or
													punitive damages.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													12.2 Total cumulative liability shall not exceed the
													amount paid by you to CodePark in the preceding twelve
													(12) months.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													13. Indemnification
												</h3>
												<p className="text-sm leading-relaxed mb-2">
													13.1 You agree to indemnify and hold harmless CodePark
													and Ashton Benning from any claims, damages,
													liabilities, or expenses arising from:
												</p>
												<ul className="text-sm space-y-1 ml-4 list-disc">
													<li>Your use or misuse of the Database</li>
													<li>Violation of this Agreement</li>
													<li>Unauthorized access or sharing</li>
												</ul>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													14. Business Representation
												</h3>
												<p className="text-sm leading-relaxed">
													14.1 If you accept this Agreement on behalf of a
													business or organization, you represent and warrant
													that you have full legal authority to bind that
													entity.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													14.2 The entity shall be responsible for all usage
													conducted under its access.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													15. Governing Law & Jurisdiction
												</h3>
												<p className="text-sm leading-relaxed">
													15.1 This Agreement shall be governed by the laws of
													the Province of British Columbia and the federal laws
													of Canada applicable therein.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													15.2 You irrevocably submit to the exclusive
													jurisdiction of the courts located in British
													Columbia, Canada.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													16. Changes to Agreement
												</h3>
												<p className="text-sm leading-relaxed">
													16.1 CodePark may update this Agreement from time to
													time.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													16.2 Continued access or use after changes constitutes
													acceptance of the updated Agreement.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													17. Entire Agreement
												</h3>
												<p className="text-sm leading-relaxed">
													17.1 This Agreement constitutes the entire agreement
													between the parties and supersedes all prior
													agreements or communications relating to access to the
													Database.
												</p>
											</div>
										</div>
									</section>

									<Separator className="bg-gray-700" />

									{/* PART II */}
									<section>
										<h2 className="text-xl font-bold text-blue-400 mb-4">
											PART II — PRIVACY POLICY
										</h2>

										<div className="space-y-6">
											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													18. Information We Collect
												</h3>
												<p className="text-sm leading-relaxed mb-2">
													18.1 We may collect:
												</p>
												<ul className="text-sm space-y-1 ml-4 list-disc">
													<li>Full legal name</li>
													<li>Email address</li>
													<li>IP address</li>
													<li>Device and browser information</li>
													<li>Session and usage data</li>
													<li>Payment status (payments processed by Stripe)</li>
												</ul>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													19. How We Use Information
												</h3>
												<p className="text-sm leading-relaxed mb-2">
													19.1 Information is used to:
												</p>
												<ul className="text-sm space-y-1 ml-4 list-disc">
													<li>Grant and manage access</li>
													<li>Enforce seat limits and prevent abuse</li>
													<li>Maintain security and system integrity</li>
													<li>Process payments and provide support</li>
													<li>Comply with legal obligations</li>
												</ul>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													20. Payment Processing
												</h3>
												<p className="text-sm leading-relaxed">
													20.1 Payments are processed by Stripe, a third-party
													payment processor.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													20.2 CodePark does not store or process credit card
													information.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													21. Data Sharing
												</h3>
												<p className="text-sm leading-relaxed">
													21.1 We do not sell personal data.
												</p>
												<p className="text-sm leading-relaxed mt-2 mb-2">
													21.2 Information may be shared only with:
												</p>
												<ul className="text-sm space-y-1 ml-4 list-disc">
													<li>Stripe (payment processing)</li>
													<li>
														Hosting, security, or infrastructure providers
													</li>
													<li>Legal authorities when required by law</li>
												</ul>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													22. Data Security & Retention
												</h3>
												<p className="text-sm leading-relaxed">
													22.1 We use reasonable administrative, technical, and
													organizational safeguards to protect personal data.
												</p>
												<p className="text-sm leading-relaxed mt-1">
													22.2 Data is retained only as long as necessary for
													legitimate business or legal purposes.
												</p>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													23. Your Rights
												</h3>
												<p className="text-sm leading-relaxed mb-2">
													23.1 You may request:
												</p>
												<ul className="text-sm space-y-1 ml-4 list-disc">
													<li>Access to personal data we hold</li>
													<li>Correction of inaccurate data</li>
													<li>
														Deletion of data, subject to legal and business
														requirements
													</li>
												</ul>
											</div>

											<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
												<h3 className="font-semibold text-white mb-3">
													24. Contact Information
												</h3>
												<p className="text-sm leading-relaxed">CodePark</p>
												<p className="text-sm leading-relaxed">
													Operated by Ashton Benning
												</p>
												<p className="text-sm leading-relaxed">
													Vancouver, British Columbia, Canada
												</p>
												<p className="text-sm leading-relaxed mt-2 text-blue-400">
													📧 support@codepark.net
												</p>
											</div>
										</div>
									</section>
								</div>
							</ScrollArea>
						</CardContent>
					</Card>

					{/* Acceptance Form */}
					<Card className="bg-gray-800/50 border-gray-700">
						<CardHeader className="border-b border-gray-700">
							<CardTitle className="text-white flex items-center gap-2">
								<Check className="h-5 w-5 text-green-400" />
								Acceptance & Consent
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-6">
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid gap-6 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="fullName" className="text-gray-300">
											Full Legal Name
										</Label>
										<Input
											id="fullName"
											type="text"
											placeholder="Enter your full legal name"
											value={fullName}
											onChange={(e) => setFullName(e.target.value)}
											disabled={isSubmitted || isSubmitting}
											className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-400 disabled:opacity-50"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email" className="text-gray-300">
											Email Address
										</Label>
										<Input
											id="email"
											type="email"
											placeholder="Enter your email address"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											disabled={isSubmitted || isSubmitting}
											className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-400 disabled:opacity-50"
										/>
									</div>
								</div>

								<div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
									<div className="flex items-start space-x-3">
										<Checkbox
											id="agreement"
											checked={agreed}
											onCheckedChange={(checked) =>
												setAgreed(checked as boolean)
											}
											disabled={isSubmitted || isSubmitting}
											className="mt-1 border-gray-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 disabled:opacity-50"
										/>
										<Label
											htmlFor="agreement"
											className="text-sm text-gray-300 cursor-pointer leading-relaxed"
										>
											I have read and agree to the CodePark Database Access &
											License Agreement and the Privacy Policy.
										</Label>
									</div>
								</div>

								<div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
									<p className="text-sm text-gray-300 mb-3">
										By clicking "Accept and Continue", you confirm that:
									</p>
									<ul className="text-sm text-gray-400 space-y-1">
										<li className="flex items-center gap-2">
											<span className="text-blue-400">•</span>
											You understand these Terms & Policies
										</li>
										<li className="flex items-center gap-2">
											<span className="text-blue-400">•</span>
											You are legally authorized to accept them
										</li>
										<li className="flex items-center gap-2">
											<span className="text-blue-400">•</span>
											Your acceptance is intentional and binding
										</li>
									</ul>
								</div>

								<Button
									type="submit"
									className={`w-full font-semibold py-3 transition-all duration-500 ${
										isSubmitted
											? "bg-green-500 hover:bg-green-500 cursor-default scale-105 disabled:opacity-100"
											: "bg-blue-500 hover:bg-blue-600"
									} text-white`}
									disabled={
										!agreed ||
										!fullName.trim() ||
										!email.trim() ||
										isSubmitted ||
										isSubmitting
									}
								>
									{isSubmitting ? (
										<span className="flex items-center justify-center gap-2">
											<svg
												className="animate-spin h-5 w-5"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Processing...
										</span>
									) : isSubmitted ? (
										<span className="flex items-center justify-center gap-2 animate-scale-in">
											<Check className="h-5 w-5" />
											Accepted
										</span>
									) : (
										"Accept and Continue"
									)}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</Layout>
	);
};

export default TermsAndPolicies;
