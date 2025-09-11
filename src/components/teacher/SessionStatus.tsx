import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Bluetooth } from "lucide-react";

interface SessionStatusProps {
  sessionCode: string;
  startTime: Date | null;
  attendanceCount: number;
}

const SessionStatus = ({ sessionCode, startTime, attendanceCount }: SessionStatusProps) => {
  const getElapsedTime = () => {
    if (!startTime) return "00:00:00";
    
    const now = new Date();
    const elapsed = now.getTime() - startTime.getTime();
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="gradient-scanning text-white">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Bluetooth className="w-3 h-3 mr-1" />
              Active Session
            </Badge>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Broadcasting
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{sessionCode}</div>
              <p className="text-sm opacity-90">Session Code</p>
            </div>
            <div>
              <div className="text-2xl font-bold flex items-center justify-center gap-1">
                <Clock className="w-5 h-5" />
                {getElapsedTime()}
              </div>
              <p className="text-sm opacity-90">Duration</p>
            </div>
            <div>
              <div className="text-2xl font-bold flex items-center justify-center gap-1">
                <Users className="w-5 h-5" />
                {attendanceCount}
              </div>
              <p className="text-sm opacity-90">Present</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm opacity-90">
            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
            <span>GATT Server Active • Range: ~10m</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionStatus;