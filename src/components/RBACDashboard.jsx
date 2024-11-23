import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, Key, Plus, Edit, Trash2, 
  Search, ChevronDown, X, Check, Menu,
  Settings, BarChart, Bell, LogOut
} from 'lucide-react';

const initialUsers = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john@example.com", 
    role: "Admin", 
    status: "Active",
    lastLogin: "2024-03-15T10:30:00",
    createdAt: "2024-01-01"
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane@example.com", 
    role: "Editor", 
    status: "Active",
    lastLogin: "2024-03-14T15:45:00",
    createdAt: "2024-01-15"
  },
  { 
    id: 3, 
    name: "Bob Wilson", 
    email: "bob@example.com", 
    role: "Viewer", 
    status: "Inactive",
    lastLogin: "2024-02-28T09:20:00",
    createdAt: "2024-02-01"
  }
];

const initialRoles = [
  { 
    id: 1, 
    name: "Admin",
    description: "Full system access",
    permissions: ["create_user", "edit_user", "delete_user", "manage_roles", "manage_permissions"],
    userCount: 1,
    color: "yellow"
  },
  { 
    id: 2, 
    name: "Editor",
    description: "Content management access",
    permissions: ["edit_user", "view_users", "manage_content"],
    userCount: 1,
    color: "green"
  },
  { 
    id: 3, 
    name: "Viewer",
    description: "Read-only access",
    permissions: ["view_users", "view_content"],
    userCount: 1,
    color: "yellow"
  }
];

const allPermissions = [
  { id: 1, name: "create_user", description: "Can create new users" },
  { id: 2, name: "edit_user", description: "Can modify user details" },
  { id: 3, name: "delete_user", description: "Can remove users" },
  { id: 4, name: "manage_roles", description: "Can manage role assignments" },
  { id: 5, name: "manage_permissions", description: "Can modify permission settings" },
  { id: 6, name: "view_users", description: "Can view user list" },
  { id: 7, name: "manage_content", description: "Can manage system content" },
  { id: 8, name: "view_content", description: "Can view system content" }
];


const RBACDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [permissions, setPermissions] = useState(allPermissions);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'Active',
    description: '',
    permissions: []
  });
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getRoleBadgeColor = (role) => {
    const roleObj = roles.find(r => r.name === role);
    switch(roleObj?.color) {
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (activeTab === 'users') {
        setUsers(users.filter(user => user.id !== itemToDelete.id));
      } else if (activeTab === 'roles') {
        setRoles(roles.filter(role => role.id !== itemToDelete.id));
      }
    }
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditItem(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: '',
        email: '',
        role: '',
        status: 'Active',
        description: '',
        permissions: []
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = Date.now();

    if (modalType === 'user') {
      if (editItem) {
        setUsers(users.map(user => 
          user.id === editItem.id ? { ...formData, id: editItem.id } : user
        ));
      } else {
        setUsers([...users, { ...formData, id: newId, createdAt: new Date().toISOString() }]);
      }
    } else if (modalType === 'role' && formData.permissions.length === 0) {
        alert('Roles must have at least one permission.');
        return;
      }
      

    setShowModal(false);
    setEditItem(null);
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const SearchBar = () => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        type="text"
        placeholder={`Search ${activeTab}...`}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );

  const Modal = ({ children }) => {
    if (!showModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl w-[32rem] max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = () => {
    if (!showDeleteConfirm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-96">
          <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this {activeTab.slice(0, -1)}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TabButton = ({ id, icon: Icon, label, count }) => (
    <button
      className={`flex items-center justify-between w-full p-3 rounded-lg transition-all ${
        activeTab === id 
          ? 'bg-yellow-50 text-yellow-600' 
          : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
      }`}
      onClick={() => setActiveTab(id)}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
      </div>
      {count !== undefined && (
        <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-sm">
          {count}
        </span>
      )}
    </button>
  );

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">RBAC Dashboard</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <TabButton
            id="users"
            icon={Users}
            label="Users"
            count={users.length}
          />
          <TabButton
            id="roles"
            icon={Shield}
            label="Roles"
            count={roles.length}
          />
          <hr className="my-4" />
         
        </nav>

        <div className="p-4 border-t">
          <button className="flex items-center space-x-2 text-red-600 hover:text-red-800">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  const UserForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">
        {editItem ? 'Edit User' : 'Add New User'}
      </h3>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        >
          <option value="">Select a role</option>
          {roles.map(role => (
            <option key={role.id} value={role.name}>{role.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => setShowModal(false)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
        >
          {editItem ? 'Update User' : 'Add User'}
        </button>
      </div>
    </form>
  );

  const RoleForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">
        {editItem ? 'Edit Role' : 'Add New Role'}
      </h3>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Role Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:focus:ring-yellow-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          rows="4"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Permissions</label>
        <div className="flex flex-wrap gap-2">
          {permissions.map(permission => (
            <label key={permission.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.permissions.includes(permission.name)}
              onChange={(e) => {
                const selectedPermissions = e.target.checked
                  ? [...formData.permissions, permission.name]
                  : formData.permissions.filter(p => p !== permission.name);
                setFormData({ ...formData, permissions: selectedPermissions });
              }}
            />
            {permission.name}
          </label>
          
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => setShowModal(false)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
        >
          {editItem ? 'Update Role' : 'Add Role'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-yellow-600 text-white shadow">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="text-lg font-bold">Dashboard</div>
          <div className="hidden md:flex space-x-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-2 rounded ${
                activeTab === 'users' ? 'bg-yellow-700' : ''
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`px-3 py-2 rounded ${
                activeTab === 'roles' ? 'bg-yellow-700' : ''
              }`}
            >
              Roles
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-yellow-700">
            <button
              onClick={() => setActiveTab('users')}
              className={`block px-4 py-2 ${
                activeTab === 'users' ? 'bg-yellow-800' : ''
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`block px-4 py-2 ${
                activeTab === 'roles' ? 'bg-yellow-800' : ''
              }`}
            >
              Roles
            </button>
          </div>
        )}
      </nav>
  
      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Search Bar */}
        <SearchBar />
  
        <div className="mt-4">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => openModal('user')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </button>
              </div>
              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Email</th>
                      <th className="p-2 border">Role</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(user =>
                        user.name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(user => (
                        <tr key={user.id}>
                          <td className="p-2 border">{user.name}</td>
                          <td className="p-2 border">{user.email}</td>
                          <td className="p-2 border">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="p-2 border">
                            <StatusBadge status={user.status} />
                          </td>
                          <td className="p-2 border whitespace-nowrap">
                            <button
                              onClick={() => openModal('user', user)}
                              className="text-yellow-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              className="text-red-600 hover:underline ml-4"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
  
          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => openModal('role')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Role
                </button>
              </div>
              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border">Role</th>
                      <th className="p-2 border">Description</th>
                      <th className="p-2 border">Users</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles
                      .filter(role =>
                        role.name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(role => (
                        <tr key={role.id}>
                          <td className="p-2 border">{role.name}</td>
                          <td className="p-2 border">{role.description}</td>
                          <td className="p-2 border">{role.userCount}</td>
                          <td className="p-2 border whitespace-nowrap">
                            <button
                              onClick={() => openModal('role', role)}
                              className="text-yellow-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(role)}
                              className="text-red-600 hover:underline ml-4"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
  
      {/* Modals */}
      <Modal>
        {modalType === 'user' && <UserForm />}
        {modalType === 'role' && <RoleForm />}
      </Modal>
      <DeleteConfirmModal />
    </div>
    
  );
};

export default RBACDashboard;
