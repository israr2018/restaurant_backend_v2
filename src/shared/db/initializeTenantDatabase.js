export const initializeTenantDatabase = async (connection) => {

    const tenantUserSchema = new mongoose.Schema({...});
    const menuSchema = new mongoose.Schema({...});
    const categorySchema = new mongoose.Schema({...});
    const orderSchema = new mongoose.Schema({...});
  
    connection.model("TenantUser", tenantUserSchema);
    connection.model("Menu", menuSchema);
    connection.model("Category", categorySchema);
    connection.model("Order", orderSchema);
  
  };
  