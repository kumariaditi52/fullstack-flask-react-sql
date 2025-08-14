import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { MdUpdate } from 'react-icons/md';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/items');
      setItems(res.data);
    } catch {
      alert('Cannot connect to backend!');
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, price, brand, description };

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/items/${editId}`, data);
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/items', data);
      }
      setName(''); setPrice(''); setBrand(''); setDescription('');
      fetchItems();
    } catch {
      alert('Error saving data!');
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.name);
    setPrice(item.price);
    setBrand(item.brand);
    setDescription(item.description);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/items/${id}`);
    fetchItems();
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400">
      <h1 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">CRUD Application</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-2xl flex flex-wrap gap-4 justify-center transform hover:scale-105 transition-transform duration-300">
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required
          className="p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"/>
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required
          className="p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"/>
        <input type="text" placeholder="Brand" value={brand} onChange={e => setBrand(e.target.value)} required
          className="p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"/>
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required
          className="p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"/>
        <button type="submit"
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-purple-700 transform hover:scale-110 transition-all duration-300">
          {editId ? <MdUpdate size={20}/> : <FiEdit size={20}/>} {editId ? 'Update' : 'Add'}
        </button>
      </form>

      {/* Table */}
      <div className="mt-10 overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow-xl">
          <thead className="bg-purple-600 text-white text-left">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Date / Time</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-100 transition-all duration-200">
                <td className="py-2 px-4">{item.name}</td>
                <td className="py-2 px-4">{item.price}</td>
                <td className="py-2 px-4">{item.brand}</td>
                <td className="py-2 px-4">{item.datetime}</td>
                <td className="py-2 px-4">{item.description}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button onClick={() => handleEdit(item)}
                    className="bg-yellow-400 p-2 rounded-xl hover:scale-110 transition-transform duration-300 shadow-md">
                    <FiEdit size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="bg-red-500 p-2 rounded-xl hover:scale-110 transition-transform duration-300 shadow-md">
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
