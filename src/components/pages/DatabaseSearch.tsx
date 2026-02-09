import {useState, useEffect} from "react";
import {
	Search,
	Filter,
	Users,
	MapPin,
	Mail,
	Github,
	Linkedin,
	Twitter,
	ExternalLink,
	FileText,
	BookOpen,
	Calendar,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {Developer} from "@/types";
import {useToast} from "@/components/ui/use-toast";

interface ExtendedDeveloper extends Developer {
	socialMedia: {
		github: {
			followers: number;
			following: number;
			stars: number;
			repositories: number;
		};
		linkedin: {url: string};
		twitter: {followers: number; url?: string};
	};
	bio: string;
	profileReadme: string;
	githubCreatedAt: string;
}

interface ColumnVisibility {
	skills: boolean;
	github: boolean;
	linkedin: boolean;
	twitter: boolean;
	contact: boolean;
	bio: boolean;
	readme: boolean;
}

interface GitHubVisibility {
	followers: boolean;
	following: boolean;
	stars: boolean;
	repositories: boolean;
}

interface SortOption {
	field: string;
	direction: "asc" | "desc";
}

const BACKEND_URL = import.meta.env.VITE_API_URL;
const MODULE_ID = 1;
const TABLE_PREFIX = "users__";

const fieldMap: Record<string, string> = {
	"github-followers": "follower_count",
	"github-following": "following_count",
	"github-stars": "star_count",
	"github-repos": "repo_count",
	"twitter-followers": "twitter_follower_count",
};

const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
	skills: true,
	github: true,
	linkedin: true,
	twitter: true,
	contact: true,
	bio: false,
	readme: false,
};

const DEFAULT_GITHUB_VISIBILITY: GitHubVisibility = {
	followers: true,
	following: false,
	stars: true,
	repositories: true,
};

