import { connectToDatabase } from '@/lib/mongodb';
import ContentNode from '@/models/ContentNode';
import { mockData } from '@/data/mockData';
import { ContentNode as ContentNodeType } from '@/types/content';

async function seedDatabase() {
  try {
    await connectToDatabase();
    
    // Clear existing data
    await ContentNode.deleteMany({});
    console.log('Cleared existing content');
    
    // Recursive function to process content nodes
    async function processNode(node: ContentNodeType, parentId: string | null = null, path: string[] = [], order: number = 0) {
      // Create the content node
      const contentNode = new ContentNode({
        slug: node.slug,
        title: node.title,
        summary: node.summary || '',
        type: node.type,
        author: node.author || '',
        badge: node.badge || null,
        body: node.body || '',
        parentId: parentId,
        path: path,
        order: order,
        published: true
      });
      
      const savedNode = await contentNode.save();
      console.log(`Created ${node.type}: ${node.title}`);
      
      // Process children if they exist
      if (node.children && node.children.length > 0) {
        const newPath = [...path, node.slug];
        for (let i = 0; i < node.children.length; i++) {
          await processNode(node.children[i], savedNode._id.toString(), newPath, i);
        }
      }
    }
    
    // Process all top-level categories
    for (let i = 0; i < mockData.length; i++) {
      await processNode(mockData[i], null, [], i);
    }
    
    console.log('Database seeding completed successfully!');
    
    // Display summary
    const totalContent = await ContentNode.countDocuments();
    const categories = await ContentNode.countDocuments({ type: 'category' });
    const chapters = await ContentNode.countDocuments({ type: 'chapter' });
    const articles = await ContentNode.countDocuments({ type: 'article' });
    
    console.log('\n=== Database Summary ===');
    console.log(`Total content nodes: ${totalContent}`);
    console.log(`Categories: ${categories}`);
    console.log(`Chapters: ${chapters}`);
    console.log(`Articles: ${articles}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

// Run the seeding
seedDatabase();
