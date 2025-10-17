
import { useState, useEffect } from "react";
import { Search, Filter, Users, MapPin, Code, Mail, Calendar, Github, Linkedin, Twitter, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Developer } from "@/types";

// Extended mock data with 50+ developers
const mockDevelopers: Developer[] = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex.chen@email.com",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    experience: 5,
    location: "Victoria, BC",
    githubUrl: "https://github.com/alexchen",
    socialMedia: {
      github: { followers: 245, stars: 1200, repositories: 32 },
      linkedin: { url: "https://linkedin.com/in/alexchen" },
      twitter: { followers: 423 }
    }
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    skills: ["Python", "Django", "AWS", "Docker"],
    experience: 7,
    location: "Victoria, BC",
    githubUrl: "https://github.com/sarahjohnson",
    socialMedia: {
      github: { followers: 512, stars: 2890, repositories: 45 },
      linkedin: { url: "https://linkedin.com/in/sarahjohnson" },
      twitter: { followers: 789 }
    }
  },
  {
    id: "3",
    name: "Mike Rodriguez",
    email: "mike.rodriguez@email.com",
    skills: ["Java", "Spring Boot", "Kubernetes", "MongoDB"],
    experience: 3,
    location: "Victoria, BC",
    githubUrl: "https://github.com/mikerodriguez",
    socialMedia: {
      github: { followers: 156, stars: 678, repositories: 18 },
      linkedin: { url: "https://linkedin.com/in/mikerodriguez" }
    }
  },
  {
    id: "4",
    name: "Emily Zhang",
    email: "emily.zhang@email.com",
    skills: ["Vue.js", "JavaScript", "Firebase", "GraphQL"],
    experience: 4,
    location: "Victoria, BC",
    githubUrl: "https://github.com/emilyzhang",
    socialMedia: {
      github: { followers: 389, stars: 1456, repositories: 28 },
      linkedin: { url: "https://linkedin.com/in/emilyzhang" },
      twitter: { followers: 234 }
    }
  },
  {
    id: "5",
    name: "David Thompson",
    email: "david.thompson@email.com",
    skills: ["C#", ".NET", "Azure", "SQL Server"],
    experience: 8,
    location: "Victoria, BC",
    githubUrl: "https://github.com/davidthompson",
    socialMedia: {
      github: { followers: 723, stars: 3245, repositories: 56 },
      linkedin: { url: "https://linkedin.com/in/davidthompson" },
      twitter: { followers: 1123 }
    }
  },
  {
    id: "6",
    name: "Jessica Martinez",
    email: "jessica.martinez@email.com",
    skills: ["React Native", "Flutter", "iOS", "Android"],
    experience: 6,
    location: "Vancouver, BC",
    githubUrl: "https://github.com/jessicamartinez",
    socialMedia: {
      github: { followers: 432, stars: 1987, repositories: 29 },
      linkedin: { url: "https://linkedin.com/in/jessicamartinez" },
      twitter: { followers: 345 }
    }
  },
  {
    id: "7",
    name: "Robert Kim",
    email: "robert.kim@email.com",
    skills: ["Go", "Rust", "Docker", "Redis"],
    experience: 9,
    location: "Victoria, BC",
    githubUrl: "https://github.com/robertkim",
    socialMedia: {
      github: { followers: 891, stars: 4567, repositories: 67 },
      linkedin: { url: "https://linkedin.com/in/robertkim" },
      twitter: { followers: 567 }
    }
  },
  {
    id: "8",
    name: "Amanda Wilson",
    email: "amanda.wilson@email.com",
    skills: ["Angular", "TypeScript", "RxJS", "NgRx"],
    experience: 4,
    location: "Calgary, AB",
    githubUrl: "https://github.com/amandawilson",
    socialMedia: {
      github: { followers: 234, stars: 890, repositories: 22 },
      linkedin: { url: "https://linkedin.com/in/amandawilson" },
      twitter: { followers: 189 }
    }
  },
  {
    id: "9",
    name: "Chris Lee",
    email: "chris.lee@email.com",
    skills: ["Svelte", "SvelteKit", "TailwindCSS", "Supabase"],
    experience: 3,
    location: "Toronto, ON",
    githubUrl: "https://github.com/chrislee",
    socialMedia: {
      github: { followers: 167, stars: 456, repositories: 15 },
      linkedin: { url: "https://linkedin.com/in/chrislee" },
      twitter: { followers: 123 }
    }
  },
  {
    id: "10",
    name: "Rachel Davis",
    email: "rachel.davis@email.com",
    skills: ["PHP", "Laravel", "MySQL", "Blade"],
    experience: 5,
    location: "Montreal, QC",
    githubUrl: "https://github.com/racheldavis",
    socialMedia: {
      github: { followers: 345, stars: 1234, repositories: 31 },
      linkedin: { url: "https://linkedin.com/in/racheldavis" },
      twitter: { followers: 234 }
    }
  },
  {
    id: "11",
    name: "Kevin Brown",
    email: "kevin.brown@email.com",
    skills: ["Next.js", "React", "Vercel", "Prisma"],
    experience: 6,
    location: "Victoria, BC",
    githubUrl: "https://github.com/kevinbrown",
    socialMedia: {
      github: { followers: 456, stars: 1678, repositories: 38 },
      linkedin: { url: "https://linkedin.com/in/kevinbrown" },
      twitter: { followers: 345 }
    }
  },
  {
    id: "12",
    name: "Nicole Garcia",
    email: "nicole.garcia@email.com",
    skills: ["Ruby", "Rails", "Sidekiq", "Heroku"],
    experience: 7,
    location: "Vancouver, BC",
    githubUrl: "https://github.com/nicolegarcia",
    socialMedia: {
      github: { followers: 567, stars: 2345, repositories: 43 },
      linkedin: { url: "https://linkedin.com/in/nicolegarcia" },
      twitter: { followers: 456 }
    }
  },
  {
    id: "13",
    name: "Daniel Taylor",
    email: "daniel.taylor@email.com",
    skills: ["Kotlin", "Android", "Jetpack Compose", "Room"],
    experience: 4,
    location: "Ottawa, ON",
    githubUrl: "https://github.com/danieltaylor",
    socialMedia: {
      github: { followers: 234, stars: 789, repositories: 19 },
      linkedin: { url: "https://linkedin.com/in/danieltaylor" },
      twitter: { followers: 167 }
    }
  },
  {
    id: "14",
    name: "Laura Anderson",
    email: "laura.anderson@email.com",
    skills: ["Swift", "iOS", "SwiftUI", "Core Data"],
    experience: 5,
    location: "Halifax, NS",
    githubUrl: "https://github.com/lauraanderson",
    socialMedia: {
      github: { followers: 345, stars: 1123, repositories: 26 },
      linkedin: { url: "https://linkedin.com/in/lauraanderson" },
      twitter: { followers: 234 }
    }
  },
  {
    id: "15",
    name: "Michael Chang",
    email: "michael.chang@email.com",
    skills: ["Elixir", "Phoenix", "LiveView", "PostgreSQL"],
    experience: 8,
    location: "Winnipeg, MB",
    githubUrl: "https://github.com/michaelchang",
    socialMedia: {
      github: { followers: 678, stars: 3456, repositories: 52 },
      linkedin: { url: "https://linkedin.com/in/michaelchang" },
      twitter: { followers: 567 }
    }
  },
  {
    id: "16",
    name: "Stephanie White",
    email: "stephanie.white@email.com",
    skills: ["Scala", "Akka", "Kafka", "Spark"],
    experience: 9,
    location: "Edmonton, AB",
    githubUrl: "https://github.com/stephaniewhite",
    socialMedia: {
      github: { followers: 789, stars: 4123, repositories: 61 },
      linkedin: { url: "https://linkedin.com/in/stephaniewhite" },
      twitter: { followers: 678 }
    }
  },
  {
    id: "17",
    name: "James Wilson",
    email: "james.wilson@email.com",
    skills: ["Clojure", "ClojureScript", "Reagent", "Ring"],
    experience: 6,
    location: "Saskatoon, SK",
    githubUrl: "https://github.com/jameswilson",
    socialMedia: {
      github: { followers: 345, stars: 1567, repositories: 34 },
      linkedin: { url: "https://linkedin.com/in/jameswilson" },
      twitter: { followers: 289 }
    }
  },
  {
    id: "18",
    name: "Ashley Moore",
    email: "ashley.moore@email.com",
    skills: ["Haskell", "PureScript", "Elm", "Category Theory"],
    experience: 7,
    location: "St. John's, NL",
    githubUrl: "https://github.com/ashleymoore",
    socialMedia: {
      github: { followers: 456, stars: 2234, repositories: 39 },
      linkedin: { url: "https://linkedin.com/in/ashleymoore" },
      twitter: { followers: 345 }
    }
  },
  {
    id: "19",
    name: "Brian Clark",
    email: "brian.clark@email.com",
    skills: ["F#", ".NET", "Functional Programming", "Azure Functions"],
    experience: 5,
    location: "Regina, SK",
    githubUrl: "https://github.com/brianclark",
    socialMedia: {
      github: { followers: 234, stars: 890, repositories: 23 },
      linkedin: { url: "https://linkedin.com/in/brianclark" },
      twitter: { followers: 189 }
    }
  },
  {
    id: "20",
    name: "Jennifer Lopez",
    email: "jennifer.lopez@email.com",
    skills: ["COBOL", "Mainframe", "JCL", "CICS"],
    experience: 15,
    location: "Charlottetown, PEI",
    githubUrl: "https://github.com/jenniferlopez",
    socialMedia: {
      github: { followers: 123, stars: 345, repositories: 12 },
      linkedin: { url: "https://linkedin.com/in/jenniferlopez" },
      twitter: { followers: 89 }
    }
  },
  {
    id: "21",
    name: "Ryan Thompson",
    email: "ryan.thompson@email.com",
    skills: ["Fortran", "MATLAB", "R", "Scientific Computing"],
    experience: 12,
    location: "Yellowknife, NT",
    githubUrl: "https://github.com/ryanthompson",
    socialMedia: {
      github: { followers: 234, stars: 678, repositories: 18 },
      linkedin: { url: "https://linkedin.com/in/ryanthompson" },
      twitter: { followers: 156 }
    }
  },
  {
    id: "22",
    name: "Melissa Davis",
    email: "melissa.davis@email.com",
    skills: ["Perl", "Bash", "Linux", "DevOps"],
    experience: 10,
    location: "Whitehorse, YT",
    githubUrl: "https://github.com/melissadavis",
    socialMedia: {
      github: { followers: 345, stars: 1234, repositories: 45 },
      linkedin: { url: "https://linkedin.com/in/melissadavis" },
      twitter: { followers: 234 }
    }
  },
  {
    id: "23",
    name: "Andrew Miller",
    email: "andrew.miller@email.com",
    skills: ["Assembly", "C", "Embedded Systems", "RTOS"],
    experience: 11,
    location: "Iqaluit, NU",
    githubUrl: "https://github.com/andrewmiller",
    socialMedia: {
      github: { followers: 456, stars: 1567, repositories: 28 },
      linkedin: { url: "https://linkedin.com/in/andrewmiller" },
      twitter: { followers: 289 }
    }
  },
  {
    id: "24",
    name: "Lisa Johnson",
    email: "lisa.johnson@email.com",
    skills: ["Julia", "Python", "Machine Learning", "TensorFlow"],
    experience: 6,
    location: "Victoria, BC",
    githubUrl: "https://github.com/lisajohnson",
    socialMedia: {
      github: { followers: 567, stars: 2345, repositories: 41 },
      linkedin: { url: "https://linkedin.com/in/lisajohnson" },
      twitter: { followers: 456 }
    }
  },
  {
    id: "25",
    name: "Mark Rodriguez",
    email: "mark.rodriguez@email.com",
    skills: ["Dart", "Flutter", "Firebase", "Material Design"],
    experience: 4,
    location: "Vancouver, BC",
    githubUrl: "https://github.com/markrodriguez",
    socialMedia: {
      github: { followers: 234, stars: 789, repositories: 21 },
      linkedin: { url: "https://linkedin.com/in/markrodriguez" },
      twitter: { followers: 178 }
    }
  },
  {
    id: "26",
    name: "Karen Williams",
    email: "karen.williams@email.com",
    skills: ["Blockchain", "Solidity", "Web3", "Ethereum"],
    experience: 3,
    location: "Toronto, ON",
    githubUrl: "https://github.com/karenwilliams",
    socialMedia: {
      github: { followers: 345, stars: 1123, repositories: 19 },
      linkedin: { url: "https://linkedin.com/in/karenwilliams" },
      twitter: { followers: 289 }
    }
  },
  {
    id: "27",
    name: "Paul Anderson",
    email: "paul.anderson@email.com",
    skills: ["Unity", "C#", "Game Development", "Blender"],
    experience: 5,
    location: "Montreal, QC",
    githubUrl: "https://github.com/paulanderson",
    socialMedia: {
      github: { followers: 456, stars: 1456, repositories: 33 },
      linkedin: { url: "https://linkedin.com/in/paulanderson" },
      twitter: { followers: 345 }
    }
  },
  {
    id: "28",
    name: "Sandra Lee",
    email: "sandra.lee@email.com",
    skills: ["Unreal Engine", "C++", "Blueprint", "VR"],
    experience: 7,
    location: "Calgary, AB",
    githubUrl: "https://github.com/sandralee",
    socialMedia: {
      github: { followers: 567, stars: 2234, repositories: 38 },
      linkedin: { url: "https://linkedin.com/in/sandralee" },
      twitter: { followers: 456 }
    }
  },
  {
    id: "29",
    name: "Timothy Brown",
    email: "timothy.brown@email.com",
    skills: ["Godot", "GDScript", "2D Games", "Pixel Art"],
    experience: 4,
    location: "Ottawa, ON",
    githubUrl: "https://github.com/timothybrown",
    socialMedia: {
      github: { followers: 234, stars: 890, repositories: 24 },
      linkedin: { url: "https://linkedin.com/in/timothybrown" },
      twitter: { followers: 234 }
    }
  },
  {
    id: "30",
    name: "Diana Garcia",
    email: "diana.garcia@email.com",
    skills: ["Construct 3", "JavaScript", "HTML5 Games", "WebGL"],
    experience: 3,
    location: "Halifax, NS",
    githubUrl: "https://github.com/dianagarcia",
    socialMedia: {
      github: { followers: 178, stars: 456, repositories: 16 },
      linkedin: { url: "https://linkedin.com/in/dianagarcia" },
      twitter: { followers: 156 }
    }
  }
];

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
  direction: 'asc' | 'desc';
}

const DatabaseSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filteredDevelopers, setFilteredDevelopers] = useState(mockDevelopers);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [sortOption, setSortOption] = useState<SortOption | null>(null);
  
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    skills: true,
    github: true,
    linkedin: true,
    twitter: true,
    contact: true,
  });

  const [githubVisibility, setGitHubVisibility] = useState<GitHubVisibility>({
    followers: true,
    stars: true,
    repositories: true,
  });


  // Trigger search when sort option changes
  useEffect(() => {
    handleSearch();
  }, [sortOption]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredDevelopers.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentDevelopers = filteredDevelopers.slice(startIndex, endIndex);

  const handleSearch = () => {
    let filtered = mockDevelopers;

    if (searchTerm) {
      filtered = filtered.filter(dev => 
        dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSkill) {
      filtered = filtered.filter(dev => 
        dev.skills.some(skill => skill.toLowerCase().includes(selectedSkill.toLowerCase()))
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(dev => 
        dev.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Apply sorting
    if (sortOption) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;
        
        switch (sortOption.field) {
          case 'github-followers':
            aValue = a.socialMedia?.github?.followers || 0;
            bValue = b.socialMedia?.github?.followers || 0;
            break;
          case 'github-stars':
            aValue = a.socialMedia?.github?.stars || 0;
            bValue = b.socialMedia?.github?.stars || 0;
            break;
          case 'github-repos':
            aValue = a.socialMedia?.github?.repositories || 0;
            bValue = b.socialMedia?.github?.repositories || 0;
            break;
          case 'twitter-followers':
            aValue = a.socialMedia?.twitter?.followers || 0;
            bValue = b.socialMedia?.twitter?.followers || 0;
            break;
          default:
            return 0;
        }

        if (sortOption.direction === 'desc') {
          return bValue - aValue;
        } else {
          return aValue - bValue;
        }
      });
    }

    setFilteredDevelopers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSkill("");
    setLocationFilter("");
    setSortOption(null);
    setFilteredDevelopers(mockDevelopers);
    setCurrentPage(1);
  };

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const toggleGitHubField = (field: keyof GitHubVisibility) => {
    setGitHubVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSort = (field: string) => {
    setSortOption(prev => {
      if (prev?.field === field) {
        // If same field, toggle direction
        return { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        // If different field, default to descending
        return { field, direction: 'desc' };
      }
    });
  };


  const handleEntriesPerPageChange = (value: string) => {
    setEntriesPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing entries per page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Users className="mr-3 text-blue-400" />
            Developer Database
          </h1>
          <p className="text-gray-400">Search and filter through our comprehensive database of developers</p>
        </div>

        {/* Search and Filter Section */}
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
              placeholder="Filter by skill (e.g., React)"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            <Input
              placeholder="Filter by location (e.g., Victoria, BC)"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            <div className="flex space-x-2">
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Filter className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button onClick={resetFilters} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
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
                        {key === 'twitter' ? 'Twitter' : key}
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
                              onCheckedChange={() => toggleGitHubField(key as keyof GitHubVisibility)}
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
          
          {/* Entries per page selector */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">Show</span>
              <Select value={entriesPerPage.toString()} onValueChange={handleEntriesPerPageChange}>
                <SelectTrigger className="w-20 bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="25" className="text-gray-300 hover:bg-gray-700">25</SelectItem>
                  <SelectItem value="50" className="text-gray-300 hover:bg-gray-700">50</SelectItem>
                  <SelectItem value="100" className="text-gray-300 hover:bg-gray-700">100</SelectItem>
                  <SelectItem value="200" className="text-gray-300 hover:bg-gray-700">200</SelectItem>
                  <SelectItem value="300" className="text-gray-300 hover:bg-gray-700">300</SelectItem>
                  <SelectItem value="400" className="text-gray-300 hover:bg-gray-700">400</SelectItem>
                  <SelectItem value="500" className="text-gray-300 hover:bg-gray-700">500</SelectItem>
                  <SelectItem value="1000" className="text-gray-300 hover:bg-gray-700">1000</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-gray-300 text-sm">entries per page</span>
            </div>
            <div className="text-gray-300 text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredDevelopers.length)} of {filteredDevelopers.length} entries
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">
              {filteredDevelopers.length} Developer{filteredDevelopers.length !== 1 ? 's' : ''} Found
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-700/50">
                  <TableHead className="text-gray-300">Developer</TableHead>
                  {columnVisibility.skills && <TableHead className="text-gray-300">Skills</TableHead>}
                  {columnVisibility.github && <TableHead className="text-gray-300">GitHub</TableHead>}
                  {columnVisibility.linkedin && <TableHead className="text-gray-300">LinkedIn</TableHead>}
                  {columnVisibility.twitter && <TableHead className="text-gray-300">Twitter</TableHead>}
                  {columnVisibility.contact && <TableHead className="text-gray-300">Contact</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDevelopers.map((developer) => (
                  <TableRow key={developer.id} className="border-gray-700 hover:bg-gray-700/50">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{developer.name}</span>
                        <div className="flex items-center text-gray-400 text-sm mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {developer.location}
                        </div>
                      </div>
                    </TableCell>
                    {columnVisibility.skills && (
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {developer.skills.map((skill) => (
                            <span 
                              key={skill} 
                              className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.github && (
                      <TableCell>
                        {developer.socialMedia?.github ? (
                          <div className="text-gray-300 space-y-2">
                            <div className="flex justify-center">
                              <a 
                                href={developer.githubUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                              >
                                <Github className="h-3 w-3 mr-1" />
                                View Profile
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                            <div className="space-y-1 text-center">
                              {githubVisibility.followers && (
                                <div className="text-xs">👥 {developer.socialMedia.github.followers} followers</div>
                              )}
                              {githubVisibility.stars && (
                                <div className="text-xs">⭐ {developer.socialMedia.github.stars} stars</div>
                              )}
                              {githubVisibility.repositories && (
                                <div className="text-xs">📁 {developer.socialMedia.github.repositories} repos</div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.linkedin && (
                      <TableCell>
                        {developer.socialMedia?.linkedin ? (
                          <div className="text-gray-300 space-y-2">
                            <div className="flex justify-center">
                              <a 
                                href={developer.socialMedia.linkedin.url || "#"} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                              >
                                <Linkedin className="h-3 w-3 mr-1" />
                                View Profile
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.twitter && (
                      <TableCell>
                        {developer.socialMedia?.twitter ? (
                          <div className="text-gray-300 space-y-2">
                            <div className="flex justify-center">
                              <a 
                                href="#" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                              >
                                <Twitter className="h-3 w-3 mr-1" />
                                View Profile
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                            <div className="text-center">
                              <div className="text-xs">👥 {developer.socialMedia.twitter.followers} followers</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.contact && (
                      <TableCell>
                        <a 
                          href={`mailto:${developer.email}`}
                          className="flex items-center text-blue-400 hover:text-blue-300"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Contact
                        </a>
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
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
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
