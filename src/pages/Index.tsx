import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Shield, Users, Smartphone, CheckCircle2, Bluetooth } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import TeacherDashboard from "@/components/teacher/TeacherDashboard";
import StudentDashboard from "@/components/student/StudentDashboard";

type UserRole = "teacher" | "student" | null;

const Index = () => {
  const [user, setUser] = useState<{ role: UserRole; name: string } | null>(null);

  const handleLogin = (role: UserRole, userData: any) => {
    setUser({ role, name: userData.name || "User" });
  };

  if (user) {
    return user.role === "teacher" ? (
      <TeacherDashboard user={user} onLogout={() => setUser(null)} />
    ) : (
      <StudentDashboard user={user} onLogout={() => setUser(null)} />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <Bluetooth className="w-12 h-12 text-primary animate-pulse-slow" />
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-primary bg-clip-text text-transparent">
                BioAttend
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Secure BLE-based biometric attendance system with offline-first design
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Badge variant="outline" className="px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                End-to-End Encrypted
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Wifi className="w-4 h-4 mr-2" />
                Offline First
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Bluetooth className="w-4 h-4 mr-2" />
                BLE Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Features */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground">
              Next-Gen Attendance Tracking
            </h2>
            
            <div className="grid gap-6">
              <Card className="shadow-biometric transition-smooth hover:shadow-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg gradient-primary">
                      <Users className="w-5 h-5 text-primary-foreground" />
                    </div>
                    Teacher Mode
                  </CardTitle>
                  <CardDescription>
                    Create sessions, manage BLE broadcasting, and verify attendance in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      BLE GATT server with encrypted channels
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      Real-time attendance verification
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      Offline session management
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-biometric transition-smooth hover:shadow-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg gradient-secondary">
                      <Smartphone className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    Student Mode
                  </CardTitle>
                  <CardDescription>
                    Join sessions, perform biometric verification, and submit signed attendance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      On-device face recognition & liveness
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      Cryptographic attendance signing
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      Privacy-preserving enrollment
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Login Form */}
          <div className="lg:sticky lg:top-8">
            <LoginForm onLogin={handleLogin} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>BioAttend - Secure Biometric Attendance System</p>
            <p className="mt-2">Built for Smart India Hackathon with privacy-first design</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;