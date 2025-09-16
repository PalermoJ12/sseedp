import {
    Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import Pagination from "@/components/ui/pagination";
import Modal from "@/components/ui/modal";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Plus, Search, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from 'react';
import { Toast } from "@/components/ui/toast";
import { type SharedData } from '@/types';

type User = {
    id: number;
    name: string;
    email: string;
    school_id: string | null;
    region: string | null;
    division: string | null;
    school_name: string | null;
    role: number;
    created_at: string;
};

type School = {
    school_id: string;
    school_name: string;
    region: string;
    division: string;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type PageProps = {
    users: Paginated<User>;
    filters: { search?: string };
    flash?: { success?: string }
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: '/users' },
];

const roleOptions = [
    { value: 0, label: 'User' },
    { value: 1, label: 'Admin' },
];

export default function Users() {
    const { auth } = usePage<SharedData>().props;
    const { users, flash, filters } = usePage<PageProps>().props;

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'update' | 'delete' | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [schools, setSchools] = useState<School[]>([]);
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        school_id: '',
        region: '',
        division: '',
        school_name: '',
        role: 0,
    });

    const [search, setSearch] = useState(filters.search || "");
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");
    
    // Get current page from URL params or users object
    const getCurrentPage = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const pageFromUrl = urlParams.get('page');
        return pageFromUrl ? parseInt(pageFromUrl) : users.current_page || 1;
    };

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType("success");
            setToastOpen(true);
        }
    }, [flash]);

    // Fetch schools data
    useEffect(() => {
        fetch(route('api.schools'))
            .then(response => response.json())
            .then(data => setSchools(data))
            .catch(error => console.error('Error fetching schools:', error));
    }, []);

    const openCreateModal = () => {
        setSelectedUser(null);
        setForm({
            name: '',
            email: '',
            password: '',
            school_id: '',
            region: '',
            division: '',
            school_name: '',
            role: 0
        });
        setModalType('create');
        setModalOpen(true);
    };

    const openUpdateModal = (user: User) => {
        setSelectedUser(user);
        setForm({
            name: user.name,
            email: user.email,
            password: '', // Don't populate password for updates
            school_id: user.school_id || '',
            region: user.region || '',
            division: user.division || '',
            school_name: user.school_name || '',
            role: user.role,
        });
        setModalType('update');
        setModalOpen(true);
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setModalType('delete');
        setModalOpen(true);
    };

    const handleSchoolChange = (schoolId: string) => {
        const selectedSchool = schools.find(school => school.school_id === schoolId);
        if (selectedSchool) {
            setForm(prev => ({
                ...prev,
                school_id: selectedSchool.school_id,
                region: selectedSchool.region,
                division: selectedSchool.division,
                school_name: selectedSchool.school_name,
            }));
        } else {
            setForm(prev => ({
                ...prev,
                school_id: '',
                region: '',
                division: '',
                school_name: '',
            }));
        }
    };

    // === CRUD Handlers ===
    const handleCreate = () => {
        const currentPage = getCurrentPage();
        const requestData: any = {
            ...form,
            page: currentPage,
        };

        // Add search parameter if it exists
        if (search) {
            requestData.search = search;
        }

        router.post(
            route('users.store'),
            requestData,
            {
                preserveState: true,
                onSuccess: () => {
                    setToastMessage("User created successfully!");
                    setToastType("success");
                    setToastOpen(true);
                    setModalOpen(false);
                },
                onError: (errors) => {
                    console.log('Validation errors:', errors);
                    setToastMessage("Failed to create user. Please check the form.");
                    setToastType("error");
                    setToastOpen(true);
                },
            }
        );
    };

    const handleUpdate = () => {
        if (!selectedUser) return;

        const currentPage = getCurrentPage();
        const requestData: any = {
            ...form,
            page: currentPage,
        };

        // Add search parameter if it exists
        if (search) {
            requestData.search = search;
        }

        router.put(
            route('users.update', selectedUser.id),
            requestData,
            {
                preserveState: true,
                onSuccess: () => {
                    setToastMessage("User updated successfully!");
                    setToastType("success");
                    setToastOpen(true);
                    setModalOpen(false);
                },
                onError: (errors) => {
                    console.log('Validation errors:', errors);
                    setToastMessage("Failed to update user. Please check the form.");
                    setToastType("error");
                    setToastOpen(true);
                },
            }
        );
    };

    const handleDelete = () => {
        if (!selectedUser) return;

        const currentPage = getCurrentPage();
        const requestData: { page: number; search?: string } = {
            page: currentPage,
        };

        // Add search parameter if it exists
        if (search) {
            requestData.search = search;
        }

        router.delete(route('users.destroy', selectedUser.id), {
            data: requestData,
            preserveState: true,
            onSuccess: () => {
                setToastMessage("User deleted successfully!");
                setToastType("success");
                setToastOpen(true);
                setModalOpen(false);
            },
            onError: () => {
                setToastMessage("Failed to delete user.");
                setToastType("error");
                setToastOpen(true);
            },
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const queryParams: { search?: string; page?: number } = {};
        
        if (search.trim()) {
            queryParams.search = search.trim();
        }
        // Reset to page 1 when searching
        queryParams.page = 1;

        router.get(route("users.index"), queryParams, { 
            preserveState: true, 
            replace: true 
        });
    };

    const getRoleBadgeColor = (role: number) => {
        switch (role) {
            case 1: return 'bg-red-100 text-red-800'; // Admin
            case 0: return 'bg-blue-100 text-blue-800'; // User
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleLabel = (role: number) => {
        switch (role) {
            case 1: return 'Admin';
            case 0: return 'User';
            default: return 'Unknown';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex justify-between items-center m-4">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email, role, region, division..."
                        className="w-80 rounded border px-3 py-2"
                    />
                    <Button type="submit" variant="outline">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>

                <Button onClick={openCreateModal}><Plus className="h-4 w-4" /></Button>
            </div>

            <div className="flex h-screen flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>Division</TableHead>
                            <TableHead>School</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data.filter((userdata) => userdata.email !== auth.user.email).map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                        {getRoleLabel(user.role)}
                                    </span>
                                </TableCell>
                                <TableCell>{user.region || '-'}</TableCell>
                                <TableCell>{user.division || '-'}</TableCell>
                                <TableCell>{user.school_name || '-'}</TableCell>
                                <TableCell>
                                    <Button size="icon" variant="outline" className="mr-2"
                                        onClick={() => openUpdateModal(user)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="outline"
                                        onClick={() => openDeleteModal(user)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                {/* Show pagination info and pagination component */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {users.data.length - 1} of {users.total - 1} results
                        {search && <span> for "{search}"</span>}
                    </div>
                    <Pagination links={users.links} />
                </div>

                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={
                        modalType === 'create'
                            ? 'Add New User'
                            : modalType === 'update'
                                ? 'Update User'
                                : 'Delete User'
                    }
                    onConfirm={
                        modalType === 'create'
                            ? handleCreate
                            : modalType === 'update'
                                ? handleUpdate
                                : handleDelete
                    }
                    confirmText={
                        modalType === 'create'
                            ? 'Create'
                            : modalType === 'update'
                                ? 'Update'
                                : 'Delete'
                    }
                    variant={modalType === 'delete' ? 'destructive' : 'default'}
                >
                    {modalType !== 'delete' ? (
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Full Name"
                                    className="w-full rounded border px-3 py-2"
                                    required
                                />

                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="Email Address"
                                    className="w-full rounded border px-3 py-2"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        placeholder={modalType === 'create' ? "Password" : "New Password (leave blank to keep current)"}
                                        className="w-full rounded border px-3 py-2 pr-10"
                                        required={modalType === 'create'}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-2.5 text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                <select
                                    value={form.role.toString()}
                                    onChange={(e) => setForm({ ...form, role: parseInt(e.target.value) })}
                                    className="w-full rounded border px-3 py-2"
                                    required
                                >
                                    {roleOptions.map(option => (
                                        <option key={option.value} value={option.value.toString()}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <select
                                    value={form.school_id}
                                    onChange={(e) => handleSchoolChange(e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                >
                                    <option value="">Select School (Optional)</option>
                                    {schools.map(school => (
                                        <option key={school.school_id} value={school.school_id}>
                                            {school.school_name} - {school.region}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {form.school_id && (
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
                                    <input
                                        type="text"
                                        value={form.region}
                                        onChange={(e) => setForm({ ...form, region: e.target.value })}
                                        placeholder="Region"
                                        className="w-full rounded border px-3 py-2"
                                        readOnly
                                    />
                                    <input
                                        type="text"
                                        value={form.division}
                                        onChange={(e) => setForm({ ...form, division: e.target.value })}
                                        placeholder="Division"
                                        className="w-full rounded border px-3 py-2"
                                        readOnly
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <p className="mb-4">
                                Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded p-3">
                                <p className="text-sm text-red-700">
                                    <strong>Email:</strong> {selectedUser?.email}<br />
                                    <strong>Role:</strong> {getRoleLabel(selectedUser?.role || 0)}<br />
                                    {selectedUser?.school_name && (
                                        <>
                                            <strong>School:</strong> {selectedUser.school_name}
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </Modal>

                <Toast
                    open={toastOpen}
                    message={toastMessage}
                    type={toastType}
                    onOpenChange={setToastOpen}
                />
            </div>
        </AppLayout>
    );
}