import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;
let _schemaInitialized = false;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.TIDB_HOST || "gateway01.ap-northeast-1.prod.aws.tidbcloud.com",
      port: Number(process.env.TIDB_PORT) || 4000,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE || "mulembe18",
      ssl: {
        rejectUnauthorized: true,
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }
  return pool;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute(sql, params);
    return rows as T[];
  } catch (error: any) {
    console.warn("[TiDB / MySQL] Query execution error:", error?.message || error);
    throw error;
  }
}

/**
 * Initializes required production schema in TiDB / MySQL
 * Scales Mulembe18 to a 47-county nationwide architecture with:
 * - 47 Counties Master Registry
 * - County Chapters Registry
 * - Granular Grassroots Clan Welfare Groups (Cells)
 * - Dual-Origin Tracing (Residence vs Ancestral Birth Origin)
 * - Granular Clan & Ward Scoped Events
 * - Multi-Cadence (Monthly / Annual) Contributions Ledger
 */
export async function initDatabaseSchema() {
  if (_schemaInitialized) return { success: true };
  try {
    const db = getDbPool();

    // =========================================================================
    // 1. COUNTIES REGISTRY (All 47 Counties of Kenya)
    // =========================================================================
    await db.execute(`
      CREATE TABLE IF NOT EXISTS counties (
        code VARCHAR(10) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        region_zone VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const [countyCount]: any = await db.execute("SELECT COUNT(*) AS count FROM counties");
    if (countyCount?.[0]?.count === 0) {
      await db.execute(`
        INSERT INTO counties (code, name, region_zone, is_active) VALUES
        ('001', 'Mombasa', 'Coast', TRUE),
        ('002', 'Kwale', 'Coast', TRUE),
        ('003', 'Kilifi', 'Coast', TRUE),
        ('004', 'Tana River', 'Coast', TRUE),
        ('005', 'Lamu', 'Coast', TRUE),
        ('006', 'Taita Taveta', 'Coast', TRUE),
        ('007', 'Garissa', 'North Eastern', TRUE),
        ('008', 'Wajir', 'North Eastern', TRUE),
        ('009', 'Mandera', 'North Eastern', TRUE),
        ('010', 'Marsabit', 'Eastern', TRUE),
        ('011', 'Isiolo', 'Eastern', TRUE),
        ('012', 'Meru', 'Eastern', TRUE),
        ('013', 'Tharaka-Nithi', 'Eastern', TRUE),
        ('014', 'Embu', 'Eastern', TRUE),
        ('015', 'Kitui', 'Eastern', TRUE),
        ('016', 'Machakos', 'Eastern', TRUE),
        ('017', 'Makueni', 'Eastern', TRUE),
        ('018', 'Nyandarua', 'Central', TRUE),
        ('019', 'Nyeri', 'Central', TRUE),
        ('020', 'Kirinyaga', 'Central', TRUE),
        ('021', 'Murang''a', 'Central', TRUE),
        ('022', 'Kiambu', 'Central', TRUE),
        ('023', 'Turkana', 'Rift Valley', TRUE),
        ('024', 'West Pokot', 'Rift Valley', TRUE),
        ('025', 'Samburu', 'Rift Valley', TRUE),
        ('026', 'Trans Nzoia', 'Rift Valley', TRUE),
        ('027', 'Uasin Gishu', 'Rift Valley', TRUE),
        ('028', 'Elgeyo Marakwet', 'Rift Valley', TRUE),
        ('029', 'Nandi', 'Rift Valley', TRUE),
        ('030', 'Baringo', 'Rift Valley', TRUE),
        ('031', 'Laikipia', 'Rift Valley', TRUE),
        ('032', 'Nakuru', 'Rift Valley', TRUE),
        ('033', 'Narok', 'Rift Valley', TRUE),
        ('034', 'Kajiado', 'Rift Valley', TRUE),
        ('035', 'Kericho', 'Rift Valley', TRUE),
        ('036', 'Bomet', 'Rift Valley', TRUE),
        ('037', 'Kakamega', 'Western', TRUE),
        ('038', 'Vihiga', 'Western', TRUE),
        ('039', 'Bungoma', 'Western', TRUE),
        ('040', 'Busia', 'Western', TRUE),
        ('041', 'Siaya', 'Nyanza', TRUE),
        ('042', 'Kisumu', 'Nyanza', TRUE),
        ('043', 'Homa Bay', 'Nyanza', TRUE),
        ('044', 'Migori', 'Nyanza', TRUE),
        ('045', 'Kisii', 'Nyanza', TRUE),
        ('046', 'Nyamira', 'Nyanza', TRUE),
        ('047', 'Nairobi City', 'Nairobi', TRUE);
      `);
    }

    // =========================================================================
    // 2. COUNTY CHAPTERS REGISTRY
    // =========================================================================
    await db.execute(`
      CREATE TABLE IF NOT EXISTS chapters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        county_code VARCHAR(10) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        chapter_name VARCHAR(191) NOT NULL,
        chapter_type VARCHAR(50) DEFAULT 'Core Expansion',
        phase INT DEFAULT 2,
        charter_status VARCHAR(50) DEFAULT 'Active & Operating',
        patron_name VARCHAR(191) NULL,
        chairperson VARCHAR(191) NULL,
        contact_phone VARCHAR(60) NULL,
        contact_email VARCHAR(191) NULL,
        mpesa_paybill_till VARCHAR(60) NULL,
        member_count INT DEFAULT 0,
        events_quarterly INT DEFAULT 4,
        ledger_balance VARCHAR(50) DEFAULT 'KES 1,200,000',
        description TEXT NULL,
        wards_or_estates TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Non-destructive column additions
    try { await db.execute("ALTER TABLE chapters ADD COLUMN chapter_type VARCHAR(50) DEFAULT 'Core Expansion';"); } catch {}
    try { await db.execute("ALTER TABLE chapters ADD COLUMN phase INT DEFAULT 2;"); } catch {}
    try { await db.execute("ALTER TABLE chapters ADD COLUMN chairperson VARCHAR(191) NULL;"); } catch {}
    try { await db.execute("ALTER TABLE chapters ADD COLUMN events_quarterly INT DEFAULT 4;"); } catch {}
    try { await db.execute("ALTER TABLE chapters ADD COLUMN ledger_balance VARCHAR(50) DEFAULT 'KES 1,200,000';"); } catch {}
    try { await db.execute("ALTER TABLE chapters ADD COLUMN description TEXT NULL;"); } catch {}
    try { await db.execute("ALTER TABLE chapters ADD COLUMN wards_or_estates TEXT NULL;"); } catch {}

    const [chapterCount]: any = await db.execute("SELECT COUNT(*) AS count FROM chapters");
    if (chapterCount?.[0]?.count === 0) {
      await db.execute(`
        INSERT INTO chapters (county_code, slug, chapter_name, chapter_type, phase, charter_status, patron_name, chairperson, contact_phone, mpesa_paybill_till, member_count, events_quarterly, ledger_balance, description, wards_or_estates)
        VALUES
        ('001', 'mombasa', 'Mombasa Chapter (National Pilot)', 'Pilot', 1, 'Active & Operating', 'Hon. Timothy Walubengo', 'Mzee Johnstone Mukaisi', '+254 712 345 678', '522522 (Acc: MULEMBE18-MSA)', 1420, 4, 'KES 1,450,000', 'The founding pilot chapter. Pioneers the member verification protocol, Isukuti cultural festivals, bereavement repatriation corridors, and the first dual-approved chapter ledger.', 'Nyali, Bamburi, Mombasa Island, Likoni, Changamwe, Kisauni, Mtwapa, Jomvu'),
        ('047', 'nairobi', 'Nairobi Metropolitan Chapter', 'Core Expansion', 2, 'Active & Operating', 'Dr. Francis Atwoli', 'Eng. Aggrey Masika', '+254 722 990 011', '522522 (Acc: MULEMBE18-NBO)', 3840, 6, 'KES 2,890,000', 'Connecting professionals, students, civil servants, and business leaders across Nairobi. Coordinates national conventions and youth career mentorship.', 'Westlands, Lang\\'ata, Kasarani, Embakasi, Ruaraka, Kilimani, South C, Dagoretti'),
        ('032', 'nakuru', 'Nakuru Rift Valley Chapter', 'Core Expansion', 2, 'Active & Operating', 'Elder John Masinde', 'Dr. Beatrice Khabuchi', '+254 725 334 455', '522522 (Acc: MULEMBE18-NKR)', 950, 3, 'KES 640,000', 'Unifying agriculturalists, business operators, and medical professionals across Nakuru, Naivasha, and the central Rift Valley hub.', 'Nakuru East, Nakuru West, Naivasha, Rongai, Njoro, Subukia, Molo'),
        ('042', 'kisumu', 'Kisumu Lake Chapter', 'Core Expansion', 2, 'Active & Operating', 'Mrs. Beatrice Anyango', 'Silvanus Wetang\\'ula', '+254 727 990 011', '522522 (Acc: MULEMBE18-KSM)', 820, 3, 'KES 510,000', 'Coordinating lake-region business operators, maritime traders, and academic faculty across Kisumu and Western transport intersections.', 'Kisumu Central, Milimani, Kondele, Kisumu East, Seme, Nyando'),
        ('027', 'uasin-gishu', 'Eldoret North Rift Chapter', 'Core Expansion', 2, 'Active & Operating', 'Mzee David Wafula', 'Hon. Caleb Khamasi', '+254 726 667 788', '522522 (Acc: MULEMBE18-ELD)', 760, 4, 'KES 480,000', 'Home to grain farmers, student leaders at Moi University, and sports athletes representing Kenya internationally.', 'Turbo, Kapseret, Soy, Ainabkoi, Moiben, Kesses'),
        ('037', 'kakamega', 'Kakamega Home Chapter (Cradle)', 'Home County', 3, 'Active & Operating', 'Mzee Wycliffe Oparanya', 'Mzee Washington Shikuku', '+254 720 112 233', '522522 (Acc: MULEMBE18-KK)', 4200, 8, 'KES 3,100,000', 'The ancestral heartland chapter. Anchors cultural preservation, Bukhungu barazas, and grassroots clan arbitration across all sub-tribes.', 'Lurambi, Shinyalu, Malava, Ikolomani, Navakholo, Butere, Mumias West, Matungu'),
        ('039', 'bungoma', 'Bungoma Home Chapter', 'Home County', 3, 'Active & Operating', 'Hon. Kenneth Lusaka', 'Pastor Amos Simiyu', '+254 721 445 566', '522522 (Acc: MULEMBE18-BGM)', 3600, 6, 'KES 2,450,000', 'Uniting Bukusu, Tachoni, and Batura clans. Coordinates educational endowment funds and regional heritage events.', 'Kanduyi, Webuye West, Kimilili, Tongaren, Sirisia, Mt Elgon, Bumula, Kabuchai'),
        ('038', 'vihiga', 'Vihiga Home Chapter', 'Home County', 3, 'Active & Operating', 'Dr. Wilbur Ottichilo', 'Grace Kavehere', '+254 724 001 122', '522522 (Acc: MULEMBE18-VHG)', 2900, 5, 'KES 1,980,000', 'Encompassing Maragoli, Banyore, and Tiriki clans. Pioneering cooperative chamas, healthcare support, and youth artisan training.', 'Sabatia, Vihiga, Hamisi, Luanda, Emuhaya'),
        ('040', 'busia', 'Busia Border Chapter', 'Home County', 3, 'Active & Operating', 'Mzee Paul Otuoma', 'Mzee Johnstone Were', '+254 723 778 899', '522522 (Acc: MULEMBE18-BSA)', 2400, 4, 'KES 1,620,000', 'Uniting Samia, Marachi, Khayo, and Abanyala along the cross-border trade corridor. Strong fisherfolk and commercial trade networks.', 'Budalangi, Funyula, Matayos, Teso North, Teso South, Nambale, Butula'),
        ('999', 'diaspora', 'Global Diaspora Chapter', 'Diaspora', 5, 'Enrolling Members', 'Dr. Miriam Lukorito (UK)', 'Eng. Patrick Masinde (USA)', '+44 7911 123456', '522522 (Acc: MULEMBE18-INTL)', 1180, 4, 'KES 4,750,000', 'Connecting Luhya community members living in the UK, United States, Canada, Europe, and the Middle East back to homeland development initiatives.', 'United Kingdom, United States, Canada, Gulf States (UAE, Qatar), Australia');
      `);
    }

    // =========================================================================
    // 3. SMALL CLAN GROUPS & LOCAL WELFARE CELLS
    // =========================================================================
    await db.execute(`
      CREATE TABLE IF NOT EXISTS clan_groups (
        id INT AUTO_INCREMENT PRIMARY KEY,
        group_code VARCHAR(50) NOT NULL UNIQUE,
        group_name VARCHAR(191) NOT NULL,
        clan_name VARCHAR(100) NOT NULL,
        county_code VARCHAR(10) NOT NULL,
        sub_county VARCHAR(100) NULL,
        ward_estate VARCHAR(100) NULL,
        monthly_dues DECIMAL(10, 2) DEFAULT 200.00,
        annual_dues DECIMAL(10, 2) DEFAULT 1200.00,
        current_balance DECIMAL(12, 2) DEFAULT 0.00,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const [clanGroupCount]: any = await db.execute("SELECT COUNT(*) AS count FROM clan_groups");
    if (clanGroupCount?.[0]?.count === 0) {
      await db.execute(`
        INSERT INTO clan_groups (group_code, group_name, clan_name, county_code, sub_county, ward_estate, monthly_dues, annual_dues, current_balance)
        VALUES
        ('MOM-BUKUSU-01', 'Mombasa Bukusu Welfare Cell', 'Bukusu', '001', 'Nyali', 'Bamburi & Links', 200.00, 1200.00, 145000.00),
        ('MOM-MARAGOLI-01', 'Mombasa Maragoli (AvaLogoli) Association', 'Maragoli (AvaLogoli)', '001', 'Mvita', 'Island & Tudor', 200.00, 1200.00, 198000.00),
        ('MOM-SAMIA-01', 'Mombasa Samia Family Union', 'Samia', '001', 'Changamwe', 'Airport & Jomvu', 200.00, 1200.00, 112000.00),
        ('MOM-WANGA-01', 'Mombasa Wanga Kingdom Welfare', 'Wanga', '001', 'Kisauni', 'Mtwapa & Kisauni', 200.00, 1200.00, 89000.00),
        ('MOM-IDAKHO-01', 'Mombasa Idakho & Isukha Cultural Cell', 'Idakho', '001', 'Likoni', 'Likoni Channel', 200.00, 1200.00, 76000.00),
        ('NBI-BUKUSU-01', 'Nairobi Bukusu Professionals Chama', 'Bukusu', '047', 'Westlands', 'Parklands & CBD', 500.00, 2500.00, 480000.00),
        ('NBI-MARAGOLI-01', 'Nairobi Maragoli Benevolent Society', 'Maragoli (AvaLogoli)', '047', 'Kasarani', 'Ruaraka & Thika Rd', 300.00, 1500.00, 320000.00),
        ('NBI-BANYORE-01', 'Nairobi Abanyole Development Forum', 'Banyore (Abanyole)', '047', 'Embakasi', 'Donholm & Fedha', 300.00, 1500.00, 210000.00),
        ('KK-BATSOTSO-01', 'Lurambi Batsotso Elders & Welfare Group', 'Batsotso', '037', 'Lurambi', 'Shikoti & Town', 150.00, 1000.00, 165000.00),
        ('BGM-TACHONI-01', 'Bungoma Tachoni Cultural Council', 'Tachoni', '039', 'Webuye West', 'Webuye Township', 150.00, 1000.00, 140000.00),
        ('VHG-TIRIKI-01', 'Vihiga Tiriki Heritage & Welfare Assembly', 'Tiriki', '038', 'Hamisi', 'Serem & Senende', 200.00, 1000.00, 185000.00),
        ('BSA-ABANYALA-01', 'Busia Abanyala Fisherfolk & Welfare Union', 'Abanyala', '040', 'Budalangi', 'Port Victoria', 150.00, 1000.00, 95000.00);
      `);
    }

    // =========================================================================
    // 4. MEMBERS TABLE (With Dual-Origin & Clan Cell Foreign Keys)
    // =========================================================================
    await db.execute(`
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

    // Non-destructive additions to members table
    try { await db.execute("ALTER TABLE members ADD COLUMN residential_county_code VARCHAR(10) NOT NULL DEFAULT '001';"); } catch {}
    try { await db.execute("ALTER TABLE members ADD COLUMN residential_sub_county VARCHAR(100) NULL DEFAULT 'Nyali';"); } catch {}
    try { await db.execute("ALTER TABLE members ADD COLUMN residential_ward VARCHAR(100) NULL DEFAULT 'Bamburi';"); } catch {}
    try { await db.execute("ALTER TABLE members ADD COLUMN birth_county_code VARCHAR(10) NOT NULL DEFAULT '039';"); } catch {}
    try { await db.execute("ALTER TABLE members ADD COLUMN birth_sub_county VARCHAR(100) NULL DEFAULT 'Kanduyi';"); } catch {}
    try { await db.execute("ALTER TABLE members ADD COLUMN ancestral_village VARCHAR(150) NULL DEFAULT 'Chebukube';"); } catch {}
    try { await db.execute("ALTER TABLE members ADD COLUMN clan_group_id INT NULL DEFAULT 1;"); } catch {}
    try { await db.execute("ALTER TABLE members ADD COLUMN dues_status VARCHAR(50) DEFAULT 'Up_To_Date';"); } catch {}
    try { await db.execute("ALTER TABLE members ADD COLUMN dues_paid_through_month VARCHAR(10) DEFAULT '2026-10';"); } catch {}
    try { await db.execute("ALTER TABLE members ADD COLUMN membership_tier VARCHAR(50) DEFAULT 'Standard';"); } catch {}

    // =========================================================================
    // 5. WELFARE CLAIMS TABLE
    // =========================================================================
    await db.execute(`
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
    try { await db.execute("ALTER TABLE welfare_claims ADD COLUMN county_code VARCHAR(10) NOT NULL DEFAULT '001';"); } catch {}
    try { await db.execute("ALTER TABLE welfare_claims ADD COLUMN clan_group_id INT NULL DEFAULT 1;"); } catch {}

    // =========================================================================
    // 6. CONTRIBUTIONS TABLE (Multi-Cadence: Monthly, Annual, Emergency)
    // =========================================================================
    await db.execute(`
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
    try { await db.execute("ALTER TABLE contributions ADD COLUMN member_id INT NULL;"); } catch {}
    try { await db.execute("ALTER TABLE contributions ADD COLUMN clan_group_id INT NULL DEFAULT 1;"); } catch {}
    try { await db.execute("ALTER TABLE contributions ADD COLUMN county_code VARCHAR(10) NOT NULL DEFAULT '001';"); } catch {}
    try { await db.execute("ALTER TABLE contributions ADD COLUMN contribution_type VARCHAR(100) DEFAULT 'Monthly_Dues';"); } catch {}
    try { await db.execute("ALTER TABLE contributions ADD COLUMN cadence VARCHAR(50) DEFAULT 'Monthly';"); } catch {}
    try { await db.execute("ALTER TABLE contributions ADD COLUMN for_period VARCHAR(50) DEFAULT '2026-10';"); } catch {}
    try { await db.execute("ALTER TABLE contributions ADD COLUMN destination_ledger VARCHAR(100) DEFAULT 'Clan_Cell';"); } catch {}

    // =========================================================================
    // 7. WELFARE APPEALS TABLE
    // =========================================================================
    await db.execute(`
      CREATE TABLE IF NOT EXISTS welfare_appeals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(191) NOT NULL,
        description TEXT NULL,
        goal_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
        raised_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
        family_name VARCHAR(191) NULL,
        location VARCHAR(191) NULL,
        is_active BOOLEAN DEFAULT TRUE,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    try { await db.execute("ALTER TABLE welfare_appeals ADD COLUMN county_code VARCHAR(10) NOT NULL DEFAULT '001';"); } catch {}
    try { await db.execute("ALTER TABLE welfare_appeals ADD COLUMN scope VARCHAR(50) DEFAULT 'County';"); } catch {}

    // =========================================================================
    // 8. EVENTS TABLE (With Clan, Group, Ward & Scope Fields)
    // =========================================================================
    await db.execute(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(191) NOT NULL,
        event_date VARCHAR(100) NOT NULL,
        day VARCHAR(10) NULL,
        dow VARCHAR(10) NULL,
        month VARCHAR(10) NULL,
        time VARCHAR(100) NULL,
        venue VARCHAR(191) NOT NULL,
        category VARCHAR(100) NOT NULL,
        entry_fee VARCHAR(100) DEFAULT 'Free',
        attendees VARCHAR(50) DEFAULT '0',
        description TEXT NULL,
        image_url TEXT NULL,
        is_featured BOOLEAN DEFAULT FALSE,
        status VARCHAR(50) DEFAULT 'Upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    try { await db.execute("ALTER TABLE events ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;"); } catch {}
    try { await db.execute("ALTER TABLE events ADD COLUMN day VARCHAR(10) NULL;"); } catch {}
    try { await db.execute("ALTER TABLE events ADD COLUMN dow VARCHAR(10) NULL;"); } catch {}
    try { await db.execute("ALTER TABLE events ADD COLUMN month VARCHAR(10) NULL;"); } catch {}
    try { await db.execute("ALTER TABLE events ADD COLUMN scope VARCHAR(50) DEFAULT 'County';"); } catch {}
    try { await db.execute("ALTER TABLE events ADD COLUMN target_clan VARCHAR(100) DEFAULT 'All';"); } catch {}
    try { await db.execute("ALTER TABLE events ADD COLUMN target_group VARCHAR(100) DEFAULT 'All';"); } catch {}
    try { await db.execute("ALTER TABLE events ADD COLUMN county_code VARCHAR(10) DEFAULT '001';"); } catch {}
    try { await db.execute("ALTER TABLE events ADD COLUMN sub_county VARCHAR(100) NULL;"); } catch {}
    try { await db.execute("ALTER TABLE events ADD COLUMN ward_estate VARCHAR(100) NULL;"); } catch {}
    try { await db.execute("ALTER TABLE events ADD COLUMN clan_group_id INT NULL;"); } catch {}

    // Seed events if empty
    const [eventCount]: any = await db.execute("SELECT COUNT(*) AS count FROM events");
    if (eventCount?.[0]?.count === 0) {
      await db.execute(`
        INSERT INTO events (title, event_date, day, dow, month, time, venue, category, entry_fee, description, is_featured, scope, target_clan, target_group, county_code, sub_county, ward_estate)
        VALUES
        (
          'Annual All-Luhya Cultural Festival & Isukuti Showcase',
          '2026-12-12', '12', 'SAT', 'DEC', '9:00 AM – 7:00 PM',
          'Mama Ngina Waterfront Park, Mombasa', 'Cultural', 'Free',
          'Flagship nationwide cultural congress bringing together elders, dancers, and cuisine masters from all 18 sub-clans across Kenya.',
          TRUE, 'National', 'All', 'All', '001', 'Mvita', 'Waterfront'
        ),
        (
          'Mombasa Bukusu Clan Quarterly Welfare Baraza & Circumcision Lore',
          '2026-11-15', '15', 'SUN', 'NOV', '2:00 PM – 5:30 PM',
          'Bamburi Community Hall, Nyali', 'Welfare & Clan', 'Free',
          'Deliberation on clan repatriation kitty, emergency distress relief, and orientation of university students newly arrived at the Coast.',
          FALSE, 'Clan_Only', 'Bukusu', 'All', '001', 'Nyali', 'Bamburi'
        ),
        (
          'Nairobi Western Youth & Tech Professionals Mentorship Forum',
          '2026-11-28', '28', 'SAT', 'NOV', '10:00 AM – 3:00 PM',
          'UoN Towers, University Way, Nairobi', 'Career & Mentorship', 'Free',
          'High-impact career pairing connecting established engineers, maritime executives, and creatives with university finalists from Western Kenya.',
          TRUE, 'County', 'All', 'Youth_Professionals', '047', 'Westlands', 'CBD'
        ),
        (
          'Lurambi Batsotso Ward Emergency Bereavement Kitty Review',
          '2026-11-20', '20', 'FRI', 'NOV', '3:00 PM – 6:00 PM',
          'Shikoti Parish Hall, Lurambi, Kakamega', 'Welfare & Clan', 'Free',
          'Ward-level gathering of clan cell elders to audit monthly contributions, verify active membership, and review grassroots transit funds.',
          FALSE, 'Ward', 'Batsotso', 'Elders', '037', 'Lurambi', 'Shikoti'
        );
      `);
    }

    // =========================================================================
    // 9. NEWS ARTICLES TABLE
    // =========================================================================
    await db.execute(`
      CREATE TABLE IF NOT EXISTS news_articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(191) NOT NULL,
        category VARCHAR(100) NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        date VARCHAR(100) NOT NULL,
        read_time VARCHAR(50) DEFAULT '3 min read',
        image_url TEXT NULL,
        author VARCHAR(100) DEFAULT 'Mulembe Secretariat',
        status VARCHAR(50) DEFAULT 'Published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    try { await db.execute("ALTER TABLE news_articles ADD COLUMN county_code VARCHAR(10) NULL DEFAULT '001';"); } catch {}
    try { await db.execute("ALTER TABLE news_articles ADD COLUMN scope VARCHAR(50) DEFAULT 'National';"); } catch {}

    const [newsCount]: any = await db.execute("SELECT COUNT(*) AS count FROM news_articles");
    if (newsCount?.[0]?.count === 0) {
      await db.execute(`
        INSERT INTO news_articles (title, category, summary, content, date, read_time, image_url, author, county_code, scope)
        VALUES
        (
          'Mulembe18 Ratifies Nationwide Chapter Charter Across 47 Counties',
          'National Governance',
          'The National Council of Elders has unanimously endorsed the decentralized Chapter Model, empowering county assemblies and local clan welfare cells.',
          'In a historic summit attended by clan elders representing all 18 Luhya communities from Coast, Nairobi, Western, and Rift Valley, the Mulembe18 National Charter was enacted. Each county will maintain autonomous chapters while contributing to the unified National Impact Ledger.',
          '27 October 2026', '4 min read', '/images/landing-hero.png', 'National Secretariat', '001', 'National'
        ),
        (
          'Consolidated Welfare Reserve Surpasses KES 2.4 Million with 100% Solvency',
          'Welfare & Drives',
          'Independent audit across all registered clan cells confirms highest solvency ratio in association history, guaranteeing 24-hour bereavement repatriation.',
          'Treasury Secretary Grace Achieng and National Comptroller presented the audited financial statement, demonstrating transparent reconciliation between M-Pesa business Paybill accounts and county sub-ledgers.',
          '20 October 2026', '3 min read', '/images/welfare-ledger.png', 'Treasury Office', '001', 'National'
        )
      `);
    }

    // =========================================================================
    // 10. GALLERY ITEMS TABLE
    // =========================================================================
    await db.execute(`
      CREATE TABLE IF NOT EXISTS gallery_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url TEXT NOT NULL,
        album_url TEXT NULL,
        label VARCHAR(191) NOT NULL,
        category VARCHAR(100) NOT NULL,
        sub_location VARCHAR(191) NULL,
        is_large BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    try { await db.execute("ALTER TABLE gallery_items ADD COLUMN county_code VARCHAR(10) NULL DEFAULT '001';"); } catch {}

    const [galleryCount]: any = await db.execute("SELECT COUNT(*) AS count FROM gallery_items");
    if (galleryCount?.[0]?.count === 0) {
      await db.execute(`
        INSERT INTO gallery_items (image_url, label, category, sub_location, is_large, sort_order, county_code)
        VALUES
        ('/images/events-cultural.png', 'Annual Luhya Cultural Day & Food Expo', 'Cultural Festival', 'Mama Ngina Waterfront, Mombasa', TRUE, 1, '001'),
        ('/images/coastal-portal.png', 'Diaspora Elders Council & Welfare Summit', 'Governance', 'Nyali Links Centre', FALSE, 2, '001'),
        ('/images/moodboard.png', 'Isukuti Dance Troupes & Bullfighting Lore', 'Heritage', 'Mombasa Beach Grounds', FALSE, 3, '001'),
        ('/images/landing-hero.png', 'Coastal Youth Mentorship & Tech Forum', 'Youth & Career', 'TUM Hall, Tudor', FALSE, 4, '001'),
        ('/images/mobile-app.png', 'Mulembe18 Community Welfare Drive', 'Solidarity', 'Likoni & Mtwapa Chapters', FALSE, 5, '001')
      `);
    }

    // =========================================================================
    // 11. LEADERSHIP MEMBERS TABLE
    // =========================================================================
    await db.execute(`
      CREATE TABLE IF NOT EXISTS leadership_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        role VARCHAR(191) NOT NULL,
        clan VARCHAR(100) NOT NULL,
        phone VARCHAR(60) NULL,
        email VARCHAR(191) NULL,
        bio TEXT NULL,
        avatar_url TEXT NULL,
        sort_order INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    try { await db.execute("ALTER TABLE leadership_members ADD COLUMN level VARCHAR(50) DEFAULT 'County';"); } catch {}
    try { await db.execute("ALTER TABLE leadership_members ADD COLUMN county_code VARCHAR(10) NULL DEFAULT '001';"); } catch {}

    const [leadershipCount]: any = await db.execute("SELECT COUNT(*) AS count FROM leadership_members");
    if (leadershipCount?.[0]?.count === 0) {
      await db.execute(`
        INSERT INTO leadership_members (name, role, clan, sort_order, level, county_code)
        VALUES
        ('Elder Johnstone Mukaisi', 'Chapter Chairperson', 'Bukusu', 1, 'County', '001'),
        ('Dr. Beatrice Khabuchi', 'Vice Chairperson & Welfare', 'Isukha', 2, 'County', '001'),
        ('Grace Kavehere', 'Chapter Treasurer', 'Maragoli', 3, 'County', '001'),
        ('Wycliffe Barasa', 'Organizing Secretary', 'Wanga', 4, 'County', '001'),
        ('Naomi Nekesa', 'Welfare & Bereavement', 'Samia', 5, 'County', '001'),
        ('Pastor Amos Kavehere', 'Elders Liaison', 'Banyore', 6, 'County', '001'),
        ('Hon. Timothy Walubengo', 'National Patron', 'Bukusu', 7, 'National', NULL),
        ('Dr. Francis Atwoli', 'National Council Elder', 'Khayo', 8, 'National', NULL)
      `);
    }

    // =========================================================================
    // 12. COMMUNITY NOTICES TABLE
    // =========================================================================
    await db.execute(`
      CREATE TABLE IF NOT EXISTS community_notices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        chapter VARCHAR(100) NOT NULL,
        location VARCHAR(191) NOT NULL,
        author VARCHAR(191) NOT NULL,
        author_clan VARCHAR(100) NOT NULL,
        phone VARCHAR(60) NOT NULL,
        posted_date VARCHAR(60) NOT NULL,
        details TEXT NOT NULL,
        price_or_salary VARCHAR(100) NULL,
        tags TEXT NULL,
        status VARCHAR(50) DEFAULT 'Approved',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    const [noticeCount]: any = await db.execute("SELECT COUNT(*) AS count FROM community_notices");
    if (noticeCount?.[0]?.count === 0) {
      await db.execute(`
        INSERT INTO community_notices (category, title, chapter, location, author, author_clan, phone, posted_date, details, price_or_salary, tags, status)
        VALUES
        ('Rental', 'Spacious 2-Bedroom Apartment in Nyali (Near Links Road)', 'Mombasa Chapter', 'Nyali, Mombasa', 'Eunice Khabetsa', 'Maragoli', '0722 411 902', '2 days ago', 'Gated compound with fresh borehole water, ample parking, and 24/7 security. Walking distance to matatu stage. Preferred lease to a responsible community family.', 'KES 28,000 / month', '["2-Bedroom", "Fresh Water", "Gated Security", "Family Friendly"]', 'Approved'),
        ('Job', 'Maritime Clearing & Forwarding Logistics Assistant Needed', 'Mombasa Chapter', 'Kilindini / Mombasa Island', 'Wycliffe Barasa (Logistics Director)', 'Bukusu', '0711 883 451', 'Yesterday', 'Seeking a graduate in Logistics or Supply Chain. Must understand Simba/ICMS systems, KRA customs clearance, and port documentation. Training provided for eager learners.', 'KES 45,000 - 55,000 / month', '["Full-Time", "Port Logistics", "KRA ICMS", "Career Growth"]', 'Approved'),
        ('Business', 'Western Heritage Fresh Produce & Free-Range Kienyeji Chicken', 'Mombasa Chapter', 'Bamburi & Mtwapa Delivery', 'Mama Agnes Nasimiyu', 'Tachoni', '0733 920 188', '3 days ago', 'Direct consignments from Bungoma & Kakamega twice weekly: original Luhya brown kienyeji chicken, fresh managu, saga, mitoo, groundnut butter, and sweet bananas.', 'Kienyeji Chicken: KES 1,100', '["Kienyeji Chicken", "Traditional Greens", "Fresh Farm Goods"]', 'Approved'),
        ('Mentorship', 'Free Software Engineering & Web Development Mentorship Circle', 'Mombasa Chapter', 'TUM / Mombasa Tech Hub (Hybrid)', 'Eng. Davis Shikuku', 'Wanga', '0704 556 120', '4 days ago', 'A 6-week weekend cohort covering full-stack web development, Git, React, and freelancing skills tailored for youth and university students looking for tech careers.', '100% Free for Members', '["Tech Mentorship", "Software Skills", "Youth Empowerment"]', 'Approved')
      `);
    }

    // =========================================================================
    // 13. ELECTION CANDIDATES & VOTES TABLE
    // =========================================================================
    await db.execute(`
      CREATE TABLE IF NOT EXISTS election_candidates (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        clan VARCHAR(100) NOT NULL,
        position VARCHAR(191) NOT NULL,
        chapter VARCHAR(191) NOT NULL,
        manifesto TEXT NOT NULL,
        votes INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const [candidateCount]: any = await db.execute("SELECT COUNT(*) AS count FROM election_candidates");
    if (candidateCount?.[0]?.count === 0) {
      await db.execute(`
        INSERT INTO election_candidates (id, name, clan, position, chapter, manifesto, votes)
        VALUES
        ('cand-1', 'Mzee Johnstone Mukaisi', 'Bukusu', 'Chapter Chairperson', 'Mombasa Chapter', 'Fast-track bereavement transit under 18 hours, youth maritime apprenticeships, and 100% public ledgers.', 384),
        ('cand-2', 'Adv. Timothy Walubengo', 'Maragoli', 'Chapter Chairperson', 'Mombasa Chapter', 'Legal aid clinics for small traders and institutional micro-loan revolving chama fund.', 312),
        ('cand-3', 'Eng. Aggrey Masika', 'Wanga', 'Chapter Chairperson', 'Mombasa Chapter', 'Digitalizing clan membership cards, expanding technical scholarships, and coastal sports cup.', 245)
      `);
    }

    // =========================================================================
    // 14. CHAPTER TRANSFER REQUESTS TABLE (FR-05)
    // =========================================================================
    await db.execute(`
      CREATE TABLE IF NOT EXISTS chapter_transfers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(191) NOT NULL,
        phone VARCHAR(60) NOT NULL,
        current_chapter VARCHAR(191) NOT NULL,
        target_chapter VARCHAR(191) NOT NULL,
        reason TEXT NULL,
        status VARCHAR(50) DEFAULT 'Pending Approval',
        approved_by VARCHAR(191) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Non-destructive additions to welfare_appeals
    try { await db.execute("ALTER TABLE welfare_appeals ADD COLUMN appeal_type VARCHAR(100) DEFAULT 'Bereavement Transit';"); } catch {}
    try { await db.execute("ALTER TABLE welfare_appeals ADD COLUMN beneficiary VARCHAR(191) NULL;"); } catch {}
    try { await db.execute("ALTER TABLE welfare_appeals ADD COLUMN beneficiary_clan VARCHAR(100) NULL;"); } catch {}
    try { await db.execute("ALTER TABLE welfare_appeals ADD COLUMN chapter VARCHAR(191) DEFAULT 'Mombasa Chapter';"); } catch {}
    try { await db.execute("ALTER TABLE welfare_appeals ADD COLUMN destination_county VARCHAR(100) NULL;"); } catch {}
    try { await db.execute("ALTER TABLE welfare_appeals ADD COLUMN target_amount DECIMAL(12, 2) DEFAULT 150000;"); } catch {}
    try { await db.execute("ALTER TABLE welfare_appeals ADD COLUMN deadline_date VARCHAR(60) DEFAULT '30 Nov 2026';"); } catch {}
    try { await db.execute("ALTER TABLE welfare_appeals ADD COLUMN days_remaining INT DEFAULT 14;"); } catch {}
    try { await db.execute("ALTER TABLE welfare_appeals ADD COLUMN dual_approvers TEXT NULL;"); } catch {}

    const [appealsCount]: any = await db.execute("SELECT COUNT(*) AS count FROM welfare_appeals");
    if (appealsCount?.[0]?.count === 0) {
      await db.execute(`
        INSERT INTO welfare_appeals (title, description, goal_amount, target_amount, raised_amount, family_name, beneficiary, beneficiary_clan, chapter, destination_county, deadline_date, days_remaining, dual_approvers, is_active, status, appeal_type)
        VALUES
        (
          'Urgent Repatriation Transit for the Late Mzee Jackson Khaemba',
          'Covering mortuary preservation at Coast General Hospital, hearse transport to Sirisia, and dignified burial logistics.',
          180000, 180000, 142000,
          'The Family of Late Jackson Khaemba', 'The Family of Late Jackson Khaemba', 'Bukusu',
          'Mombasa Chapter', 'Bungoma (Sirisia)', '30 Oct 2026', 2,
          '["Mzee Johnstone Mukaisi (Chair)", "Grace Kavehere (Treasurer)"]',
          TRUE, 'Active Appeal', 'Bereavement Transit'
        ),
        (
          'Specialized Orthopedic Surgery Support for Mama Gladys Anindo',
          'Emergency post-accident orthopedic surgery and specialized titanium implant support at Pandya Memorial Hospital, Mombasa.',
          120000, 120000, 98500,
          'Gladys Anindo (Family of 4)', 'Gladys Anindo (Family of 4)', 'Maragoli',
          'Mombasa Chapter', 'Mombasa (Bamburi)', '05 Nov 2026', 8,
          '["Naomi Nekesa (Welfare Sec)", "Dr. Beatrice Khabuchi (Elder)"]',
          TRUE, 'Active Appeal', 'Emergency Medical'
        )
      `);
    }

    console.log("[TiDB / MySQL] Countrywide Schema with 47 Counties, Clan Groups, Notices & Elections initialized successfully.");
    _schemaInitialized = true;
    return { success: true };
  } catch (err: any) {
    console.warn("[TiDB / MySQL] Schema initialization warning:", err?.message || err);
    return { success: false, error: err?.message };
  }
}
