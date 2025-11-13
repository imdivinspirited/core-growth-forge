import { useState, useEffect } from "react";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { use2FA } from "@/hooks/use2FA";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, Download, QrCode, Key, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function TwoFactorAuth() {
  const { sessionToken } = useCustomAuth();
  const { loading, generate2FA, verify2FA, disable2FA } = use2FA(sessionToken);
  const { toast } = useToast();
  
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [setupStep, setSetupStep] = useState<'init' | 'scan' | 'verify' | 'complete'>('init');

  const handleGenerate = async () => {
    const { otpauth, error } = await generate2FA();
    
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    if (otpauth) {
      setQrCodeUrl(otpauth);
      setSetupStep('scan');
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }

    const { recoveryCodes: codes, error } = await verify2FA(verificationCode);
    
    if (error) {
      toast({
        title: "Verification Failed",
        description: error,
        variant: "destructive",
      });
      return;
    }

    if (codes) {
      setRecoveryCodes(codes);
      setShowRecoveryCodes(true);
      setIs2FAEnabled(true);
      setSetupStep('complete');
    }
  };

  const handleDisable = async () => {
    if (!confirm("Are you sure you want to disable 2FA? This will make your account less secure.")) {
      return;
    }

    const { error } = await disable2FA();
    
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setIs2FAEnabled(false);
    setSetupStep('init');
    setQrCodeUrl(null);
    setRecoveryCodes([]);
  };

  const downloadRecoveryCodes = () => {
    const blob = new Blob(
      [recoveryCodes.join('\n')],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recovery-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyRecoveryCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    toast({
      title: "Copied",
      description: "Recovery codes copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </div>
          </div>
          {is2FAEnabled && (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Enabled
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {setupStep === 'init' && !is2FAEnabled && (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Two-factor authentication adds an extra layer of security by requiring a code from your authenticator app in addition to your password.
              </AlertDescription>
            </Alert>
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Enable 2FA
                </>
              )}
            </Button>
          </div>
        )}

        {setupStep === 'scan' && qrCodeUrl && (
          <div className="space-y-4">
            <Alert>
              <QrCode className="h-4 w-4" />
              <AlertDescription>
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-center p-6 bg-muted rounded-lg">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                alt="2FA QR Code"
                className="w-48 h-48"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="verify-code">Verification Code</Label>
              <Input
                id="verify-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-muted-foreground">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleVerify} disabled={loading || verificationCode.length !== 6} className="flex-1">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Enable"}
              </Button>
              <Button variant="outline" onClick={() => setSetupStep('init')}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {is2FAEnabled && (
          <div className="space-y-4">
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-400">
                Two-factor authentication is enabled on your account
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleDisable} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Disable 2FA
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <Dialog open={showRecoveryCodes} onOpenChange={setShowRecoveryCodes}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Recovery Codes
              </DialogTitle>
              <DialogDescription>
                Save these codes in a secure location. Each code can only be used once.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>Important:</strong> Store these codes securely. You'll need them if you lose access to your authenticator app.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg font-mono text-sm">
                {recoveryCodes.map((code, index) => (
                  <div key={index} className="text-center">
                    {code}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={downloadRecoveryCodes} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={copyRecoveryCodes} variant="outline" className="flex-1">
                  Copy
                </Button>
              </div>
              
              <Button onClick={() => setShowRecoveryCodes(false)} className="w-full">
                I've Saved My Codes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
