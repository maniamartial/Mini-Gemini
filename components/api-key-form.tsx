"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { EyeIcon, EyeOffIcon, SaveIcon, KeyIcon } from 'lucide-react';

export function ApiKeyForm() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load the API key from localStorage on component mount
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Empty API Key",
        description: "Please enter your Gemini API key.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('gemini-api-key', apiKey);
    
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved.",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyIcon className="h-5 w-5" />
          Gemini API Key
        </CardTitle>
        <CardDescription>
          Enter your Gemini API key to generate responses. 
          Your API key is stored locally in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Input
            type={showApiKey ? "text" : "password"}
            placeholder="Enter your Gemini API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="absolute right-0 top-0 h-full"
            onClick={() => setShowApiKey(!showApiKey)}
          >
            {showApiKey ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showApiKey ? "Hide API Key" : "Show API Key"}
            </span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSaveApiKey}>
          <SaveIcon className="h-4 w-4 mr-2" />
          Save API Key
        </Button>
      </CardFooter>
    </Card>
  );
}