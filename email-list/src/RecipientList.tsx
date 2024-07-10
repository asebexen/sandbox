import { Recipient } from "./services/createRecipient";

// Controlled component that passes up events to the parent.
export interface RecipientListProps {
  recipientList: Recipient[];
  emailChanged: (recipientIndex: number, newEmail: string) => void;
  nameChanged: (recipientIndex: number, newName: string) => void;
  recipientDeleted: (recipientIndex: number) => void;
  recipientCreated: () => void;
}
export default function RecipientList(props: RecipientListProps) {
  return (
    <>
      <h2>Recipient List</h2>
      {/* Use the index in the array to uniquely refer to this recipient. */}
      {props.recipientList.map((recipient, i) =>
        <div key={i} style={{display:'flex', flexDirection:'row', alignItems:'center', gap:'4px'}}>
          <input value={recipient.name} onChange={e => props.nameChanged(i, e.target.value)}/>
          <input value={recipient.email} onChange={e => props.emailChanged(i, e.target.value)}/>
          <button onClick={() => props.recipientDeleted(i)}>Delete</button>
        </div>
      )}
      <button onClick={props.recipientCreated}>Add</button>
    </>
  )
}