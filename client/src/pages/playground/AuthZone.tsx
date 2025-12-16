import React, { useState } from "react";
import Shell from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function AuthZone() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Simulate network delay
    setTimeout(() => {
      const form = e.target as HTMLFormElement;
      const username = (form.elements.namedItem("username") as HTMLInputElement).value;
      const password = (form.elements.namedItem("password") as HTMLInputElement).value;

      setLoading(false);

      if (username === "admin" && password === "password123") {
        setSuccess("Login successful! Welcome back, Commander.");
        localStorage.setItem("session_token", "abc-123-xyz");
      } else {
        setError("Invalid credentials. Try 'admin' / 'password123'");
      }
    }, 1500);
  };

  return (
    <Shell>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-mono mb-2">Authentication Zone</h1>
          <p className="text-muted-foreground">
            Test login flows, validation errors, and session persistence.
            <br />
            <code className="text-xs bg-muted px-1 py-0.5 rounded text-pink-400">test-id="auth-zone"</code>
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" data-testid="tab-login">Login Form</TabsTrigger>
            <TabsTrigger value="register" data-testid="tab-register">Registration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Secure Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access the system.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin} id="login-form">
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive" data-testid="alert-error">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert className="border-green-500/50 text-green-500" data-testid="alert-success">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      name="username" 
                      placeholder="admin" 
                      data-testid="input-username"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••" 
                      data-testid="input-password"
                      required 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                    data-testid="btn-login"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? "Authenticating..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Join the academy today.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" placeholder="user@example.com" data-testid="input-email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-pass">Password</Label>
                  <Input id="reg-pass" type="password" data-testid="input-reg-password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="secondary" data-testid="btn-register">Create Account</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}
