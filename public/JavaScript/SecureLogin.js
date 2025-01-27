/**
 * Represents a connection to the MySQL database.
 *
 * This variable is configured with connection details such as host, user, password,
 * database name, and port. Environment variables are used for each of these settings,
 * falling back to default values if the environment variables are not set.
 *
 * @type {{PoolNamespace: PoolNamespace; escape(value: any, stringifyObjects?: boolean, timeZone?: TimeZone): string; Connection: Connection; createPoolCluster(config?: PoolClusterOptions): PoolCluster; Prepare: Prepare; Pool: Pool; QueryOptions: QueryOptions; createConnection: {(connectionUri: string): Connection; (config: ConnectionOptions): Connection}; ConnectionOptions: ConnectionOptions; PoolCluster: PoolCluster; SslOptions: SslOptions; PrepareStatementInfo: PrepareStatementInfo; format: {(sql: string): string; (sql: string, values: any, stringifyObjects?: boolean, timeZone?: TimeZone): string}; createPool: {(connectionUri: string): Pool; (config: PoolOptions): Pool}; escapeId(value: any, forbidQualified?: boolean): string; PoolConnection: PoolConnection; PoolOptions: PoolOptions; createServer(handler: (conn: Connection) => any): Server; Query: Query; QueryError: QueryError; raw(sql: string): {toSqlString: () => string}; PoolClusterOptions: PoolClusterOptions; ConnectionConfig: ConnectionConfig; ErrorPacketParams: ErrorPacketParams; ProcedureCallPacket: T extends RowDataPacket[] ? [T, ResultSetHeader] : (T extends (ResultSetHeader | OkPacket) ? ResultSetHeader : ([RowDataPacket[], ResultSetHeader] | ResultSetHeader)); ResultSetHeader: ResultSetHeader; Field: Field; FieldPacket: FieldPacket; OkPacket: OkPacket; RowDataPacket: RowDataPacket; QueryResult: OkPacket | ResultSetHeader | ResultSetHeader[] | RowDataPacket[] | RowDataPacket[][] | OkPacket[] | [RowDataPacket[], ResultSetHeader]; OkPacketParams: OkPacketParams; authPlugins: {caching_sha2_password: AuthPluginDefinition<{overrideIsSecure?: boolean; serverPublicKey?: RsaPublicKey | RsaPrivateKey | KeyLike; onServerPublicKey?: (data: Buffer) => void}>; mysql_clear_password: AuthPluginDefinition<{password?: string}>; mysql_native_password: AuthPluginDefinition<{password?: string; passwordSha1?: string}>; sha256_password: AuthPluginDefinition<{serverPublicKey?: RsaPublicKey | RsaPrivateKey | KeyLike; onServerPublicKey?: (data: Buffer) => void}>}; AuthPluginDefinition: (pluginOptions?: T) => AuthPlugin; AuthPlugin: (pluginMetadata: {connection: Connection; command: string}) => (pluginData: Buffer) => (Promise<string> | string | Buffer | Promise<Buffer> | null); CharsetToEncoding: string[]; Charsets: Charsets | Charsets; Types: Types | Types; TypeCastGeometry: Geometry; TypeCastNext: () => unknown; TypeCastField: Type & {length: number; db: string; table: string; name: string; string: (encoding?: (BufferEncoding | string | undefined)) => (string | null); buffer: () => (Buffer | null); geometry: () => (Geometry | Geometry[] | null)}; TypeCastType: Type; TypeCast: ((field: Field, next: Next) => any) | boolean; clearParserCache: () => void; setMaxParserCache: (max: number) => void}}
 */

// Required modules
require('dotenv').config();
const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'test',
    port: process.env.MYSQL_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Example query to test the pool
pool.query('SELECT 1', (err, results) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Database connection successful, test query result:', results);
});

// Close the pool on exit
process.on('exit', () => {
    pool.end((err) => {
        if (err) {
            console.error('Error closing MySQL pool:', err);
        } else {
            console.log('MySQL pool closed.');
        }
    });
});

/**
 * Function to check user login credentials securely.
 * @param {string} email - The email provided by the user.
 * @param {string} password - The plain-text password provided by the user.
 * @param {function} callback - Callback to handle the result.
 */
function checkLogin(email, password, callback) {
    // SQL query to fetch the user by email
    const query = 'SELECT * FROM members WHERE email = ?';

    db.execute(query, [email], (err, results) => {
        if (err) {
            console.error('Failed to query the database:', err);
            callback({success: false, message: 'Server error. Please try again later.'}, null);
            return;
        }

        // Check if the user exists
        if (results.length > 0) {
            const user = results[0]; // Fetch user record
            const hashedPasswordFromDB = user.password;

            // Compare provided password with the stored hashed password
            bcrypt.compare(password, hashedPasswordFromDB, (err, isMatch) => {
                if (err) {
                    console.error('Error during password comparison:', err);
                    callback({success: false, message: 'Server error. Please try again later.'}, null);
                    return;
                }

                if (isMatch) {
                    delete user.password; // Remove password from user object before returning
                    callback(null, {success: true, user});
                } else {
                    callback(null, {success: false, message: 'Invalid email or password.'});
                }
            });
        } else {
            callback(null, {success: false, message: 'Invalid email or password.'});
        }
    });
}

// Example usage of the checkLogin function
const userEmail = 'test@example.com'; // Example email input (replace in real usage)
const userPassword = 'securepassword'; // Example password input (replace in real usage)

checkLogin(userEmail, userPassword, (err, result) => {
    if (err) {
        console.error('Error during login check:', err.message);
        return;
    }

    if (result.success) {
        console.log('✅ Login successful:', result.user); // Log user data on success
    } else {
        console.log('❌ Login failed:', result.message); // Log failure message on error/invalid credentials
    }
});
