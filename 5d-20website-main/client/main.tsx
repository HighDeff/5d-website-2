import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Core pages
import Index from "./pages/Index";
import Collections from "./pages/Collections";
import EnhancedCollections from "./pages/EnhancedCollections";
import CollectionDetail from "./pages/CollectionDetail";
import NotFound from "./pages/NotFound";

// Shop pages
import Jewelry from "./pages/shop/Jewelry";
import HomeKitchen from "./pages/shop/HomeKitchen";
import Clothing from "./pages/shop/Clothing";
import ShoesAccessories from "./pages/shop/ShoesAccessories";
import Beauty from "./pages/shop/Beauty";
import UserShop from "./pages/shop/UserShop";

// Admin pages
import ProductUpload from "./pages/admin/ProductUpload";
import UserManagement from "./pages/admin/UserManagement";
import DatabaseSettings from "./pages/admin/DatabaseSettings";
import SystemTest from "./pages/admin/SystemTest";
import SystemTester from "./pages/admin/SystemTester";
import SystemFixer from "./pages/admin/SystemFixer";
import ActualSystemTest from "./pages/admin/ActualSystemTest";
import AutoTestRunner from "./pages/admin/AutoTestRunner";
import SystemFix from "./pages/admin/SystemFix";
import CSVImageMatcher from "./pages/admin/CSVImageMatcher";
import CSVGenerator from "./pages/admin/CSVGenerator";
import SimpleCSVDebugger from "./pages/admin/SimpleCSVDebugger";
import CSVFilenameProcessor from "./pages/admin/CSVFilenameProcessor";
import AIImageRecognition from "./pages/admin/AIImageRecognition";
import NavigationAnalytics from "./pages/admin/NavigationAnalytics";
import AIMessages from "./pages/admin/AIMessages";
import AIContentManagement from "./pages/admin/AIContentManagement";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import TestInterface from "./pages/admin/TestInterface";
import LiveMonitoringDashboard from "./pages/admin/LiveMonitoringDashboard";

// User pages
import UserProfile from "./pages/UserProfile";
import UserDashboard from "./pages/UserDashboard";
import UserSettings from "./pages/UserSettings";
import MonitoringDashboard from "./pages/MonitoringDashboard";
import AIMarketplace from "./pages/AIMarketplace";
import UserSearch from "./pages/UserSearch";
import LiveOffers from "./pages/LiveOffers";
import GuestUpload from "./pages/GuestUpload";
import AuthTest from "./pages/AuthTest";
import Auth from "./pages/Auth";
import SocialAccounts from "./pages/SocialAccounts";
import ProductPage from "./pages/products/ProductPage";

// Static pages
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import MobileApp from "./pages/MobileApp";
import SellProducts from "./pages/SellProducts";
import Membership from "./pages/Membership";
import Signup from "./pages/Signup";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import MyItems from "./pages/MyItems";
import LearnMore from "./pages/LearnMore";
import Notifications from "./pages/Notifications";
import SendOffers from "./pages/SendOffers";
import Favorites from "./pages/Favorites";
import GuestDashboard from "./pages/GuestDashboard";
import UploadItems from "./pages/UploadItems";
import MemberChat from "./pages/MemberChat";
import Settings from "./pages/Settings";
import LiveCommunity from "./pages/LiveCommunity";
import AIManagementHub from "./pages/AIManagementHub";
import AIStatus from "./pages/AIStatus";
import EnhancedAIManagementHub from "./pages/EnhancedAIManagementHub";
import UltraAIManagementHub from "./pages/UltraAIManagementHub";
import AILibraryManager from "./pages/AILibraryManager";

// New organized pages
import CanvasControlCenter from "./pages/CanvasControlCenter";
import AINotificationsHub from "./pages/AINotificationsHub";
import PopupsAndModals from "./pages/PopupsAndModals";
import QuantumPassModel from "./pages/QuantumPassModel";

// Core components
import AppInitializer from "./components/AppInitializer";
import LiveModeToggle from "./components/LiveModeToggle";
import SystemStatusNotification from "./components/SystemStatusNotification";
import AINavigationToggle from "./components/AINavigationToggle";

