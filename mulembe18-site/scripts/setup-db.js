const mysql = require("mysql2/promise");

async function setup() {
  console.log("Connecting to TiDB Cloud...");
  const conn = await mysql.createConnection({
    host: "gateway01.ap-northeast-1.prod.aws.tidbcloud.com",
    port: 4000,
    user: "4Cqp3QYorpBTz6H.root",
    password: "OkOeQnMkcKs4hj6R",
    database: "mulembe18",
    ssl: { rejectUnauthorized: true },
  });

  console.log("Connected to TiDB successfully!");

  // 1. Members
  await conn.query(`
    CREATE TABLE IF NOT EXISTS members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      clerk_id VARCHAR(191) NULL UNIQUE,
      full_name VARCHAR(191) NOT NULL,
      email VARCHAR(191) NULL,
      phone VARCHAR(60) NOT NULL,
      sub_clan VARCHAR(100) NOT NULL,
      residential_zone VARCHAR(100) NOT NULL,
      profession VARCHAR(191) NULL,
      field VARCHAR(100) NULL,
      membership_no VARCHAR(60) NOT NULL UNIQUE,
      role VARCHAR(50) DEFAULT 'member',
      status VARCHAR(50) DEFAULT 'Verified',
      bio TEXT NULL,
      avatar_url TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
  console.log("✓ members table created");

  // 2. Welfare Claims
  await conn.query(`
    CREATE TABLE IF NOT EXISTS welfare_claims (
      id INT AUTO_INCREMENT PRIMARY KEY,
      claim_no VARCHAR(60) NOT NULL UNIQUE,
      claimant_name VARCHAR(191) NOT NULL,
      sub_clan VARCHAR(100) NOT NULL,
      residential_zone VARCHAR(100) NOT NULL,
      claim_type VARCHAR(100) NOT NULL,
      amount DECIMAL(12, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'Under Review',
      description TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✓ welfare_claims table created");

  // 3. Contributions
  await conn.query(`
    CREATE TABLE IF NOT EXISTS contributions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      receipt_no VARCHAR(60) NOT NULL UNIQUE,
      mpesa_code VARCHAR(60) NOT NULL UNIQUE,
      member_name VARCHAR(191) NOT NULL,
      phone VARCHAR(60) NOT NULL,
      amount DECIMAL(12, 2) NOT NULL,
      purpose VARCHAR(100) NOT NULL,
      status VARCHAR(50) DEFAULT 'Completed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✓ contributions table created");

  // 4. Events
  await conn.query(`
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(191) NOT NULL,
      event_date VARCHAR(100) NOT NULL,
      location VARCHAR(191) NOT NULL,
      category VARCHAR(100) NOT NULL,
      entry_fee VARCHAR(100) DEFAULT 'Free',
      registered_count INT DEFAULT 0,
      capacity INT DEFAULT 500,
      status VARCHAR(50) DEFAULT 'Upcoming',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✓ events table created");

  const [tables] = await conn.query("SHOW TABLES;");
  console.log("\nALL TABLES IN mulembe18 DATABASE:", tables);

  // Check count of members
  const [memberCount] = await conn.query("SELECT COUNT(*) AS total FROM members;");
  console.log("Current member count in database:", memberCount[0].total);

  await conn.end();
  console.log("TiDB Connection closed successfully.");
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
