// src/context/AuthContext.tsx
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

interface AuthUser {
	email: string;
	sessionToken: string;
	activeSeats: number;
	maxSeats: number;
}

interface AuthContextType {
	isSignedIn: boolean;
	user: AuthUser | null;
	isLoading: boolean;
	signIn: (data: AuthUser) => void;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get device info for session tracking
export const getDeviceInfo = (): string => {
	const ua = navigator.userAgent;
	let browser = "Unknown Browser";
	let os = "Unknown OS";

	if (ua.includes("Firefox")) browser = "Firefox";
	else if (ua.includes("Chrome")) browser = "Chrome";
	else if (ua.includes("Safari")) browser = "Safari";
	else if (ua.includes("Edge")) browser = "Edge";

	if (ua.includes("Windows")) os = "Windows";
	else if (ua.includes("Mac")) os = "macOS";
	else if (ua.includes("Linux")) os = "Linux";
	else if (ua.includes("Android")) os = "Android";
	else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

	return `${browser} on ${os}`;
};

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Load from localStorage on mount
	useEffect(() => {
		const savedUser = localStorage.getItem("authUser");
		if (savedUser) {
			try {
				const parsed = JSON.parse(savedUser);
				setUser(parsed);
			} catch (e) {
				console.error("Failed to parse saved user:", e);
				localStorage.removeItem("authUser");
			}
		}
		setIsLoading(false);
	}, []);

	const signIn = (data: AuthUser) => {
		setUser(data);
		localStorage.setItem("authUser", JSON.stringify(data));
	};

	const signOut = async () => {
		// Call the signout API to remove session from database
		if (user?.sessionToken) {
			try {
				await fetch(`${BASE_URL}/api/auth/signout`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({sessionToken: user.sessionToken}),
				});
				console.log("Session removed from server");
			} catch (error) {
				console.error("Error during sign out:", error);
			}
		}

		setUser(null);
		localStorage.removeItem("authUser");
	};

	return (
		<AuthContext.Provider
			value={{
				isSignedIn: !!user,
				user,
				isLoading,
				signIn,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
