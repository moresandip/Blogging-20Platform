import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, PenTool, User, Menu, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const location = useLocation();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const NavLinks = () => (
    <>
      <Link 
        to="/blogs" 
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive('/blogs') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        Explore
      </Link>
      <Link 
        to="/categories" 
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive('/categories') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        Categories
      </Link>
      <Link 
        to="/about" 
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive('/about') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        About
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
            <PenTool className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">BlogSpace</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLinks />
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className={`relative w-full transition-all duration-200 ${
            isSearchFocused ? 'scale-105' : ''
          }`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles, authors, topics..."
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="hidden md:flex relative">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-primary">
              3
            </Badge>
          </Button>
          
          <Link to="/create">
            <Button className="hidden md:flex">
              <PenTool className="w-4 h-4 mr-2" />
              Write
            </Button>
          </Link>

          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <User className="w-4 h-4" />
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                
                <nav className="flex flex-col space-y-4">
                  <NavLinks />
                </nav>

                <div className="flex flex-col space-y-3 pt-4 border-t">
                  <Link to="/create">
                    <Button className="w-full justify-start">
                      <PenTool className="w-4 h-4 mr-2" />
                      Write Article
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                    <Badge className="ml-auto">3</Badge>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
