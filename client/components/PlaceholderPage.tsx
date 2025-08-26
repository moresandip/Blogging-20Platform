import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

interface PlaceholderPageProps {
  title: string;
  description: string;
  suggestedPrompt?: string;
}

export default function PlaceholderPage({ title, description, suggestedPrompt }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <Card className="text-center">
          <CardContent className="p-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Construction className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              {description}
            </p>
            
            {suggestedPrompt && (
              <div className="bg-muted/50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-2">Continue Building</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  To implement this page, you can prompt:
                </p>
                <div className="bg-background border rounded-md p-3 text-sm font-mono text-left">
                  "{suggestedPrompt}"
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/blogs">
                <Button variant="outline">
                  Explore Articles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
