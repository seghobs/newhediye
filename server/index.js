const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'users.json');

// Ensure users.json exists
async function initializeUsersFile() {
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([]));
  }
}

// Read users from file
async function getUsers() {
  const data = await fs.readFile(USERS_FILE, 'utf8');
  return JSON.parse(data);
}

// Write users to file
async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Check if user is eligible for gift
function isEligibleForGift(lastGiftDate) {
  if (!lastGiftDate) return true;
  const lastDate = new Date(lastGiftDate);
  const now = new Date();
  const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
  return diffDays >= 20;
}

// API Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const newUsers = req.body;
    const users = await getUsers();
    const updatedUsers = [...users];
    
    newUsers.forEach(newUser => {
      if (!updatedUsers.some(u => u.id === newUser.id)) {
        updatedUsers.push({
          ...newUser,
          lastGiftDate: null
        });
      }
    });
    
    await saveUsers(updatedUsers);
    res.json(updatedUsers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add users' });
  }
});

app.post('/api/users/:id/gift', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await getUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!isEligibleForGift(users[userIndex].lastGiftDate)) {
      return res.status(400).json({ error: 'User not eligible for gift yet' });
    }
    
    users[userIndex].lastGiftDate = new Date().toISOString();
    await saveUsers(users);
    res.json(users[userIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to give gift' });
  }
});

app.delete('/api/users/:id/gift', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await getUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    users[userIndex].lastGiftDate = null;
    await saveUsers(users);
    res.json(users[userIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove gift' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await getUsers();
    const updatedUsers = users.filter(u => u.id !== id);
    await saveUsers(updatedUsers);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Initialize and start server
initializeUsersFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
});