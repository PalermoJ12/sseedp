import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import Pagination from "@/components/ui/pagination";
import Modal from "@/components/ui/modal";

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Plus, Search } from "lucide-react"
import { useState, useEffect } from 'react';
import { Toast } from "@/components/ui/toast";

type Sport = {
    id: number;
    sport_name: string;
};

type SportItem = {
    id: number;
    item_name: string;
    sport: Sport;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

type PageProps = {
    items: Paginated<SportItem>;
    sports: Sport[];
    filters?: { search?: string };
    flash?: { success?: string }
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Items',
        href: '/items',
    },
];

export default function Items() {
    const { items, sports, flash, filters } = usePage<PageProps>().props;

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'update' | 'delete' | null>(null);
    const [selectedItem, setSelectedItem] = useState<SportItem | null>(null);
    const [selectedSportId, setSelectedSportId] = useState<number | null>(null);
    const [itemName, setItemName] = useState('');
    const [search, setSearch] = useState(filters?.search || "");
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
    const currentPage = new URLSearchParams(window.location.search).get('page') || 1;

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType("success");
            setToastOpen(true);
        }
    }, [flash]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route("items.index"), { search }, { preserveState: true, replace: true });
    };

    const openCreateModal = () => {
        setSelectedItem(null);
        setItemName('');
        setSelectedSportId(null);
        setModalType('create');
        setModalOpen(true);
    };

    const openUpdateModal = (item: SportItem) => {
        setSelectedItem(item);
        setItemName(item.item_name);
        setSelectedSportId(item.sport?.id ?? null);
        setModalType('update');
        setModalOpen(true);
    };

    const openDeleteModal = (item: SportItem) => {
        setSelectedItem(item);
        setModalType('delete');
        setModalOpen(true);
    };

    const handleCreate = () => {
        if (!itemName || !selectedSportId) return;

        router.post(
            route('items.store'),
            { item_name: itemName, sport_id: selectedSportId, page: currentPage },
            {
                preserveState: true,
                onSuccess: () => {
                    setToastMessage("Item created successfully!");
                    setToastType("success");
                    setToastOpen(true);
                    router.reload({ only: ["items"] });
                },
                onError: () => {
                    setToastMessage("Failed to create item.");
                    setToastType("error");
                    setToastOpen(true);
                },
            }
        );

        setModalOpen(false);
        setSelectedItem(null);
    };

    const handleUpdate = () => {
        if (!selectedItem || !selectedSportId) return;

        router.put(
            route('items.update', selectedItem.id),
            { item_name: itemName, sport_id: selectedSportId, page: currentPage },
            {
                preserveState: true,
                onSuccess: () => {
                    setToastMessage("Item updated successfully!");
                    setToastType("success");
                    setToastOpen(true);
                    router.reload({ only: ["items"] });
                },
                onError: () => {
                    setToastMessage("Failed to update item.");
                    setToastType("error");
                    setToastOpen(true);
                },
            }
        );

        setModalOpen(false);
        setSelectedItem(null);
    };

    const handleDelete = () => {
        if (!selectedItem) return;

        router.delete(route('items.destroy', selectedItem.id), {
            preserveState: true,
            onSuccess: () => {
                setToastMessage("Item deleted successfully!");
                setToastType("success");
                setToastOpen(true);
                router.reload({ only: ["items"] });
            },
            onError: () => {
                setToastMessage("Failed to delete item.");
                setToastType("error");
                setToastOpen(true);
            },
        });

        setModalOpen(false);
        setSelectedItem(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex justify-between items-center m-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search items or sports..."
                        className="w-64 rounded border px-3 py-2"
                    />
                    <Button type="submit" variant="outline">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>

                <Button onClick={openCreateModal} className="hover:cursor-pointer">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex h-screen flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Sport Name</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.item_name}</TableCell>
                                <TableCell>{item.sport?.sport_name}</TableCell>
                                <TableCell>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="mr-2 hover:cursor-pointer"
                                        onClick={() => openUpdateModal(item)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="hover:cursor-pointer"
                                        onClick={() => openDeleteModal(item)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Pagination links={items.links} />

                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={
                        modalType === 'create'
                            ? 'Add New Item'
                            : modalType === 'update'
                                ? 'Update Item'
                                : 'Delete Item'
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
                            <input
                                type="text"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="w-full rounded border px-3 py-2"
                                placeholder="Enter item name"
                            />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full text-left hover:cursor-pointer">
                                        {selectedSportId
                                            ? sports.find((s) => s.id === selectedSportId)?.sport_name
                                            : "Select a sport"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full max-w-xs">
                                    {sports.map((sport) => (
                                        <DropdownMenuItem
                                            key={sport.id}
                                            onClick={() => setSelectedSportId(sport.id)}
                                            className="hover:cursor-pointer"
                                        >
                                            {sport.sport_name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <p>
                            Are you sure you want to delete <strong>{selectedItem?.item_name}</strong>?
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
