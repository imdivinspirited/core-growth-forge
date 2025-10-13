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
          <Img
            src="https://ovaboe.dev/logo.png"
            width="120"
            height="40"
            alt="ovaboe.dev"
            style={logo}
          />
        </Section>
        
        <Heading style={h1}>Welcome to ovaboe.dev! 🎉</Heading>
        
        <Text style={text}>
          Hi there! We're excited to have you on board.
        </Text>
        
        <Text style={text}>
          To complete your registration and start exploring everything ovaboe.dev has to offer, 
          please verify your email address by clicking the button below:
        </Text>
        
        <Section style={buttonContainer}>
          <Button style={button} href={verificationUrl}>
            Verify Your Email
          </Button>
        </Section>
        
        <Text style={text}>
          Or copy and paste this link into your browser:
        </Text>
        
        <Text style={linkText}>
          {verificationUrl}
        </Text>
        
        <Text style={footerText}>
          This verification link will expire in 24 hours for security reasons.
        </Text>
        
        <Section style={divider} />
        
        <Text style={footer}>
          If you didn't create an account with ovaboe.dev, you can safely ignore this email.
        </Text>
        
        <Text style={footer}>
          © 2025 ovaboe.dev. All rights reserved.
          <br />
          <Link href="https://ovaboe.dev" style={footerLink}>
            Visit our website
          </Link>
          {' • '}
          <Link href="mailto:contact@ovaboe.dev" style={footerLink}>
            Contact us
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const logoSection = {
  padding: '32px 20px 0',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '700',
  margin: '40px 0 20px',
  padding: '0 20px',
  lineHeight: '36px',
  textAlign: 'center' as const,
};

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 20px',
  margin: '16px 0',
};

const buttonContainer = {
  padding: '27px 0 27px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  lineHeight: '100%',
};

const linkText = {
  color: '#5469d4',
  fontSize: '14px',
  padding: '0 20px',
  margin: '0 0 16px',
  wordBreak: 'break-all' as const,
};

const footerText = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '22px',
  padding: '0 20px',
  margin: '16px 0',
};

const divider = {
  borderBottom: '1px solid #e6ebf1',
  margin: '32px 20px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '20px',
  padding: '0 20px',
  margin: '8px 0',
  textAlign: 'center' as const,
};

const footerLink = {
  color: '#5469d4',
  textDecoration: 'underline',
};