// Component for truncated text with tooltip on hover
const TruncatedTextWithTooltip = ({
	text,
	maxLength = 100,
	icon: Icon,
}: {
	text: string;
	maxLength?: number;
	icon?: React.ElementType;
}) => {
	if (!text || text.trim() === "") {
		return <span className="text-gray-500 text-sm italic">Not provided</span>;
	}

	const shouldTruncate = text.length > maxLength;
	const truncatedText = shouldTruncate
		? text.slice(0, maxLength) + "..."
		: text;

	if (!shouldTruncate) {
		return (
			<p className="text-sm text-gray-300 whitespace-pre-wrap break-words">
				{text}
			</p>
		);
	}

	return (
		<TooltipProvider delayDuration={200}>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="cursor-help">
						<p className="text-sm text-gray-300 line-clamp-3">
							{truncatedText}
						</p>
						{Icon && (
							<span className="text-blue-400 text-xs mt-1 flex items-center">
								<Icon className="h-3 w-3 mr-1" />
								Hover to see full content
							</span>
						)}
					</div>
				</TooltipTrigger>
				<TooltipContent
					className="max-w-md max-h-96 overflow-y-auto bg-gray-900 border-gray-600 text-gray-100 p-4"
					side="top"
					align="start"
				>
					<div className="whitespace-pre-wrap break-words text-sm">{text}</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

const DatabaseSearch = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSkill, setSelectedSkill] = useState("");
	const [locationFilter, setLocationFilter] = useState("");
	const [filteredDevelopers, setFilteredDevelopers] = useState<
		ExtendedDeveloper[]
	>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [entriesPerPage, setEntriesPerPage] = useState(25);
	const [sortOption, setSortOption] = useState<SortOption | null>(null);
	const [totalEntries, setTotalEntries] = useState(0);
	const [totalPages, setTotalPages] = useState(1);

	const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
		...DEFAULT_COLUMN_VISIBILITY,
	});

	const [githubVisibility, setGithubVisibility] = useState<GitHubVisibility>({
		...DEFAULT_GITHUB_VISIBILITY,
	});

	const {toast} = useToast();

	useEffect(() => {
		handleSearch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sortOption, entriesPerPage, currentPage]);

	const mapToDeveloper = (item: Record<string, any>): ExtendedDeveloper => ({
		id: item[`${TABLE_PREFIX}id`],
		name: item[`${TABLE_PREFIX}full_name`] || "",
		email: item[`${TABLE_PREFIX}public_email`] || "",
		skills: item[`${TABLE_PREFIX}primary_languages`]
			? item[`${TABLE_PREFIX}primary_languages`]
					.split(",")
					.map((s: string) => s.trim())
			: [],
		experience: 0,
		location: item[`${TABLE_PREFIX}city`] || "",
		githubUrl: `https://github.com/${item[`${TABLE_PREFIX}username`] || ""}`,
		bio: item[`${TABLE_PREFIX}bio`] || "",
		profileReadme: item[`${TABLE_PREFIX}profile_readme`] || "",
		githubCreatedAt: item[`${TABLE_PREFIX}github_created_at`] || "",
		socialMedia: {
			github: {
				followers: item[`${TABLE_PREFIX}follower_count`] || 0,
				following: item[`${TABLE_PREFIX}following_count`] || 0,
				stars: item[`${TABLE_PREFIX}star_count`] || 0,
				repositories: item[`${TABLE_PREFIX}repo_count`] || 0,
			},
			linkedin: {
				url: item[`${TABLE_PREFIX}linkedin_url`] || "",
			},
			twitter: {
				followers: item[`${TABLE_PREFIX}twitter_follower_count`] || 0,
				url: item[`${TABLE_PREFIX}twitter_url`] || "",
			},
		},
	});

	const handleSearch = async () => {
		try {
			const body: Record<string, any> = {
				page: currentPage,
				per_page: entriesPerPage,
				order_by: sortOption ? fieldMap[sortOption.field] : "",
				search_order: sortOption ? sortOption.direction : "asc",
				search_type: "module",
				module_id: MODULE_ID,
				text_search_type: "fuzzy",
			};

			if (searchTerm) body.search_key = searchTerm;
			if (selectedSkill)
				body[`${MODULE_ID}__primary_languages`] = selectedSkill;
			if (locationFilter) body[`${MODULE_ID}__city`] = locationFilter;

			const response = await fetch(`${BACKEND_URL}/api/crm/search`, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(body),
			});

			const res = await response.json();

			if (!response.ok) throw new Error(res.message || "Failed to fetch users");

			const developers = res.data ? res.data.map(mapToDeveloper) : [];
			setFilteredDevelopers(developers);
			setTotalEntries(res.total || 0);
			setTotalPages(res.last_page || 1);
			setCurrentPage(res.current_page || 1);
		} catch (error) {
			console.error("Error fetching users:", error);
			setFilteredDevelopers([]);
			setTotalEntries(0);
			setTotalPages(1);
		}
	};

	const triggerNewSearch = () => {
		if (currentPage === 1) {
			handleSearch();
		} else {
			setCurrentPage(1);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			triggerNewSearch();
		}
	};

	const resetFilters = () => {
		setSearchTerm("");
		setSelectedSkill("");
		setLocationFilter("");
		setSortOption(null);
		setCurrentPage(1);
		setTimeout(() => {
			handleSearch();
		}, 0);
	};

	const resetToDefault = () => {
		setColumnVisibility({...DEFAULT_COLUMN_VISIBILITY});
		setGithubVisibility({...DEFAULT_GITHUB_VISIBILITY});
		setSortOption(null);
	};

	const toggleColumn = (column: keyof ColumnVisibility) => {
		setColumnVisibility((prev) => ({
			...prev,
			[column]: !prev[column],
		}));
	};

	const toggleGithubField = (field: keyof GitHubVisibility) => {
		setGithubVisibility((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const handleSort = (field: string) => {
		setSortOption((prev) =>
			prev?.field === field
				? {field, direction: prev.direction === "asc" ? "desc" : "asc"}
				: {field, direction: "desc"},
		);
	};

	const handleEntriesPerPageChange = (value: string) => {
		setEntriesPerPage(parseInt(value));
		setCurrentPage(1);
	};

	const handlePageChange = (page: number) => setCurrentPage(page);

	const formatDate = (dateStr: string) => {
		if (!dateStr) return "";
		try {
			return new Date(dateStr).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
			});
		} catch {
			return dateStr;
		}
	};

	const renderPaginationItems = () => {
		const items = [];

		items.push(
			<PaginationItem key={1}>
				<PaginationLink
					onClick={() => handlePageChange(1)}
					isActive={currentPage === 1}
					className={`cursor-pointer ${
						currentPage === 1
							? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
							: ""
					}`}
				>
					1
				</PaginationLink>
			</PaginationItem>,
		);

		if (currentPage > 3) {
			items.push(
				<PaginationItem key="ellipsis-start">
					<span className="px-3 text-gray-400">...</span>
				</PaginationItem>,
			);
		}

		if (currentPage > 2) {
			items.push(
				<PaginationItem key={currentPage - 1}>
					<PaginationLink
						onClick={() => handlePageChange(currentPage - 1)}
						className="cursor-pointer"
					>
						{currentPage - 1}
					</PaginationLink>
				</PaginationItem>,
			);
		}

		if (currentPage !== 1 && currentPage !== totalPages) {
			items.push(
				<PaginationItem key={currentPage}>
					<PaginationLink
						isActive
						className="cursor-pointer bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
					>
						{currentPage}
					</PaginationLink>
				</PaginationItem>,
			);
		}

		if (currentPage < totalPages - 1) {
			items.push(
				<PaginationItem key={currentPage + 1}>
					<PaginationLink
						onClick={() => handlePageChange(currentPage + 1)}
						className="cursor-pointer"
					>
						{currentPage + 1}
					</PaginationLink>
				</PaginationItem>,
			);
		}

		if (currentPage < totalPages - 2) {
			items.push(
				<PaginationItem key="ellipsis-end">
					<span className="px-3 text-gray-400">...</span>
				</PaginationItem>,
			);
		}

		if (totalPages > 1) {
			items.push(
				<PaginationItem key={totalPages}>
					<PaginationLink
						onClick={() => handlePageChange(totalPages)}
						isActive={currentPage === totalPages}
						className={`cursor-pointer ${
							currentPage === totalPages
								? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
								: ""
						}`}
					>
						{totalPages}
					</PaginationLink>
				</PaginationItem>,
			);
		}

		return items;
	};

	// Helper to display active search terms as tags
	const getActiveFilters = () => {
		const filters: {type: string; values: string[]}[] = [];

		if (searchTerm) {
			const terms = searchTerm
				.split(",")
				.map((t) => t.trim())
				.filter((t) => t);
			if (terms.length > 0) filters.push({type: "Search", values: terms});
		}
		if (selectedSkill) {
			const terms = selectedSkill
				.split(",")
				.map((t) => t.trim())
				.filter((t) => t);
			if (terms.length > 0) filters.push({type: "Skills", values: terms});
		}
		if (locationFilter) {
			const terms = locationFilter
				.split(",")
				.map((t) => t.trim())
				.filter((t) => t);
			if (terms.length > 0) filters.push({type: "Location", values: terms});
		}

		return filters;
	};

	const activeFilters = getActiveFilters();

	return (
		<div className="min-h-screen bg-gray-900 text-white p-6">
			<div className="container mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2 flex items-center">
						<Users className="mr-3 text-blue-400" />
						Developer Database
					</h1>
					<p className="text-gray-400">
						Search and filter through the user database
					</p>
				</div>

				<div className="bg-gray-800 rounded-lg p-6 mb-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
						<div className="relative">
							<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search name, email, bio, readme... (comma for multiple)"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onKeyDown={handleKeyDown}
								className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
							/>
						</div>
						<Input
							placeholder="Skills (e.g., Python, JavaScript)"
							value={selectedSkill}
							onChange={(e) => setSelectedSkill(e.target.value)}
							onKeyDown={handleKeyDown}
							className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
						/>
						<Input
							placeholder="Location (e.g., Toronto, Vancouver)"
							value={locationFilter}
							onChange={(e) => setLocationFilter(e.target.value)}
							onKeyDown={handleKeyDown}
							className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
						/>
						<div className="flex space-x-2">
							<Button
								onClick={triggerNewSearch}
								className="bg-blue-600 hover:bg-blue-700"
							>
								<Filter className="h-4 w-4 mr-2" />
								Search
							</Button>
							<Button
								onClick={resetFilters}
								variant="outline"
								className="border-gray-600 bg-blue-600 hover:bg-blue-700"
							>
								Reset
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
									>
										<Filter className="h-4 w-4 mr-2" />
										Filters
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-80 bg-gray-800 border-gray-700 max-h-[80vh] overflow-y-auto">
									<DropdownMenuLabel className="text-gray-300">
										Toggle Columns
									</DropdownMenuLabel>
									<DropdownMenuSeparator className="bg-gray-700" />

									{/* Skills */}
									<div className="flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-700 rounded">
										<Checkbox
											id="skills"
											checked={columnVisibility.skills}
											onCheckedChange={() => toggleColumn("skills")}
											className="border-gray-500"
										/>
										<label
											htmlFor="skills"
											className="text-sm text-gray-300 capitalize cursor-pointer flex-1"
										>
											Skills
										</label>
									</div>

									{/* Twitter */}
									<div className="flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-700 rounded">
										<Checkbox
											id="twitter"
											checked={columnVisibility.twitter}
											onCheckedChange={() => toggleColumn("twitter")}
											className="border-gray-500"
										/>
										<label
											htmlFor="twitter"
											className="text-sm text-gray-300 capitalize cursor-pointer flex-1"
										>
											Twitter
										</label>
									</div>

									{/* Contact */}
									<div className="flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-700 rounded">
										<Checkbox
											id="contact"
											checked={columnVisibility.contact}
											onCheckedChange={() => toggleColumn("contact")}
											className="border-gray-500"
										/>
										<label
											htmlFor="contact"
											className="text-sm text-gray-300 capitalize cursor-pointer flex-1"
										>
											Contact
										</label>
									</div>

									{/* Bio */}
									<div className="flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-700 rounded">
										<Checkbox
											id="bio"
											checked={columnVisibility.bio}
											onCheckedChange={() => toggleColumn("bio")}
											className="border-gray-500"
										/>
										<label
											htmlFor="bio"
											className="text-sm text-gray-300 cursor-pointer flex-1 flex items-center"
										>
											<FileText className="h-3 w-3 mr-1" />
											Bio
										</label>
									</div>

									{/* ReadMe */}
									<div className="flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-700 rounded">
										<Checkbox
											id="readme"
											checked={columnVisibility.readme}
											onCheckedChange={() => toggleColumn("readme")}
											className="border-gray-500"
										/>
										<label
											htmlFor="readme"
											className="text-sm text-gray-300 cursor-pointer flex-1 flex items-center"
										>
											<BookOpen className="h-3 w-3 mr-1" />
											ReadMe
										</label>
									</div>

									{/* GitHub Section */}
									<DropdownMenuSeparator className="bg-gray-700" />
									<div className="px-2 py-1.5">
										<div className="flex items-center space-x-2 hover:bg-gray-700 rounded p-1">
											<Checkbox
												id="github"
												checked={columnVisibility.github}
												onCheckedChange={() => toggleColumn("github")}
												className="border-gray-500"
											/>
											<label
												htmlFor="github"
												className="text-sm text-gray-300 cursor-pointer flex-1 font-medium"
											>
												GitHub
											</label>
										</div>
										{columnVisibility.github && (
											<div className="ml-6 space-y-1 mt-2">
												<div className="flex items-center space-x-2 hover:bg-gray-700 rounded p-1">
													<Checkbox
														id="github-followers"
														checked={githubVisibility.followers}
														onCheckedChange={() =>
															toggleGithubField("followers")
														}
														className="border-gray-500"
													/>
													<label
														htmlFor="github-followers"
														className="text-sm text-gray-400 cursor-pointer flex-1"
													>
														Followers
													</label>
												</div>
												<div className="flex items-center space-x-2 hover:bg-gray-700 rounded p-1">
													<Checkbox
														id="github-following"
														checked={githubVisibility.following}
														onCheckedChange={() =>
															toggleGithubField("following")
														}
														className="border-gray-500"
													/>
													<label
														htmlFor="github-following"
														className="text-sm text-gray-400 cursor-pointer flex-1"
													>
														Following
													</label>
												</div>
												<div className="flex items-center space-x-2 hover:bg-gray-700 rounded p-1">
													<Checkbox
														id="github-stars"
														checked={githubVisibility.stars}
														onCheckedChange={() => toggleGithubField("stars")}
														className="border-gray-500"
													/>
													<label
														htmlFor="github-stars"
														className="text-sm text-gray-400 cursor-pointer flex-1"
													>
														Stars
													</label>
												</div>
												<div className="flex items-center space-x-2 hover:bg-gray-700 rounded p-1">
													<Checkbox
														id="github-repos"
														checked={githubVisibility.repositories}
														onCheckedChange={() =>
															toggleGithubField("repositories")
														}
														className="border-gray-500"
													/>
													<label
														htmlFor="github-repos"
														className="text-sm text-gray-400 cursor-pointer flex-1"
													>
														Repos
													</label>
												</div>
											</div>
										)}
									</div>

									{/* LinkedIn Section */}
									<DropdownMenuSeparator className="bg-gray-700" />
									<div className="px-2 py-1.5">
										<div className="flex items-center space-x-2 hover:bg-gray-700 rounded p-1">
											<Checkbox
												id="linkedin"
												checked={columnVisibility.linkedin}
												onCheckedChange={() => toggleColumn("linkedin")}
												className="border-gray-500"
											/>
											<label
												htmlFor="linkedin"
												className="text-sm text-gray-300 cursor-pointer flex-1 font-medium"
											>
												LinkedIn
											</label>
										</div>
									</div>

									{/* Sort Section */}
									<DropdownMenuSeparator className="bg-gray-700" />
									<DropdownMenuLabel className="text-gray-300">
										Sort By
									</DropdownMenuLabel>
									<div className="px-2 py-1.5 space-y-1">
										{[
											{field: "github-followers", label: "GitHub Followers"},
											{field: "github-following", label: "GitHub Following"},
											{field: "github-stars", label: "GitHub Stars"},
											{field: "github-repos", label: "GitHub Repos"},
											{field: "twitter-followers", label: "Twitter Followers"},
										].map(({field, label}) => (
											<button
												key={field}
												onClick={() => handleSort(field)}
												className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-700 flex items-center justify-between ${
													sortOption?.field === field
														? "bg-gray-700 text-blue-400"
														: "text-gray-300"
												}`}
											>
												<span>{label}</span>
												{sortOption?.field === field && (
													<span className="text-xs">
														{sortOption.direction === "desc" ? "↓" : "↑"}
													</span>
												)}
											</button>
										))}
									</div>

									{/* Reset Section */}
									<DropdownMenuSeparator className="bg-gray-700" />
									<div className="px-2 py-1.5">
										<button
											onClick={resetToDefault}
											className="w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-700 text-red-400 hover:text-red-300"
										>
											Reset to Default
										</button>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Active Filters Display */}
					{activeFilters.length > 0 && (
						<div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-700">
							<span className="text-gray-400 text-sm">Active filters:</span>
							{activeFilters.map((filter) => (
								<div key={filter.type} className="flex items-center gap-1">
									<span className="text-gray-500 text-xs">{filter.type}:</span>
									{filter.values.map((value, idx) => (
										<span
											key={`${filter.type}-${idx}`}
											className="px-2 py-0.5 bg-blue-600/30 text-blue-300 rounded text-xs flex items-center"
										>
											{value}
											{idx < filter.values.length - 1 && (
												<span className="ml-1 text-blue-400">+</span>
											)}
										</span>
									))}
								</div>
							))}
						</div>
					)}

					{/* Search Tips */}
					<div className="text-xs text-gray-500 mt-3">
						💡 Tip: Use commas to search multiple terms. Search looks through
						name, public email, skills, bio, and readme (e.g., "healthcare, AI"
						finds developers with both terms)
					</div>

					<div className="flex items-center justify-between mt-4">
						<div className="flex items-center space-x-2">
							<span className="text-gray-300 text-sm">Show</span>
							<Select
								value={entriesPerPage.toString()}
								onValueChange={handleEntriesPerPageChange}
							>
								<SelectTrigger className="w-20 bg-gray-700 border-gray-600 text-white">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-gray-800 border-gray-700">
									{[25, 50, 100, 200, 500, 1000].map((n) => (
										<SelectItem
											key={n}
											value={n.toString()}
											className="text-gray-300 hover:bg-gray-700"
										>
											{n}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<span className="text-gray-300 text-sm">entries per page</span>
						</div>
						<div className="text-gray-300 text-sm">
							Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
							{Math.min(
								(currentPage - 1) * entriesPerPage + filteredDevelopers.length,
								totalEntries,
							)}{" "}
							of {totalEntries} entries
						</div>
					</div>
				</div>

				<div className="bg-gray-800 rounded-lg overflow-hidden">
					<div className="p-4 border-b border-gray-700">
						<h2 className="text-xl font-semibold">
							{totalEntries} Developer{totalEntries !== 1 ? "s" : ""} Found
						</h2>
					</div>

					<div className="overflow-x-auto">
						<Table className="table-fixed w-full">
							<TableHeader>
								<TableRow className="border-gray-700">
									<TableHead className="text-gray-300 w-48">
										Developer
									</TableHead>
									{columnVisibility.skills && (
										<TableHead className="text-gray-300 w-40">Skills</TableHead>
									)}
									{columnVisibility.github && (
										<TableHead className="text-gray-300 w-36">GitHub</TableHead>
									)}
									{columnVisibility.linkedin && (
										<TableHead className="text-gray-300 w-28">
											LinkedIn
										</TableHead>
									)}
									{columnVisibility.twitter && (
										<TableHead className="text-gray-300 w-32">
											Twitter
										</TableHead>
									)}
									{columnVisibility.contact && (
										<TableHead className="text-gray-300 w-28">Email</TableHead>
									)}
									{columnVisibility.bio && (
										<TableHead className="text-gray-300 w-64">
											<span className="flex items-center">
												<FileText className="h-4 w-4 mr-1" />
												Bio
											</span>
										</TableHead>
									)}
									{columnVisibility.readme && (
										<TableHead className="text-gray-300 w-64">
											<span className="flex items-center">
												<BookOpen className="h-4 w-4 mr-1" />
												ReadMe
											</span>
										</TableHead>
									)}
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredDevelopers.map((dev) => (
									<TableRow key={dev.id} className="border-gray-700">
										<TableCell className="align-top">
											<div className="flex flex-col">
												<span className="font-medium text-white truncate">
													{dev.name}
												</span>
												<div className="flex items-center text-gray-400 text-sm mt-1">
													<MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
													<span className="truncate">{dev.location}</span>
												</div>
												{dev.githubCreatedAt && (
													<div className="flex items-center text-gray-500 text-xs mt-1">
														<Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
														<span>
															Joined {formatDate(dev.githubCreatedAt)}
														</span>
													</div>
												)}
											</div>
										</TableCell>

										{columnVisibility.skills && (
											<TableCell className="align-top">
												<div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
													{dev.skills.slice(0, 5).map((s) => (
														<span
															key={s}
															className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs whitespace-nowrap"
														>
															{s}
														</span>
													))}
													{dev.skills.length > 5 && (
														<span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs">
															+{dev.skills.length - 5} more
														</span>
													)}
												</div>
											</TableCell>
										)}

										{columnVisibility.github && (
											<TableCell className="align-top">
												{dev.githubUrl &&
												dev.githubUrl !== "https://github.com/" ? (
													<>
														<a
															href={dev.githubUrl}
															target="_blank"
															rel="noopener noreferrer"
															className="text-blue-400 flex items-center text-sm"
														>
															<Github className="h-3 w-3 mr-1 flex-shrink-0" />{" "}
															Profile{" "}
															<ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
														</a>
														<div className="text-xs text-gray-400 mt-1">
															{githubVisibility.followers && (
																<div>
																	👥 {dev.socialMedia.github.followers}{" "}
																	followers
																</div>
															)}
															{githubVisibility.following && (
																<div>
																	👤 {dev.socialMedia.github.following}{" "}
																	following
																</div>
															)}
															{githubVisibility.stars && (
																<div>
																	⭐ {dev.socialMedia.github.stars} stars
																</div>
															)}
															{githubVisibility.repositories && (
																<div>
																	📁 {dev.socialMedia.github.repositories} repos
																</div>
															)}
														</div>
													</>
												) : (
													<span className="text-gray-500 text-sm italic">
														No Account
													</span>
												)}
											</TableCell>
										)}

										{columnVisibility.linkedin && (
											<TableCell className="align-top">
												{dev.socialMedia.linkedin.url ? (
													<a
														href={dev.socialMedia.linkedin.url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-400 flex items-center text-sm"
													>
														<Linkedin className="h-3 w-3 mr-1 flex-shrink-0" />{" "}
														Profile{" "}
														<ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
													</a>
												) : (
													<span className="text-gray-500 text-sm italic">
														No Account
													</span>
												)}
											</TableCell>
										)}

										{columnVisibility.twitter && (
											<TableCell className="align-top">
												{dev.socialMedia.twitter.url ? (
													<>
														<a
															href={dev.socialMedia.twitter.url}
															target="_blank"
															rel="noopener noreferrer"
															className="text-blue-400 flex items-center text-sm"
														>
															<Twitter className="h-3 w-3 mr-1 flex-shrink-0" />{" "}
															Profile{" "}
															<ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
														</a>
														<div className="text-xs text-gray-400 mt-1">
															👥 {dev.socialMedia.twitter.followers} followers
														</div>
													</>
												) : (
													<span className="text-gray-500 text-sm italic">
														No Account
													</span>
												)}
											</TableCell>
										)}

										{columnVisibility.contact && (
											<TableCell className="align-top">
												{dev.email && dev.email.trim() !== "" ? (
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																className="text-blue-400 hover:text-blue-300 flex items-center px-0 h-auto"
															>
																<Mail className="h-4 w-4 mr-1" />
																Contact
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
															<DropdownMenuLabel className="text-gray-300 text-sm mb-1">
																{dev.email}
															</DropdownMenuLabel>
															<DropdownMenuSeparator className="bg-gray-700" />
															<button
																onClick={() => {
																	navigator.clipboard.writeText(
																		dev.email.trim(),
																	);
																	toast({
																		title: "Copied!",
																		description:
																			"Email address copied to clipboard.",
																	});
																}}
																className="w-full text-left px-3 py-2 hover:bg-gray-700 text-sm"
															>
																📋 Copy Email
															</button>
															<button
																onClick={() => {
																	const email = dev.email.trim();
																	const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
																		email,
																	)}`;
																	window.open(
																		gmailUrl,
																		"_blank",
																		"noopener,noreferrer",
																	);
																}}
																className="w-full text-left px-3 py-2 hover:bg-gray-700 text-sm"
															>
																📬 Contact Now
															</button>
														</DropdownMenuContent>
													</DropdownMenu>
												) : (
													<span className="text-gray-500 text-sm italic">
														No Account
													</span>
												)}
											</TableCell>
										)}

										{columnVisibility.bio && (
											<TableCell className="align-top">
												<TruncatedTextWithTooltip
													text={dev.bio}
													maxLength={150}
													icon={FileText}
												/>
											</TableCell>
										)}

										{columnVisibility.readme && (
											<TableCell className="align-top">
												<TruncatedTextWithTooltip
													text={dev.profileReadme}
													maxLength={150}
													icon={BookOpen}
												/>
											</TableCell>
										)}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>

				{/* Pagination */}
				<div className="flex justify-center mt-6">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
									className={`${
										currentPage === 1
											? "opacity-50 pointer-events-none"
											: "cursor-pointer"
									}`}
								/>
							</PaginationItem>

							{renderPaginationItems()}

							<PaginationItem>
								<PaginationNext
									onClick={() =>
										handlePageChange(Math.min(currentPage + 1, totalPages))
									}
									className={`${
										currentPage === totalPages
											? "opacity-50 pointer-events-none"
											: "cursor-pointer"
									}`}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</div>
	);
};

export default DatabaseSearch;
