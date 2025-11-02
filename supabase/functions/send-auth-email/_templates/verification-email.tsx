import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface VerificationEmailProps {
  verificationUrl: string;
  userEmail: string;
}

export const VerificationEmail = ({
  verificationUrl,
  userEmail,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to ovaboe.dev - Verify your email to get started</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <div style={logoBadge}>
            <span style={logoText}>ovaboe.dev</span>
          </div>
        </Section>
        
        <Heading style={h1}>Welcome to ovaboe.dev! 🎉</Heading>
        
        <Text style={text}>
          Hi there! We're thrilled to have you join our community of learners, professionals, and students.
        </Text>
        
        <Text style={text}>
          To unlock your account and start your journey with us, please verify your email address:
        </Text>
        
        <Section style={buttonContainer}>
          <Button style={button} href={verificationUrl}>
            Verify Your Email
          </Button>
        </Section>
        
        <Text style={helpText}>
          Having trouble? Copy and paste this link into your browser:
        </Text>
        
        <Text style={linkText}>
          {verificationUrl}
        </Text>
        
        <Section style={featureBox}>
          <Text style={featureTitle}>What's Next?</Text>
          <Text style={featureText}>
            ✓ Build your professional profile<br />
            ✓ Access exclusive courses and workshops<br />
            ✓ Connect with like-minded professionals<br />
            ✓ Share your knowledge through our blog platform
          </Text>
        </Section>
        
        <Text style={footerText}>
          🔒 This verification link expires in 24 hours for your security.
        </Text>
        
        <Section style={divider} />
        
        <Text style={footer}>
          Didn't sign up for ovaboe.dev? You can safely ignore this email.
        </Text>
        
        <Text style={footer}>
          © 2025 ovaboe.dev. All rights reserved.<br />
          <Link href="https://ovaboe.dev" style={footerLink}>
            Website
          </Link>
          {' • '}
          <Link href="mailto:support@ovaboe.dev" style={footerLink}>
            Support
          </Link>
          {' • '}
          <Link href="https://ovaboe.dev/privacy" style={footerLink}>
            Privacy
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

const main = {
  backgroundColor: '#f0f4f8',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '40px 20px',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px',
  maxWidth: '600px',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
};

const logoSection = {
  padding: '0 0 32px',
  textAlign: 'center' as const,
};

const logoBadge = {
  display: 'inline-block',
  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  padding: '12px 32px',
  borderRadius: '50px',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
};

const logoText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  letterSpacing: '-0.5px',
};

const h1 = {
  color: '#1e293b',
  fontSize: '32px',
  fontWeight: '800',
  margin: '0 0 24px',
  lineHeight: '1.2',
  textAlign: 'center' as const,
};

const text = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const helpText = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0 8px',
  textAlign: 'center' as const,
};

const buttonContainer = {
  padding: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#3B82F6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 48px',
  lineHeight: '100%',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
  transition: 'all 0.2s ease',
};

const linkText = {
  color: '#3B82F6',
  fontSize: '13px',
  wordBreak: 'break-all' as const,
  backgroundColor: '#f1f5f9',
  padding: '12px',
  borderRadius: '6px',
  fontFamily: 'monospace',
  margin: '0 0 24px',
  display: 'block',
};

const featureBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 0',
};

const featureTitle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 16px',
};

const featureText = {
  color: '#475569',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
};

const footerText = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const divider = {
  borderTop: '1px solid #e2e8f0',
  margin: '32px 0',
};

const footer = {
  color: '#94a3b8',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '12px 0',
  textAlign: 'center' as const,
};

const footerLink = {
  color: '#3B82F6',
  textDecoration: 'none',
  fontWeight: '500',
};
