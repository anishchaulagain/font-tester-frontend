
import type React from "react"
import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  MoreHorizontal,
  Calendar,
  Globe,
  Type,
  Eye,
  EyeOff,
  X,
  Check,
  AlertCircle,
  ExternalLink,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import LogoutComponent from "@/_components/AdminDashboard/LogoutComponent"
import WelcomeHeader from "@/_components/AdminDashboard/WelcomeHeader"
import Header from "@/_components/LandingPage/Header"
import { ThemeProvider } from "@/context/ThemeContext"
import ThemeToggle from "@/_components/ThemeToggler"
import FontAddedChart from "@/_components/AdminDashboard/FontCharts"

interface Font {
  id: number
  name: string
  category: string
  subsets: string[]
  google_fonts_url: string
  createdAt: string
  isActive?: boolean
}

interface NewFont {
  name: string
  category: string
  subsets: string
  google_fonts_url: string
}

const AdminFontDashboard: React.FC = () => {
  const [fonts, setFonts] = useState<Font[]>([])
  const [filteredFonts, setFilteredFonts] = useState<Font[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [newFont, setNewFont] = useState<NewFont>({
    name: "",
    category: "",
    subsets: "",
    google_fonts_url: "",
  })
  const [editingFont, setEditingFont] = useState<Font | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fontsPerPage = 8
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const validateFont = () => {
    const newErrors: Record<string, string> = {};

    if (!newFont.name.trim()) {
      newErrors.name = 'Font name is required.';
    }

    if (!newFont.category.trim()) {
      newErrors.category = 'Category is required.';
    }

    if (!newFont.subsets.trim()) {
      newErrors.subsets = 'At least one subset is required.';
    }

    const isValidURL = /^https:\/\/fonts\.googleapis\.com\/css2\?family=.+$/.test(newFont.google_fonts_url.trim());
    if (!isValidURL) {
      newErrors.google_fonts_url = 'Enter a valid Google Fonts URL.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  }

  const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  },
  hover: {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    transition: { duration: 0.2 }
  }
};

const getBadgeColor = (category:any) => {
    const colors:any = {
      'sans-serif': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'serif': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'monospace': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'handwriting': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'display': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    };
    return colors[category?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring" as const,
        stiffness: 400,
      },
    },
  }

  const fetchFonts = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:3000/v1/fonts")
      const fontsData = response.data.data.map((font: Font) => ({
        ...font,
        isActive: Math.random() > 0.3, // Simulate active status
      }))
      setFonts(fontsData)
      setFilteredFonts(fontsData)
      setError(null)
    } catch (error) {
      console.error("Error fetching fonts:", error)
      setError("Failed to fetch fonts. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFonts()
  }, [])

  // Filter fonts based on search and filters
  useEffect(() => {
    const filtered = fonts.filter((font) => {
      const matchesSearch = font.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLanguage =
        selectedLanguage === "all" ||
        font.subsets.some((subset) => subset.toLowerCase().includes(selectedLanguage.toLowerCase()))
      const matchesCategory =
        selectedCategory === "all" || font.category.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesLanguage && matchesCategory
    })

    setFilteredFonts(filtered)
    setCurrentPage(1)
  }, [fonts, searchQuery, selectedLanguage, selectedCategory])

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalFonts = fonts.length
    const activeFonts = fonts.filter((font) => font.isActive).length
    const recentlyAdded = fonts.filter((font) => {
      const fontDate = new Date(font.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return fontDate > weekAgo
    }).length

    const languageStats = fonts.reduce(
      (acc, font) => {
        font.subsets.forEach((subset) => {
          acc[subset] = (acc[subset] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    const topLanguages = Object.entries(languageStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    return {
      totalFonts,
      activeFonts,
      recentlyAdded,
      topLanguages,
    }
  }, [fonts])

  const handleCreate = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/v1/fonts",
        {
          ...newFont,
          subsets: newFont.subsets.split(",").map((s) => s.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (!validateFont()) return;

      // proceed with actual create logic
      console.log("Creating font:", newFont);
      setSuccess("Font created successfully!")
      setNewFont({ name: "", category: "", subsets: "", google_fonts_url: "" })
      setIsCreateDialogOpen(false)
      fetchFonts()
    } catch (err) {
      setError("Error creating font. Please try again.")
    }
  }

  const handleEdit = async () => {
    if (!editingFont) return

    try {
      await axios.put(
        `http://localhost:3000/v1/fonts/${editingFont.id}`,
        {
          name: editingFont.name,
          category: editingFont.category,
          subsets: editingFont.subsets,
          google_fonts_url: editingFont.google_fonts_url,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setSuccess("Font updated successfully!")
      setIsEditDialogOpen(false)
      setEditingFont(null)
      fetchFonts()
    } catch (err) {
      setError("Failed to update font. Please try again.")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/v1/fonts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess("Font deleted successfully!")
      fetchFonts()
    } catch (err) {
      setError("Failed to delete font. Please try again.")
    }
  }

  const toggleFontStatus = async (font: Font) => {
    // Simulate API call to toggle font status
    const updatedFonts = fonts.map((f) => (f.id === font.id ? { ...f, isActive: !f.isActive } : f))
    setFonts(updatedFonts)
    setSuccess(`Font ${font.isActive ? "deactivated" : "activated"} successfully!`)
  }

  // Pagination
  const indexOfLastFont = currentPage * fontsPerPage
  const indexOfFirstFont = indexOfLastFont - fontsPerPage
  const currentFonts = filteredFonts.slice(indexOfFirstFont, indexOfLastFont)
  const totalPages = Math.ceil(filteredFonts.length / fontsPerPage)

  const uniqueLanguages = Array.from(new Set(fonts.flatMap((font) => font.subsets)))
  const uniqueCategories = Array.from(new Set(fonts.map((font) => font.category)))
  const savedUser = localStorage.getItem("user");

  if (savedUser) {
    const userData = JSON.parse(savedUser);
    console.log(userData.firstName); // → Anish
  }

  return (
    <ThemeProvider>
 <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
        <div className="container mx-auto p-6 space-y-8">
          {/* Header */}

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <WelcomeHeader />
                
              <h1 className="text-4xl font-bold tracking-tight">
            Font Management <span className="text-[#2a86fd]">Dashboard</span>
          </h1>
          
              </div>
              <div className="flex items-center gap-x-4">
                <ThemeToggle />
                <LogoutComponent />
              </div>

            </div>

          </motion.div>

          {/* Alerts */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error-alert"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mb-4"
              >
                <Alert variant="destructive" className="relative">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription className="pr-8">
                    {error}
                  </AlertDescription>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-destructive/20"
                    onClick={() => setError(null)}
                    aria-label="Dismiss error"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                key="success-alert"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mb-4"
              >
                <Alert className="relative border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription className="pr-8">
                    {success}
                  </AlertDescription>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-green-200/50 dark:hover:bg-green-800/50"
                    onClick={() => setSuccess(null)}
                    aria-label="Dismiss success message"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analytics Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 "
          >
            <motion.div variants={itemVariants}>
              <Card className="dark:bg-[#282a2c]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Fonts</CardTitle>
                  <Type className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalFonts}</div>
                  <p className="text-xs text-[#84c9b5] dark:text-muted-foreground">+{analytics.recentlyAdded} from last week</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="dark:bg-[#282a2c]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Fonts</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.activeFonts}</div>
                  <p className="text-xs text-[#84c9b5] dark:text-muted-foreground">
                    {Math.round((analytics.activeFonts / analytics.totalFonts) * 100)}% of total
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="dark:bg-[#282a2c]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recently Added</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.recentlyAdded}</div>
                  <p className="text-xs text-[#84c9b5] dark:text-muted-foreground">Last 7 days</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="dark:bg-[#282a2c]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Language</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.topLanguages[0]?.[0] || "N/A"}</div>
                  <p className="text-xs text-[#84c9b5] dark:text-muted-foreground">{analytics.topLanguages[0]?.[1] || 0} fonts</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="space-y-6">
      <FontAddedChart fonts={fonts} />
    </div>

          {/* Controls */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="dark:bg-[#0a0a0a]">
              <CardHeader>
                <CardTitle>Font Library Controls</CardTitle>
                <CardDescription>Search, filter, and manage your font collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search fonts by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-[#f5f5f5]"
                      />
                    </div>
                  </div>

                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-full lg:w-[200px] bg-[#f5f5f5]">
                      <SelectValue placeholder="Filter by language" />
                    </SelectTrigger>
                    <SelectContent >
                      <SelectItem value="all">All Languages</SelectItem>
                      {uniqueLanguages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full lg:w-[200px] bg-[#f5f5f5]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#2a86fd] hover:bg-blue-400 cursor-pointer dark:bg-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Font
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] dark:bg-[#0a0a0a]">
                      <DialogHeader>
                        <DialogTitle>Add New Font</DialogTitle>
                        <DialogDescription>
                          Add a new font to your library. Fill in all the required information.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Font Name</Label>
                          <Input
                            id="name"
                            value={newFont.name}
                            onChange={(e) => setNewFont({ ...newFont, name: e.target.value })}
                            placeholder="Enter font name"
                            required
                          />
                          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={newFont.category}
                            onChange={(e) => setNewFont({ ...newFont, category: e.target.value })}
                            placeholder="e.g., serif, sans-serif" required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="subsets">Language Subsets</Label>
                          <Input
                            id="subsets"
                            value={newFont.subsets}
                            onChange={(e) => setNewFont({ ...newFont, subsets: e.target.value })}
                            placeholder="e.g., latin, devanagari, cyrillic" required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="url">Google Fonts URL</Label>
                          <Textarea
                            id="url"
                            value={newFont.google_fonts_url}
                            onChange={(e) => setNewFont({ ...newFont, google_fonts_url: e.target.value })}
                            placeholder="https://fonts.googleapis.com/css2?family=..."
                            rows={3} required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreate}>Create Font</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>

         
 <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-1"
    >
      {/* Table Header */}
      <div className="bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 rounded-t-xl px-6 py-4">
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
          <div className="col-span-3">Font Details</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-3">Languages</div>
          <div className="col-span-2">Added</div>
          <div className="col-span-1">Source</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>
      </div>

      {/* Table Body */}
      <Card className="border border-gray-200 dark:border-gray-700 rounded-b-xl overflow-hidden bg-white dark:bg-[#0a0a0a]">
        <AnimatePresence mode="wait">
          {currentFonts.map((font, index) => (
            <motion.div
              key={font.id}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              whileHover="hover"
              layout
              className={`group border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200 ${
                index === 0 ? '' : ''
              }`}
            >
              <div className="px-6 py-4">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Font Details */}
                  <div className="col-span-3">
                    <div className="space-y-1">
                      <h3 className="text-base lg:text-lg font-semibold text-foreground group-hover:text-foreground/90 transition-colors line-clamp-1">
                        {font.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono line-clamp-1">
                        {font.google_fonts_url}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <Badge
                      className={`text-xs font-medium transition-colors ${getBadgeColor(font.category)}`}
                    >
                      {font.category}
                    </Badge>
                  </div>

                  {/* Languages */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <div className="flex flex-wrap gap-1 min-w-0">
                        {font.subsets.slice(0, 3).map((subset) => (
                          <Badge
                            key={subset}
                            variant="outline"
                            className="text-xs px-1.5 py-0.5 font-normal border-border/60 bg-background/50 hover:bg-background/80 transition-colors"
                          >
                            {subset.charAt(0).toUpperCase() + subset.slice(1)}
                          </Badge>
                        ))}
                        {font.subsets.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0.5 font-normal border-dashed border-border/60 bg-muted/30 text-muted-foreground"
                          >
                            +{font.subsets.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Date Added */}
                  <div className="col-span-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      {new Date(font.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Source Link */}
                  <div className="col-span-1">
                    <a
                      href={font.google_fonts_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-1.5 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Open Google Fonts"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-secondary/80"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingFont(font)
                            setIsEditDialogOpen(true)
                          }}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Font
                        </DropdownMenuItem>
                        <Separator className="my-1" />
                        <DropdownMenuItem
                          onClick={() => handleDelete(font.id)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {currentFonts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium mb-2">No fonts found</p>
              <p>Try adjusting your search criteria or add a new font.</p>
            </div>
          </div>
        )}
      </Card>

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground px-2 py-3">
        <div>
          Showing {currentFonts.length} fonts
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>Google Fonts Library</span>
        </div>
      </div>
    </motion.div>
          


          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </motion.div>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Font</DialogTitle>
                <DialogDescription>Update the font information below.</DialogDescription>
              </DialogHeader>
              {editingFont && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Font Name</Label>
                    <Input
                      id="edit-name"
                      value={editingFont.name}
                      onChange={(e) => setEditingFont({ ...editingFont, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Input
                      id="edit-category"
                      value={editingFont.category}
                      onChange={(e) => setEditingFont({ ...editingFont, category: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-subsets">Language Subsets</Label>
                    <Input
                      id="edit-subsets"
                      value={editingFont.subsets.join(", ")}
                      onChange={(e) =>
                        setEditingFont({
                          ...editingFont,
                          subsets: e.target.value.split(",").map((s) => s.trim()),
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-url">Google Fonts URL</Label>
                    <Textarea
                      id="edit-url"
                      value={editingFont.google_fonts_url}
                      onChange={(e) => setEditingFont({ ...editingFont, google_fonts_url: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEdit}>Update Font</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default AdminFontDashboard
