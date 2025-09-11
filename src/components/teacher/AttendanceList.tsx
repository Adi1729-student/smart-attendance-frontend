import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, Clock, AlertTriangle, User } from "lucide-react";

interface AttendanceRecord {
  id: string;
  studentName: string;
  rollNumber: string;
  timestamp: Date;
  status: "verified" | "pending" | "rejected";
  rssi: number;
  method: "biometric" | "manual";
}

interface AttendanceListProps {
  sessionActive: boolean;
  attendanceCount: number;
}

const AttendanceList = ({ sessionActive, attendanceCount }: AttendanceListProps) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Generate mock attendance data
  useEffect(() => {
    if (sessionActive && attendanceCount > attendanceRecords.length) {
      const newRecords = [];
      const names = [
        "Arjun Patel", "Priya Sharma", "Rohit Kumar", "Sneha Reddy", 
        "Vikram Singh", "Ananya Gupta", "Karan Mehta", "Pooja Iyer"
      ];
      
      for (let i = attendanceRecords.length; i < attendanceCount; i++) {
        const name = names[i % names.length];
        newRecords.push({
          id: `att_${i + 1}`,
          studentName: name,
          rollNumber: `S${(2024001 + i).toString()}`,
          timestamp: new Date(Date.now() - Math.random() * 300000), // Random time in last 5 mins
          status: Math.random() > 0.1 ? "verified" : (Math.random() > 0.5 ? "pending" : "rejected"),
          rssi: -40 - Math.floor(Math.random() * 30), // -40 to -70 dBm
          method: "biometric"
        });
      }
      
      setAttendanceRecords(prev => [...prev, ...newRecords]);
    }
  }, [attendanceCount, sessionActive, attendanceRecords.length]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />;
      case "rejected":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return <User className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge variant="default" className="bg-success text-success-foreground">Verified</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="shadow-biometric">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <User className="w-5 h-5 text-primary" />
          Live Attendance Feed
        </CardTitle>
        <CardDescription>
          Real-time attendance verification from BLE connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!sessionActive ? (
          <div className="text-center py-12 text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Start a session to see live attendance updates</p>
          </div>
        ) : attendanceRecords.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50 animate-pulse-slow" />
            <p>Waiting for student connections...</p>
            <p className="text-sm mt-2">Students will appear here as they join</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Attendance Records ({attendanceRecords.length})</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-success">
                  {attendanceRecords.filter(r => r.status === "verified").length} Verified
                </Badge>
                <Badge variant="outline" className="text-warning">
                  {attendanceRecords.filter(r => r.status === "pending").length} Pending
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {attendanceRecords
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((record) => (
                <div 
                  key={record.id} 
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card/50 transition-smooth hover:bg-card"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {record.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{record.studentName}</h4>
                      {getStatusIcon(record.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{record.rollNumber}</span>
                      <span>RSSI: {record.rssi} dBm</span>
                      <span>{record.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(record.status)}
                    <Badge variant="outline" className="text-xs">
                      {record.method}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceList;