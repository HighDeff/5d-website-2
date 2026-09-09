import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  Eye,
  Heart,
  Star,
  Calendar,
  Download,
  Mail,
  CreditCard,
  ArrowRight,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import GuestSalesService, {
  GuestSale,
  GuestPurchase,
} from "@/services/GuestSalesService";
import FavoritesService from "@/services/FavoritesService";

function GuestDashboard() {
  const [guestSales, setGuestSales] = useState<GuestSale[]>([]);
  const [guestPurchases, setGuestPurchases] = useState<GuestPurchase[]>([]);
  const [guestFavorites, setGuestFavorites] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    loadGuestData();
  }, []);

  const loadGuestData = () => {
    const sales = GuestSalesService.getGuestSales();
    const purchases = GuestSalesService.getGuestPurchases();
    const favorites = FavoritesService.getFavorites(); // No userId = guest favorites
    const analyticsData = GuestSalesService.getGuestAnalytics();

    setGuestSales(sales);
    setGuestPurchases(purchases);
    setGuestFavorites(favorites);
    setAnalytics(analyticsData);
  };

  const exportData = (type: "sales" | "purchases") => {
    const data =
      type === "sales"
        ? guestSales.map((sale) => ({
            ID: sale.id,
            Product: sale.productName,
            Buyer: sale.buyerName,
            Amount: sale.amount,
            Commission: sale.commission,
            "Net Amount": sale.netAmount,
            Date: new Date(sale.date).toLocaleDateString(),
            Status: sale.status,
            "Payment Method": sale.paymentMethod,
          }))
        : guestPurchases.map((purchase) => ({
            ID: purchase.id,
            Product: purchase.productName,
            Seller: purchase.sellerName,
            Amount: purchase.amount,
            Date: new Date(purchase.date).toLocaleDateString(),
            Status: purchase.status,
            "Order Number": purchase.orderNumber,
          }));

    const csv = [
      Object.keys(data[0] || {}).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guest_${type}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-emerald-100 text-emerald-800",
    };
    return (
      <Badge className={colors[status as keyof typeof colors] || ""}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Guest Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your guest sales, purchases, and favorites
              </p>
            </div>
            <div className="flex space-x-4">
              <Link to="/guest-upload">
                <Button className="bg-gradient-to-r from-orange-600 to-amber-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Sell as Guest
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Convert to Account CTA */}
        <Card className="mb-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Keep Your Data Forever
                </h3>
                <p className="text-orange-100">
                  Create an account to permanently save all your sales,
                  purchases, and favorites. Your guest data will be migrated
                  automatically!
                </p>
              </div>
              <Link to="/auth">
                <Button
                  variant="secondary"
                  className="bg-white text-orange-600 hover:bg-orange-50"
                >
                  Sign Up Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Sales
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      ${analytics.totalSales.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Items Sold
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {analytics.salesCount}
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Purchases
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      ${analytics.totalPurchases.toFixed(2)}
                    </p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Favorites
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      {guestFavorites.length}
                    </p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Sales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Sales
                    {analytics && analytics.salesCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportData("sales")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics && analytics.recentSales.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.recentSales.map((sale: GuestSale) => (
                        <div
                          key={sale.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={sale.productImage}
                              alt={sale.productName}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-medium text-sm">
                                {sale.productName}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {new Date(sale.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              ${sale.netAmount.toFixed(2)}
                            </p>
                            {getStatusBadge(sale.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No sales yet</p>
                      <Link to="/guest-upload">
                        <Button className="mt-3" size="sm">
                          Start Selling
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Purchases */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Purchases
                    {analytics && analytics.purchaseCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportData("purchases")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics && analytics.recentPurchases.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.recentPurchases.map(
                        (purchase: GuestPurchase) => (
                          <div
                            key={purchase.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={purchase.productImage}
                                alt={purchase.productName}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <h4 className="font-medium text-sm">
                                  {purchase.productName}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  Order #{purchase.orderNumber}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-600">
                                ${purchase.amount.toFixed(2)}
                              </p>
                              {getStatusBadge(purchase.status)}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No purchases yet</p>
                      <Link to="/">
                        <Button className="mt-3" size="sm">
                          Start Shopping
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  All Sales
                  {guestSales.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => exportData("sales")}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Sales Data
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {guestSales.length > 0 ? (
                  <div className="space-y-4">
                    {guestSales.map((sale) => (
                      <div
                        key={sale.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={sale.productImage}
                              alt={sale.productName}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-semibold">
                                {sale.productName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Sold to: {sale.buyerName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(sale.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-green-600">
                              ${sale.netAmount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              (${sale.amount.toFixed(2)} - commission)
                            </p>
                            {getStatusBadge(sale.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No sales yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Start selling your items to see them here
                    </p>
                    <Link to="/guest-upload">
                      <Button>Start Selling</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  All Purchases
                  {guestPurchases.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => exportData("purchases")}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Purchase Data
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {guestPurchases.length > 0 ? (
                  <div className="space-y-4">
                    {guestPurchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={purchase.productImage}
                              alt={purchase.productName}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-semibold">
                                {purchase.productName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                From: {purchase.sellerName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Order #{purchase.orderNumber} •{" "}
                                {new Date(purchase.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-blue-600">
                              ${purchase.amount.toFixed(2)}
                            </p>
                            {getStatusBadge(purchase.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No purchases yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Shop items to see your purchase history here
                    </p>
                    <Link to="/">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Favorites
                  <Link to="/favorites">
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4 mr-2" />
                      View All Favorites
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">
                    {guestFavorites.length > 0
                      ? `You have ${guestFavorites.length} favorite items`
                      : "No favorites yet"}
                  </p>
                  <Link to="/favorites">
                    <Button size="sm">View Favorites Page</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Guest Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Data Storage Notice
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Your guest data is stored locally in your browser. To keep
                    it permanently and access it from any device, please create
                    an account.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Clear Guest Data</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      This will remove all your guest sales, purchases, and
                      favorites from this browser.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to clear all guest data? This action cannot be undone.",
                          )
                        ) {
                          GuestSalesService.clearGuestData();
                          localStorage.removeItem("guestFavorites");
                          loadGuestData();
                        }
                      }}
                    >
                      Clear All Data
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Export All Data</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Download all your guest data as CSV files for backup.
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => exportData("sales")}
                        disabled={guestSales.length === 0}
                      >
                        Export Sales
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => exportData("purchases")}
                        disabled={guestPurchases.length === 0}
                      >
                        Export Purchases
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default GuestDashboard;
