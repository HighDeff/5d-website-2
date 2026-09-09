// User Migration Utility - Updates existing users with missing fields
export const migrateUsers = () => {
  try {
    const savedUsers = localStorage.getItem("allUsers");
    if (!savedUsers) return;

    const users = JSON.parse(savedUsers);
    let updated = false;

    const updatedUsers = users.map((user: any) => {
      let userUpdated = false;
      const updatedUser = { ...user };

      // Add username if missing
      if (!updatedUser.username) {
        const baseUsername =
          updatedUser.name
            ?.toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .substring(0, 10) || "user";
        updatedUser.username = `${baseUsername}${Date.now().toString().slice(-4)}`;
        userUpdated = true;
      }

      // Add productCount if missing
      if (typeof updatedUser.productCount !== "number") {
        updatedUser.productCount = 0;
        userUpdated = true;
      }

      // Set default avatar if missing
      if (!updatedUser.avatar && !updatedUser.profileImage) {
        updatedUser.avatar = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`;
        userUpdated = true;
      }

      // Set default preferences if missing
      if (!updatedUser.preferences) {
        updatedUser.preferences = {
          notifications: true,
          marketing: false,
          publicProfile: true,
        };
        userUpdated = true;
      }

      // Update verified status if missing
      if (typeof updatedUser.verified !== "boolean") {
        updatedUser.verified = false;
        userUpdated = true;
      }

      if (userUpdated) {
        updated = true;
      }

      return updatedUser;
    });

    if (updated) {
      localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
      console.log("🔄 Users migrated successfully");

      // Also update current user if they're affected
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const updatedCurrentUser = updatedUsers.find(
          (u: any) => u.id === user.id,
        );
        if (updatedCurrentUser) {
          localStorage.setItem(
            "currentUser",
            JSON.stringify(updatedCurrentUser),
          );
        }
      }
    }

    return updatedUsers;
  } catch (error) {
    console.error("Error migrating users:", error);
    return null;
  }
};

// Count products for each user and update productCount
export const updateProductCounts = () => {
  try {
    const savedUsers = localStorage.getItem("allUsers");
    const savedProducts = localStorage.getItem("allProducts");

    if (!savedUsers || !savedProducts) return;

    const users = JSON.parse(savedUsers);
    const products = JSON.parse(savedProducts);

    const updatedUsers = users.map((user: any) => {
      const userProducts = products.filter(
        (product: any) => product.sellerId === user.id,
      );
      return {
        ...user,
        productCount: userProducts.length,
      };
    });

    localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
    console.log("📊 Product counts updated for all users");

    // Also update current user
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const updatedCurrentUser = updatedUsers.find(
        (u: any) => u.id === user.id,
      );
      if (updatedCurrentUser) {
        localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
      }
    }

    return updatedUsers;
  } catch (error) {
    console.error("Error updating product counts:", error);
    return null;
  }
};

// Initialize migration on app start
export const initializeUserMigration = () => {
  migrateUsers();
  updateProductCounts();
};
