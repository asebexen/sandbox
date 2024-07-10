import { useEffect, useState } from "react";
import RecipientList, { RecipientListProps } from "./RecipientList";
import { Recipient } from "./services/createRecipient";

// Actually calls an endpoint.
async function fetchRecipientList(): Promise<Recipient[]> {
  const mockData: Recipient[] = [
    {
      id: 'abc',
      name: 'Dorothy',
      email: 'dorothy@gmail.com'
    },
    {
      id: 'def',
      name: 'Steven',
      email: 'steven@dragons.rawr'
    }
  ];
  return mockData;
}

export default function RecipientListPage() {
  // In-memory recipient list to edit.
  const [recipientList, setRecipientList] = useState<Recipient[]>([]);

  // Fetch (mocked) data on page load.
  useEffect(() => {
    fetchRecipientList()
      .then(data => setRecipientList(data));
  }, []);

  // For visualization purposes.
  useEffect(() => {
    console.log(recipientList);
  }, [recipientList]);

  // Receive events from the child.
  function emailChanged(recipientIndex: number, newEmail: string): void {
    const newRecipientList = structuredClone(recipientList);
    newRecipientList[recipientIndex].email = newEmail;
    // Update the recipient list in a way React likes.
    setRecipientList(newRecipientList);
  }

  function nameChanged(recipientIndex: number, newName: string): void {
    const newRecipientList = structuredClone(recipientList);
    newRecipientList[recipientIndex].name = newName;
    setRecipientList(newRecipientList);
  }

  function recipientCreated() {
    const newRecipient: Recipient = {
      name: 'New Recipient',
      email: ''
    };
    const newRecipientList = [...recipientList, newRecipient];
    setRecipientList(newRecipientList);
  }

  function recipientDeleted(recipientIndex: number): void {
    const newRecipientList = [...recipientList.slice(0, recipientIndex), ...recipientList.slice(recipientIndex + 1)];
    setRecipientList(newRecipientList);
  }

  const recipientListProps: RecipientListProps = {
    recipientList,
    emailChanged,
    nameChanged,
    recipientCreated,
    recipientDeleted
  }
  return (
    <>
      <RecipientList {...recipientListProps}/>
    </>
  )
}