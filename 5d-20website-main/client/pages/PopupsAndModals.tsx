import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Layers, 
  ShoppingBag, 
  Users, 
  Mail, 
  Filter,
  Settings,
  Eye,
  AlertCircle,
  Phone,
  Image,
  Grid
} from "lucide-react";
import SocialMediaPopup from "@/components/SocialMediaPopup";
import MobileApp from "@/components/MobileApp";
import ProductPopout from "@/components/ProductPopout";
import ProductFilter from "@/components/ProductFilter";
import SignupModal from "@/components/SignupModal";
import QuickPurchaseModal from "@/components/QuickPurchaseModal";

interface PopupManager {
  id: string;
  name: string;
  type: 'modal' | 'popup' | 'overlay' | 'notification';
  isOpen: boolean;
  category: 'social' | 'commerce' | 'auth' | 'utility' | 'mobile';
  component: string;
  description: string;
}

const PopupsAndModals = () => {
  const [popupManagers, setPopupManagers] = useState<PopupManager[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Individual popup states
  const [showSocialPopup, setShowSocialPopup] = useState(false);
  const [showMobileApp, setShowMobileApp] = useState(false);
  const [showProductPopout, setShowProductPopout] = useState(false);
  const [showProductFilter, setShowProductFilter] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showQuickPurchase, setShowQuickPurchase] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Initialize popup managers
    const managers: PopupManager[] = [
      {
        id: 'social-media-popup',
        name: 'Social Media Popup',
        type: 'popup',
        isOpen: showSocialPopup,
        category: 'social',
        component: 'SocialMediaPopup',
        description: 'Social media links and sharing options'
      },
      {
        id: 'mobile-app',
        name: 'Mobile App Preview',
        type: 'modal',
        isOpen: showMobileApp,
        category: 'mobile',
        component: 'MobileApp',
        description: 'Mobile application preview and download'
      },
      {
        id: 'product-popout',
        name: 'Product Popout',
        type: 'overlay',
        isOpen: showProductPopout,
        category: 'commerce',
        component: 'ProductPopout',
        description: 'Detailed product view with quick actions'
      },
      {
        id: 'product-filter',
        name: 'Product Filter',
        type: 'modal',
        isOpen: showProductFilter,
        category: 'commerce',
        component: 'ProductFilter',
        description: 'Advanced product filtering and search'
      },
      {
        id: 'signup-modal',
        name: 'Signup Modal',
        type: 'modal',
        isOpen: showSignupModal,
        category: 'auth',
        component: 'SignupModal',
        description: 'User registration and authentication'
      },
      {
        id: 'quick-purchase',
        name: 'Quick Purchase Modal',
        type: 'modal',
        isOpen: showQuickPurchase,
        category: 'commerce',
        component: 'QuickPurchaseModal',
        description: 'Fast checkout and purchase flow'
      }
    ];
    setPopupManagers(managers);
  }, [showSocialPopup, showMobileApp, showProductPopout, showProductFilter, showSignupModal, showQuickPurchase]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social': return <Users className="h-4 w-4" />;
      case 'mobile': return <Phone className="h-4 w-4" />;
      case 'commerce': return <ShoppingBag className="h-4 w-4" />;
      case 'auth': return <Eye className="h-4 w-4" />;
      case 'utility': return <Settings className="h-4 w-4" />;
      default: return <Grid className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'modal': return 'bg-blue-900 text-blue-300 border-blue-600';
      case 'popup': return 'bg-green-900 text-green-300 border-green-600';
      case 'overlay': return 'bg-purple-900 text-purple-300 border-purple-600';
      case 'notification': return 'bg-yellow-900 text-yellow-300 border-yellow-600';
      default: return 'bg-gray-900 text-gray-300 border-gray-600';
    }
  };

  const openPopup = (id: string) => {
    switch (id) {
      case 'social-media-popup':
        setShowSocialPopup(true);
        break;
      case 'mobile-app':
        setShowMobileApp(true);
        break;
      case 'product-popout':
        setSelectedProduct({
          id: 'demo-product',
          name: 'Demo Product',
          price: 49.99,
          description: 'This is a demo product for testing the popout functionality.',
          image: '/placeholder.svg'
        });
        setShowProductPopout(true);
        break;
      case 'product-filter':
        setShowProductFilter(true);
        break;
      case 'signup-modal':
        setShowSignupModal(true);
        break;
      case 'quick-purchase':
        setShowQuickPurchase(true);
        break;
    }
  };

  const closeAllPopups = () => {
    setShowSocialPopup(false);
    setShowMobileApp(false);
    setShowProductPopout(false);
    setShowProductFilter(false);
    setShowSignupModal(false);
    setShowQuickPurchase(false);
    setSelectedProduct(null);
  };

  const filteredPopups = selectedCategory === 'all' 
    ? popupManagers 
    : popupManagers.filter(popup => popup.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Layers className="h-10 w-10 text-indigo-400" />
            Popups & Modals Management
          </h1>
          <p className="text-slate-300">Centralized management for all popups, modals, and overlays</p>
        </div>

        <Tabs defaultValue="manager" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="manager" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Popup Manager
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Testing Center
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manager" className="space-y-6">
            {/* Category Filter */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Popup Categories</CardTitle>
                <CardDescription>Filter popups by category and manage their states</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                    className="bg-slate-700 border-slate-600"
                  >
                    All ({popupManagers.length})
                  </Button>
                  {['social', 'mobile', 'commerce', 'auth', 'utility'].map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="bg-slate-700 border-slate-600"
                    >
                      {getCategoryIcon(category)}
                      <span className="ml-1 capitalize">{category}</span>
                      <Badge variant="outline" className="ml-2">
                        {popupManagers.filter(p => p.category === category).length}
                      </Badge>
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={closeAllPopups}
                    variant="outline"
                    className="bg-red-900 border-red-600 text-red-300 hover:bg-red-800"
                  >
                    Close All Popups
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Popup List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPopups.map(popup => (
                <Card key={popup.id} className="bg-slate-800 border-slate-600">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(popup.category)}
                        <CardTitle className="text-sm text-white">{popup.name}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className={getTypeColor(popup.type)}>
                          {popup.type}
                        </Badge>
                        <Badge variant="outline" className={
                          popup.isOpen 
                            ? 'bg-green-900 text-green-300 border-green-600'
                            : 'bg-gray-900 text-gray-300 border-gray-600'
                        }>
                          {popup.isOpen ? 'Open' : 'Closed'}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-slate-300 text-xs">
                      {popup.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-xs text-slate-400">
                        <div className="flex justify-between">
                          <span>Component:</span>
                          <span className="text-slate-300 font-mono">{popup.component}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Category:</span>
                          <span className="text-slate-300 capitalize">{popup.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => openPopup(popup.id)}
                          disabled={popup.isOpen}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {popup.isOpen ? 'Already Open' : 'Test Open'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Popup Testing Center</CardTitle>
                <CardDescription>Test all popup components and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button onClick={() => openPopup('social-media-popup')} className="bg-blue-600 hover:bg-blue-700">
                    <Users className="h-4 w-4 mr-2" />
                    Social Media
                  </Button>
                  <Button onClick={() => openPopup('mobile-app')} className="bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Mobile App
                  </Button>
                  <Button onClick={() => openPopup('product-popout')} className="bg-purple-600 hover:bg-purple-700">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Product View
                  </Button>
                  <Button onClick={() => openPopup('product-filter')} className="bg-yellow-600 hover:bg-yellow-700">
                    <Filter className="h-4 w-4 mr-2" />
                    Product Filter
                  </Button>
                  <Button onClick={() => openPopup('signup-modal')} className="bg-indigo-600 hover:bg-indigo-700">
                    <Eye className="h-4 w-4 mr-2" />
                    Signup Modal
                  </Button>
                  <Button onClick={() => openPopup('quick-purchase')} className="bg-red-600 hover:bg-red-700">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Quick Purchase
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-slate-900 border border-slate-600 rounded-lg">
                  <h4 className="font-semibold mb-2">Currently Open Popups</h4>
                  <div className="space-y-2">
                    {popupManagers.filter(p => p.isOpen).map(popup => (
                      <div key={popup.id} className="flex items-center justify-between p-2 bg-slate-800 rounded">
                        <span className="text-sm">{popup.name}</span>
                        <Badge variant="outline" className="bg-green-900 text-green-300 border-green-600">
                          Active
                        </Badge>
                      </div>
                    ))}
                    {popupManagers.filter(p => p.isOpen).length === 0 && (
                      <p className="text-slate-400 text-sm">No popups currently open</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Popup Analytics</CardTitle>
                <CardDescription>Usage statistics and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-400 mb-2">Total Popups</h4>
                    <div className="text-2xl font-bold text-blue-400">{popupManagers.length}</div>
                    <p className="text-xs text-slate-400">Registered components</p>
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                    <h4 className="font-semibold text-green-400 mb-2">Active Now</h4>
                    <div className="text-2xl font-bold text-green-400">
                      {popupManagers.filter(p => p.isOpen).length}
                    </div>
                    <p className="text-xs text-slate-400">Currently open</p>
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-400 mb-2">Categories</h4>
                    <div className="text-2xl font-bold text-purple-400">
                      {new Set(popupManagers.map(p => p.category)).size}
                    </div>
                    <p className="text-xs text-slate-400">Different types</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Popup Settings</CardTitle>
                <CardDescription>Configure popup behavior and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Global Settings</h4>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start bg-slate-700 border-slate-600">
                          Enable Popup Animations
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-slate-700 border-slate-600">
                          Auto-close Timer Settings
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-slate-700 border-slate-600">
                          Popup Z-index Management
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Advanced Options</h4>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start bg-slate-700 border-slate-600">
                          Keyboard Navigation
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-slate-700 border-slate-600">
                          Accessibility Settings
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-slate-700 border-slate-600">
                          Performance Optimization
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Rendered Popups */}
      {showSocialPopup && (
        <SocialMediaPopup onClose={() => setShowSocialPopup(false)} />
      )}
      {showMobileApp && (
        <MobileApp onClose={() => setShowMobileApp(false)} />
      )}
      {showProductPopout && selectedProduct && (
        <ProductPopout
          product={selectedProduct}
          isOpen={showProductPopout}
          onClose={() => setShowProductPopout(false)}
        />
      )}
      {showProductFilter && (
        <ProductFilter
          isOpen={showProductFilter}
          onClose={() => setShowProductFilter(false)}
          filters={{}}
          onFiltersChange={() => {}}
        />
      )}
      {showSignupModal && (
        <SignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
        />
      )}
      {showQuickPurchase && (
        <QuickPurchaseModal
          product={{
            id: 'demo',
            name: 'Demo Product',
            price: 49.99,
            description: 'Demo product for testing'
          }}
          isOpen={showQuickPurchase}
          onClose={() => setShowQuickPurchase(false)}
        />
      )}
    </div>
  );
};

export default PopupsAndModals;
