import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// Mock addresses
const initialAddresses: Address[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "+91 98765 43210",
    address: "123, MG Road, Koramangala",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560034",
    isDefault: true,
  },
  {
    id: "2",
    name: "John Doe",
    phone: "+91 98765 43210",
    address: "456, Brigade Road, Indiranagar",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560038",
    isDefault: false,
  },
];

function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
    setEditingAddress(null);
  };

  const handleOpenDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        name: address.name,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error("Please fill all fields");
      return;
    }

    if (editingAddress) {
      setAddresses(addresses.map(a =>
        a.id === editingAddress.id
          ? { ...a, ...formData }
          : a
      ));
      toast.success("Address updated");
    } else {
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newAddress]);
      toast.success("Address added");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast.success("Address deleted");
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    })));
    toast.success("Default address updated");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Addresses</h1>
          <p className="text-muted-foreground">
            Manage your delivery addresses
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, apartment, etc."
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Bangalore"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Karnataka"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="560034"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingAddress ? "Update" : "Add"} Address
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No addresses saved</h2>
          <p className="text-muted-foreground mb-6">
            Add an address to make checkout faster
          </p>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{address.name}</p>
                      {address.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{address.phone}</p>
                    <p className="text-sm text-muted-foreground">{address.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(address)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Set as Default
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(address.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/account/addresses")({
  component: AddressesPage,
});
