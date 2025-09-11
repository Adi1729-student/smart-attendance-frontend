import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Bluetooth, 
  Scan, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode,
  Eye,
  Shield,
  Wifi
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SessionScannerProps {
  isEnrolled: boolean;
  bluetoothEnabled: boolean;
  onAttendanceMarked: () => void;
}

type ScanningState = "idle" | "scanning" | "found" | "connecting" | "liveness" | "submitting" | "completed";

const SessionScanner = ({ isEnrolled, bluetoothEnabled, onAttendanceMarked }: SessionScannerProps) => {
  const [scanningState, setScanningState] = useState<ScanningState>("idle");
  const [sessionCode, setSessionCode] = useState("");
  const [foundSessions, setFoundSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [livenessProgress, setLivenessProgress] = useState(0);
  const { toast } = useToast();

  const mockSessions = [
    { 
      id: "sess_001", 
      code: "ABC123", 
      course: "Computer Science 101", 
      teacher: "Dr. Sarah Kumar", 
      rssi: -45,
      distance: "2.1m"
    },
    { 
      id: "sess_002", 
      code: "XYZ789", 
      course: "Data Structures", 
      teacher: "Prof. Raj Patel", 
      rssi: -62,
      distance: "5.8m"
    }
  ];

  const startScanning = () => {
    if (!bluetoothEnabled) {
      toast({
        title: "Bluetooth Required",
        description: "Please enable Bluetooth to scan for sessions",
        variant: "destructive"
      });
      return;
    }

    setScanningState("scanning");
    setFoundSessions([]);
    
    // Simulate BLE scanning
    setTimeout(() => {
      setFoundSessions(mockSessions);
      setScanningState("found");
      toast({
        title: "Sessions Found",
        description: `Found ${mockSessions.length} active sessions nearby`,
      });
    }, 3000);
  };

  const connectToSession = (session: any) => {
    setSelectedSession(session);
    setScanningState("connecting");
    
    // Simulate BLE connection and nonce exchange
    setTimeout(() => {
      setScanningState("liveness");
      toast({
        title: "Connected to Session",
        description: "Received encrypted nonce. Starting liveness check...",
      });
      
      performLivenessCheck();
    }, 2000);
  };

  const performLivenessCheck = () => {
    setLivenessProgress(0);
    
    const interval = setInterval(() => {
      setLivenessProgress(prev => {
        const newProgress = prev + 20;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setScanningState("submitting");
          
          // Simulate attendance submission
          setTimeout(() => {
            setScanningState("completed");
            onAttendanceMarked();
            toast({
              title: "Attendance Submitted",
              description: "Your signed attendance packet has been verified",
            });
          }, 2000);
        }
        
        return newProgress;
      });
    }, 800);
  };

  const manualSessionEntry = () => {
    if (!sessionCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid session code",
        variant: "destructive"
      });
      return;
    }
    
    const mockSession = {
      id: "manual_001",
      code: sessionCode.toUpperCase(),
      course: "Manual Entry",
      teacher: "Unknown",
      rssi: -50,
      distance: "Manual"
    };
    
    connectToSession(mockSession);
  };

  const reset = () => {
    setScanningState("idle");
    setSelectedSession(null);
    setFoundSessions([]);
    setSessionCode("");
    setLivenessProgress(0);
  };

  if (!isEnrolled) {
    return (
      <Card className="shadow-biometric">
        <CardContent className="text-center py-12">
          <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Enrollment Required</h3>
          <p className="text-muted-foreground">
            Complete biometric enrollment before scanning for sessions
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="shadow-biometric">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Scan className="w-6 h-6 text-primary" />
            Session Scanner
          </CardTitle>
          <CardDescription>
            Scan for BLE sessions or manually enter session code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={bluetoothEnabled ? "default" : "destructive"}>
                <Bluetooth className="w-3 h-3 mr-1" />
                BLE {bluetoothEnabled ? "Ready" : "Disabled"}
              </Badge>
              <Badge variant="outline">
                <Shield className="w-3 h-3 mr-1" />
                Enrolled
              </Badge>
            </div>
            
            {scanningState !== "idle" && (
              <Button variant="outline" size="sm" onClick={reset}>
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Scanner Interface */}
      {scanningState === "idle" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* BLE Scanning */}
          <Card className="shadow-biometric">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bluetooth className="w-5 h-5 text-primary" />
                BLE Auto-Scan
              </CardTitle>
              <CardDescription>
                Automatically discover nearby teacher sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Bluetooth className="w-16 h-16 mx-auto text-primary mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Click to scan for sessions broadcasting via BLE GATT
                </p>
                <Button 
                  onClick={startScanning} 
                  disabled={!bluetoothEnabled}
                  className="gradient-primary"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  Start BLE Scan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Manual Entry */}
          <Card className="shadow-biometric">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-secondary-accent" />
                Manual Entry
              </CardTitle>
              <CardDescription>
                Enter session code displayed by teacher
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionCode">Session Code</Label>
                  <Input
                    id="sessionCode"
                    placeholder="Enter 6-digit code"
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="text-center text-lg font-mono tracking-wider"
                  />
                </div>
                
                <Button 
                  onClick={manualSessionEntry}
                  className="w-full gradient-secondary"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Join Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Scanning State */}
      {scanningState === "scanning" && (
        <Card className="shadow-biometric">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <Bluetooth className="w-16 h-16 text-primary animate-pulse" />
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Scanning for Sessions</h3>
            <p className="text-muted-foreground mb-4">
              Looking for BLE GATT servers in range...
            </p>
            <div className="max-w-xs mx-auto">
              <Progress value={undefined} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Found Sessions */}
      {scanningState === "found" && (
        <Card className="shadow-biometric">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-success" />
              Available Sessions ({foundSessions.length})
            </CardTitle>
            <CardDescription>
              Select a session to join and mark attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {foundSessions.map((session) => (
                <div 
                  key={session.id}
                  className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-smooth cursor-pointer"
                  onClick={() => connectToSession(session)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{session.course}</h4>
                        <Badge variant="outline" className="text-xs">{session.code}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{session.teacher}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>RSSI: {session.rssi} dBm</span>
                        <span>Distance: {session.distance}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={session.rssi > -50 ? "default" : "secondary"}>
                        {session.rssi > -50 ? "Strong" : "Weak"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connecting/Liveness/Submitting States */}
      {(scanningState === "connecting" || scanningState === "liveness" || scanningState === "submitting") && selectedSession && (
        <Card className="shadow-biometric">
          <CardContent className="text-center py-12">
            <div className="space-y-6">
              {scanningState === "connecting" && (
                <>
                  <Shield className="w-16 h-16 mx-auto text-primary animate-pulse" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Connecting to Session</h3>
                    <p className="text-muted-foreground">
                      Establishing secure BLE GATT connection...
                    </p>
                    <Badge variant="outline" className="mt-2">{selectedSession.code}</Badge>
                  </div>
                </>
              )}
              
              {scanningState === "liveness" && (
                <>
                  <div className="w-16 h-16 mx-auto relative">
                    <Eye className="w-16 h-16 text-primary" />
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Liveness Verification</h3>
                    <p className="text-muted-foreground mb-4">
                      Performing biometric verification and face matching...
                    </p>
                    <div className="max-w-xs mx-auto space-y-2">
                      <Progress value={livenessProgress} className="h-3" />
                      <p className="text-sm text-muted-foreground">{livenessProgress}% complete</p>
                    </div>
                  </div>
                </>
              )}
              
              {scanningState === "submitting" && (
                <>
                  <Shield className="w-16 h-16 mx-auto text-primary animate-pulse" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Submitting Attendance</h3>
                    <p className="text-muted-foreground">
                      Signing packet with device key and transmitting...
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed State */}
      {scanningState === "completed" && (
        <Card className="shadow-biometric gradient-verified text-white">
          <CardContent className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Attendance Verified</h3>
            <p className="opacity-90 mb-4">
              Your attendance has been successfully recorded
            </p>
            {selectedSession && (
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {selectedSession.code} • {selectedSession.course}
                </Badge>
                <p className="text-sm opacity-75">
                  Verified at {new Date().toLocaleTimeString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionScanner;