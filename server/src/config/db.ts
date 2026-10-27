import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

export const getMongoConnectionConfig = () => {
  let uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/jeeva_life_os';
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const dbName = process.env.MONGODB_DB_NAME || 'jeeva_life_os';

  // Strip wrapping quotes if user put quotes in .env
  uri = uri.replace(/^["']|["']$/g, '').trim();

  // Handle placeholders like <username> and <password>
  if (username) {
    const cleanUser = username.replace(/^["']|["']$/g, '').trim();
    uri = uri.replace('<username>', encodeURIComponent(cleanUser));
  }
  if (password) {
    const cleanPass = password.replace(/^["']|["']$/g, '').trim();
    uri = uri.replace('<password>', encodeURIComponent(cleanPass));
  }

  // If credentials provided but not in URI
  if (username && password && !uri.includes('@')) {
    const cleanUser = encodeURIComponent(username.replace(/^["']|["']$/g, '').trim());
    const cleanPass = encodeURIComponent(password.replace(/^["']|["']$/g, '').trim());
    uri = uri.replace('://', `://${cleanUser}:${cleanPass}@`);
  }

  return { uri, dbName };
};

export const connectDB = async (): Promise<boolean> => {
  const { uri, dbName } = getMongoConnectionConfig();
  
  // Mask password for clean logs
  const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
  console.log(`Connecting to MongoDB Atlas: ${maskedUri} (Database: ${dbName})...`);

  try {
    const conn = await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 15000,
    } as any);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error: any) {
    console.warn(`⚠️ MongoDB Connection Error: ${error.message}`);
    return false;
  }
};