// Essential services only
import AdminAccountService from "./services/AdminAccountService";
import "./services/InitializeAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppInitializer>
        <Toaster />
        <Sonner />
        <LiveModeToggle />
        <SystemStatusNotification />
        <AINavigationToggle />
        <BrowserRouter>
          <Routes>
            {/* Core routes */}
            <Route path="/" element={<Index />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/enhanced-collections" element={<EnhancedCollections />} />
            <Route path="/collections/:collectionId" element={<CollectionDetail />} />

            {/* Shop routes */}
            <Route path="/shop/jewelry" element={<Jewelry />} />
            <Route path="/shop/home-kitchen" element={<HomeKitchen />} />
            <Route path="/shop/clothing" element={<Clothing />} />
            <Route path="/shop/shoes-accessories" element={<ShoesAccessories />} />
            <Route path="/shop/beauty" element={<Beauty />} />
            <Route path="/shop/:username" element={<UserShop />} />

            {/* AI Control Center routes */}
            <Route path="/canvas-control" element={<CanvasControlCenter />} />
            <Route path="/ai-notifications" element={<AINotificationsHub />} />
            <Route path="/popups-modals" element={<PopupsAndModals />} />
            <Route path="/quantumpass-model" element={<QuantumPassModel />} />

            {/* Admin routes */}
            <Route path="/admin/products" element={<ProductUpload />} />
            <Route path="/admin/product-upload" element={<ProductUpload />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/database" element={<DatabaseSettings />} />
            <Route path="/admin/messages" element={<AIMessages />} />
            <Route path="/admin/ai-content" element={<AIContentManagement />} />
            <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/admin/test-interface" element={<TestInterface />} />
            <Route path="/admin/test" element={<SystemTest />} />
            <Route path="/admin/system-tester" element={<SystemTester />} />
            <Route path="/admin/system-fixer" element={<SystemFixer />} />
            <Route path="/admin/live-test" element={<ActualSystemTest />} />
            <Route path="/admin/auto-test" element={<AutoTestRunner />} />
            <Route path="/admin/fix-all" element={<SystemFix />} />
            <Route path="/admin/csv-matcher" element={<CSVImageMatcher />} />
            <Route path="/admin/csv-generator" element={<CSVGenerator />} />
            <Route path="/admin/csv-debug" element={<SimpleCSVDebugger />} />
            <Route path="/admin/csv-filename" element={<CSVFilenameProcessor />} />
            <Route path="/admin/ai-image-recognition" element={<AIImageRecognition />} />
            <Route path="/admin/navigation-analytics" element={<NavigationAnalytics />} />
            <Route path="/admin/monitoring" element={<MonitoringDashboard />} />
            <Route path="/admin/live-monitoring" element={<LiveMonitoringDashboard />} />

            {/* AI and marketplace routes */}
            <Route path="/ai-marketplace" element={<AIMarketplace />} />
            <Route path="/ai-management" element={<AIManagementHub />} />
            <Route path="/AIManagementHub" element={<AIManagementHub />} />
            <Route path="/ai-status" element={<AIStatus />} />
            <Route path="/enhanced-ai-hub" element={<EnhancedAIManagementHub />} />
            <Route path="/ultra-ai-hub" element={<UltraAIManagementHub />} />
            <Route path="/ai-library" element={<AILibraryManager />} />

            {/* User routes */}
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/user-settings" element={<UserSettings />} />
            <Route path="/live-community" element={<LiveCommunity />} />
            <Route path="/social-accounts" element={<SocialAccounts />} />
            <Route path="/product/:productId" element={<ProductPage />} />

            {/* Static pages */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/mobile-app" element={<MobileApp />} />
            <Route path="/sell-products" element={<SellProducts />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/signin" element={<Auth />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/my-items" element={<MyItems />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/send-offers" element={<SendOffers />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/guest-dashboard" element={<GuestDashboard />} />
            <Route path="/upload-items" element={<UploadItems />} />
            <Route path="/member-chat" element={<MemberChat />} />
            <Route path="/users" element={<UserSearch />} />
            <Route path="/upload" element={<ProductUpload />} />
            <Route path="/guest-upload" element={<GuestUpload />} />
            <Route path="/auth-test" element={<AuthTest />} />
            <Route path="/offers" element={<LiveOffers />} />

            {/* Catch-all route - MUST BE LAST */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppInitializer>
    </TooltipProvider>
  </QueryClientProvider>
);

// Initialize essential services after app loads
const initializeEssentialServices = async () => {
  try {
    // Initialize admin account
    AdminAccountService;

    console.log("✅ Essential services initialized");
  } catch (error) {
    console.error("❌ Error initializing essential services:", error);
  }
};

// Prevent duplicate createRoot calls in development mode
const container = document.getElementById("root")!;
const rootElement = container as any;

if (!rootElement._reactRoot) {
  rootElement._reactRoot = createRoot(container);
}

rootElement._reactRoot.render(<App />);

// Initialize services after React renders
setTimeout(initializeEssentialServices, 1000);
