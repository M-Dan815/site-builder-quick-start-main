import {Link} from "react-router-dom"; // if you're using React Router

const Footer = () => {
	return (
		<footer className="border-t border-gray-800 py-8 px-4">
			<div className="container mx-auto text-center text-gray-400">
				<p>&copy; 2024 CodePark. All rights reserved.</p>
				<p className="mt-2">
					<Link
						to="/terms-and-policies"
						className="text-gray-400 hover:text-white underline"
					>
						Terms of Service & Policies
					</Link>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
