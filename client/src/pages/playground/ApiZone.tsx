import React, { useState } from "react";
import Shell from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, RefreshCw, Trash2, Plus, Save } from "lucide-react";

type User = {
  id: number;
  name: string;
  role: string;
};

export default function ApiZone() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Alice Johnson", role: "Admin" },
    { id: 2, name: "Bob Smith", role: "User" },
    { id: 3, name: "Charlie Brown", role: "User" },
  ]);
  
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", role: "User" });

  // Simulated API Delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleGetUsers = async () => {
    setLoading(true);
    await delay(800);
    setResponse({
      status: 200,
      statusText: "OK",
      headers: { "content-type": "application/json" },
      data: users
    });
    setLoading(false);
  };

  const handleCreateUser = async () => {
    if (!newUser.name) return;
    setLoading(true);
    await delay(1000);
    
    const user = { id: Date.now(), ...newUser };
    setUsers([...users, user]);
    
    setResponse({
      status: 201,
      statusText: "Created",
      headers: { "content-type": "application/json" },
      data: user
    });
    setNewUser({ name: "", role: "User" });
    setLoading(false);
  };

  const handleDeleteUser = async (id: number) => {
    setLoading(true);
    await delay(600);
    setUsers(users.filter(u => u.id !== id));
    setResponse({
      status: 200,
      statusText: "OK",
      data: { success: true, message: `User ${id} deleted` }
    });
    setLoading(false);
  };

  const handleSimulateError = async (code: number) => {
    setLoading(true);
    await delay(500);
    let text = "Error";
    if (code === 401) text = "Unauthorized";
    if (code === 404) text = "Not Found";
    if (code === 500) text = "Internal Server Error";

    setResponse({
      status: code,
      statusText: text,
      data: { error: text, code: code }
    });
    setLoading(false);
  };

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-mono mb-2">API Simulation Zone</h1>
          <p className="text-muted-foreground">
            Practice intercepting network requests (`cy.intercept`, `page.route`).
            <br />
            These actions simulate real REST API calls with delays and JSON responses.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  User API
                </CardTitle>
                <CardDescription>
                  CRUD operations that you can spy on or stub.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={handleGetUsers} 
                    disabled={loading}
                    data-testid="btn-get-users"
                    variant="outline"
                  >
                    GET /api/users
                  </Button>
                </div>

                <div className="flex gap-2 items-end pt-4 border-t border-white/10">
                  <div className="space-y-2 flex-1">
                    <Label>New User</Label>
                    <Input 
                      placeholder="Name" 
                      value={newUser.name}
                      onChange={e => setNewUser({...newUser, name: e.target.value})}
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-2 w-32">
                    <Label>Role</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={r => setNewUser({...newUser, role: r})}
                    >
                      <SelectTrigger data-testid="select-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Guest">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleCreateUser} 
                    disabled={loading || !newUser.name}
                    data-testid="btn-create"
                  >
                    <Plus className="h-4 w-4 mr-1" /> POST
                  </Button>
                </div>

                <div className="space-y-2 pt-4">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">Database State</Label>
                  <div className="bg-muted/50 rounded-md p-2 space-y-1">
                    {users.map(user => (
                      <div key={user.id} className="flex items-center justify-between text-sm p-2 bg-background rounded border border-white/5" data-testid={`user-row-${user.id}`}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] h-5">{user.role}</Badge>
                          <span className="font-mono">{user.name}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-muted-foreground hover:text-red-400"
                          onClick={() => handleDeleteUser(user.id)}
                          data-testid={`btn-delete-${user.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {users.length === 0 && (
                      <div className="text-center text-xs text-muted-foreground py-2">No users found</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Simulator */}
            <Card>
              <CardHeader>
                <CardTitle>Error Simulator</CardTitle>
                <CardDescription>
                  Force the API to return specific error codes.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => handleSimulateError(401)} data-testid="btn-401">
                  Simulate 401
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleSimulateError(404)} data-testid="btn-404">
                  Simulate 404
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleSimulateError(500)} data-testid="btn-500">
                  Simulate 500
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Response Viewer */}
          <div className="h-full">
            <Card className="h-full flex flex-col bg-slate-950 border-slate-800">
              <CardHeader className="py-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono text-sm text-slate-400">Network Inspector</CardTitle>
                  {loading && <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />}
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 relative font-mono text-xs">
                <ScrollArea className="h-[500px] w-full p-4">
                  {response ? (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="text-slate-500">Status</div>
                        <div className={`text-lg font-bold ${response.status >= 400 ? 'text-red-400' : 'text-green-400'}`}>
                          {response.status} {response.statusText}
                        </div>
                      </div>
                      
                      {response.headers && (
                        <div className="space-y-1">
                          <div className="text-slate-500">Headers</div>
                          <pre className="text-slate-300 bg-white/5 p-2 rounded">
                            {JSON.stringify(response.headers, null, 2)}
                          </pre>
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="text-slate-500">Body</div>
                        <pre className="text-blue-300 bg-white/5 p-2 rounded overflow-auto">
                          {JSON.stringify(response.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600 mt-20">
                      <Globe className="h-10 w-10 mb-2 opacity-20" />
                      <p>Waiting for request...</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
