import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, CheckCircle2, Clock, AlertTriangle, TrendingUp } from "lucide-react";

interface AttendanceRecord {
  id: string;
  date: string;
  course: string;
  teacher: string;
  status: "present" | "late" | "absent";
  time: string;
  method: "biometric" | "manual" | "-";
}

const AttendanceHistory = () => {
  const mockHistory: AttendanceRecord[] = [
    {
      id: "1",
      date: "2024-09-11",
      course: "Computer Science 101",
      teacher: "Dr. Sarah Kumar",
      status: "present",
      time: "09:15 AM",
      method: "biometric"
    },
    {
      id: "2",
      date: "2024-09-10",
      course: "Data Structures",
      teacher: "Prof. Raj Patel",
      status: "present",
      time: "10:05 AM",
      method: "biometric"
    },
    {
      id: "3",
      date: "2024-09-09",
      course: "Computer Science 101",
      teacher: "Dr. Sarah Kumar",
      status: "late",
      time: "09:25 AM",
      method: "biometric"
    },
    {
      id: "4",
      date: "2024-09-08",
      course: "Mathematics",
      teacher: "Dr. Priya Sharma",
      status: "present",
      time: "11:00 AM",
      method: "manual"
    },
    {
      id: "5",
      date: "2024-09-07",
      course: "Data Structures",
      teacher: "Prof. Raj Patel",
      status: "absent",
      time: "-",
      method: "-"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "late":
        return <Clock className="w-4 h-4 text-warning" />;
      case "absent":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge variant="default" className="bg-success text-success-foreground">Present</Badge>;
      case "late":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Late</Badge>;
      case "absent":
        return <Badge variant="destructive">Absent</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getMethodBadge = (method: string) => {
    if (method === "biometric") {
      return <Badge variant="outline" className="text-primary border-primary">Biometric</Badge>;
    } else if (method === "manual") {
      return <Badge variant="outline">Manual</Badge>;
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const attendanceStats = {
    totalClasses: mockHistory.length,
    present: mockHistory.filter(r => r.status === "present").length,
    late: mockHistory.filter(r => r.status === "late").length,
    absent: mockHistory.filter(r => r.status === "absent").length,
  };

  const attendancePercentage = Math.round(
    ((attendanceStats.present + attendanceStats.late) / attendanceStats.totalClasses) * 100
  );

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="shadow-biometric">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{attendancePercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {attendanceStats.present + attendanceStats.late} of {attendanceStats.totalClasses} classes
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-biometric">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.present}</div>
            <p className="text-xs text-muted-foreground">On-time attendance</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-biometric">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.late}</div>
            <p className="text-xs text-muted-foreground">Arrived after start</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-biometric">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.absent}</div>
            <p className="text-xs text-muted-foreground">Missed classes</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card className="shadow-biometric">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            Attendance History
          </CardTitle>
          <CardDescription>
            Your recent attendance records across all courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockHistory.map((record) => (
              <div 
                key={record.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card/50 transition-smooth hover:bg-card"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {record.teacher.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{record.course}</h4>
                    {getStatusIcon(record.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{record.teacher}</span>
                    <span>{formatDate(record.date)}</span>
                    {record.time !== "-" && <span>{record.time}</span>}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(record.status)}
                  {record.method !== "-" && getMethodBadge(record.method)}
                </div>
              </div>
            ))}
          </div>
          
          {mockHistory.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No attendance records found</p>
              <p className="text-sm mt-2">Start attending sessions to see your history here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceHistory;