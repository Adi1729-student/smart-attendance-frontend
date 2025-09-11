import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserCheck, GraduationCap, Shield, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (role: "teacher" | "student", userData: any) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [activeTab, setActiveTab] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    rollNumber: "",
    employeeId: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent, role: "teacher" | "student") => {
    e.preventDefault();
    setLoading(true);

    // Simulate authentication
    setTimeout(() => {
      const userData = {
        name: role === "teacher" ? "Dr. Sarah Kumar" : "Priya Sharma",
        id: role === "teacher" ? formData.employeeId : formData.rollNumber,
        role,
      };

      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.name}!`,
      });

      onLogin(role, userData);
      setLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-biometric">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <div className="p-3 rounded-full gradient-primary">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl">Secure Login</CardTitle>
        <CardDescription>
          Access your biometric attendance portal
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Student
            </TabsTrigger>
            <TabsTrigger value="teacher" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Teacher
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="space-y-4">
            <div className="text-center mb-4">
              <Badge variant="outline" className="text-xs">
                Demo Credentials: Roll: S1234, Password: demo123
              </Badge>
            </div>
            
            <form onSubmit={(e) => handleSubmit(e, "student")} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  placeholder="Enter your roll number"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full gradient-primary" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  "Login as Student"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="teacher" className="space-y-4">
            <div className="text-center mb-4">
              <Badge variant="outline" className="text-xs">
                Demo Credentials: ID: T001, Password: teacher123
              </Badge>
            </div>
            
            <form onSubmit={(e) => handleSubmit(e, "teacher")} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  placeholder="Enter your employee ID"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teacherPassword">Password</Label>
                <div className="relative">
                  <Input
                    id="teacherPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full gradient-secondary" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  "Login as Teacher"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LoginForm;