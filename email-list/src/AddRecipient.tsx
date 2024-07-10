import { useState } from "react";
import createRecipient, { CreateRecipientResponse } from "./services/createRecipient";
import { isResponseError } from "./services/ResponseError";

export default function AddRecipient() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  async function submit() {
    const response: CreateRecipientResponse = await createRecipient(name, email);
    if (isResponseError(response)) {
      console.error(response.error);
    } else {
      console.log(`Created recipient: ${response.name}, ${response.email}`);
    }
  }

  return (
    <>
      <h2>Add Single Recipient</h2>
      <div style={{display:'flex', flexDirection:'column'}}>
        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
          <p style={{marginBlock:'4px'}}>Name</p>
          <input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
          <p style={{marginBlock:'4px'}}>Email</p>
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <button onClick={submit}>Add</button>
      </div>
    </>
  )
}