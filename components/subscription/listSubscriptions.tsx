"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

// Define the subscription type
type Subscription = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  features: string[];
  isPopular?: boolean;
};

// Static subscription data
const initialSubscriptions: Subscription[] = [
  {
    id: "1",
    name: "Basic Membership",
    description: "Perfect for beginners",
    price: 50,
    duration: 30,
    features: ["Access to gym equipment", "Locker usage", "Free water"],
    isPopular: false,
  },
  {
    id: "2",
    name: "Premium Membership",
    description: "Our most popular plan",
    price: 120,
    duration: 90,
    features: [
      "Access to gym equipment",
      "Locker usage",
      "Free water",
      "2 Personal training sessions",
      "Access to pool",
    ],
    isPopular: true,
  },
  {
    id: "3",
    name: "Elite Membership",
    description: "For serious athletes",
    price: 200,
    duration: 180,
    features: [
      "Access to gym equipment",
      "Locker usage",
      "Free water",
      "5 Personal training sessions",
      "Access to pool",
      "Nutrition consultation",
      "Unlimited classes",
    ],
    isPopular: false,
  },
  {
    id: "4",
    name: "Day Pass",
    description: "Try before you commit",
    price: 10,
    duration: 1,
    features: ["One day access to all facilities"],
    isPopular: false,
  },
];

export default function ListSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<Omit<Subscription, 'id'>>({
    name: "",
    description: "",
    price: 0,
    duration: 30,
    features: [""],
    isPopular: false,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      duration: 30,
      features: [""],
      isPopular: false,
    });
  };

  const handleAddSubscription = () => {
    // Simple validation
    if (!formData.name || formData.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Remove empty features
    const features = formData.features.filter(f => f.trim() !== "");
    
    const newSubscription: Subscription = {
      ...formData,
      features,
      id: Date.now().toString(), // Simple ID generation
    };

    setSubscriptions([...subscriptions, newSubscription]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("Membership plan added successfully");
  };

  const handleEditSubscription = () => {
    if (!selectedSubscription) return;
    
    // Simple validation
    if (!formData.name || formData.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Remove empty features
    const features = formData.features.filter(f => f.trim() !== "");
    
    const updatedSubscriptions = subscriptions.map(sub => 
      sub.id === selectedSubscription.id 
        ? { ...formData, features, id: selectedSubscription.id } 
        : sub
    );

    setSubscriptions(updatedSubscriptions);
    setIsEditDialogOpen(false);
    setSelectedSubscription(null);
    resetForm();
    toast.success("Membership plan updated successfully");
  };

  const handleDeleteSubscription = () => {
    if (!selectedSubscription) return;
    
    const updatedSubscriptions = subscriptions.filter(
      sub => sub.id !== selectedSubscription.id
    );
    
    setSubscriptions(updatedSubscriptions);
    setIsDeleteDialogOpen(false);
    setSelectedSubscription(null);
    toast.success("Membership plan deleted successfully");
  };

  const openEditDialog = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setFormData({
      name: subscription.name,
      description: subscription.description,
      price: subscription.price,
      duration: subscription.duration,
      features: [...subscription.features, ""], // Add empty field for new features
      isPopular: subscription.isPopular || false,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDeleteDialogOpen(true);
  };

  const addFeatureField = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""]
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const removeFeature = (index: number) => {
    if (formData.features.length <= 1) return;
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Membership Plans</h2>
          <p className="text-muted-foreground mt-2">
            Manage your gym's membership plans
          </p>
        </div>
        <Button onClick={() => {
          resetForm();
          setIsAddDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((subscription) => (
          <Card 
            key={subscription.id} 
            className={`flex flex-col h-full ${
              subscription.isPopular ? "border-primary shadow-md" : ""
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  {subscription.isPopular && (
                    <Badge className="mb-2">Popular</Badge>
                  )}
                  <CardTitle>{subscription.name}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(subscription)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(subscription)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>{subscription.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pt-2">
              <div className="flex items-baseline mb-4">
                <span className="text-2xl font-bold">{subscription.price} DT</span>
                <span className="text-muted-foreground ml-2">
                  / {subscription.duration === 1 
                     ? "day" 
                     : `${subscription.duration} days`}
                </span>
              </div>
              <ul className="space-y-2 text-sm">
                {subscription.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Subscription Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle>Add New Membership Plan</DialogTitle>
            <DialogDescription>
              Create a new membership plan for your gym. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (DT) *
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (days) *
              </Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isPopular" className="text-right">
                Popular Plan
              </Label>
              <div className="col-span-3">
                <Switch
                  checked={formData.isPopular}
                  onCheckedChange={(checked) => setFormData({...formData, isPopular: checked})}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right mt-2">
                Features
              </Label>
              <div className="col-span-3 space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Enter a feature"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeatureField}
                  className="mt-2"
                >
                  Add Feature
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 pt-2 bg-background">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubscription}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subscription Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} >
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle>Edit Membership Plan</DialogTitle>
            <DialogDescription>
              Make changes to the membership plan. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (DT) *
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (days) *
              </Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isPopular" className="text-right">
                Popular Plan
              </Label>
              <div className="col-span-3">
                <Switch
                  checked={formData.isPopular}
                  onCheckedChange={(checked) => setFormData({...formData, isPopular: checked})}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right mt-2">
                Features
              </Label>
              <div className="col-span-3 space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Enter a feature"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeatureField}
                  className="mt-2"
                >
                  Add Feature
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 pt-2 bg-background">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubscription}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Membership Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{selectedSubscription?.name}" plan? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteSubscription}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}