import { useEffect, useState } from "react";
import { addContact, getMe } from "../utils/api";

const Contacts = () => {
  const [form, setForm] = useState({
    email: "",
  });
const [contacts, setContacts] = useState([]as any)
useEffect(() => {
  const getContacts= async ()=> {
  const userData=  await getMe()
  setContacts (userData.contacts)
  }
  getContacts()
}, [])

useEffect(() => {
  console.log (contacts)
}, [contacts])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      try {
        const newContact = await addContact(
          form.email
      )

      if (!newContact) {
        console.error("Failed to add contact.");
        return;
      }
      console.log (newContact)
      setContacts(newContact.contacts)
      // navigate(`/event/${newEvent._id}`);
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };
const handleDelete = (contactId:string)=>{
  console.log(contactId)
}

  return (
    <>
      <section>
        <div className="container">
        {/* {contacts?.length > 0 &&
        contacts.map((contact:any)=>(<div key= {contact._id}>
            {contact.name}
        </div>))} */}
        <table className="table table-striped table-bordered rounded overflow-hidden">
  <thead>
    <tr>
      <th className="col-5">Name</th> {/* 5/12 columns */}
      <th className="col-5">Email</th> {/* 5/12 columns */}
      <th className="col-2"></th> {/* 2/12 columns */}
    </tr>
  </thead>
  <tbody>
    {contacts?.length > 0 && contacts.map((contact: any) => (
      <tr key={contact._id}>
        <td>{contact.name}</td>
        <td>{contact.email}</td>
        <td className="d-flex justify-content-center">
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(contact._id)}>
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
        <div className="container">
          <form onSubmit={handleSubmit} className="event-form">
            <div className="input-group">
              <label>Add User</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Search by e-mail"
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Add User
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contacts;
