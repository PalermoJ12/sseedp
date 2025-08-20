import {
    Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import Pagination from "@/components/ui/pagination";
import Modal from "@/components/ui/modal";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Plus, Search } from "lucide-react"
import { useState, useEffect } from 'react';
import { Toast } from "@/components/ui/toast";

type School = {
    id: number;
    region: string;
    division: string;
    school_id: string;
    school_name: string;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

type PageProps = {
    schools: Paginated<School>;
    filters: { search?: string };
    flash?: { success?: string }
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Schools', href: '/schools' },
];

export default function Schools() {
    const { schools, flash, filters } = usePage<PageProps>().props;

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'update' | 'delete' | null>(null);
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

    const [form, setForm] = useState({
        region: '',
        division: '',
        school_id: '',
        school_name: ''
    });

    const [search, setSearch] = useState(filters.search || "");
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const currentPage = new URLSearchParams(window.location.search).get('page') || 1;

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType("success");
            setToastOpen(true);
        }
    }, [flash]);

    const openCreateModal = () => {
        setSelectedSchool(null);
        setForm({ region: '', division: '', school_id: '', school_name: '' });
        setModalType('create');
        setModalOpen(true);
    };

    const openUpdateModal = (school: School) => {
        setSelectedSchool(school);
        setForm({
            region: school.region,
            division: school.division,
            school_id: school.school_id,
            school_name: school.school_name
        });
        setModalType('update');
        setModalOpen(true);
    };

    const openDeleteModal = (school: School) => {
        setSelectedSchool(school);
        setModalType('delete');
        setModalOpen(true);
    };

    // === CRUD Handlers ===
    const handleCreate = () => {
        router.post(
            route('schools.store'),
            { ...form, page: currentPage },
            {
                preserveState: true,
                onSuccess: () => {
                    setToastMessage("School created successfully!");
                    setToastType("success");
                    setToastOpen(true);
                    router.reload({ only: ["schools"] });
                },
                onError: () => {
                    setToastMessage("Failed to create school.");
                    setToastType("error");
                    setToastOpen(true);
                },
            }
        );
        setModalOpen(false);
    };

    const handleUpdate = () => {
        if (!selectedSchool) return;

        router.put(
            route('schools.update', selectedSchool.id),
            { ...form, page: currentPage },
            {
                preserveState: true,
                onSuccess: () => {
                    setToastMessage("School updated successfully!");
                    setToastType("success");
                    setToastOpen(true);
                    router.reload({ only: ["schools"] });
                },
                onError: () => {
                    setToastMessage("Failed to update school.");
                    setToastType("error");
                    setToastOpen(true);
                },
            }
        );
        setModalOpen(false);
    };

    const handleDelete = () => {
        if (!selectedSchool) return;

        router.delete(route('schools.destroy', selectedSchool.id), {
            preserveState: true,
            onSuccess: () => {
                setToastMessage("School deleted successfully!");
                setToastType("success");
                setToastOpen(true);
                router.reload({ only: ["schools"] });
            },
            onError: () => {
                setToastMessage("Failed to delete school.");
                setToastType("error");
                setToastOpen(true);
            },
        });
        setModalOpen(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route("schools.index"), { search }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex justify-between items-center m-4">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, ID, region, division..."
                        className="w-64 rounded border px-3 py-2"
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
                            <TableHead>Region</TableHead>
                            <TableHead>Division</TableHead>
                            <TableHead>School ID</TableHead>
                            <TableHead>School Name</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schools.data.map((school) => (
                            <TableRow key={school.id}>
                                <TableCell>{school.id}</TableCell>
                                <TableCell>{school.region}</TableCell>
                                <TableCell>{school.division}</TableCell>
                                <TableCell>{school.school_id}</TableCell>
                                <TableCell>{school.school_name}</TableCell>
                                <TableCell>
                                    <Button size="icon" variant="outline" className="mr-2"
                                        onClick={() => openUpdateModal(school)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="outline"
                                        onClick={() => openDeleteModal(school)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination links={schools.links} />

                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={
                        modalType === 'create'
                            ? 'Add New School'
                            : modalType === 'update'
                                ? 'Update School'
                                : 'Delete School'
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
                        <div className="flex flex-col gap-2">
                            <input type="text" value={form.region}
                                onChange={(e) => setForm({ ...form, region: e.target.value })}
                                placeholder="Region" className="w-full rounded border px-3 py-2" />

                            <input type="text" value={form.division}
                                onChange={(e) => setForm({ ...form, division: e.target.value })}
                                placeholder="Division" className="w-full rounded border px-3 py-2" />

                            <input type="text" value={form.school_id}
                                onChange={(e) => setForm({ ...form, school_id: e.target.value })}
                                placeholder="School ID" className="w-full rounded border px-3 py-2" />

                            <input type="text" value={form.school_name}
                                onChange={(e) => setForm({ ...form, school_name: e.target.value })}
                                placeholder="School Name" className="w-full rounded border px-3 py-2" />
                        </div>
                    ) : (
                        <p>
                            Are you sure you want to delete <strong>{selectedSchool?.school_name}</strong>?
                        </p>
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
