export const ownerLogin = async (req, res) => {
  try {
    const { email, password, code } = req.body;

    if (!email || !password || !code) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 1️⃣ Find owner in platform DB
    const owner = await PlatformUser
      .findOne({ email, code, role: "restaurant-admin" })
      .select("+password");

    if (!owner) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2️⃣ Compare password
    const isMatch = await owner.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Check subscription
    if (owner.subscriptionExpiresAt < new Date()) {
      return res.status(403).json({ message: "Subscription expired" });
    }

    // 4️⃣ Generate JWT
    const token = generateToken({
      userId: owner._id,
      role: owner.role,
      dbName: owner.dbName,
      code: owner.code
    });

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ==========================================
// 🔹 Staff Login
// ==========================================
export const staffLogin = async (req, res) => {
  try {
    const { email, password, code } = req.body;

    if (!email || !password || !code) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 1️⃣ Find tenant in platform DB using code
    const tenant = await PlatformUser.findOne({ code });

    if (!tenant) {
      return res.status(404).json({ message: "Invalid restaurant code" });
    }

    // 2️⃣ Connect to tenant DB
    const connection = getTenantConnection(tenant.dbName);

    const TenantUser = getTenantUserModel(connection);

    // 3️⃣ Find staff user
    const user = await TenantUser
      .findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 5️⃣ Generate JWT
    const token = generateToken({
      userId: user._id,
      role: user.role,
      dbName: tenant.dbName,
      code: tenant.code
    });

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};