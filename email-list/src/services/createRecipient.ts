import { ResponseError } from "./ResponseError";

export type Recipient = {
  id?: string;
  name: string;
  email: string;
};

export type CreateRecipientResponse = Recipient | ResponseError;
export type CreateRecipientRequest = {
  name: string;
  email: string;
};

async function dummyFetch(_0: string, options: {method: string, body: string}): Promise<{json: () => Promise<CreateRecipientResponse>}> {
  const requestBody: CreateRecipientRequest = JSON.parse(options.body);

  const someNewRecipient: CreateRecipientResponse = {
    name: requestBody.name,
    email: requestBody.email
  };

  return {
    json: async () => someNewRecipient
  };
}
export default async function createRecipient(name: string, email: string): Promise<CreateRecipientResponse> {
  const requestBody: CreateRecipientRequest = {name, email};
  const response = await dummyFetch('http://localhost:8080/recipient/new', {method: 'POST', body: JSON.stringify(requestBody)} );
  const result: Promise<CreateRecipientResponse> = response.json();
  return result;
}