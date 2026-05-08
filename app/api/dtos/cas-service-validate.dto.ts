import { z } from "zod";

export const casServiceValidate = z.object({
  serviceResponse: z.object({
    authenticationSuccess: z.object({
      user: z.string(),
      attributes: z.object({
        credentialType: z.array(z.string()),
        clientIpAddress: z.array(z.string()),
        samlAuthenticationStatementAuthMethod: z.array(z.string()),
        isFromNewLogin: z.array(z.boolean()),
        authenticationDate: z.array(z.number()),
        authenticationMethod: z.array(z.string()),
        successfulAuthenticationHandlers: z.array(z.string()),
        serverIpAddress: z.array(z.string()),
        userAgent: z.array(z.string()),
        longTermAuthenticationRequestTokenUsed: z.array(z.boolean()),
      }),
    }),
  }),
});

export type ServiceValidateResponse = z.infer<typeof casServiceValidate>;
