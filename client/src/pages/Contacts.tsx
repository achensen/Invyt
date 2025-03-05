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
        console.error("Failed to create event.");
        return;
      }

      // navigate(`/event/${newEvent._id}`);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <>
      <section>
        <div className="container">
        {contacts?.length > 0 &&
        contacts.map((contact:any)=>(<div>
            {contact.name}
        </div>))}
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
