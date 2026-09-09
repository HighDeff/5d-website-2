// Initialize Admin Account - Force Creation
export const initializeAdminAccount = () => {
  try {
    console.log("🔧 Initializing admin account...");

    // Get existing users
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    console.log("📊 Current users count:", users.length);

    // Check if admin exists
    const adminExists = users.find(
      (u: any) =>
        u.email === "haynes.d1993@yahoo.com" || u.id === "admin_haynes_d1993",
    );

    if (adminExists) {
      console.log("✅ Admin account found:", adminExists.name);
      // Update admin properties if needed
      adminExists.isAdmin = true;
      adminExists.adminLevel = "super_admin";
      adminExists.verified = true;
      adminExists.membershipLevel = "premium";
      localStorage.setItem("users", JSON.stringify(users));
      return adminExists;
    }

    // Create admin account
    const adminUser = {
      id: "admin_haynes_d1993",
      name: "Daniel Haynes",
      email: "haynes.d1993@yahoo.com",
      username: "dan_haynes_admin",
      phone: "",
      address: "",
      membershipLevel: "premium",
      memberSince: new Date().toISOString(),
      totalSales: 0,
      totalPurchases: 0,
      salesCount: 0,
      purchaseCount: 0,
      productCount: 0,
      rating: 5.0,
      favoriteProducts: [],
      favoriteUsers: [],
      profileImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Head Administrator - Platform Owner and Developer",
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      status: "active",
      verified: true,
      isAdmin: true,
      adminLevel: "super_admin",
      paymentInfo: {
        paypalEmail: "haynes.d1993@yahoo.com",
        cashAppTag: "$DanHaynes",
      },
      preferences: {
        notifications: true,
        marketing: false,
        publicProfile: true,
      },
    };

    users.push(adminUser);
    localStorage.setItem("users", JSON.stringify(users));
    console.log("🎉 Admin account created successfully:", adminUser.name);

    // Also create some test data if users array was empty
    if (users.length === 1) {
      console.log("📝 Creating test users...");
      const testUsers = [
        {
          id: "user_sarah_johnson",
          name: "Sarah Johnson",
          email: "sarah.johnson@example.com",
          username: "sarah_fashion",
          phone: "(555) 123-4567",
          address: "123 Fashion Ave, Style City, ST 12345",
          membershipLevel: "member",
          memberSince: "2023-01-15T00:00:00.000Z",
          totalSales: 2450.75,
          totalPurchases: 890.5,
          salesCount: 18,
          purchaseCount: 12,
          productCount: 25,
          rating: 4.8,
          favoriteProducts: [],
          favoriteUsers: [],
          profileImage:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          bio: "Fashion enthusiast and small business owner selling vintage and handmade items.",
          joinDate: "2023-01-15T00:00:00.000Z",
          lastActive: new Date().toISOString(),
          status: "active",
          verified: true,
          isAdmin: false,
          paymentInfo: {
            paypalEmail: "sarah.demo@paypal.com",
            cashAppTag: "$SarahDemo",
          },
          preferences: {
            notifications: true,
            marketing: true,
            publicProfile: true,
          },
        },
        {
          id: "user_mike_seller",
          name: "Mike Thompson",
          email: "mike.thompson@example.com",
          username: "mike_deals",
          phone: "(555) 987-6543",
          address: "",
          membershipLevel: "free",
          memberSince: "2023-06-20T00:00:00.000Z",
          totalSales: 150.0,
          totalPurchases: 45.99,
          salesCount: 3,
          purchaseCount: 2,
          productCount: 8,
          rating: 4.2,
          favoriteProducts: [],
          favoriteUsers: [],
          profileImage:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          bio: "New to selling, looking to declutter and make some extra cash.",
          joinDate: "2023-06-20T00:00:00.000Z",
          lastActive: new Date().toISOString(),
          status: "active",
          verified: false,
          isAdmin: false,
          paymentInfo: {
            paypalEmail: "mike.seller@paypal.com",
          },
          preferences: {
            notifications: true,
            marketing: false,
            publicProfile: true,
          },
        },
      ];

      users.push(...testUsers);
      localStorage.setItem("users", JSON.stringify(users));
      console.log("✅ Test users created");
    }

    console.log("🎯 Final user count:", users.length);
    return adminUser;
  } catch (error) {
    console.error("❌ Error initializing admin account:", error);
    return null;
  }
};

// Auto-run when imported
initializeAdminAccount();

export default { initializeAdminAccount };
