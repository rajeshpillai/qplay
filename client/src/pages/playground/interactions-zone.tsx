import React, { useState } from "react";
import Shell from "@/components/layout/shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, MousePointer2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function InteractionsZone() {
  const [dropped, setDropped] = useState(false);
  const [doubleClicked, setDoubleClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", "draggable-item");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (data === "draggable-item") {
      setDropped(true);
    }
  };

  const handleAlert = () => {
    window.alert("This is a native browser alert!");
  };

  const handleConfirm = () => {
    if (window.confirm("Are you sure?")) {
      console.log("Confirmed!");
    } else {
      console.log("Cancelled!");
    }
  };

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-mono mb-2">Interactions Zone</h1>
          <p className="text-muted-foreground">
            Test complex user interactions: Drag & Drop, Hovers, Alerts, iFrames, and Shadow DOM.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Drag and Drop */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer2 className="h-5 w-5" />
                Drag & Drop
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="w-24 h-24 bg-blue-500 rounded-lg flex items-center justify-center cursor-move text-white font-bold shadow-lg active:scale-95 transition-transform"
                draggable
                onDragStart={handleDragStart}
                data-testid="draggable-item"
              >
                Drag Me
              </div>

              <div 
                className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${dropped ? "border-green-500 bg-green-500/10" : "border-muted-foreground/20"}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-testid="drop-zone"
              >
                {dropped ? (
                  <span className="text-green-500 font-bold flex items-center gap-2">
                    Dropped! <Badge variant="outline" className="border-green-500 text-green-500">Success</Badge>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Drop Here</span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setDropped(false)} className="w-full text-xs" data-testid="btn-reset">Reset</Button>
            </CardContent>
          </Card>

          {/* Mouse Events */}
          <Card>
            <CardHeader>
              <CardTitle>Mouse Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Button 
                  variant={doubleClicked ? "default" : "secondary"}
                  onDoubleClick={() => setDoubleClicked(!doubleClicked)}
                  data-testid="btn-dblclick"
                >
                  {doubleClicked ? "Double Clicked!" : "Double Click Me"}
                </Button>
                {doubleClicked && <Badge>Active</Badge>}
              </div>

              <div className="flex items-center justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" data-testid="btn-hover" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                        Hover Me
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p data-testid="tooltip-content">Hidden Secret!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {hovered && <span className="text-xs text-muted-foreground">Hovering...</span>}
              </div>
            </CardContent>
          </Card>

          {/* Native Dialogs */}
          <Card>
            <CardHeader>
              <CardTitle>Native Dialogs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                These trigger browser-level popups which pause execution.
              </p>
              <div className="flex gap-4">
                <Button onClick={handleAlert} data-testid="btn-alert">
                  Trigger Alert
                </Button>
                <Button variant="secondary" onClick={handleConfirm} data-testid="btn-confirm">
                  Trigger Confirm
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Clipboard & Keyboard */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Clipboard */}
              <div className="space-y-2">
                <Label>Clipboard Interaction</Label>
                <div className="flex gap-2">
                   <Input value="Copy this secret code: AB-123" readOnly className="bg-muted" />
                   <Button 
                     variant="outline" 
                     data-testid="btn-copy"
                     onClick={() => {
                       navigator.clipboard.writeText("AB-123");
                       const btn = document.querySelector('[data-testid="btn-copy"]');
                       if(btn) btn.textContent = "Copied!";
                       setTimeout(() => { if(btn) btn.textContent = "Copy"; }, 2000);
                     }}
                   >
                     Copy
                   </Button>
                </div>
              </div>

              {/* Keyboard */}
              <div className="space-y-2">
                <Label>Keyboard Shortcuts</Label>
                <Input 
                  placeholder="Press 'Control+K' here..." 
                  data-testid="input-keyboard"
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                      e.preventDefault();
                      const msg = document.getElementById('kbd-msg');
                      if(msg) {
                        msg.classList.remove('hidden');
                        setTimeout(() => msg.classList.add('hidden'), 2000);
                      }
                    }
                  }}
                />
                <p id="kbd-msg" className="text-xs text-green-500 font-mono hidden" data-testid="kbd-msg">
                  Shortcut 'Ctrl+K' detected!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Visibility & States */}
          <Card>
            <CardHeader>
              <CardTitle>States & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" data-testid="switch-airplane" />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
              </div>

              <div className="p-4 border rounded-md bg-muted/50">
                 <p className="text-sm invisible" data-testid="invisible-text">
                   I am in the DOM but invisible
                 </p>
                 <p className="text-sm mt-2" style={{ display: 'none' }} data-testid="hidden-text">
                   I am display: none
                 </p>
                 <p className="text-sm mt-2 font-mono text-green-400" data-testid="visible-text">
                   I am visible
                 </p>
              </div>
            </CardContent>
          </Card>
          
          {/* iFrame Lab */}
          <Card>
            <CardHeader>
              <CardTitle>iFrame</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded h-[200px] overflow-hidden bg-white">
                 <iframe 
                   id="payment-frame"
                   srcDoc={`
                     <html>
                       <head>
                         <style>
                           body { font-family: sans-serif; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
                           input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
                           button { padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; }
                         </style>
                       </head>
                       <body>
                         <h3>Secure Payment</h3>
                         <input type="text" id="card-number" placeholder="Card Number" data-testid="input-card" />
                         <button>Pay Now</button>
                       </body>
                     </html>
                   `}
                   className="w-full h-full"
                   title="Payment Iframe"
                 />
              </div>
            </CardContent>
          </Card>

          {/* Shadow DOM Lab */}
          <Card>
            <CardHeader>
               <CardTitle>Shadow DOM</CardTitle>
            </CardHeader>
            <CardContent>
               <div id="shadow-host" ref={(node) => {
                 if (node && !node.shadowRoot) {
                   const shadow = node.attachShadow({ mode: 'open' });
                   shadow.innerHTML = `
                     <style>
                       .box { padding: 16px; background: #333; color: white; border-radius: 8px; }
                       .btn { background: #10b981; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
                     </style>
                     <div class="box">
                       <h4>Shadow Content</h4>
                       <button class="btn" onclick="alert('Clicked inside shadow!')">Click Me</button>
                     </div>
                   `;
                 }
               }} />
            </CardContent>
          </Card>
          
           {/* Canvas (Mouse Actions) */}
           <Card>
            <CardHeader>
              <CardTitle>Canvas Drawing</CardTitle>
              <CardDescription>Use mouse/touch events to draw on this canvas.</CardDescription>
            </CardHeader>
            <CardContent>
               <canvas 
                 id="drawing-canvas" 
                 width={300} 
                 height={200}
                 className="border rounded bg-white w-full h-[200px]"
                 data-testid="drawing-canvas"
                 onMouseDown={(e) => {
                   const canvas = e.currentTarget;
                   const ctx = canvas.getContext('2d');
                   if(ctx) {
                     ctx.beginPath();
                     ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                     // Simple dot for verification
                     ctx.fillStyle = 'red';
                     ctx.fillRect(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 2, 2);
                   }
                   canvas.setAttribute('data-drawing', 'true');
                 }}
               />
            </CardContent>
          </Card>

        </div>
      </div>
    </Shell>
  );
}
