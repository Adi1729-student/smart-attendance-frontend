import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Square, 
  Users, 
  Bluetooth, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  LogOut,
  QrCode,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SessionStatus from "./SessionStatus";
import AttendanceList from "./AttendanceList";

interface TeacherDashboardProps {
  user: { role: string; name: string };
  onLogout: () => void;
}

const TeacherDashboard = ({ user, onLogout }: TeacherDashboardProps) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionCode, setSessionCode] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"online" | "offline">("online");
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const [sessionForm, setSessionForm] = useState({
    course: "Computer Science 101",
    batch: "CS-2024-A",
    room: "Room 101",
  });

  // Simulate BLE and network status
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.1 ? "online" : "offline");
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const startSession = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(code);
    setSessionActive(true);
    setSessionStartTime(new Date());
    setAttendanceCount(0);
    
    toast({
      title: "Session Started",
      description: `Broadcasting session ${code} via BLE GATT server`,
    });
  };

  const stopSession = () => {
    setSessionActive(false);
    setSessionStartTime(null);
    
    toast({
      title: "Session Ended",
      description: `Collected ${attendanceCount} attendance records`,
    });
  };

  // Simulate attendance updates
  useEffect(() => {
    if (sessionActive) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          setAttendanceCount(prev => prev + 1);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sessionActive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg gradient-primary">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant={connectionStatus === "online" ? "default" : "destructive"}>
                {connectionStatus === "online" ? (
                  <Wifi className="w-3 h-3 mr-1" />
                ) : (
                  <WifiOff className="w-3 h-3 mr-1" />
                )}
                {connectionStatus}
              </Badge>
              
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="session" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="session">Session Control</TabsTrigger>
            <TabsTrigger value="attendance">Live Attendance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="session" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Session Control */}
              <Card className="shadow-biometric">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Bluetooth className="w-5 h-5 text-primary" />
                    BLE Session Control
                  </CardTitle>
                  <CardDescription>
                    Start or stop attendance collection via BLE GATT server
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!sessionActive ? (
                    <>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="course">Course</Label>
                          <Input
                            id="course"
                            value={sessionForm.course}
                            onChange={(e) => setSessionForm({ ...sessionForm, course: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="batch">Batch</Label>
                          <Input
                            id="batch"
                            value={sessionForm.batch}
                            onChange={(e) => setSessionForm({ ...sessionForm, batch: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="room">Room</Label>
                          <Input
                            id="room"
                            value={sessionForm.room}
                            onChange={(e) => setSessionForm({ ...sessionForm, room: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <Button onClick={startSession} className="w-full gradient-success">
                        <Play className="w-4 h-4 mr-2" />
                        Start BLE Session
                      </Button>
                    </>
                  ) : (
                    <>
                      <SessionStatus 
                        sessionCode={sessionCode}
                        startTime={sessionStartTime}
                        attendanceCount={attendanceCount}
                      />
                      
                      <Button 
                        onClick={stopSession} 
                        variant="destructive" 
                        className="w-full"
                      >
                        <Square className="w-4 h-4 mr-2" />
                        Stop Session
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* QR Code Display */}
              <Card className="shadow-biometric">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <QrCode className="w-5 h-5 text-secondary-accent" />
                    Session Code Display
                  </CardTitle>
                  <CardDescription>
                    Students can manually enter this code for verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sessionActive ? (
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-32 h-32 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-primary">
                        <div className="text-center">
                          <QrCode className="w-8 h-8 mx-auto text-primary mb-2" />
                          <p className="text-xs text-muted-foreground">QR Code</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Session Code:</p>
                        <div className="text-3xl font-mono font-bold text-primary tracking-wider">
                          {sessionCode}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <QrCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Start a session to generate QR code</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceList sessionActive={sessionActive} attendanceCount={attendanceCount} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-biometric">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-biometric">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94.2%</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-biometric">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security Incidents</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">No incidents this month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;