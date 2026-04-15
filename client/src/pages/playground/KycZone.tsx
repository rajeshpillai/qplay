import React, { useState, useEffect, useRef, useCallback } from "react";
import Shell from "@/components/layout/Shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  FileCheck,
  Video,
  MessageSquare,
  ScrollText,
  Phone,
  Upload,
  Check,
  Camera,
  Clock,
} from "lucide-react";

// ── Multi-Step KYC Wizard ────────────────────────────────────────────────────

function KycWizard() {
  const [step, setStep] = useState(1);
  const [fullname, setFullname] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [kycSubmitted, setKycSubmitted] = useState(false);

  const handleUpload = () => {
    setUploadStatus("Uploading...");
    setUploadProgress(0);

    const t1 = setTimeout(() => setUploadProgress(40), 400);
    const t2 = setTimeout(() => {
      setUploadProgress(75);
      setUploadStatus("Verifying...");
    }, 1000);
    const t3 = setTimeout(() => {
      setUploadProgress(100);
      setUploadStatus("Verified \u2713");
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  const handleSubmitKyc = () => {
    setKycSubmitted(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          KYC Onboarding Wizard
        </CardTitle>
        <CardDescription>
          Complete all 4 steps to verify your identity.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step Indicator */}
        <div className="flex gap-2" data-testid="step-indicator">
          {[1, 2, 3, 4].map((s) => (
            <Badge
              key={s}
              data-testid={`step-${s}`}
              variant={step === s ? "default" : step > s ? "secondary" : "outline"}
              className="px-3 py-1"
            >
              {step > s ? (
                <Check className="h-3 w-3 mr-1" />
              ) : null}
              {s === 1 && "Personal Info"}
              {s === 2 && "Address"}
              {s === 3 && "ID Upload"}
              {s === 4 && "Review"}
            </Badge>
          ))}
        </div>

        {kycSubmitted ? (
          <Alert
            className="border-green-500/50 text-green-500"
            data-testid="kyc-success"
          >
            <Check className="h-4 w-4" />
            <AlertDescription>KYC Completed Successfully</AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Step 1 - Personal Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                    id="fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="John Doe"
                    data-testid="input-fullname"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    data-testid="input-dob"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    data-testid="input-phone"
                  />
                </div>
              </div>
            )}

            {/* Step 2 - Address */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="123 Main St"
                    data-testid="input-street"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    data-testid="input-city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger data-testid="select-country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="Singapore">Singapore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3 - Document Upload */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doc-upload">Upload Identity Document</Label>
                  <Input
                    id="doc-upload"
                    type="file"
                    data-testid="input-doc-upload"
                    onChange={(e) =>
                      setDocFile(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={!docFile || uploadStatus === "Verified \u2713"}
                  data-testid="btn-upload-doc"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
                {uploadStatus && (
                  <div className="space-y-2">
                    <Progress
                      value={uploadProgress}
                      data-testid="upload-progress"
                    />
                    <p
                      className="text-sm text-muted-foreground"
                      data-testid="upload-status"
                    >
                      {uploadStatus}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4 - Review */}
            {step === 4 && (
              <div
                className="space-y-3 rounded-md border p-4 text-sm"
                data-testid="review-summary"
              >
                <div>
                  <span className="font-medium">Full Name:</span> {fullname}
                </div>
                <div>
                  <span className="font-medium">Date of Birth:</span> {dob}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {phone}
                </div>
                <div>
                  <span className="font-medium">Street:</span> {street}
                </div>
                <div>
                  <span className="font-medium">City:</span> {city}
                </div>
                <div>
                  <span className="font-medium">Country:</span> {country}
                </div>
                <div>
                  <span className="font-medium">Document:</span>{" "}
                  {docFile ? docFile.name : "None"}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      {!kycSubmitted && (
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            data-testid="btn-back"
          >
            Back
          </Button>
          {step < 4 ? (
            <Button
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              data-testid="btn-next"
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmitKyc} data-testid="btn-submit-kyc">
              <FileCheck className="h-4 w-4 mr-2" />
              Submit KYC
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

// ── OTP Verification ─────────────────────────────────────────────────────────

function OtpVerification() {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const id = setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => clearTimeout(id);
    }
    if (timer === 0) setCanResend(true);
  }, [timer, canResend]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = digits.join("");
    if (code === "1234") {
      setOtpSuccess(true);
      setOtpError("");
    } else {
      setOtpError("Invalid OTP. Try 1234.");
      setOtpSuccess(false);
    }
  };

  const handleResend = () => {
    setDigits(["", "", "", ""]);
    setOtpError("");
    setOtpSuccess(false);
    setTimer(30);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          OTP Verification
        </CardTitle>
        <CardDescription>
          Verify your phone number with a one-time password.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground" data-testid="otp-phone">
          OTP sent to +91 98765 43210
        </p>

        <div className="flex gap-3 justify-center">
          {digits.map((d, i) => (
            <Input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              className="w-12 h-12 text-center text-lg font-mono"
              maxLength={1}
              value={d}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              data-testid={`otp-digit-${i + 1}`}
            />
          ))}
        </div>

        {otpSuccess && (
          <Alert
            className="border-green-500/50 text-green-500"
            data-testid="otp-success"
          >
            <Check className="h-4 w-4" />
            <AlertDescription>OTP Verified Successfully</AlertDescription>
          </Alert>
        )}

        {otpError && (
          <Alert variant="destructive" data-testid="otp-error">
            <AlertDescription>{otpError}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <Button onClick={handleVerify} data-testid="btn-verify-otp">
            Verify OTP
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {canResend ? (
              <button
                className="text-primary underline cursor-pointer"
                onClick={handleResend}
                data-testid="btn-resend-otp"
              >
                Resend OTP
              </button>
            ) : (
              <span data-testid="btn-resend-otp" className="opacity-50">
                Resend OTP
              </span>
            )}
            <span className="flex items-center gap-1" data-testid="otp-timer">
              <Clock className="h-3 w-3" />
              {timer}s
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Video KYC ────────────────────────────────────────────────────────────────

function VideoKyc() {
  const [videoState, setVideoState] = useState<
    "idle" | "connecting" | "agent-joined" | "selfie-captured" | "ended"
  >("idle");

  const handleStart = () => {
    setVideoState("connecting");
    setTimeout(() => setVideoState("agent-joined"), 2000);
  };

  const handleCapture = () => {
    setVideoState("selfie-captured");
  };

  const handleEndCall = () => {
    setVideoState("ended");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Video KYC
        </CardTitle>
        <CardDescription>
          Complete a live video verification with an agent.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="relative flex items-center justify-center rounded-lg bg-gray-900 h-48 overflow-hidden"
          data-testid="video-area"
        >
          {videoState === "idle" && (
            <Camera className="h-12 w-12 text-gray-600 animate-pulse" />
          )}
          {videoState === "connecting" && (
            <p className="text-yellow-400 animate-pulse">Connecting...</p>
          )}
          {videoState === "agent-joined" && (
            <p className="text-green-400">Agent Joined</p>
          )}
          {videoState === "selfie-captured" && (
            <p className="text-green-400" data-testid="selfie-status">
              Selfie Captured &#x2713;
            </p>
          )}
          {videoState === "ended" && (
            <p className="text-gray-400">Call Ended</p>
          )}
        </div>

        <div className="flex gap-2">
          {videoState === "idle" && (
            <Button onClick={handleStart} data-testid="btn-start-video">
              <Video className="h-4 w-4 mr-2" />
              Start Video KYC
            </Button>
          )}
          {videoState === "agent-joined" && (
            <>
              <Button onClick={handleCapture} data-testid="btn-capture-selfie">
                <Camera className="h-4 w-4 mr-2" />
                Capture Selfie
              </Button>
              <Button
                variant="destructive"
                onClick={handleEndCall}
                data-testid="btn-end-call"
              >
                End Call
              </Button>
            </>
          )}
          {videoState === "selfie-captured" && (
            <Button
              variant="destructive"
              onClick={handleEndCall}
              data-testid="btn-end-call"
            >
              End Call
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── iframe Widget Communication ──────────────────────────────────────────────

const IFRAME_SRCDOC = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #1a1a2e;
      color: #e0e0e0;
      padding: 16px;
      margin: 0;
    }
    input {
      padding: 6px 10px;
      border: 1px solid #444;
      border-radius: 4px;
      background: #16213e;
      color: #e0e0e0;
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 8px;
    }
    button {
      padding: 6px 14px;
      background: #0f3460;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover { background: #1a4a7a; }
    .received {
      margin-top: 12px;
      padding: 8px;
      background: #16213e;
      border-radius: 4px;
      font-size: 13px;
      min-height: 20px;
    }
  </style>
</head>
<body>
  <div>
    <label style="font-size:13px;display:block;margin-bottom:4px;">Name</label>
    <input data-testid="widget-input-name" id="widgetName" placeholder="Enter name" />
    <button data-testid="widget-btn-send" onclick="sendToParent()">Send to Parent</button>
  </div>
  <div class="received">
    <span style="font-size:12px;color:#888;">Parent says:</span>
    <span data-testid="widget-received" id="parentMsg"></span>
  </div>
  <script>
    function sendToParent() {
      var name = document.getElementById('widgetName').value;
      window.parent.postMessage({ source: 'kyc-widget', name: name }, '*');
    }
    window.addEventListener('message', function(event) {
      if (event.data && event.data.source === 'kyc-parent') {
        document.getElementById('parentMsg').textContent = event.data.message;
      }
    });
  </script>
</body>
</html>
`;

function IframeWidget() {
  const [receivedData, setReceivedData] = useState("");
  const [messageToWidget, setMessageToWidget] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data && event.data.source === "kyc-widget") {
        setReceivedData(event.data.name);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const sendToWidget = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { source: "kyc-parent", message: messageToWidget },
        "*"
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Widget Communication (iframe)
        </CardTitle>
        <CardDescription>
          Test cross-origin messaging between parent and embedded widget.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <iframe
          ref={iframeRef}
          srcDoc={IFRAME_SRCDOC}
          data-testid="kyc-widget-frame"
          className="w-full h-48 rounded-lg border border-border"
          title="KYC Widget"
        />

        <div className="space-y-2">
          <Label>Received Data from Widget</Label>
          <div
            className="rounded-md border p-3 text-sm min-h-[32px]"
            data-testid="received-data"
          >
            {receivedData}
          </div>
        </div>

        <div className="flex gap-2 items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="msg-to-widget">Message to Widget</Label>
            <Input
              id="msg-to-widget"
              value={messageToWidget}
              onChange={(e) => setMessageToWidget(e.target.value)}
              placeholder="Type a message..."
              data-testid="input-msg-to-widget"
            />
          </div>
          <Button onClick={sendToWidget} data-testid="btn-send-to-widget">
            Send to Widget
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Consent & Terms ──────────────────────────────────────────────────────────

function ConsentTerms() {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [consentRecorded, setConsentRecorded] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = termsRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      setScrolledToBottom(true);
    }
  }, []);

  const handleAccept = () => {
    setConsentRecorded(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScrollText className="h-5 w-5" />
          Consent &amp; Terms
        </CardTitle>
        <CardDescription>
          Read and accept the terms to proceed with your KYC application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          ref={termsRef}
          onScroll={handleScroll}
          className="h-48 overflow-y-auto rounded-md border p-4 text-sm text-muted-foreground leading-relaxed"
          data-testid="terms-box"
        >
          <p className="mb-2 font-semibold text-foreground">
            Terms and Conditions for KYC Verification
          </p>
          <p className="mb-2">
            1. By submitting your KYC documents, you consent to the collection,
            storage, and processing of your personal information for identity
            verification purposes in accordance with applicable data protection
            laws and regulations.
          </p>
          <p className="mb-2">
            2. You acknowledge that all information provided is accurate,
            complete, and up to date. Providing false or misleading information
            may result in the rejection of your application and potential legal
            consequences.
          </p>
          <p className="mb-2">
            3. Your identity documents, including but not limited to government
            issued photo identification, proof of address, and biometric data,
            will be securely stored and encrypted using industry standard
            protocols.
          </p>
          <p className="mb-2">
            4. We reserve the right to request additional documentation or
            information at any time during or after the verification process to
            ensure ongoing compliance with regulatory requirements.
          </p>
          <p className="mb-2">
            5. The verification process may involve third-party identity
            verification services. By proceeding, you consent to sharing your
            data with these authorized service providers under strict
            confidentiality agreements.
          </p>
          <p className="mb-2">
            6. You have the right to request access to, correction of, or
            deletion of your personal data at any time by contacting our data
            protection officer at privacy@example.com.
          </p>
          <p className="mb-2">
            7. In the event of a data breach, you will be notified within 72
            hours in accordance with applicable notification requirements and
            regulatory obligations.
          </p>
          <p className="mb-2">
            8. Your KYC verification status is valid for a period of 12 months
            from the date of approval. You may be required to re-verify your
            identity upon expiration or if significant changes occur.
          </p>
          <p className="mb-2">
            9. We may use anonymized and aggregated data derived from the KYC
            process for analytical purposes, product improvement, and regulatory
            reporting without identifying individual users.
          </p>
          <p className="mb-2">
            10. By clicking the consent checkbox below, you acknowledge that you
            have read, understood, and agree to be bound by these terms and
            conditions in their entirety.
          </p>
          <p className="mb-2">
            11. These terms are governed by the laws of the jurisdiction in which
            the service is provided. Any disputes shall be resolved through
            binding arbitration.
          </p>
          <p className="mb-2">
            12. We reserve the right to modify these terms at any time. Continued
            use of the service after modifications constitutes acceptance of the
            revised terms.
          </p>
          <p className="mb-2">
            13. If any provision of these terms is found to be invalid or
            unenforceable, the remaining provisions shall continue in full force
            and effect.
          </p>
          <p className="mb-2">
            14. You agree not to circumvent, disable, or otherwise interfere with
            any security features of the KYC verification system.
          </p>
          <p className="mb-2">
            15. For questions or concerns regarding these terms, please contact
            our support team at support@example.com or call +1-800-555-0199.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="consent"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            disabled={!scrolledToBottom}
            data-testid="checkbox-consent"
          />
          <Label
            htmlFor="consent"
            className={!scrolledToBottom ? "opacity-50" : ""}
          >
            I agree to the terms and conditions
          </Label>
        </div>

        {consentRecorded && (
          <Alert
            className="border-green-500/50 text-green-500"
            data-testid="consent-success"
          >
            <Check className="h-4 w-4" />
            <AlertDescription>Consent Recorded</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAccept}
          disabled={!agreed}
          data-testid="btn-accept-terms"
        >
          Accept Terms
        </Button>
      </CardFooter>
    </Card>
  );
}

// ── Main KycZone Component ───────────────────────────────────────────────────

export default function KycZone() {
  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-mono mb-2">KYC Zone</h1>
          <p className="text-muted-foreground">
            Test KYC onboarding flows: multi-step wizards, OTP verification,
            video calls, iframe communication, and consent management.
            <br />
            <code className="text-xs bg-muted px-1 py-0.5 rounded text-pink-400">
              test-id="kyc-zone"
            </code>
          </p>
        </div>

        <KycWizard />
        <OtpVerification />
        <VideoKyc />
        <IframeWidget />
        <ConsentTerms />
      </div>
    </Shell>
  );
}
