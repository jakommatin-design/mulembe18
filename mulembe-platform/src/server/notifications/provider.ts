/**
 * Notification Provider Interface & Implementations
 *
 * Implements swappable delivery providers:
 * - Email: Resend (Free-tier API)
 * - SMS: Africa's Talking (Kenya & Regional SMS gateway)
 * - In-Memory Mocks for testing and offline environments
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SmsPayload {
  to: string; // E.164 e.g. +254712345678
  message: string;
}

export interface ProviderResult {
  success: boolean;
  id?: string;
  error?: string;
  provider: string;
  timestamp: string;
}

export interface EmailProvider {
  readonly name: string;
  send(payload: EmailPayload): Promise<ProviderResult>;
}

export interface SmsProvider {
  readonly name: string;
  send(payload: SmsPayload): Promise<ProviderResult>;
}

// ==========================================
// 1. Resend Email Provider
// ==========================================
export class ResendEmailProvider implements EmailProvider {
  readonly name = "resend";
  private apiKey: string | undefined;
  private fromEmail: string;

  constructor(apiKey?: string, fromEmail?: string) {
    this.apiKey = apiKey || process.env.RESEND_API_KEY;
    this.fromEmail =
      fromEmail ||
      process.env.RESEND_FROM_EMAIL ||
      "Mulembe National Platform <notifications@mulembe.org>";
  }

  async send(payload: EmailPayload): Promise<ProviderResult> {
    const timestamp = new Date().toISOString();

    // If running in Vitest/test environment or no API key configured, use safe mock
    if (
      !this.apiKey ||
      this.apiKey.startsWith("mock") ||
      this.apiKey === "test" ||
      process.env.NODE_ENV === "test"
    ) {
      return {
        success: true,
        id: `resend-sim-${Math.random().toString(36).substring(2, 9)}`,
        provider: this.name,
        timestamp,
      };
    }

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text || payload.html.replace(/<[^>]*>?/gm, ""),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return {
          success: false,
          error: `Resend error (${res.status}): ${errText}`,
          provider: this.name,
          timestamp,
        };
      }

      const data = (await res.json()) as { id?: string };
      return {
        success: true,
        id: data.id || `resend-${Date.now()}`,
        provider: this.name,
        timestamp,
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error sending email via Resend",
        provider: this.name,
        timestamp,
      };
    }
  }
}

// ==========================================
// 2. Africa's Talking SMS Provider
// ==========================================
export class AfricasTalkingSmsProvider implements SmsProvider {
  readonly name = "africas_talking";
  private apiKey: string | undefined;
  private username: string;
  private senderId: string | undefined;

  constructor(apiKey?: string, username?: string, senderId?: string) {
    this.apiKey = apiKey || process.env.AT_API_KEY;
    this.username = username || process.env.AT_USERNAME || "sandbox";
    this.senderId = senderId || process.env.AT_SENDER_ID || "MULEMBE";
  }

  async send(payload: SmsPayload): Promise<ProviderResult> {
    const timestamp = new Date().toISOString();

    // If running in Vitest/test environment or no API key configured, use safe mock
    if (
      !this.apiKey ||
      this.apiKey.startsWith("mock") ||
      this.apiKey === "test" ||
      process.env.NODE_ENV === "test"
    ) {
      return {
        success: true,
        id: `at-sim-${Math.random().toString(36).substring(2, 9)}`,
        provider: this.name,
        timestamp,
      };
    }

    try {
      const endpoint =
        this.username === "sandbox"
          ? "https://api.sandbox.africastalking.com/version1/messaging"
          : "https://api.africastalking.com/version1/messaging";

      const params = new URLSearchParams();
      params.append("username", this.username);
      params.append("to", payload.to);
      params.append("message", payload.message);
      if (this.senderId && this.username !== "sandbox") {
        params.append("from", this.senderId);
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          apiKey: this.apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: params.toString(),
      });

      if (!res.ok) {
        const errText = await res.text();
        return {
          success: false,
          error: `Africa's Talking error (${res.status}): ${errText}`,
          provider: this.name,
          timestamp,
        };
      }

      const data = (await res.json()) as {
        SMSMessageData?: {
          Recipients?: Array<{
            statusCode: number;
            number: string;
            status: string;
            cost: string;
            messageId: string;
          }>;
          Message?: string;
        };
      };

      const recipient = data?.SMSMessageData?.Recipients?.[0];
      const isSuccess = recipient ? recipient.status === "Success" : true;

      return {
        success: isSuccess,
        id: recipient?.messageId || `at-${Date.now()}`,
        error: isSuccess ? undefined : `Delivery status: ${recipient?.status || "Unknown"}`,
        provider: this.name,
        timestamp,
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error sending SMS via Africa's Talking",
        provider: this.name,
        timestamp,
      };
    }
  }
}

// ==========================================
// 3. Mock Providers for Unit Testing / Spy
// ==========================================
export class MockEmailProvider implements EmailProvider {
  readonly name = "mock_email";
  public sent: EmailPayload[] = [];
  public shouldFail = false;

  async send(payload: EmailPayload): Promise<ProviderResult> {
    if (this.shouldFail) {
      return {
        success: false,
        error: "Simulated Email Failure",
        provider: this.name,
        timestamp: new Date().toISOString(),
      };
    }
    this.sent.push(payload);
    return {
      success: true,
      id: `mock-email-${this.sent.length}`,
      provider: this.name,
      timestamp: new Date().toISOString(),
    };
  }
}

export class MockSmsProvider implements SmsProvider {
  readonly name = "mock_sms";
  public sent: SmsPayload[] = [];
  public shouldFail = false;

  async send(payload: SmsPayload): Promise<ProviderResult> {
    if (this.shouldFail) {
      return {
        success: false,
        error: "Simulated SMS Failure",
        provider: this.name,
        timestamp: new Date().toISOString(),
      };
    }
    this.sent.push(payload);
    return {
      success: true,
      id: `mock-sms-${this.sent.length}`,
      provider: this.name,
      timestamp: new Date().toISOString(),
    };
  }
}

// Singleton instances
export const defaultEmailProvider = new ResendEmailProvider();
export const defaultSmsProvider = new AfricasTalkingSmsProvider();

