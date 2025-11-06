import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Key, Chrome, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [signUpData, setSignUpData] = useState({ mobileNumber: "", countryCode: "+1", password: "", fullName: "" });
  const [signInData, setSignInData] = useState({ mobileNumber: "", countryCode: "+1", password: "" });
  const [forgotData, setForgotData] = useState({ mobileNumber: "", countryCode: "+1", newPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpType, setOtpType] = useState<'signup' | 'signin' | 'password_reset'>('signup');
  const [currentMobile, setCurrentMobile] = useState("");
  const [currentCountryCode, setCurrentCountryCode] = useState("+1");
  const [currentOtp, setCurrentOtp] = useState("");
  const customAuth = useCustomAuth();
  const oAuth = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (customAuth.user || oAuth.user) {
      navigate("/", { replace: true });
    }
  }, [customAuth.user, oAuth.user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!signUpData.mobileNumber || !signUpData.password || !signUpData.fullName) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error, requiresOtp, otp } = await customAuth.signUp(
      signUpData.mobileNumber, 
      signUpData.countryCode,
      signUpData.password, 
      signUpData.fullName
    );
    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    if (requiresOtp) {
      setShowOtpInput(true);
      setOtpType('signup');
      setCurrentMobile(signUpData.mobileNumber);
      setCurrentCountryCode(signUpData.countryCode);
      setCurrentOtp(otp || '');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!signInData.mobileNumber || !signInData.password) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error, requiresOtp, otp } = await customAuth.signIn(
      signInData.mobileNumber,
      signInData.countryCode,
      signInData.password
    );
    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    if (requiresOtp) {
      setShowOtpInput(true);
      setOtpType('signin');
      setCurrentMobile(signInData.mobileNumber);
      setCurrentCountryCode(signInData.countryCode);
      setCurrentOtp(otp || '');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!forgotData.mobileNumber) {
      toast({
        title: "Validation Error",
        description: "Mobile number is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error, requiresOtp, otp } = await customAuth.forgotPassword(
      forgotData.mobileNumber,
      forgotData.countryCode
    );
    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    if (requiresOtp) {
      setShowOtpInput(true);
      setOtpType('password_reset');
      setCurrentMobile(forgotData.mobileNumber);
      setCurrentCountryCode(forgotData.countryCode);
      setCurrentOtp(otp || '');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    if (otpType === 'password_reset') {
      if (!forgotData.newPassword || forgotData.newPassword.length < 8) {
        toast({
          title: "Validation Error",
          description: "Password must be at least 8 characters",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const { error } = await customAuth.resetPassword(
        currentMobile,
        currentCountryCode,
        otpCode,
        forgotData.newPassword
      );
      setIsLoading(false);
      
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        return;
      }
      
      setShowOtpInput(false);
      setMode('signin');
      setOtpCode('');
      setForgotData({ mobileNumber: "", countryCode: "+1", newPassword: "" });
      return;
    }
    
    const { error } = await customAuth.verifyOtp(currentMobile, currentCountryCode, otpCode, otpType);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    navigate("/");
  };

  if (showOtpInput) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Verify OTP</CardTitle>
            <CardDescription className="text-center">
              Enter the 6-digit code to complete {otpType === 'signup' ? 'registration' : otpType === 'signin' ? 'sign in' : 'password reset'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <Alert className="bg-primary/10 border-primary">
                <Key className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Your OTP:</strong> <span className="font-mono text-lg">{currentOtp}</span>
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl tracking-widest"
                  required
                  autoFocus
                />
                <p className="text-xs text-muted-foreground text-center">
                  OTP expires in 10 minutes
                </p>
              </div>
              
              {otpType === 'password_reset' && (
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={forgotData.newPassword}
                    onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters
                  </p>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  otpType === 'password_reset' ? 'Reset Password' : 'Verify OTP'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setShowOtpInput(false);
                  setOtpCode('');
                }}
                disabled={isLoading}
              >
                Back
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'signin' | 'signup' | 'forgot')} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="forgot">Reset</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-country">Country Code</Label>
                  <Select value={signInData.countryCode} onValueChange={(value) => setSignInData({ ...signInData, countryCode: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+1">+1 (US/Canada)</SelectItem>
                      <SelectItem value="+44">+44 (UK)</SelectItem>
                      <SelectItem value="+91">+91 (India)</SelectItem>
                      <SelectItem value="+86">+86 (China)</SelectItem>
                      <SelectItem value="+61">+61 (Australia)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-mobile">Mobile Number</Label>
                  <Input
                    id="signin-mobile"
                    type="tel"
                    placeholder="1234567890"
                    value={signInData.mobileNumber}
                    onChange={(e) => setSignInData({ ...signInData, mobileNumber: e.target.value.replace(/\D/g, '') })}
                    required
                  />
                  {errors.mobileNumber && <p className="text-sm text-destructive">{errors.mobileNumber}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    required
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                </Button>
              </form>

              <div className="mt-6">
                <Separator className="my-4" />
                <p className="text-center text-sm text-muted-foreground mb-4">Or continue with</p>
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => oAuth.signInWithOAuth('google')}
                    disabled={isLoading}
                  >
                    <Chrome className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => oAuth.signInWithOAuth('github')}
                    disabled={isLoading}
                  >
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => oAuth.signInWithOAuth('facebook')}
                    disabled={isLoading}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signUpData.fullName}
                    onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                    required
                  />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-country">Country Code</Label>
                  <Select value={signUpData.countryCode} onValueChange={(value) => setSignUpData({ ...signUpData, countryCode: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+1">+1 (US/Canada)</SelectItem>
                      <SelectItem value="+44">+44 (UK)</SelectItem>
                      <SelectItem value="+91">+91 (India)</SelectItem>
                      <SelectItem value="+86">+86 (China)</SelectItem>
                      <SelectItem value="+61">+61 (Australia)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-mobile">Mobile Number</Label>
                  <Input
                    id="signup-mobile"
                    type="tel"
                    placeholder="1234567890"
                    value={signUpData.mobileNumber}
                    onChange={(e) => setSignUpData({ ...signUpData, mobileNumber: e.target.value.replace(/\D/g, '') })}
                    required
                  />
                  {errors.mobileNumber && <p className="text-sm text-destructive">{errors.mobileNumber}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    required
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign Up"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="forgot">
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-country">Country Code</Label>
                  <Select value={forgotData.countryCode} onValueChange={(value) => setForgotData({ ...forgotData, countryCode: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+1">+1 (US/Canada)</SelectItem>
                      <SelectItem value="+44">+44 (UK)</SelectItem>
                      <SelectItem value="+91">+91 (India)</SelectItem>
                      <SelectItem value="+86">+86 (China)</SelectItem>
                      <SelectItem value="+61">+61 (Australia)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forgot-mobile">Mobile Number</Label>
                  <Input
                    id="forgot-mobile"
                    type="tel"
                    placeholder="1234567890"
                    value={forgotData.mobileNumber}
                    onChange={(e) => setForgotData({ ...forgotData, mobileNumber: e.target.value.replace(/\D/g, '') })}
                    required
                  />
                  {errors.mobileNumber && <p className="text-sm text-destructive">{errors.mobileNumber}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset OTP"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Alert className="bg-muted/50">
            <Key className="h-4 w-4" />
            <AlertDescription className="text-xs text-center">
              <strong>Hybrid Auth System:</strong> Sign in with mobile + SMS OTP or use OAuth (Google/GitHub/Facebook). Password reset available.
            </AlertDescription>
          </Alert>
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
