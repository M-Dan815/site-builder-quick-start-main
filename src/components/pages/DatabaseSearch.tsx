import { useState, useEffect } from "react";
import {
  Search, Filter, Users, MapPin, Mail, Github, Linkedin, Twitter, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious
} from "@/components/ui/pagination";
import { Developer } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface ExtendedDeveloper extends Developer {
  socialMedia: {
    github: { followers: number; stars: number; repositories: number };
    linkedin: { url: string };
    twitter: { followers: number; url?: string };
  };
}

interface ColumnVisibility {
  skills: boolean;
  github: boolean;
  linkedin: boolean;
  twitter: boolean;
  contact: boolean;
}

interface GitHubVisibility {
  followers: boolean;
  stars: boolean;
  repositories: boolean;
}

interface SortOption {
  field: string;
  direction: "asc" | "desc";
}

const BACKEND_URL = "http://codepark.net:3000/"; // backend base
const MODULE_ID = 1; // module ID for users
const TABLE_PREFIX = "users__";

const fieldMap: Record<string, string> = {
  "github-followers": "follower_count",
  "github-stars": "star_count",
  "github-repos": "repo_count",
  "twitter-followers": "twitter_follower_count",
};

const DatabaseSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filteredDevelopers, setFilteredDevelopers] = useState<ExtendedDeveloper[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [sortOption, setSortOption] = useState<SortOption | null>(null);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    skills: true,
    github: true,
    linkedin: true,
    twitter: true,
    contact: true,
  });

  const [githubVisibility, setGithubVisibility] = useState<GitHubVisibility>({
    followers: true,
    stars: true,
    repositories: true,
  });

  const {toast} = useToast()

  // ✅ Always call backend even without filters
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption, entriesPerPage, currentPage]);

  const mapToDeveloper = (item: Record<string, any>): ExtendedDeveloper => ({
    id: item[`${TABLE_PREFIX}id`],
    name: item[`${TABLE_PREFIX}full_name`] || "",
    email: item[`${TABLE_PREFIX}email`] || "",
    skills: item[`${TABLE_PREFIX}primary_languages`]
      ? item[`${TABLE_PREFIX}primary_languages`].split(",").map((s: string) => s.trim())
      : [],
    experience: 0,
    location: item[`${TABLE_PREFIX}city`] || "",
    githubUrl: `https://github.com/${item[`${TABLE_PREFIX}username`] || ""}`,
    socialMedia: {
      github: {
        followers: item[`${TABLE_PREFIX}follower_count`] || 0,
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
      if (selectedSkill) body[`${MODULE_ID}__primary_languages`] = selectedSkill;
      if (locationFilter) body[`${MODULE_ID}__city`] = locationFilter;

      const response = await fetch(`${BACKEND_URL}/api/crm/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSkill("");
    setLocationFilter("");
    setSortOption(null);
    setCurrentPage(1);
    handleSearch();
  };

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const toggleGithubField = (field: keyof GitHubVisibility) => {
    setGithubVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSort = (field: string) => {
    setSortOption((prev) =>
      prev?.field === field
        ? { field, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { field, direction: "desc" }
    );
  };

  const handleEntriesPerPageChange = (value: string) => {
    setEntriesPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Users className="mr-3 text-blue-400" />
            Developer Database
          </h1>
          <p className="text-gray-400">
            Search and filter through the user database
          </p>
        </div>

        {/* Search + Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Input
              placeholder="Filter by skill"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            <Input
              placeholder="Filter by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            <div className="flex space-x-2">
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Filter className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Reset
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-gray-800 border-gray-700">
                  <DropdownMenuLabel className="text-gray-300">Toggle Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  
                  {/* Main columns */}
                  {Object.entries(columnVisibility).filter(([key]) => !['github', 'linkedin'].includes(key)).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-700 rounded">
                      <Checkbox
                        id={key}
                        checked={value}
                        onCheckedChange={() => toggleColumn(key as keyof ColumnVisibility)}
                        className="border-gray-500"
                      />
                      <label
                        htmlFor={key}
                        className="text-sm text-gray-300 capitalize cursor-pointer flex-1"
                      >
                        {key === 'twitter' ? 'Twitter' : key === 'contact' ? 'Email' : key}
                      </label>
                    </div>
                  ))}

                  {/* GitHub Section */}
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <div className="px-2 py-1.5">
                    <div className="flex items-center space-x-2 hover:bg-gray-700 rounded p-1">
                      <Checkbox
                        id="github"
                        checked={columnVisibility.github}
                        onCheckedChange={() => toggleColumn('github')}
                        className="border-gray-500"
                      />
                      <label htmlFor="github" className="text-sm text-gray-300 cursor-pointer flex-1 font-medium">
                        GitHub
                      </label>
                    </div>
                    {columnVisibility.github && (
                      <div className="ml-6 space-y-1 mt-2">
                        {Object.entries(githubVisibility).map(([key, value]) => (
                          <div key={key} className="flex items-center space-x-2 hover:bg-gray-700 rounded p-1">
                            <Checkbox
                              id={`github-${key}`}
                              checked={value}
                              onCheckedChange={() => toggleGithubField(key as keyof GitHubVisibility)}
                              className="border-gray-500"
                            />
                            <label
                              htmlFor={`github-${key}`}
                              className="text-sm text-gray-400 capitalize cursor-pointer flex-1"
                            >
                              {key === 'repositories' ? 'Repos' : key}
                            </label>
                          </div>
                        ))}
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
                        onCheckedChange={() => toggleColumn('linkedin')}
                        className="border-gray-500"
                      />
                      <label htmlFor="linkedin" className="text-sm text-gray-300 cursor-pointer flex-1 font-medium">
                        LinkedIn
                      </label>
                    </div>
                  </div>

                  {/* Sort Section */}
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuLabel className="text-gray-300">Sort By</DropdownMenuLabel>
                  <div className="px-2 py-1.5 space-y-1">
                    {[
                      { field: 'github-followers', label: 'GitHub Followers' },
                      { field: 'github-stars', label: 'GitHub Stars' },
                      { field: 'github-repos', label: 'GitHub Repos' },
                      { field: 'twitter-followers', label: 'Twitter Followers' }
                    ].map(({ field, label }) => (
                      <button
                        key={field}
                        onClick={() => handleSort(field)}
                        className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-700 flex items-center justify-between ${
                          sortOption?.field === field ? 'bg-gray-700 text-blue-400' : 'text-gray-300'
                        }`}
                      >
                        <span>{label}</span>
                        {sortOption?.field === field && (
                          <span className="text-xs">
                            {sortOption.direction === 'desc' ? '↓' : '↑'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Reset Section */}
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <div className="px-2 py-1.5">
                    <button
                      onClick={resetFilters}
                      className="w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-700 text-red-400 hover:text-red-300"
                    >
                      Reset to Default
                    </button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Pagination Selector */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">Show</span>
              <Select value={entriesPerPage.toString()} onValueChange={handleEntriesPerPageChange}>
                <SelectTrigger className="w-20 bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {[25, 50, 100, 200, 500, 1000].map((n) => (
                    <SelectItem key={n} value={n.toString()} className="text-gray-300 hover:bg-gray-700">
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
                totalEntries
              )}{" "}
              of {totalEntries} entries
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">
              {totalEntries} Developer{totalEntries !== 1 ? "s" : ""} Found
            </h2>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Developer</TableHead>
                  {columnVisibility.skills && <TableHead className="text-gray-300">Skills</TableHead>}
                  {columnVisibility.github && <TableHead className="text-gray-300">GitHub</TableHead>}
                  {columnVisibility.linkedin && <TableHead className="text-gray-300">LinkedIn</TableHead>}
                  {columnVisibility.twitter && <TableHead className="text-gray-300">Twitter</TableHead>}
                  {columnVisibility.contact && <TableHead className="text-gray-300">Email</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevelopers.map((dev) => (
                  <TableRow key={dev.id} className="border-gray-700">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{dev.name}</span>
                        <div className="flex items-center text-gray-400 text-sm mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {dev.location}
                        </div>
                      </div>
                    </TableCell>
                    {columnVisibility.skills && (
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {dev.skills.map((s) => (
                            <span key={s} className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs">
                              {s}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    )}
                    {/* GitHub */}
                    {columnVisibility.github && (
                      <TableCell>
                        {dev.githubUrl && dev.githubUrl !== "https://github.com/"
                          ? (
                            <>
                              <a
                                href={dev.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 flex items-center"
                              >
                                <Github className="h-3 w-3 mr-1" /> Profile{" "}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                              <div className="text-xs text-gray-400">
                                {githubVisibility.followers && (
                                  <div>👥 {dev.socialMedia.github.followers} followers</div>
                                )}
                                {githubVisibility.stars && (
                                  <div>⭐ {dev.socialMedia.github.stars} stars</div>
                                )}
                                {githubVisibility.repositories && (
                                  <div>📁 {dev.socialMedia.github.repositories} repos</div>
                                )}
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-500 text-sm italic">No Account</span>
                          )}
                      </TableCell>
                    )}

                    {/* LinkedIn */}
                    {columnVisibility.linkedin && (
                      <TableCell>
                        {dev.socialMedia.linkedin.url ? (
                          <a
                            href={dev.socialMedia.linkedin.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 flex items-center"
                          >
                            <Linkedin className="h-3 w-3 mr-1" /> Profile{" "}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm italic">No Account</span>
                        )}
                      </TableCell>
                    )}

                    {/* Twitter */}
                    {columnVisibility.twitter && (
                      <TableCell>
                        {dev.socialMedia.twitter.url ? (
                          <>
                            <a
                              href={dev.socialMedia.twitter.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 flex items-center"
                            >
                              <Twitter className="h-3 w-3 mr-1" /> Profile{" "}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                            <div className="text-xs text-gray-400">
                              👥 {dev.socialMedia.twitter.followers} followers
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-500 text-sm italic">No Account</span>
                        )}
                      </TableCell>
                    )}
                    {/* Contact */}
                    {columnVisibility.contact && (
                      <TableCell>
                        {dev.email && dev.email.trim() !== "" ? (
                              <button
                              onClick={() => {
                                const email = dev.email.trim();
                                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
                                window.open(gmailUrl, "_blank", "noopener,noreferrer");
                              }}
                              className="text-blue-400 hover:text-blue-300 flex items-center"
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Contact
                            </button>
                        ) : (
                          <span className="text-gray-500 text-sm italic">No Account</span>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-700">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum);
                          }}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseSearch;
