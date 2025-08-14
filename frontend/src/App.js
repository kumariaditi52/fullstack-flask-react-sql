import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiMoon, FiSun } from 'react-icons/fi';
import { MdUpdate } from 'react-icons/md';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

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
    <div className={darkMode ? "dark min-h-screen bg-gray-900 text-gray-200" : "min-h-screen bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 text-black"}>

      {/* Dark / Light Toggle */}
      <div className="p-4 flex justify-end">
        <button onClick={() => setDarkMode(!darkMode)} className={`text-xl p-2 rounded-full shadow-md transition-transform duration-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>

      {/* Header */}
      <header className="text-center mt-4">
        <h2 className={`text-4xl font-extrabold drop-shadow-lg mb-2 ${darkMode ? 'text-red-400' : 'text-white'}`}>React CRUD Table</h2>
        <p className={`text-lg drop-shadow-md ${darkMode ? 'text-gray-300' : 'text-white/90'}`}>Manage your items with ease</p>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className={`p-6 mt-8 rounded-2xl shadow-2xl flex flex-wrap gap-4 justify-center transform hover:scale-105 transition-transform duration-300 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-black'}`}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required
          className={`p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-black border-gray-300'}`}/>
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required
          className={`p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-black border-gray-300'}`}/>
        <input type="text" placeholder="Brand" value={brand} onChange={e => setBrand(e.target.value)} required
          className={`p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-black border-gray-300'}`}/>
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required
          className={`p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-black border-gray-300'}`}/>
        <button type="submit"
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg transform hover:scale-110 transition-all duration-300 ${darkMode ? 'bg-purple-800 text-white hover:bg-purple-700' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
          {editId ? <MdUpdate size={20}/> : <FiEdit size={20}/>} {editId ? 'Update' : 'Add'}
        </button>
      </form>

      {/* Cards */}
      <div className="p-4 mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map(item => (
          <div 
            key={item.id} 
            className={`rounded-2xl shadow-2xl p-4 flex justify-between items-start transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-black'}`}
          >
            {/* Left: Item Data */}
            <div className="flex flex-col gap-1">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-red-400' : 'text-black'}`}>{item.name}</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-black'}`}><strong>Price:</strong> ${item.price}</p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-black'}`}><strong>Brand:</strong> {item.brand}</p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-black'}`}><strong>Date:</strong> {item.datetime}</p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-black'}`}><strong>Description:</strong> {item.description}</p>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-col gap-2 ml-4">
              <button onClick={() => handleEdit(item)}
                className="bg-yellow-400 p-2 rounded-xl hover:scale-110 transition-transform duration-300 shadow-md">
                <FiEdit size={18} />
              </button>
              <button onClick={() => handleDelete(item.id)}
                className="bg-red-500 p-2 rounded-xl hover:scale-110 transition-transform duration-300 shadow-md">
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
