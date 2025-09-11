import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bluetooth, 
  Camera, 
  CheckCircle2, 
  Clock, 
  LogOut, 
  Scan,
  Shield,
  User,
  AlertCircle,
  Wifi,
  WifiOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EnrollmentFlow from "./EnrollmentFlow";
import SessionScanner from "./SessionScanner";
import AttendanceHistory from "./AttendanceHistory";

interface StudentDashboardProps {
  user: { role: string; name: string };
  onLogout: () => void;
}

const StudentDashboard = ({ user, onLogout }: StudentDashboardProps) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"online" | "offline">("online");
  const [attendanceToday, setAttendanceToday] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const { toast } = useToast();

  // Simulate connection status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.1 ? "online" : "offline");
      setBluetoothEnabled(Math.random() > 0.05);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEnrollmentComplete = () => {
    setIsEnrolled(true);
    toast({
      title: "Enrollment Complete",
      description: "Your biometric profile has been securely created",
    });
  };

  const handleAttendanceMarked = () => {
    setAttendanceToday(true);
    toast({
      title: "Attendance Recorded",
      description: "Your attendance has been verified and submitted",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg gradient-secondary">
                <User className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Student Portal</h1>
                <p className="text-muted-foreground">Welcome, {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant={bluetoothEnabled ? "default" : "destructive"}>
                <Bluetooth className="w-3 h-3 mr-1" />
                BLE {bluetoothEnabled ? "On" : "Off"}
              </Badge>
              
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
        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-biometric">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrollment Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {isEnrolled ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="text-sm font-medium text-success">Enrolled</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-warning" />
                    <span className="text-sm font-medium text-warning">Pending</span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {isEnrolled ? "Biometric profile active" : "Complete enrollment to continue"}
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-biometric">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {attendanceToday ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="text-sm font-medium text-success">Marked</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Pending</span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {attendanceToday ? "Verified at 09:15 AM" : "Join a session to mark attendance"}
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-biometric">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Progress</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>23/25 days</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Excellent attendance this month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={isEnrolled ? "scanner" : "enrollment"} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
            <TabsTrigger value="scanner" disabled={!isEnrolled}>Session Scanner</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="enrollment">
            <EnrollmentFlow 
              isEnrolled={isEnrolled} 
              onEnrollmentComplete={handleEnrollmentComplete} 
            />
          </TabsContent>

          <TabsContent value="scanner">
            <SessionScanner 
              isEnrolled={isEnrolled}
              bluetoothEnabled={bluetoothEnabled}
              onAttendanceMarked={handleAttendanceMarked}
            />
          </TabsContent>

          <TabsContent value="history">
            <AttendanceHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;