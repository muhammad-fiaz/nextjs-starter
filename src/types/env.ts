export interface EnvConfig {
  readonly nodeEnv: "development" | "test" | "production";
  readonly appUrl?: string;
}
