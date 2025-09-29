import { connectToDatabase } from '@/lib/mongodb';
import ContentNode from '@/models/ContentNode';
import mongoose from 'mongoose';

async function checkDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await connectToDatabase();
    
    // Get database info
    const db = mongoose.connection.db;
    const dbName = db?.databaseName;
    console.log(`📊 Connected to database: ${dbName}`);
    
    // List all collections
    const collections = await db?.listCollections().toArray();
    console.log('\n📂 Available collections:');
    collections?.forEach((collection: any) => {
      console.log(`  - ${collection.name}`);
    });
    
    // Check content_nodes collection specifically
    const contentNodesExists = collections?.some((col: any) => col.name === 'content_nodes');
    console.log(`\n🎯 content_nodes collection exists: ${contentNodesExists ? '✅ YES' : '❌ NO'}`);
    
    if (contentNodesExists) {
      // Count documents in content_nodes
      const totalCount = await ContentNode.countDocuments();
      const categories = await ContentNode.countDocuments({ type: 'category' });
      const chapters = await ContentNode.countDocuments({ type: 'chapter' });
      const articles = await ContentNode.countDocuments({ type: 'article' });
      
      console.log('\n📊 Content statistics:');
      console.log(`  📁 Categories: ${categories}`);
      console.log(`  📂 Chapters: ${chapters}`);
      console.log(`  📝 Articles: ${articles}`);
      console.log(`  📊 Total documents: ${totalCount}`);
      
      // Show sample documents
      console.log('\n📋 Sample documents:');
      const sampleCategories = await ContentNode.find({ type: 'category' }).limit(3);
      sampleCategories.forEach((cat: any) => {
        console.log(`  📁 ${cat.title} (slug: ${cat.slug})`);
      });
      
      // Check if there are any documents at all
      if (totalCount === 0) {
        console.log('\n⚠️  No documents found in content_nodes collection!');
        console.log('💡 Try running: npm run seed-mockup');
      }
    } else {
      console.log('\n⚠️  content_nodes collection not found!');
      console.log('💡 The collection will be created when you first save data.');
      console.log('💡 Try running: npm run seed-mockup');
    }
    
    // Test a simple query
    console.log('\n🔍 Testing ContentNode model...');
    try {
      const testQuery = await ContentNode.find().limit(1);
      console.log('✅ ContentNode model is working properly');
      if (testQuery.length > 0) {
        console.log(`   Sample document ID: ${testQuery[0]._id}`);
      }
    } catch (error) {
      console.log('❌ Error with ContentNode model:', error);
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    console.log('\n🔚 Closing connection...');
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkDatabase();
