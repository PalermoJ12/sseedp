import { useState, useEffect, Fragment } from "react";
import { router, usePage } from "@inertiajs/react";
import {
  Table, TableHeader, TableBody, TableRow, TableCell, TableHead
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit, Check, Search as SearchIcon} from "lucide-react";
import { Toast } from "@/components/ui/toast";
import AppLayout from "@/layouts/app-layout";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import Modal from "@/components/ui/modal";

type Sport = { id: number; sport_name: string };
type SportItem = { id: number; item_name: string; sport_id: number };
type Inventory = { id: number; sport: Sport; item: SportItem; quantity: number, total: number };
type Paginated<T> = {
  data: T[];
  links: { url: string | null; label: string; active: boolean }[];
};
type PageProps = {
  sports: Sport[];
  inventory: Paginated<Inventory>;
  items: SportItem[];
  user: { school_id: string; id: number };
  flash?: { success?: string };
  filters?: { search?: string };
};

export default function InventoryManagement() {
  const { sports, items, inventory, user, flash, filters } = usePage<PageProps>().props;

  const [selectedSportId, setSelectedSportId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [cart, setCart] = useState<{ sport_id: number; item_id: number; quantity: number }[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [search, setSearch] = useState(filters?.search || "");

  // Finalize modal
  const [finalizeModal, setFinalizeModal] = useState(false);
  const [downloadedPsf, setDownloadedPsf] = useState("");
  const [disbursedAmount, setDisbursedAmount] = useState("");

  const filteredItems = selectedSportId ? items.filter(i => i.sport_id === selectedSportId) : [];

  useEffect(() => {
    if (flash?.success) {
      setToastMessage(flash.success);
      setToastType("success");
      setToastOpen(true);
    }
  }, [flash]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route("inventories.index"), { search }, { preserveState: true, replace: true });
  };

  const handleAddToCart = () => {
    if (!selectedSportId || !selectedItemId || quantity <= 0) {
      setToastMessage("Please select sport, item, and enter a valid quantity.");
      setToastType("error");
      setToastOpen(true);
      return;
    }
    const existsIndex = cart.findIndex(c => c.item_id === selectedItemId && c.sport_id === selectedSportId);
    if (existsIndex !== -1) {
      const newCart = [...cart];
      newCart[existsIndex].quantity += quantity; // accumulate
      setCart(newCart);
    } else {
      setCart([...cart, { sport_id: selectedSportId, item_id: selectedItemId, quantity }]);
    }
    setSelectedItemId(null);
    setQuantity(0);
  };

  const handleRemoveFromCart = (item_id: number, sport_id: number) => {
    setCart(cart.filter(c => !(c.item_id === item_id && c.sport_id === sport_id)));
  };

  const handleSubmitCart = () => {
    if (cart.length === 0) {
      setToastMessage("Cart is empty.");
      setToastType("error");
      setToastOpen(true);
      return;
    }
    router.post(route("inventories.store"), {
      school_id: user.school_id,
      user_id: user.id,
      entries: cart
    }, { preserveState: true });
    setCart([]);
  };

  const handleEditInventory = (inv: Inventory) => {
    setEditingId(inv.id);
    setEditQuantity(inv.quantity);
  };

  const handleUpdateInventory = (id: number) => {
    if (editQuantity <= 0) {
      setToastMessage("Quantity must be greater than 0.");
      setToastType("error");
      setToastOpen(true);
      return;
    }
    router.put(route("inventories.update", id), { quantity: editQuantity }, { preserveState: true });
    setEditingId(null);
  };

  const openDeleteModal = (inv: Inventory) => {
    setSelectedInventory(inv);
    setDeleteModalOpen(true);
  };

  const handleDeleteInventory = () => {
    if (!selectedInventory) return;
    router.delete(route("inventories.destroy", selectedInventory.id), { preserveState: true });
    setDeleteModalOpen(false);
    setSelectedInventory(null);
  };

  const handlePagination = (url: string | null) => {
    if (!url) return;
    router.get(url, {}, { preserveState: true });
  };

  const totalQuantityOnPage = inventory.data.reduce((sum, inv) => sum + inv.quantity, 0);

  const handleFinalizeSubmit = () => {
    if (!downloadedPsf || !disbursedAmount) {
      setToastMessage("Downloaded PSF per Sub and Disbursed Amount are required.");
      setToastType("error");
      setToastOpen(true);
      return;
    }
    router.post(route("inventories.finalize"), {
      downloaded_psf_per_sub: downloadedPsf,
      disbursed_amount: disbursedAmount
    }, { preserveState: true });
    setFinalizeModal(false);
    setDownloadedPsf("");
    setDisbursedAmount("");
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Inventory", href: "/inventory" }]}>
      <div className="flex flex-col gap-4 p-4">
        {/* Search + Add-to-Cart */}
        <div className="flex flex-wrap gap-3 items-end">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search sport or item..."
              className="border rounded px-3 py-2 w-64"
            />
            <Button type="submit" variant="outline"><SearchIcon className="h-4 w-4" /></Button>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-56 text-left">
                {selectedSportId ? sports.find(s => s.id === selectedSportId)?.sport_name : "Select Sport"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sports.map(s => (
                <DropdownMenuItem key={s.id} onClick={() => setSelectedSportId(s.id)}>
                  {s.sport_name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-56 text-left" disabled={!selectedSportId}>
                {selectedItemId ? filteredItems.find(i => i.id === selectedItemId)?.item_name : "Select Item"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {filteredItems.map(i => (
                <DropdownMenuItem key={i.id} onClick={() => setSelectedItemId(i.id)}>
                  {i.item_name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <input
            type="number"
            min={1}
            value={quantity}
            placeholder="Qty"
            className="w-24 border px-2 py-2 rounded"
            onChange={e => setQuantity(parseInt(e.target.value || "0", 10))}
          />

          <Button onClick={handleAddToCart} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add to Cart
          </Button>
        </div>

        {/* Cart Table */}
        {cart.length > 0 && (
          <div className="mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sport</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((c, idx) => (
                  <TableRow key={`${c.sport_id}-${c.item_id}-${idx}`}>
                    <TableCell>{sports.find(s => s.id === c.sport_id)?.sport_name}</TableCell>
                    <TableCell>{items.find(i => i.id === c.item_id)?.item_name}</TableCell>
                    <TableCell>{c.quantity}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="destructive"
                        onClick={() => handleRemoveFromCart(c.item_id, c.sport_id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button className="mt-3" onClick={handleSubmitCart}>
              Submit All Items
            </Button>
          </div>
        )}

        {/* Current Inventory */}
        <div className="flex items-center justify-between mt-6">
          <h2 className="font-bold text-lg">Current Inventory</h2>
          <div className="text-sm opacity-70">Item total: <b>{totalQuantityOnPage}</b></div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sport</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.data.map(inv => (
              <TableRow key={inv.id}>
                <TableCell>{inv.sport.sport_name}</TableCell>
                <TableCell>{inv.item.item_name}</TableCell>
                <TableCell>
                  {editingId === inv.id ? (
                    <input
                      type="number"
                      min={1}
                      value={editQuantity}
                      onChange={e => setEditQuantity(parseInt(e.target.value || "0", 10))}
                      className="w-24 border px-2 py-1 rounded"
                    />
                  ) : inv.quantity}
                </TableCell>
                <TableCell className="flex gap-2">
                  {editingId === inv.id ? (
                    <Button size="icon" onClick={() => handleUpdateInventory(inv.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="icon" onClick={() => handleEditInventory(inv)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="icon" variant="destructive" onClick={() => openDeleteModal(inv)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {inventory.links.map((link, idx) => (
            <Button
              key={`${link.label}-${idx}`}
              disabled={!link.url}
              variant={link.active ? "default" : "outline"}
              onClick={() => handlePagination(link.url)}
            >
              <span dangerouslySetInnerHTML={{ __html: link.label }} />
            </Button>
          ))}
        </div>

        {/* Finalize Button */}
        <div className="flex justify-end mt-6">
          <Button  disabled={inventory.data.length === 0} onClick={() => setFinalizeModal(true)}>Finalize Inventory</Button>
        </div>
      </div>

      {/* Delete confirm modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Inventory Item"
        onConfirm={handleDeleteInventory}
        confirmText="Delete"
        variant="destructive"
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{selectedInventory?.item.item_name}</strong>?
        </p>
      </Modal>

      {/* Finalize modal */}
      <Modal
        isOpen={finalizeModal}
        onClose={() => setFinalizeModal(false)}
        title="Finalize Inventory Submission"
        onConfirm={handleFinalizeSubmit}
        confirmText="Save Summary"
      >
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Downloaded PSF per Sub</label>
            <input
              type="number"
              step="0.01"
              value={downloadedPsf}
              onChange={e => setDownloadedPsf(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Disbursed Amount</label>
            <input
              type="number"
              step="0.01"
              value={disbursedAmount}
              onChange={e => setDisbursedAmount(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="0.00"
            />
          </div>
          <div className="text-sm opacity-70">
            Note: Total quantity saved equals the sum of all items under your school.
          </div>
        </div>
      </Modal>

      <Toast open={toastOpen} message={toastMessage} type={toastType} onOpenChange={setToastOpen} />
    </AppLayout>
  );
}
