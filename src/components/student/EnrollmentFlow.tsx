import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, CheckCircle2, Eye, Shield, User, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnrollmentFlowProps {
  isEnrolled: boolean;
  onEnrollmentComplete: () => void;
}

const EnrollmentFlow = ({ isEnrolled, onEnrollmentComplete }: EnrollmentFlowProps) => {
  const [enrollmentStep, setEnrollmentStep] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedSelfies, setCapturedSelfies] = useState<number[]>([]);
  const { toast } = useToast();

  const enrollmentSteps = [
    { 
      title: "Device Binding", 
      description: "Secure this device to your account",
      icon: Shield,
      status: "completed"
    },
    { 
      title: "Face Capture", 
      description: "Capture 5 selfies for biometric enrollment",
      icon: Camera,
      status: enrollmentStep >= 1 ? "active" : "pending"
    },
    { 
      title: "Liveness Detection", 
      description: "Verify your live presence",
      icon: Eye,
      status: enrollmentStep >= 2 ? "active" : "pending"
    },
    { 
      title: "Enrollment Complete", 
      description: "Your biometric profile is ready",
      icon: CheckCircle2,
      status: isEnrolled ? "completed" : "pending"
    }
  ];

  const captureSelfie = async () => {
    setIsCapturing(true);
    
    // Simulate camera capture and face detection
    setTimeout(() => {
      const newSelfieIndex = capturedSelfies.length + 1;
      setCapturedSelfies(prev => [...prev, newSelfieIndex]);
      
      toast({
        title: `Selfie ${newSelfieIndex} Captured`,
        description: "Face detected and embedding computed",
      });
      
      if (newSelfieIndex === 5) {
        setEnrollmentStep(2);
        toast({
          title: "All Selfies Captured",
          description: "Proceeding to liveness verification",
        });
      }
      
      setIsCapturing(false);
    }, 2000);
  };

  const performLivenessCheck = async () => {
    setIsCapturing(true);
    
    // Simulate liveness detection
    setTimeout(() => {
      toast({
        title: "Liveness Verified",
        description: "Blink detection and head movement confirmed",
      });
      
      setTimeout(() => {
        onEnrollmentComplete();
        setIsCapturing(false);
      }, 1000);
    }, 3000);
  };

  const startEnrollment = () => {
    setEnrollmentStep(1);
    toast({
      title: "Enrollment Started",
      description: "Device binding completed successfully",
    });
  };

  if (isEnrolled) {
    return (
      <Card className="shadow-biometric">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full gradient-success flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-success-foreground" />
          </div>
          <CardTitle className="text-2xl text-success">Enrollment Complete</CardTitle>
          <CardDescription>
            Your biometric profile is active and secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success-light">
              <Shield className="w-5 h-5 text-success" />
              <div className="text-sm">
                <p className="font-medium text-success">Device Secured</p>
                <p className="text-success/80">Private keys stored in secure enclave</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success-light">
              <User className="w-5 h-5 text-success" />
              <div className="text-sm">
                <p className="font-medium text-success">Biometric Template Created</p>
                <p className="text-success/80">5 face embeddings averaged and encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success-light">
              <Eye className="w-5 h-5 text-success" />
              <div className="text-sm">
                <p className="font-medium text-success">Liveness Verified</p>
                <p className="text-success/80">Anti-spoofing measures active</p>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-4">
            <Badge variant="outline" className="text-success border-success">
              Ready for Session Scanning
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="shadow-biometric">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            Biometric Enrollment
          </CardTitle>
          <CardDescription>
            Secure your attendance with on-device biometric authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round((enrollmentStep / 3) * 100)}%</span>
              </div>
              <Progress value={(enrollmentStep / 3) * 100} className="h-2" />
            </div>
            
            <div className="grid gap-3">
              {enrollmentSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-smooth ${
                      step.status === "completed" 
                        ? "bg-success-light" 
                        : step.status === "active" 
                        ? "bg-primary/10 border border-primary/20" 
                        : "bg-muted"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      step.status === "completed" 
                        ? "text-success" 
                        : step.status === "active" 
                        ? "text-primary" 
                        : "text-muted-foreground"
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                    {step.status === "completed" && (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Step */}
      {enrollmentStep === 0 && (
        <Card className="shadow-biometric">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
            <CardTitle>Start Enrollment</CardTitle>
            <CardDescription>
              Bind this device to your account and begin biometric enrollment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Privacy Notice</p>
                    <p className="text-muted-foreground mt-1">
                      Your face data will be processed on-device only. We store only encrypted 
                      mathematical representations (embeddings), never raw images.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button onClick={startEnrollment} className="w-full gradient-primary">
                <Shield className="w-4 h-4 mr-2" />
                Begin Secure Enrollment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {enrollmentStep === 1 && (
        <Card className="shadow-biometric">
          <CardHeader className="text-center">
            <Camera className="w-12 h-12 mx-auto text-primary mb-4" />
            <CardTitle>Face Capture ({capturedSelfies.length}/5)</CardTitle>
            <CardDescription>
              Capture selfies from different angles for robust recognition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-5 gap-2 mx-auto max-w-xs">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div 
                    key={num}
                    className={`aspect-square rounded-lg border-2 border-dashed flex items-center justify-center text-xs transition-smooth ${
                      capturedSelfies.includes(num)
                        ? "border-success bg-success-light text-success"
                        : "border-muted-foreground text-muted-foreground"
                    }`}
                  >
                    {capturedSelfies.includes(num) ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      num
                    )}
                  </div>
                ))}
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto rounded-full border-4 border-primary/20 flex items-center justify-center bg-muted">
                  <Camera className="w-12 h-12 text-muted-foreground" />
                </div>
                
                <Button 
                  onClick={captureSelfie} 
                  disabled={isCapturing || capturedSelfies.length >= 5}
                  className="gradient-primary"
                >
                  {isCapturing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    `Capture Selfie ${capturedSelfies.length + 1}`
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {enrollmentStep === 2 && (
        <Card className="shadow-biometric">
          <CardHeader className="text-center">
            <Eye className="w-12 h-12 mx-auto text-primary mb-4" />
            <CardTitle>Liveness Verification</CardTitle>
            <CardDescription>
              Perform liveness check to complete enrollment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 text-center">
              <div className="w-32 h-32 mx-auto rounded-full border-4 border-primary/20 flex items-center justify-center bg-muted">
                <Eye className="w-12 h-12 text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Look at the camera and follow the instructions:
                </p>
                <div className="flex justify-center gap-4 text-xs">
                  <Badge variant="outline">Blink twice</Badge>
                  <Badge variant="outline">Turn head left</Badge>
                  <Badge variant="outline">Turn head right</Badge>
                </div>
              </div>
              
              <Button 
                onClick={performLivenessCheck}
                disabled={isCapturing}
                className="gradient-success"
              >
                {isCapturing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-success-foreground border-t-transparent rounded-full animate-spin" />
                    Verifying Liveness...
                  </div>
                ) : (
                  "Start Liveness Check"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnrollmentFlow;